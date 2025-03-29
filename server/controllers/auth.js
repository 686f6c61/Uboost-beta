const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { logUserActivity } = require('../utils/activityLogger');
const { sendWelcomeEmail, sendLoginAlert, sendAccountApprovedEmail } = require('../utils/emailService');

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Helper function to send token response with cookie
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = generateToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // Use secure cookies in production
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Remove password from output
  user.password = undefined;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user
    });
};

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, city, country } = req.body;
    
    // Obtener información geográfica
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Encontrar el código de país correspondiente
    const countryMapping = {
      'Spain': 'ES',
      'España': 'ES',
      'United States': 'US',
      'Estados Unidos': 'US',
      'United Kingdom': 'GB',
      'Reino Unido': 'GB',
      // Podríamos añadir más países, pero en la interfaz ya tenemos el selector completo
    };
    
    const countryCode = countryMapping[country] || '';

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user with pending status
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      city,
      country,
      countryCode,
      ipAddress,
      geoInfo: {
        registrationIp: ipAddress
      },
      status: 'pending' // All new users start as pending
    });
    
    // Registrar actividad de registro
    await logUserActivity({
      userId: user._id,
      email: user.email,
      action: 'register',
      details: {
        userAgent: req.headers['user-agent'],
        country,
        city
      },
      ipAddress
    });
    
    // Enviar correo de bienvenida
    try {
      await sendWelcomeEmail({
        firstName,
        lastName,
        email,
        city,
        country,
        _id: user._id
      });
      console.log(`Correo de bienvenida enviado a ${email}`);
    } catch (emailError) {
      console.error('Error al enviar correo de bienvenida:', emailError);
      // No interrumpimos el proceso de registro si falla el correo
    }

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Obtener IP del cliente
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Actualizar información geográfica del último login
    await User.findByIdAndUpdate(user._id, {
      'geoInfo.lastLogin': {
        ip: ipAddress,
        city: user.city,
        country: user.country,
        countryCode: user.countryCode,
        timestamp: new Date()
      }
    });
    
    // Registrar actividad de login
    await logUserActivity({
      userId: user._id,
      email: user.email,
      action: 'login',
      details: {
        userAgent: req.headers['user-agent'],
        status: user.status,
        country: user.country,
        city: user.city
      },
      ipAddress
    });
    
    // Enviar alerta de inicio de sesión
    try {
      await sendLoginAlert(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          city: user.city,
          country: user.country
        },
        {
          ipAddress,
          userAgent: req.headers['user-agent']
        }
      );
      console.log(`Alerta de inicio de sesión enviada a ${user.email}`);
    } catch (emailError) {
      console.error('Error al enviar alerta de inicio de sesión:', emailError);
      // No interrumpimos el proceso de login si falla el correo
    }

    // Check if user is deleted or paused
    if (user.status === 'deleted' || user.status === 'paused') {
      return res.status(401).json({
        success: false,
        message: 'Your account has been ' + user.status + '. Please contact an administrator.'
      });
    }

    // Check if user is pending
    if (user.status === 'pending') {
      return res.status(401).json({
        success: false,
        message: 'Your account is pending approval. Please contact an administrator.'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res) => {
  try {
    const { firstName, lastName, city, country } = req.body;
    
    const fieldsToUpdate = {
      firstName,
      lastName,
      city,
      country
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // Registrar actividad de logout si hay un usuario autenticado
    if (req.user) {
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      await logUserActivity({
        userId: req.user.id,
        email: req.user.email,
        action: 'logout',
        details: {
          userAgent: req.headers['user-agent']
        },
        ipAddress
      });
    }
    
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Successfully logged out'
    });
  } catch (err) {
    // En caso de error, seguimos con el logout pero registramos el error
    console.error('Error al registrar actividad de logout:', err);
    res.status(200).json({
      success: true,
      message: 'Successfully logged out'
    });
  }
};

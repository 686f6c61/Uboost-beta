const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// Import routes
const pdfRoutes = require('./routes/pdf.routes');
const s3pdfRoutes = require('./routes/s3pdf.routes'); // Nuevas rutas para S3
const openaiRoutes = require('./routes/openai.routes');
const anthropicRoutes = require('./routes/anthropic.routes');
const deepseekRoutes = require('./routes/deepseek.routes');
const configRoutes = require('./routes/config.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const usersRoutes = require('./routes/users.routes');
const queryHistoryRoutes = require('./routes/queryHistory.routes');
const landingRoutes = require('./routes/landingRoutes'); // Rutas para la landing page

const app = express();
// Puerto fijo para el servidor (cambiado a 5100 para evitar conflictos)
const PORT = 5100;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    // Seed admin user if needed
    const seedAdmin = require('./utils/seedAdmin');
    seedAdmin();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// Middleware
// Configuración adecuada de CORS para permitir credenciales
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5101', 'http://localhost:3001'], // Dominios permitidos
  credentials: true, // Permitir cookies y encabezados de autenticación
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  createParentPath: true,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
}));

// Routes
app.use('/api/pdf', pdfRoutes);
app.use('/api/s3pdf', s3pdfRoutes); // Nueva ruta para S3 PDFs
app.use('/api/openai', openaiRoutes);
app.use('/api/anthropic', anthropicRoutes);
app.use('/api/deepseek', deepseekRoutes);
app.use('/api/config', configRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/history', queryHistoryRoutes);
app.use('/api/landing', landingRoutes); // Rutas para la landing page

// Serve uploads for development
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Iniciar el servidor en el puerto fijo
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

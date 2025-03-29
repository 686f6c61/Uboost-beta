/**
 * Script para generar datos de actividad de usuario de prueba
 * Para ejecutar: node injectActivityData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const UserActivity = require('./models/userActivity');

// Acciones posibles
const actions = ['login', 'logout', 'query', 'pdf_upload', 'pdf_process'];
const models = ['gpt-4o', 'gpt-4o-mini', 'claude-3-7-sonnet-20240307'];

// Función para generar un número aleatorio en un rango
const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Función para generar una fecha aleatoria en los últimos 7 días
const randomDate = (days = 7) => {
  const date = new Date();
  date.setDate(date.getDate() - randomInRange(0, days));
  date.setHours(randomInRange(8, 23), randomInRange(0, 59), randomInRange(0, 59));
  return date;
};

// Conectar a la base de datos
const connectDB = async () => {
  console.log('Intentando conectar a MongoDB:', process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

// Generar datos de actividad
const generateActivityData = async () => {
  try {
    // Obtener usuarios aprobados
    const users = await User.find({ status: 'approved' });
    
    if (users.length === 0) {
      console.log('No hay usuarios aprobados en la base de datos. Utilizando todos los usuarios.');
      users = await User.find({});
      
      if (users.length === 0) {
        console.error('No hay usuarios en la base de datos');
        process.exit(1);
      }
    }
    
    console.log(`Encontrados ${users.length} usuarios para generar datos de actividad`);

    // Crear registros para cada usuario
    const activities = [];

    for (const user of users) {
      // Número aleatorio de actividades por usuario (entre 5 y 20)
      const activityCount = randomInRange(5, 20);
      
      console.log(`Generando ${activityCount} actividades para el usuario ${user.email}`);
      
      for (let i = 0; i < activityCount; i++) {
        const action = actions[randomInRange(0, actions.length - 1)];
        const timestamp = randomDate();
        
        let details = {};
        let tokensConsumed = 0;
        let model = '';
        
        // Personalizar datos según el tipo de acción
        if (action === 'login' || action === 'logout') {
          details = { 
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            device: ['Desktop', 'Mobile', 'Tablet'][randomInRange(0, 2)]
          };
        } else if (action === 'query') {
          model = models[randomInRange(0, models.length - 1)];
          tokensConsumed = randomInRange(100, 3000);
          details = {
            promptLength: randomInRange(50, 300),
            responseLength: randomInRange(100, 2000),
            queryType: ['búsqueda', 'resumen', 'análisis'][randomInRange(0, 2)]
          };
        } else if (action === 'pdf_upload' || action === 'pdf_process') {
          details = {
            fileName: `documento_${randomInRange(1, 100)}.pdf`,
            fileSize: randomInRange(100000, 5000000),
            pageCount: randomInRange(1, 50)
          };
        }
        
        // Crear registro de actividad
        activities.push({
          user: user._id,
          email: user.email,
          action,
          details,
          timestamp,
          sessionDuration: action === 'logout' ? randomInRange(60, 3600) : 0,
          tokensConsumed,
          model,
          ipAddress: `192.168.${randomInRange(1, 255)}.${randomInRange(1, 255)}`
        });
      }
    }
    
    // Eliminar registros existentes
    await UserActivity.deleteMany({});
    console.log('Registros previos eliminados');
    
    // Insertar todos los registros
    await UserActivity.insertMany(activities);
    console.log(`${activities.length} registros de actividad generados con éxito`);
    
  } catch (error) {
    console.error('Error al generar datos de actividad:', error);
  }
};

// Función principal
const main = async () => {
  try {
    await connectDB();
    await generateActivityData();
    console.log('Proceso completado');
    process.exit(0);
  } catch (error) {
    console.error('Error en el proceso principal:', error);
    process.exit(1);
  }
};

// Ejecutar el script
main();

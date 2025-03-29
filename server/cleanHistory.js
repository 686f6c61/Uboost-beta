require('dotenv').config();
const mongoose = require('mongoose');
const QueryHistory = mongoose.model('QueryHistory');

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Conectado a MongoDB');
    
    try {
      // Eliminar todos los registros de historial
      const result = await QueryHistory.deleteMany({});
      console.log(`Se han eliminado ${result.deletedCount} registros de historial`);
    } catch (err) {
      console.error('Error al eliminar registros:', err);
    } finally {
      // Cerrar la conexión
      mongoose.connection.close();
      console.log('Conexión cerrada');
    }
  })
  .catch(err => {
    console.error('Error al conectar con MongoDB:', err);
  });

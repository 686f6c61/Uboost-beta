const mongoose = require('mongoose');

// Esquema para solicitudes de Early Access
const EarlyAccessRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor proporciona tu nombre']
  },
  email: {
    type: String,
    required: [true, 'Por favor proporciona tu email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Por favor proporciona un email válido'
    ]
  },
  university: {
    type: String
  },
  country: {
    type: String
  },
  purpose: {
    type: String,
    required: [true, 'Por favor indica para qué usarías la plataforma']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Método estático para obtener estadísticas de Early Access
EarlyAccessRequestSchema.statics.getStats = async function() {
  // Total de plazas disponibles
  const totalSpots = 50;
  
  // Contar solicitudes
  const count = await this.countDocuments();
  
  // Calcular plazas restantes
  const remainingSpots = Math.max(0, totalSpots - count);
  
  // Calcular porcentaje ocupado
  const percentOccupied = Math.min(100, Math.round((count / totalSpots) * 100));
  
  return {
    totalSpots,
    count,
    remainingSpots,
    percentOccupied
  };
};

module.exports = mongoose.model('EarlyAccessRequest', EarlyAccessRequestSchema);

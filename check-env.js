// Script para verificar si las variables de entorno se cargan correctamente
require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Está definido' : 'No está definido');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Está definido' : 'No está definido');
console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? 'Está definido' : 'No está definido');
console.log('Directorio actual:', __dirname);

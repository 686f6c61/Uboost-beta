/**
 * Middleware para manejar excepciones asíncronas
 * Envuelve las funciones de controlador para evitar try/catch repetitivos
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;

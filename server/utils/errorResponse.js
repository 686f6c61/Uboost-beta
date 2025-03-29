/**
 * Clase personalizada para manejar errores en la API
 * Extiende la clase Error de JavaScript
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;

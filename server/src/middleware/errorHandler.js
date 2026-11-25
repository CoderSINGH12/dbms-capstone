import { AppError } from '../utils/AppError.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // 1. MySQL Duplicate Key Error (ER_DUP_ENTRY) -> 409 Conflict
  if (err.code === 'ER_DUP_ENTRY') {
    const match = err.message.match(/Duplicate entry '(.*)' for key '(.*)'/);
    const detail = match ? `Duplicate entry '${match[1]}' for key '${match[2]}'` : 'A record with these unique details already exists.';
    error = new AppError(detail, 409);
  }

  // 2. MySQL Foreign Key Violations -> 422 Unprocessable Entity
  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
    error = new AppError('Foreign key reference violation: Related record does not exist.', 422);
  }

  if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
    error = new AppError('Cannot delete or update this record because other tables depend on it.', 409);
  }

  // 3. MySQL 8+ CHECK Constraint Violations -> 422 Unprocessable Entity
  if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
    const match = err.message.match(/Check constraint '(.*)' is violated/);
    const constraintName = match ? match[1] : 'database rule';
    error = new AppError(`Data validation failed: Check constraint '${constraintName}' was violated.`, 422);
  }

  // 4. Custom SQLSTATE 45000 (Trigger Rejection) -> 422 Unprocessable Entity
  if (err.sqlState === '45000') {
    error = new AppError(err.message, 422);
  }

  // 5. Database Connection Failures -> 503 Service Unavailable
  if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ER_ACCESS_DENIED_ERROR') {
    error = new AppError('Database service currently unavailable. Please verify MySQL service status.', 503);
  }

  // 6. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid authentication token. Please log in again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your session has expired. Please log in again.', 401);
  }

  // 7. Zod Validation Errors
  if (err.name === 'ZodError') {
    const formattedErrors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(422).json({
      status: 'fail',
      message: 'Validation failed. Please verify submitted form fields.',
      errors: formattedErrors,
    });
  }

  const statusCode = error.statusCode || 500;
  const status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

  res.status(statusCode).json({
    status,
    message: error.message || 'An unexpected internal server error occurred.',
    details: error.details || undefined,
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 ? { stack: err.stack } : {}),
  });
};

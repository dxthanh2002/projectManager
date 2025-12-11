import { ZodError } from 'zod';

/**
 * Global Error Handler Middleware
 * Standardizes error responses across the entire API
 * Must be registered AFTER all routes in server.js
 */
export function errorHandler(err, req, res, next) {
    // Handle Zod validation errors
    if (err instanceof ZodError) {
        return res.status(400).json({
            error: 'VALIDATION_ERROR',
            message: 'Request validation failed',
            details: err.errors.map(e => ({
                field: e.path.join('.'),
                message: e.message
            }))
        });
    }

    // Handle errors with explicit status property
    if (err.status) {
        return res.status(err.status).json({
            error: err.code || 'ERROR',
            message: err.message
        });
    }

    // Handle unexpected errors
    console.error('Unhandled error:', err);
    return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
    });
}

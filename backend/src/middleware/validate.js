import { ZodError } from 'zod';

/**
 * Validation Middleware
 * Validates request data against Zod schemas
 */

/**
 * Generic validation middleware factory
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export function validate(schema) {
    return async (req, res, next) => {
        try {
            // Validate request data
            const validated = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            // Replace request data with validated data
            req.body = validated.body || req.body;
            req.query = validated.query || req.query;
            req.params = validated.params || req.params;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Format Zod validation errors
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                return res.status(400).json({
                    error: 'VALIDATION_ERROR',
                    message: 'Request validation failed',
                    details: errors,
                });
            }

            // Handle unexpected errors
            console.error('Validation middleware error:', error);
            return res.status(500).json({
                error: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred during validation',
            });
        }
    };
}

/**
 * Validate body only
 * @param {import('zod').ZodSchema} schema - Zod schema for body
 */
export function validateBody(schema) {
    return async (req, res, next) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                return res.status(400).json({
                    error: 'VALIDATION_ERROR',
                    message: 'Request body validation failed',
                    details: errors,
                });
            }

            console.error('Body validation error:', error);
            return res.status(500).json({
                error: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred during validation',
            });
        }
    };
}

/**
 * Validate params only
 * @param {import('zod').ZodSchema} schema - Zod schema for params
 */
export function validateParams(schema) {
    return async (req, res, next) => {
        try {
            req.params = await schema.parseAsync(req.params);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                return res.status(400).json({
                    error: 'VALIDATION_ERROR',
                    message: 'Request parameters validation failed',
                    details: errors,
                });
            }

            console.error('Params validation error:', error);
            return res.status(500).json({
                error: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred during validation',
            });
        }
    };
}

/**
 * Validate query only
 * @param {import('zod').ZodSchema} schema - Zod schema for query
 */
export function validateQuery(schema) {
    return async (req, res, next) => {
        try {
            req.query = await schema.parseAsync(req.query);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                return res.status(400).json({
                    error: 'VALIDATION_ERROR',
                    message: 'Query parameters validation failed',
                    details: errors,
                });
            }

            console.error('Query validation error:', error);
            return res.status(500).json({
                error: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred during validation',
            });
        }
    };
}

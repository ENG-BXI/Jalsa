import {NextFunction, Request, Response} from 'express';
import {z} from 'zod';

export function ValidationMiddleware(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const result = schema.safeParse(body);
    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: result.error.issues
      });
    }
    req.body = result.data;

    next();
  };
}

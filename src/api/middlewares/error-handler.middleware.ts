import { ErrorRequestHandler } from 'express';

const errors: Record<string, number> = {
};

export const errorHandlerMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const { name, message } = err;
  const status = errors[name];
  if (!status) return res.sendStatus(500);
  res.status(status).json({ message });
};

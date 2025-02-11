import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Log request details
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.method !== 'GET' ? req.body : undefined,
    userAgent: req.get('user-agent'),
    ip: req.ip
  };

  console.log('\n🔍 Request:', JSON.stringify(logData, null, 2));

  // Log response details
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const responseLog = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    };

    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // Red for errors, green for success
    console.log(`${statusColor}📡 Response:`, JSON.stringify(responseLog, null, 2), '\x1b[0m');
  });

  next();
};

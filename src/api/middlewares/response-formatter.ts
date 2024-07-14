import { NextFunction, Request, Response } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const send = res.send;
    res.send = (data) => {
      res.send = send;
      try {
        data = JSON.parse(data);
      } catch(err) {}

      res.type('application/json');
      return res.send({
        statusCode: res.statusCode,
        data: data,
        request: {
          method: req.method,
          url: req.originalUrl
        }
      });
    };
    next();
  } catch(err) {
    next(err);
  }
};
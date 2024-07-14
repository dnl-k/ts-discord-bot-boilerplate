import { Request, Response } from 'express';
import { Resource } from '../types.js';
import httpStatus from 'http-status';

export default {
  get: (req: Request, res: Response) => {
    const client = req.app.get('discord-client');
    return res.status(httpStatus.OK).send("moin");
  },
  post: (req: Request, res: Response) => {
    return res.status(httpStatus.SEE_OTHER);
  }
} satisfies Resource;
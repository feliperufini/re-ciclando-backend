import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import type { ResponseDefaultMsg } from '../types/ResponseDefaultMsg';
import NextCors from 'nextjs-cors';

export const policyCors = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg>) => {
  try {
    await NextCors(req, res, {
      methods: ['GET', 'PUT', 'POST', 'DELETE'],
      origin: '*',
      optionsSuccessStatus: 200,
    });
    return handler(req, res);
  } catch (e) {
    console.log('Erro ao tratar a política de CORS: ', e);
    return res.status(500).json({ error : 'Ocorreu um erro ao tratar a política de CORS!'});
  }
}
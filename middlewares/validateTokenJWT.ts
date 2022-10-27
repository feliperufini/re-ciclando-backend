import type { NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import type { ResponseDefaultMsg } from '../types/ResponseDefaultMsg';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const validateTokenJWT = (handler : NextApiHandler) => (req : NextApiRequest, res : NextApiResponse<ResponseDefaultMsg>) => {
  try {
    const {JWT_KEY} = process.env;
    if (!JWT_KEY) {
      return res.status(500).json({ error : 'ENV: Chave JWT não informada!'});
    }
    if (!req || !req.headers) {
      return res.status(401).json({ error : 'Não foi possível validar o token de acesso!'});
    }
    if (req.method != 'OPTIONS') {
      const authorization = req.headers['authorization'];
      if (!authorization) {
        return res.status(401).json({ error : 'Não foi possível validar o token de acesso!'});
      }
  
      const token = authorization.substring(7);
      if (!token) {
        return res.status(401).json({ error : 'Não foi possível validar o token de acesso!'});
      }
  
      const decoded = jwt.verify(token, JWT_KEY) as JwtPayload;
      if (!decoded) {
        return res.status(401).json({ error : 'Não foi possível validar o token de acesso!'});
      }
  
      if (!req.query) {
        req.query = {};
      }
  
      req.query.userId = decoded._id;
    }
  } catch (e) {
    console.log(e);
    return res.status(401).json({ error : 'Não foi possível validar o token de acesso!'});
  }

  return handler(req, res);
}
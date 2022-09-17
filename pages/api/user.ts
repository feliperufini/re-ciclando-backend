import type { NextApiRequest, NextApiResponse } from "next";
import { validateTokenJWT } from "../../middlewares/validateTokenJWT"

const userEndpoint = (req : NextApiRequest, res : NextApiResponse) => {
  return res.status(200).json('Usuário autenticado com sucesso!');
}

export default validateTokenJWT(userEndpoint);
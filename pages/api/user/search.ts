import type { NextApiResponse, NextApiRequest } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT";
import { UserModel } from "../../../models/UserModel";
import { policyCors } from "../../../middlewares/policyCors";

const searchUserEndpoint = async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg | any[]>) => {
  try {
    if (req.method !== 'GET') {
      return res.status(400).json({ error: 'Método informado é inválido!' });
    }

    const { email } = req.query;

    if (!email || email.length < 2) {
      return res.status(400).json({ error: 'Informe pelo menos dois caracteres na busca!' });
    }

    const userSearch = await UserModel.findOne({email: {$regex : email, $options: 'i'}});

    return res.status(200).json(userSearch);

  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Não foi possível buscar o produto!' });
  }
}

export default policyCors(validateTokenJWT(connectMongoDB(searchUserEndpoint)));
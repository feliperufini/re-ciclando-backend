import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../types/ResponseDefaultMsg";
import type { ResponseLogin } from "../../types/ResponseLogin";
import { connectMongoDB } from "../../middlewares/connectMongoDB";
import { UserModel } from "../../models/UserModel";

import jwt from "jsonwebtoken";
import md5 from "md5";
import { policyCors } from "../../middlewares/policyCors";

const endpointLogin = async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg | ResponseLogin>) => {
  const {JWT_KEY} = process.env;
  if (!JWT_KEY) {
    return res.status(500).json({error : 'ENV JWT não informado!'});
  }

  if (req.method === 'POST') {
    const {email, password} = req.body;

    const userValidation = await UserModel.find({email : email, password : md5(password)});
    if (userValidation && userValidation.length > 0) {
      const user = userValidation[0];

      const token = jwt.sign({_id : user._id}, JWT_KEY);
      return res.status(200).json({name : user.name, email : user.email, token});
    }
      return res.status(400).json({error : 'E-mail ou senha inválidos!'});
  }
    return res.status(405).json({error : 'Método informado não é válido!'});
}

export default policyCors(connectMongoDB(endpointLogin));
import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../middlewares/validateTokenJWT"
import { UserModel } from "../../models/UserModel";

const profileEndpoint = async (req : NextApiRequest, res : NextApiResponse<ResponseDefaultMsg> | any) => {
  try {
    const {userId} = req?.query;
    const user = await UserModel.findById(userId);
    user.password = null;
  
    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
  }
  return res.status(400).json({error : 'Não foi possível obter os dados do usuário!'});
}

export default validateTokenJWT(connectMongoDB(profileEndpoint));
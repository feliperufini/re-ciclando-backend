import type { NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { upload, uploadImageCosmic } from "../../../services/UploadImageCosmic";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT";
import { UserModel } from "../../../models/UserModel";

import nc from "next-connect";
import { policyCors } from "../../../middlewares/policyCors";
import md5 from "md5";

const handler = nc()
  .use(upload.single('file'))
  .post(
    async (req: any, res: NextApiResponse<ResponseDefaultMsg>) => {
      try {
        if (!req || !req.body) {
          return res.status(400).json({ error: 'Parâmetros de entrada inválidos!' });
        }

        const {name, email, password, level} = req?.body;

        if (!name || name.length < 3) {
          return res.status(400).json({ error: 'Nome do usuário inválido!' });
        }
        if (!email || email.length < 6 || !email.includes('@') || !email.includes('.')) {
          return res.status(400).json({ error: 'E-mail informado é inválido!' });
        }
        if (!password || password.length < 6) {
          return res.status(400).json({ error: 'A senha deve possuir no mínimo 6 caracteres!' });
        }
        if (!level || level > 3 || level < 2) {
          return res.status(400).json({ error: 'O nível informado para o usuário é inválido!' });
        }

        if (!req.file || !req.file.originalname) {
          const user  = {
            name,
            email,
            password: md5(password),
            level,
            avatar : null
          }
  
          await UserModel.create(user);
          return res.status(200).json({ msg: 'Usuário cadastrado com sucesso!' });
        } else {
          const avatar = await uploadImageCosmic(req);
          const user  = {
            name,
            email,
            password: md5(password),
            level,
            avatar : avatar.media.url
          }
  
          await UserModel.create(user);
          return res.status(200).json({ msg: 'Usuário cadastrado com sucesso!' });
        }
      } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Erro ao cadastrar usuário!' });
      }
    }
  );

export const config = {
  api: {
    bodyParser : false
  }
}

export default policyCors(validateTokenJWT(connectMongoDB(handler)));
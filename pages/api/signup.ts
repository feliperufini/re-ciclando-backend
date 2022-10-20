import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../types/ResponseDefaultMsg";
import type { UserRequest } from "../../types/UserRequest";
import { UserModel } from "../../models/UserModel";
import { connectMongoDB } from "../../middlewares/connectMongoDB";
import { upload, uploadImageCosmic } from "../../services/UploadImageCosmic";

import md5 from "md5";
import nc from "next-connect";

const handler = nc()
  .use(upload.single('file'))
  .post(
    async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg>) => {
      const user = req.body as UserRequest;

      // verificar os dados (regex)
      if (!user.name || user.name.length < 2) {
        return res.status(400).json({ error: 'Nome de usuário inválido!' });
      }
      if (!user.email || user.email.length < 6 || !user.email.includes('@') || !user.email.includes('.')) {
        return res.status(400).json({ error: 'E-mail de usuário inválido!' });
      }
      if (!user.password || user.password.length < 6) {
        return res.status(400).json({ error: 'Senha de usuário inválida!' });
      }

      // verificar duplicidade
      const verifyUserEmail = await UserModel.find({ email: user.email });
      if (verifyUserEmail && verifyUserEmail.length > 0) {
        return res.status(400).json({ error: 'E-mail de usuário já cadastrado!' });
      }

      // enviar imagem do multer para o cosmic
      const image = await uploadImageCosmic(req);
      user.avatar = image?.media?.url;

      // criptografar a senha antes de salvar
      user.password = md5(user.password);

      // salvar usuário no banco de dados
      await UserModel.create(user);
      return res.status(200).json({ msg: 'Usuário cadastrado com sucesso!' });
    }
  );

export const config = {
  api: {
    bodyParser: false
  }
}

export default connectMongoDB(handler);
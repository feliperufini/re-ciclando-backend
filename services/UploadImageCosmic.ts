import multer from "multer";
import cosmicjs from "cosmicjs";

const {
  KEY_WRITE_AVATARS,
  BUCKET_AVATARS,
  KEY_WRITE_PRODUCTS,
  BUCKET_PRODUCTS
} = process.env;

const Cosmic = cosmicjs();

const bucketAvatars = Cosmic.bucket({
  slug : BUCKET_AVATARS,
  write_key : KEY_WRITE_AVATARS
});

const bucketProducts = Cosmic.bucket({
  slug : BUCKET_PRODUCTS,
  write_key : KEY_WRITE_PRODUCTS
});

const storage = multer.memoryStorage();
const upload = multer({storage : storage});

const uploadImageCosmic = async (req : any) => {
  if (req?.file?.originalname) {
    const mediaObject = {
      originalname: req.file.originalname,
      buffer : req.file.buffer
    };

    if (req.url && req.url.includes('avatar')) {
      return await bucketAvatars.addMedia({media : mediaObject})
    } else {
      return await bucketProducts.addMedia({media : mediaObject})
    }
  }
}

export {upload, uploadImageCosmic};
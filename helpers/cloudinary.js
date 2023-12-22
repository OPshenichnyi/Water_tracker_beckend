import {v2 as cloudinary} from "cloudinary";

const  {CLOUDINARY_CLOUD_NAME, CLOUDINARY_APPI_KEY, CLOUDINARY_APPI_SECRET} =process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_APPI_KEY,
    api_secret: CLOUDINARY_APPI_SECRET
})

export default cloudinary;
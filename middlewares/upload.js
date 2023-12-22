import multer from "multer";
import path from "path";

const tempDir = path.resolve("temp")

const multerConfig = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) =>{
        const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`
        const filename = `${uniquePrefix}_${file.originalname}`
        cb(null, filename);
    }
})

const limits = {
    fileSize: 5 * 1024 * 1024,
}

const upload = multer({
    storage: multerConfig,
    limits,
})

export default upload;
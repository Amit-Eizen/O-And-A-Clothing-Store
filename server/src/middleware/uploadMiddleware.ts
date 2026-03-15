import multer from "multer";
import path from "path";
import fs from "fs";

const getUploadDir = (userId: string, subfolder: string): string => {
    const dir = path.join(__dirname, "../../public/uploads", userId, subfolder);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true});
    }
    return dir;
}

const profileStorage = multer.diskStorage({
    destination: (req: any, file, cb) => {
        cb(null, getUploadDir(req.userId, "profiles"));
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
});

const reviewStorage = multer.diskStorage({
    destination: (req: any, file, cb) => {
        cb(null, getUploadDir(req.userId, "reviews"));
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
    }
};

// Single file upload for profile images
export const uploadProfileImage = multer({
    storage: profileStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single("profileImage");

// Multiple file upload for review images (max 5)
export const uploadReviewImages = multer({
    storage: reviewStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB per file
}).array("images", 5);

export const UPLOADS_PATH = "/public/uploads";

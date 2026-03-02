import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, "../../public/uploads");

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
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
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single("profileImage");

// Multiple file upload for review images (max 5)
export const uploadReviewImages = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB per file
}).array("images", 5);
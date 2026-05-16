const multer = require("multer");
const fs = require("fs");
const { randomStringGenerator } = require("../../utilities/helper");

const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let filePath = "./public/uploads";
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
        }
        cb(null, filePath);
    },
    filename: (req, file, cb) => {
        // Cleaning original name to remove spaces (helps with Cloudinary/URL handling)
        const cleanName = file.originalname.replace(/\s+/g, '-');
        let filename = randomStringGenerator(15) + "-" + cleanName;
        cb(null, filename);
    },
});

const uploader = (type = 'image') => {
    // Define size limits locally (don't use 'this' inside the filter as it refers to the filter object)
    let sizeLimit = 3000000; // Default 3MB
    let allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'];

    if (type === "doc") {
        sizeLimit = 50000000; // 50MB
        allowedExts = ['pdf', 'doc', 'docx', 'xls', 'csv', 'json', 'xlsx'];
    } else if (type === 'audio') {
        sizeLimit = 70000000; // 70MB
        allowedExts = ['mp3', 'wav', 'ogg', 'aac', 'flac'];
    }

    return multer({
        storage: myStorage,
        limits: { 
            fileSize: sizeLimit 
        },
        fileFilter: (req, file, cb) => {
            const fileExt = file.originalname.split(".").pop().toLowerCase();
            
            if (allowedExts.includes(fileExt)) {
                cb(null, true);
            } else {
                cb({ 
                    code: 422, 
                    message: `Unsupported file type. Allowed: ${allowedExts.join(', ')}`, 
                    status: "INVALID_FILE_TYPE" 
                });
            }
        },
    });
};

module.exports = uploader;
const { deleteFile } = require("../../utilities/helper");
const { CloudinaryConfig } = require("../config/config");

const cloudinary = require("cloudinary").v2;

class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: CloudinaryConfig.cloudinaryName,
      api_key: CloudinaryConfig.cloudinaryKey,
      api_secret: CloudinaryConfig.cloudinarySecretKey,
    });
  }

  fileUpload = async (filePath, dir = "/") => {
    try {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        filePath,
        {
          unique_filename: true,
          folder: "/api-galliscout" + dir,
          resource_type: "auto",
        },
      );
      deleteFile(filePath)
      const optimized = cloudinary.url(public_id, {
        transformation: [
          { width: 500, crop: "scale" },
          { quality: "auto", fetch_format: "auto" },
        ],
      });
      return {
        publicId: public_id,
        secureUrl:secure_url,
        optimizedUrl: optimized,
      };
    } catch (exception) {
      console.log(exception);
      throw {
        code: 500,
        message: "File upload error on cloudinary",
        status: "FILE_UPLOAD_ERROR",
      };
    }
  };
}

const cloudinarySvc = new CloudinaryService();
module.exports = cloudinarySvc;

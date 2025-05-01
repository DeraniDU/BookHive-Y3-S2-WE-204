export default {
  PORT: process.env.PORT || 3000,
  mongoDBURL: process.env.MONGO_URI, // Now matches .env
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  },
  jwtSecret: process.env.JWT_SECRET
};
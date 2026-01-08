import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/'
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    cb(null, uploadDir)
  },
  
  filename: function (req, file, cb) {
    // Sanitize filename
    const originalName = file.originalname
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.]/g, '-')
    
    // Create unique filename with timestamp
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = path.extname(sanitizedName)
    const baseName = path.basename(sanitizedName, extension)
    
    const finalFilename = `${baseName}-${timestamp}-${randomString}${extension}`
    
    cb(null, finalFilename)
  }
})

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed MIME types
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ]
  
  // Check if file type is allowed
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF, WebP, SVG) are allowed.'), false)
  }
}

// Create upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file
  }
})

// Custom error handler for Multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      })
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file is allowed.'
      })
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.'
      })
    }
    
    return res.status(400).json({
      success: false,
      message: 'File upload error.'
    })
  } else if (err) {
    // Other errors
    return res.status(400).json({
      success: false,
      message: err.message
    })
  }
  
  next()
}

// Single file upload middleware
const uploadAvatar = upload.single('avatar');

export {uploadAvatar,handleMulterError}
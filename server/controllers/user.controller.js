import User from "../models/user.model.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Op } from "sequelize";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Helper function to get avatar URL
const getAvatarUrl = (req, filename) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

// Helper function to delete old avatar file
const deleteAvatarFile = (avatarUrl) => {
  if (!avatarUrl) return;

  try {
    const filename = avatarUrl.split("/").pop();
    const filePath = path.join(__dirname, "../uploads", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old avatar file: ${filename}`);
    }
  } catch (error) {
    console.error("Error deleting avatar file:", error);
  }
};

export const addUser = async (req, res) => {
  try {
    const userId = req.auth.id;
    const {
      name,
      email,
      age,
      phone,
      address,
      company,
      role,
      website,
      isActive,
      isVerified,
      receiveNotifications,
    } = req.body;

    // Validate required fields
    if (!name || !email || !age) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and age are required fields.",
      });
    }

    // Check if user already exists (by email)
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      if (req.file.filename) {
        deleteAvatarFile(req.file.filename); // delete the store image the user upload but the user not create
      }
      return res.status(409).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    // Prepare user data
    const userData = {
      name,
      email,
      userId,
      age: parseInt(age),
      phone: phone || "",
      address: address || "",
      company: company || "",
      role: role || "",
      website: website || "",
      isActive: isActive === "true",
      isVerified: isVerified === "true",
      receiveNotifications: receiveNotifications === "true",
      avatar: null,
    };

    // Handle avatar file
    if (req.file) {
      userData.avatar = getAvatarUrl(req, req.file.filename);
      userData.avatarFilename = req.file.filename;
    }

    // Save user (in demo, we push to array)
    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: user,
      state: "create"
    });
  } catch (error) {
    console.error("Error creating user:", error);
    if (req.file.filename) {
      deleteAvatarFile(req.file.filename); // delete the store image the user upload but the user not create
    }
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  let uploadedFile = null;
  
  try {
    const userId = req.auth.id;
    const { id } = req.params;
    const {
      name,
      email,
      age,
      phone,
      address,
      company,
      role,
      website,
      isActive,
      isVerified,
      receiveNotifications,
    } = req.body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !age) {
      if (req.file?.filename) {
        deleteAvatarFile(req.file.filename);
      }
      return res.status(400).json({
        success: false,
        message: "Name, email, and age are required fields.",
      });
    }

    // Validate age
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      if (req.file?.filename) {
        deleteAvatarFile(req.file.filename);
      }
      return res.status(400).json({
        success: false,
        message: "Age must be a number between 1 and 120.",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (req.file?.filename) {
        deleteAvatarFile(req.file.filename);
      }
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Find user
    const user = await User.findOne({ where: {id:id, userId:userId} });
    if (!user) {
      if (req.file?.filename) {
        deleteAvatarFile(req.file.filename);
      }
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if email already exists (excluding current user)
    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        if (req.file?.filename) {
          deleteAvatarFile(req.file.filename);
        }
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // Track uploaded file
    if (req.file) {
      uploadedFile = req.file;
    }

    // Prepare update data
    const updateData = {
      name: name.trim(),
      email: email.trim(),
      age: ageNum,
      phone: phone?.trim() || user.phone,
      address: address?.trim() || user.address,
      company: company?.trim() || user.company,
      role: role?.trim() || user.role,
      website: website?.trim() || user.website,
    };

    // Handle boolean fields properly
    if (isActive !== undefined) {
      updateData.isActive = isActive === "true" || isActive === true;
    }
    
    if (isVerified !== undefined) {
      updateData.isVerified = isVerified === "true" || isVerified === true;
    }
    
    if (receiveNotifications !== undefined) {
      updateData.receiveNotifications = receiveNotifications === "true" || receiveNotifications === true;
    }

    // Handle avatar file
    if (req.file) {
      // Delete old avatar file if exists
      if (user.avatarFilename) {
        deleteAvatarFile(user.avatarFilename);
      }
      
      updateData.avatar = getAvatarUrl(req, req.file.filename);
      updateData.avatarFilename = req.file.filename;
    } else if (req.body.removeAvatar === "true") {
      // Handle avatar removal if requested
      if (user.avatarFilename) {
        deleteAvatarFile(user.avatarFilename);
      }
      updateData.avatar = null;
      updateData.avatarFilename = null;
    }

    // Update user
    await user.update(updateData);

    // Get fresh data from database
    const updatedUser = await User.findByPk(id);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
      state: "update"
    });

  } catch (error) {
    console.error("Error updating user:", error);
    
    // Clean up uploaded file if error occurs
    if (uploadedFile?.filename) {
      deleteAvatarFile(uploadedFile.filename);
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.auth.id;
    const { id } = req.params;

    // Find user
    const user = await User.findOne({ where: {id:id, userId:userId}});
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleUser = async (req, res) => {};

export const getUser = async (req, res) => {
  try {
    const {id} = req.auth;
    const { search, role } = req.query;
    
    // --- Pagination Logic ---
    const page = parseInt(req.query.page) || 1;    // Default to page 1
    const limit = parseInt(req.query.limit) || 5; // Default to 10 items
    const offset = (page - 1) * limit;

    // --- Dynamic Filters ---
    let whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (role) {
      whereClause.role = role;
    }

    if(id){
      whereClause.userId = id;
    }

    // --- Execute Query ---
    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      users: rows,
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
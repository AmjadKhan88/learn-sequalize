import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../configs/db.js";

const User = sequelize.define("User",{
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    userId: {type: DataTypes.UUID, allowNull:false},
    name: {type: DataTypes.STRING, allowNull:false},
    email: {type: DataTypes.STRING, allowNull:false},
    age: {type: DataTypes.INTEGER, allowNull:false},
    phone: {type: DataTypes.STRING},
    address: {type: DataTypes.STRING},
    company: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING},
    website: {type: DataTypes.STRING},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: true},
    isVerified: {type: DataTypes.BOOLEAN, defaultValue: false},
    receiveNotifications: {type: DataTypes.BOOLEAN, defaultValue: false},
    avatar: {type: DataTypes.STRING},
    avatarFilename: {type: DataTypes.STRING}
},{
    timestamps:true,
    tableName: "users",
    modelName:'User'
});

export default User;


import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../configs/db.js";


const Auth = sequelize.define('Auth',{
    id: {type: DataTypes.UUID,defaultValue: UUIDV4,primaryKey:true},
    name: {type: DataTypes.STRING,allowNull:false},
    email: {type: DataTypes.STRING,allowNull:false},
    password: {type: DataTypes.STRING,allowNull:false},
    image: {type:DataTypes.STRING, defaultValue:""}
},
{
    timestamps: true,
    tableName:'auths',
    modelName:'Auth'
}
)

export default Auth;
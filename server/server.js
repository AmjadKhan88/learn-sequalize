import express from "express";
import 'dotenv/config';
import cors from "cors";
import { connectDB } from "./configs/db.js";
import { sequelize } from "./configs/db.js";
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/user.routes.js";
import path from 'path'
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";


const app = express();

app.use(cors({
  origin: `${process.env.FRONTEND_URL || 'http://localhost:5173'}`, // Your frontend URL
  credentials: true, // Allow cookies to be sent
}));
app.use(cookieParser())
app.use(express.json());
await connectDB();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// sync table to database
await sequelize.sync({force:false});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get("/",(req,res)=> res.send("Api is working"));
app.use("/api/auth",authRoutes);
app.use('/api/users',userRoutes);


app.listen(3000, () => {
    console.log(`Server is running on port`);
});


export default app;
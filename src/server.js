import express from "express";
import path from "path";
import { engine } from "express-handlebars";
import { config } from "dotenv";

config();

import { connectDB } from "./config/database.js";

import "./bot/bot.js";

import categoryRouter from "./routes/category.js";
import productRouter from "./routes/product.js";
import authRouter from "./routes/auth.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), "./public"))); // __dirname o'rniga process.cwd()

// Handlebars
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

// Routers
// app.use('/', homeRouter);
// app.use('/profile', userRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/auth", authRouter);

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));

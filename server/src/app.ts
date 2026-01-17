import express, { Express } from "express";
import mongoose from "mongoose";
import { swaggerUi, swaggerSpec } from "./swagger";

import authRoute from "./routes/authRoute";
/* import productsRoute from "./routes/productsRoute";
import cartRoute from "./routes/cartRoute";
import ordersRoute from "./routes/ordersRoute";
import commentsRoute from "./routes/commentsRoute"; */

import dotenv from "dotenv";
dotenv.config({ path: ".env.dev" });

const app = express();
app.use(express.json());

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'O&A Clothing Store API Documentation'
}));

// API routes
app.use("/", authRoute);
/* app.use("/products", productsRoute);
app.use("/cart", cartRoute);
app.use("/orders", ordersRoute);
app.use("/comments", commentsRoute); */

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

const initApp = () => {
  const pr = new Promise<Express>((resolve, reject) => {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      reject("DATABASE_URL is not defined");
      return;
    }
    mongoose
      .connect(dbUrl, {})
      .then(() => {
        resolve(app);
      });
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected to Database"));
  });
  return pr;
};

export default initApp;

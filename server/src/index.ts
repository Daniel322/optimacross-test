// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import carsRouter from "./routes/cars.router";

dotenv.config({ path: '.env' });

async function bootstrap() {

  const app: Express = express();
  const port = process.env.PORT || 3000;
  
  try {
    await mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017')
    
    console.log('[server]: mongodb connected')
  } catch (err) {
    console.log(err)
  }
  
  // app.get("/", (req: Request, res: Response) => {
  //   res.send("Express + TypeScript Server");
  // });

  app.use('/cars', carsRouter);
  
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

bootstrap();


// src/index.ts
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import session, { MemoryStore } from 'express-session';

import authRouter from './routes/auth.router';
import carsRouter from './routes/cars.router';

dotenv.config({ path: '.env' });

async function bootstrap() {

  const app: Express = express();
  const port = process.env.PORT || 3000;

  const store: MemoryStore = new session.MemoryStore();

  console.log(store);
  
  try {
    await mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017', {
      "auth": {
        "username": "mongo",
        "password": "mongo" //TODO: add this variables to env
      },
    })
    
    console.log('[server]: mongodb connected')
  } catch (err) {
    console.log(err)
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
    store,
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
  }));

  app.use('/api/cars', carsRouter);
  app.use('/api/auth', authRouter);
  
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}/api`);
  });
}

bootstrap();


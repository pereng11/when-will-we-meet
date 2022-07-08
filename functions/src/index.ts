import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import kakaoRoutes from './routes/kakao';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const corsOptions = {
  origin: true,
};

app.use(cors(corsOptions));
app.use('/kakao', kakaoRoutes);

export const api = functions.https.onRequest(app);

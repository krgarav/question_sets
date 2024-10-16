import express from "express";
import morgan from "morgan";

import cors from 'cors';
import path from 'path';
import bodyParser from "body-parser";

import questionPaperRoutes from "./routes/questionPaperRoutes.js"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// rest object
const app = express();


// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'client', 'build')));

//routes
app.use("/api/v1/question-paper", questionPaperRoutes);


// PORT
const PORT = 8000;

app.listen(PORT, () => {
    console.log(`server Running on ${PORT}`);
});

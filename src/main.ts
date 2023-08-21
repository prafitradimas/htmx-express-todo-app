
import bodyParser from "body-parser";
import express from "express";
import { todoRouter } from "./app/route.js";
import * as path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 42069;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const start = (port: number) => {
    const app = express();
    app.use(express.static(path.normalize(__dirname.concat("/../views"))));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(todoRouter);
    app.listen(port, () => {
        console.info(`Starting server...`);
        console.info(`Listening to http://localhost:${port}`);
    });
}

start(port);

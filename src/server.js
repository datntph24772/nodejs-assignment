import express from 'express'
import mongoose from 'mongoose'
import productRouter from './routers/devices'
import bodyParser from 'body-parser'
import fileRouter from "./routers/file"
import { fileURLToPath } from 'url';
import path from 'path'
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
const app = express()
const port = 8080
// Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(express.static("src/public"))

app.use('/upload', fileRouter)
// Connect DB
mongoose.connect("mongodb://127.0.0.1/assignment1")
.then(() => console.log("Connect to DB successfully"))
// Router
app.use('/', productRouter)
app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
})
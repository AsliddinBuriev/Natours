import { config } from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

config({
  path: './config.env'
});

const pw = encodeURIComponent(process.env.DBPWD)
const url = process.env.DBURL.replace('<password>', pw)

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(res => {
  console.log('DB is connected');
})



const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`THE API IS RUNNING ON PORT ${port}`);
})
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import Tour from './../../src/models/tourModel.js';
config({ path: './config.env' })



const pw = encodeURIComponent(process.env.DBPWD)
const url = process.env.DBURL.replace('<password>', pw)

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => {
    console.log('DB is connected');
})


const tours = JSON.parse(readFileSync(new URL('tours.json', import.meta.url)));
// const users = JSON.parse(readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('data is successfully imported!');
    } catch (err) {
        console.log(err);
    }
    process.exit()
}
const cleanDB = async () => {
    try {
        await Tour.deleteMany();
        console.log('db has been successfully cleaned!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    cleanDB()
}

// console.log(process.argv);
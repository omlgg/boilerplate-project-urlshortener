import mongoose, { mongo } from 'mongoose';
import express from 'express';
import dns from 'node:dns';
import nodeurl from 'node:url';
import dotenv from "dotenv";
dotenv.config();
const router = new express.Router();

const dbusername = process.env.DBUSERNAME;
const dbpassword = process.env.DBPASSWORD;
await mongoose.connect(`mongodb+srv://${dbusername}:${dbpassword}@cluster0.pzim1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);

let urlSchema = mongoose.Schema({
    url: String
})
let urlModel = mongoose.model('URL', urlSchema);


router.get('/:shorturl', async (req, res) => {
    
    let shorturl = req.params?.shorturl;
    if (!mongoose.isObjectIdOrHexString(shorturl)) {
        res.send({"error": "Not correct type of shorturl"});
        return;
    }
    try {
        shorturl = await urlModel.findById(shorturl).exec();
        res.redirect(shorturl.url);
    }
    catch (err) {
        console.log(err);
        res.send({"error":"No short URL found for the given input"});
    }
});

router.post('/', (req, res, next) => {
    const url = req.body?.url;
    
    if (!url) {
        res.send({"error":"Invalid URL"});
        return;
    }

    let parsedURL = new nodeurl.URL(url);

    dns.lookup(parsedURL.host, {}, (err, address, family) => {
        if (err) {
            console.log(parsedURL);
            res.send({"error":"Invalid URL"});
            return;
        }
        else next();
    }); 
})

router.post('/', async (req, res, next) => {
    const url = req.body?.url;

    let values = await urlModel.findOne({url: url}).exec();
    if (!values || Object.keys(values).length === 0) {
        next();
    }
    else {
        res.send({
            original_url: url,
            short_url: values._id.toString()
        })
    }
});

router.post('/',async (req, res) => {
    const url = req.body?.url; 
    let newURL = new urlModel({
        url: url
    })
    let savedURL = await newURL.save();
    res.send({
        original_url: savedURL.url,
        short_url: savedURL._id
    });
})

export default router;
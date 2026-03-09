import express from 'express'
import * as dotenv from 'dotenv'
import OpenAI from "openai";
import axios from 'axios';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

router.route('/').get((req, res) => {
    res.status(200).json({ message: 'Hello from DALL.E Routes' })
})

router.post("/", async (req, res) => {
    try {

        const { prompt } = req.body;

        const response = await axios({
            url: "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json",
                "Accept": "image/png"
            },
            data: {
                inputs: prompt,
            },
            responseType: "arraybuffer",
        });

        const base64Image = Buffer.from(response.data, "binary").toString("base64");

        res.status(200).json({
            photo: base64Image,
        });

    } catch (error) {
        if (error.response && error.response.data) {
            console.error(Buffer.from(error.response.data).toString());
        } else {
            console.error(error.message);
        }
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default router
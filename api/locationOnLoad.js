
const express = require('express');
const cors = require('cors');
const axios = require('axios')
const dotenv = require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

module.exports = async (req, res) => {

    if(req.method === 'GET'){
        res.send('Weather On Load API - GET Method')
    }

    // Checking if POST request
    if(req.method === 'POST'){
        const apiKey = process.env.OPEN_WEATHER_API_KEY

        const lat = req.body.lat
        const lng = req.body.lng
    
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`)
            .then((result) => {
            res.send(result.data) 
            return 
            }
        )
    }

}
require('dotenv').config();
const express = require('express');
const { databaseAuthentication } = require('./config/database');
const app = express();

const storeRouter = require('./routes/route');


app.use(express.json());

app.use('/api/v1/',storeRouter);



app.use((error,req,res,next)=>{
    if (res.headerSent) {
        return next(error)
    } else {
        res.status(error.status_code || 500).json({ status_code: error.status_code, response_message: error.response_message || 'An unknown error occured' });  
    }
})

databaseAuthentication().then(()=>{
    console.log('database connected');
    app.listen(process.env.PORT || 6000, ()=>{
        console.log('Inventory system server started.');
    });
})


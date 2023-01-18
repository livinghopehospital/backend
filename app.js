require('dotenv').config();
const express = require('express');

const app = express();
const { databaseAuthentication } = require('./config/database');

const cors = require('cors');
const storeRouter = require('./routes/route');
const serviceRouter = require('./routes/service-routes');

app.use(express.json());
app.use(cors());
app.options('*', cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-with,Content-Type,Accept,Authorization");
  next();
});

app.use('/api/v1/',storeRouter);
app.use('/api/service/v1/', serviceRouter);




app.use((error,req,res,next)=>{
    // console.log(error);
    if (res.headerSent) {
        return next(error)
    } else {
        res.status(error.status_code || 500).json({ status_code: error.status_code, response_message: error.response_message || 'An unknown error occured' });  
    }
})


app.use((req,res,next)=>{
  res.status(404).json({status_code:404,response_message:'The requested route is not found on this server'})
})

databaseAuthentication().then(()=>{
    app.listen(process.env.PORT || 6000, ()=>{
        console.log('Inventory system server started 6000.');
    });
});


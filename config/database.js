
const mongoose = require("mongoose");
const { secretKeys } = require("./keys");


const redis = require('redis');

const redisClient = redis.createClient(6379)


const databaseAuthentication =async()=>{
    try {
        mongoose.connect(secretKeys.DATABASE_URL).then(()=>{
            console.log("Database connected");
        }).catch((err)=>{
            console.log(err);
        })
    } catch (error) {
        
    }
}


module.exports={
    databaseAuthentication,
    redisClient
}
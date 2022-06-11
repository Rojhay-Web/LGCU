'use strict';

require('dotenv').config();
const fs = require("fs");
var mongoClient = require('mongodb').MongoClient;

const database = {
    connectionString: process.env.DatabaseConnectionString,
    dbName: process.env.DatabaseName,
    connectionOptions: { connectTimeoutMS: 2000, socketTimeoutMS: 2000}
}

findAll();

function findAll(){
    try {
        var output = "", retStatus = false;

        // Import to DB
        mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
            if(err) {
                console.log(`[Error] Connecting to DB: ${err}`);
                return retStatus;
            }
            else {
                const db = client.db(database.dbName).collection('lgcu_degrees');
                db.aggregate([
                    {"$group" : { "_id": "$title", "count": { "$sum": 1 } } },
                    {"$match": {"_id" :{ "$ne" : null } , "count" : {"$gt": 1} } }, 
                    {"$project": {"title" : "$_id", "_id" : 0, "count":1 } }
                ]).toArray(function(err, res){
                    if(err){
                        output = `[Error] Inserting Finding All Dups: ${err}`;
                    }
                    else { 
                        output = `[SUCCESS] Inserting Courses`; retStatus = true; 
                        console.log(res);                                                                                                  
                    }                        
                    client.close(); console.log(output);
                    return retStatus;
                });
            }
        });  
    }
    catch(ex){
        console.log(`[Error] Importing Courses: ${ex}`);
        return retStatus;
    }
}
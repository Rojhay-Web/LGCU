'use strict';

require('dotenv').config();
const fs = require("fs");
var mongoClient = require('mongodb').MongoClient;

const database = {
    connectionString: process.env.DatabaseConnectionString,
    dbName: process.env.DatabaseName,
    connectionOptions: { connectTimeoutMS: 2000, socketTimeoutMS: 2000}
}

/* Data */
let academicData = {}, courseData ={};

/* Main Section */
init();
//importCourses();
//importSchools();
//importDegrees();

// Import jsonFiles
function init(){
    try {
        var academicFile = fs.readFileSync('../../src/js/data/academics.json');
        var courseFile = fs.readFileSync('../../src/js/data/courses.json');

        academicData = JSON.parse(academicFile);
        courseData = JSON.parse(courseFile);

        return true;
    }
    catch(ex){
        console.log(`[Error] Importing JSON Files: ${ex}`);
        return false;
    }
}

// Import Courses
function importCourses(){
    try {
        var output = "", retStatus = false;
        // Build Course Objects
        const courseKeys = Object.keys(courseData);
        var courseList = [];
        courseKeys.map(key =>{
            courseList.push({
                courseKey: key,
                ...courseData[key]
            });
        });

        // Import to DB
        mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
            if(err) {
                console.log(`[Error] Connecting to DB: ${err}`);
                return retStatus;
            }
            else {
                const db = client.db(database.dbName).collection('lgcu_courses');
                db.insertMany(courseList,function(insertError,retObj){
                    if(insertError){
                        output = `[Error] Inserting Courses: ${insertError}`;
                    }
                    else { 
                        output = `[SUCCESS] Inserting Courses`; retStatus = true; 
                        console.log(retObj);                                                                                                  
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

// Importing Schools of Study
function importSchools(){
    try {
        var output = "", retStatus = false;
        // Build Course Objects
        const academicKeys = Object.keys(academicData);
        var schoolList = [];
        academicKeys.map(key =>{
            var tmpSchool = {
                schoolKey: key,
                ...academicData[key]
            };
            delete tmpSchool.degrees;

            schoolList.push(tmpSchool);
        });

        // Import to DB
        mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
            if(err) {
                console.log( `[Error] Connecting to DB: ${err}`);
                return retStatus;
            }
            else {
                const db = client.db(database.dbName).collection('lgcu_schools');
                db.insertMany(schoolList,function(insertError,retObj){
                    if(insertError){
                        output = `[Error] Inserting Schools Of Study: ${insertError}`;
                    }
                    else { 
                        output = `[SUCCESS] Inserting Schools Of Study ${retObj}`; retStatus = true;                                                                                                       
                    }                        
                    client.close(); console.log(output);
                    return retStatus;
                });
            }
        });  
    }
    catch(ex){
        console.log(`[Error] Importing Schools Of Study: ${ex}`);
    }
}

// Importing Degree List
function importDegrees(){
    try {
        var output = "", retStatus = false;
        // Build Degree Objects
        const academicKeys = Object.keys(academicData);
        var degreeList = [];
        academicKeys.map(school =>{
            const levelKeys = Object.keys(academicData[school].degrees);
            levelKeys.map(level => {
                var levelList = academicData[school].degrees[level];
                levelList.map(degree => {
                    degreeList.push({
                        schoolKey: school,
                        levelKey: level,
                        ...degree
                    });
                });
            });
        });

        // Import to DB
        mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
            if(err) {
                console.log( `[Error] Connecting to DB: ${err}`);
                return retStatus;
            }
            else {
                const db = client.db(database.dbName).collection('lgcu_degrees');
                db.insertMany(degreeList,function(insertError,retObj){
                    if(insertError){
                        output = `[Error] Inserting Degrees: ${insertError}`;
                    }
                    else { 
                        output = `[SUCCESS] Inserting Degrees ${retObj}`; retStatus = true;                                                                                                       
                    }                        
                    client.close(); console.log(output);
                    return retStatus;
                });
            }
        });  
    }
    catch(ex){
        console.log(`[Error] Importing Degrees: ${ex}`);
    }
}
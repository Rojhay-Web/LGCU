'use strict';

const fs = require("fs");
const courseDataFile = "../src/js/data/courses.json";
const academicDataFile = "../src/js/data/academics.json";

// Run Code
main();

function main(){
    try {
        let rawdata_c = fs.readFileSync(courseDataFile); 
        let rawdata_a = fs.readFileSync(academicDataFile); 
        let courseData = JSON.parse(rawdata_c); 
        let academicData = JSON.parse(rawdata_a);

        var schoolList = Object.keys(academicData);

        console.log("Starting Scan");

        schoolList.forEach(function(school){
            var tmpDegreeList = Object.keys(academicData[school].degrees);
            console.log(" -> ", school);
            tmpDegreeList.forEach(function(degree){
                console.log(" --> ", degree);
                var majorList = academicData[school].degrees[degree];
                majorList.forEach(function(major){                    
                    major.courses.forEach(function(section){
                        section.courses.forEach(function(dclass){
                            if(!(dclass in courseData)){
                                console.log(school," | ",degree," | ",dclass, " Not in Course file");
                            }
                        });
                    });
                });
            });
        });

        console.log("Completed Scan");
    }
    catch(ex){
        console.log("error verifying course data: ",ex);
    }
}

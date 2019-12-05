'use strict';

const fs = require("fs");
const academicDataFile = "../src/js/data/academics.json";

// Run Code
main();

function main(){
    try {
        let rawdata_a = fs.readFileSync(academicDataFile);
        let academicData = JSON.parse(rawdata_a);

        var schoolList = Object.keys(academicData);

        console.log("Starting Build");
        var urlBase = "https://www.lenkesongcu.org/studyarea/"

        schoolList.forEach(function(school){
            var tmpDegreeList = Object.keys(academicData[school].degrees);
            //console.log(" -> ", school);
            tmpDegreeList.forEach(function(degree){
                //console.log(" --> ", degree);
                var majorList = academicData[school].degrees[degree];
                majorList.forEach(function(major){                    
                    var sitemapUrl = '<url><loc>'+urlBase+school+'?majorId='+major.id+'</loc></url>';
                    console.log(sitemapUrl);
                });
            });
        });

        console.log("Completed Scan");
    }
    catch(ex){
        console.log("error Building site map: ",ex);
    }
}
require('dotenv').config();
var mongoClient = require('mongodb').MongoClient;

const database = {
    connectionString: process.env.DatabaseConnectionString,
    dbName: process.env.DatabaseName,
    connectionOptions: { connectTimeoutMS: 2000, socketTimeoutMS: 2000}
}

const academics = {
    getAllSchools: function(callback){
        var response = {"errorMessage":null, "results":null};

        try {
            mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err; callback(response);
                }
                else {
                    const db = client.db(database.dbName).collection('lgcu_schools');
                    db.find({})
                    .toArray(function(err, res){ 
                        if(err) { response.error = `[Error] Retrieving Schools(s): ${err}`; }
                        else {  response.results = res; }
                        client.close(); callback(response);  
                    }); 
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error] Getting All LGCU Schools (E09): "+ ex;
            callback(response);
        }
    },
    getAllDegreeLevels:function(callback) {
        var response = {"errorMessage":null, "results":null};

        try {
            mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err; callback(response);
                }
                else {
                    const db = client.db(database.dbName).collection('lgcu_degrees');
                    db.distinct("levelKey", function(err, res){ 
                        if(err) { response.error = `[Error] Retrieving Degree Level(s): ${err}`; }
                        else {  response.results = res.map(item => ({ title: item })); }
                        client.close(); callback(response);  
                    }); 
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error] Getting All LGCU Degree Levels (E09): "+ ex;
            callback(response);
        }
    },
    getDegreeCourses:function(majorId, callback) {
        var response = {"errorMessage":null, "results":null};

        try {
            mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err; callback(response);
                }
                else {
                    majorId = majorId.toUpperCase();

                    const db = client.db(database.dbName).collection('lgcu_degrees');
                    db.aggregate([
                        { $match: {"id": majorId}},
                        { $lookup: { from: "lgcu_courses", localField: "courses.courses", foreignField: "courseKey", as: "courseInfo" }},
                    ]).toArray(function(err, res){ 
                        if(err) { response.error = `[Error] Getting Degree Courses (E2): ${err}`; }
                        else if(!res || res.length <= 0) { response.error = `[Error] No results`;}
                        else {  
                            let tmpRet = res[0];
                            tmpRet.courseInfo = Object.assign({}, ...tmpRet.courseInfo.map((x) => ({[x.courseKey]: x})));

                            response.results = tmpRet; 
                        }
                        client.close(); callback(response);  
                    });
                }
            });
        }
        catch(ex){
            response.errorMessage = `[Error] Getting Courses For ${majorId} (E09): ${ex}`;
            callback(response);
        }
    },
    degreeSearch: function(schoolList, levelList, concentrations, callback){
        var response = {"errorMessage":null, "results":null};

        try {
            var query = [];
            if(schoolList && schoolList.length > 0){
                query.push({schoolKey: { $in: schoolList }});
            }
            if(levelList && levelList.length > 0){
                query.push({levelKey: { $in: levelList }});
            }
            if(query.length === 0){
                query.push({});
            }

            mongoClient.connect(database.connectionString, database.mongoOptions, function(err, client){
                if(err) {
                    response.errorMessage = err; callback(response);
                }
                else {
                    const db = client.db(database.dbName).collection('lgcu_degrees');
                    db.find({ $and: query})
                    .project({_id:1, schoolKey: 1, levelKey:1, id:1, title:1, concentrations: 1, degreeTitle: 1 })
                    .toArray(function(err, res){ 
                        if(err) { response.error = `[Error] Searching Degree(s): ${err}`; }
                        else if(concentrations){  
                            const concentrationList = res.filter(function(major){
                                return major.concentrations && major.concentrations.length > 0;
                            });

                            concentrationList.map(function(con) {
                                con.concentrations.forEach(function(concentration) {
                                    res.push({...con, subtitle:concentration.title });
                                });
                            });

                            response.results = res; 
                        }
                        else {
                            response.results = res;
                        }
                        client.close(); callback(response);  
                    }); 
                }
            });
        }
        catch(ex){
            response.errorMessage = "[Error] Searching LGCU Degrees (E09): "+ ex;
            callback(response);
        }
    }
}

module.exports = academics;
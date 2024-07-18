module.exports = {
    validateParam(params, obj, call_name=null) {
        if(!obj){ throw "param object is empty";  }
        else{
            let missingList = [];

            for(let i = 0; i < params.length; i++){
                if(!(params[i] in obj) || obj[params[i]] == null){
                    log.warning(`${params[i]} is missing from ${call_name}`);
                    missingList.push(params[i]);
                }
            }

            if(missingList.length > 0){
                throw `${missingList.join(",")} parameters are missing`;
            }
        }
    }
}
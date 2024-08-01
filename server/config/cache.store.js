'use strict';
const log = require('../services/log.service');
const fns = require('date-fns');

class CacheStore {
    constructor() {
        this.store = {};
    }

    /* Search Cache Store For Key */
    searchCacheStore(key){
        try {
            key = key.toLowerCase();
            
            let ret = this.store[key];
            
            if(!ret?.expireDate || fns.isPast(ret.expireDate) || !ret?.data){
                return null;
            }

            return ret?.data;        
        }
        catch(ex){
            log.error(`Searching Cache [${key}]: ${ex}`);
            return null;
        }
    }

    /* Update Cache Store Local & Backup DB */
    updateCacheStore(key, data, expireDate=null){
        let status = true;
        try {
            if(!data){
                log.error(`No Data To Update/Insert`);
                return false;
            }
            
            if(expireDate == null) {
                expireDate = fns.getTime(fns.addDays(new Date(),1));
            }
            
            key = key.toLowerCase();
            this.store[key] = { 
                "key": key, "expireDate": expireDate, "data": data
            };
            log.debug(`Added [${key}] to cache`);
        }
        catch(ex){
            log.error(`Updating Cache [${key}]: ${ex}`);
            status = false;
        }

        return status;
    }
}

module.exports = CacheStore;
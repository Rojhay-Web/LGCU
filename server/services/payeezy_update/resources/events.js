var method = require("../method");
var Resource = require("../resource");

module.exports = Resource.extend({
		
		path : '/events',		
		searchById : method ({
			method: 'GET',
			path: '/{id}',
			urlParams: ['id']
		})
});
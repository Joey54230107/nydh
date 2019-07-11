const http = require('http')
const request = require("request")
const xml = require('xml2js')
const xmlreader = require("xmlreader")

const req = request.get({
	url: 'http://z1.krsncjdnr.info/pw/thread.php?fid=112&page=1'
}, (err, res) => {

	xmlreader.read(res.body, function(errors, response){
		if(null !== errors ){
			console.log(errors)
			return;
		}
		console.log( response.response )
	});
})

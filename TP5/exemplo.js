var http=require('http')
var url=require('url')
var fs=require('fs')
var pug=require('pug')
var path=require('path')

var estilo=/w3\.css/
var index=/index/
var musica=/musica/
var jsonFile=/\*.json/

fs.readdirAsync = function(dirname) {
    return new Promise(function(resolve, reject) {
        fs.readdir(dirname, function(err, filenames){
            if (err) 
                reject(err); 
            else 
                resolve(filenames);
        });
    });
};
fs.readFileAsync = function(filename, enc) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, enc, function(err, data){
            if (err) 
                reject(err); 
            else
                resolve(data);
        });
    });
};
function getFile(filename) {
    return fs.readFileAsync(filename, 'utf8');
}
function isDataFile(filename) {
  return (filename.split('.')[1] == 'json')
}
fs.writeFile('./fishes.json', '', function(){console.log('done')});
http.createServer((req,res)=>{
	var purl = url.parse(req.url,true)

	if(index.test(purl.pathname)){
		res.writeHead(200,{'Content-type':'text/html'})
		console.log('P5001: index request')
		fs.readdirAsync('./json').then(function (filenames){
		    filenames = filenames.filter(isDataFile);
		    console.log(filenames);
		    return Promise.all(filenames.map(getFile));
		}).then(function (files){
	    		var summaryFiles = [];
	    		files.forEach(function(file) {
	    		  var json_file = JSON.parse(file);
	    		  summaryFiles.push({ "name": json_file["name"],
	    		                      "imageUrl": json_file["images"][0],
	    		                      "id": json_file["id"]
	    		                  });
	    		});
			})
	}
}
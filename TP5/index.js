var http=require('http')
var url=require('url')
var fs=require('fs')
var pug=require('pug')
var path=require('path')

var estilo=/w3\.css/
var index=/index/
var musicas=/musicas/
var jsonFile=/\*.json/
var arr=[]
var arre2=[]
var arre3=[]
var tr=false
fs.readdir('./json', function(err, files) {
   	if(!err){
   		files.forEach(function(file, ind){
   			var link='json/'+file
   			fs.readFile(link,(err,data)=>{
   				if(!err&&file.match(/(m.*\.json)/)){
   					var obj=JSON.parse(data)
   					var elem={"tipo":obj.tipo,"_id":obj._id, "titulo":obj.titulo}
   					arr.push(elem)
   				}
   				else
   					console.log('Erro ao ler o ficheiro '+file)
   			})    				
   		})
	}	
   	else
   		console.log('Erro nos ficheiros do dir')
})

http.createServer((req,res)=>{
	var purl = url.parse(req.url,true)
	if(!tr){
			/** CONVERSOR DE ARRAY: a insercao devia ser ordenada. modificar **/
			for(f in arr){
				if(arr[f].tipo in arre2){
					var tipoxx=arr[f].tipo
					var elem={"aid":arr[f]._id,"titulo":arr[f].titulo}
					arre2[tipoxx].info.push(elem)
				}
				else{
					var tipoxx=arr[f].tipo
					var elem={"tipo":tipoxx,"info":[{"aid":arr[f]._id,"titulo":arr[f].titulo}]}
					arre2[tipoxx]=elem
				}
			}
			for(j in arre2)
				arre3.push(arre2[j])
			tr="true"
		}
	if(index.test(purl.pathname)){
		console.log('arr test -----------------')
		for(r in arre3)
			console.log(JSON.stringify(arre3))
		console.log('--------------------------')
		res.writeHead(200,{'Content-type':'text/html'})
		console.log('P5001: index request')
		res.write(pug.renderFile('index.pug',{ds: arre3}))
		res.end()
	}
	else if(estilo.test(purl.pathname)){
		res.writeHead(200,{'Content-type':'text/css'})
		fs.readFile('estilo/w3.css',(err,data)=>{
			if(err)
				console.log('Erro a tentar aceder a folha de estilo')
			else
				res.write(data)
			res.end()
		})
		
	}
	else if(musicas.test(purl.pathname)){
		res.writeHead(200,{'Content-type':'text/html'})
		var fich=purl.pathname.split('/')[2]+'.json'
		console.log('Pesquisa '+fich)
		fs.readFile('json/'+fich,(err,data)=>{
			if(!err){
				var obj=JSON.parse(data)
				res.write(pug.renderFile('layoutjs.pug',{ds: obj}))
			}
			else
				res.write('<p>ERRO ao processar o ficheiro JSON.</p>'+fich)
			res.end()

		})

	}
	else{
		res.writeHead(200,{'Content-type':'text/html'})
		res.write('<p>Erro: Rota desconhecida</p>')
		res.end()
	}
	
}).listen(5001,()=>{
	console.log('P5001: on')
})
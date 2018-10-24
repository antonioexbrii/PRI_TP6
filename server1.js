var http=require('http')
var pug=require('pug')
var fs=require('fs')
var url=require('url')
var {parse}=require('querystring')
var jsonfile=require('jsonfile')

/* Ficheiro de registo de dados */
var tesesBD='tesesbd.json'

var srv=http.createServer((req,res)=>{
	var purl=url.parse(req.url,true)
	console.log('req:'+JSON.stringify(purl))
	console.log('method:'+req.method)

	if(req.method=='GET'){
		
		if(req.url=='/'){ //nao deixa aceder com o purl.pathname?
			res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
			res.write(pug.renderFile('index.pug'))
			res.end()
		}
		else if(purl.pathname=='/registo'){
			res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
			res.write(pug.renderFile('formulario.pug'))
			res.end()
		}
		else if(purl.pathname=='/lista'){
			res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
			jsonfile.readFile(tesesBD,(err,teses)=>{
				if(!err)
					res.write(pug.renderFile('lista-teses.pug', {lista:teses}))
				else
					console.log('erro listagem') //mudar aqio tb				
			})
		}
		else if(purl.pathname=='/w3.css'){
			res.writeHead(200,{'Content-Type':'text/css'})
			fs.readFile('stylesheet/w3.css',(err,data)=>{
				if(!err) res.write(data)
				else res.write(pug.renderFile('erros.pug',{erro:err}))
				res.end()
			})
		}
		else if(purl.pathname=='/manifesto'){
			res.writeHead(200,{'Content-Type':'text/html'})
			fs.readFile('manifesto.html',(err,data)=>{
				if(!err) res.write(data)
				else res.write(pug.renderFile('erros.pug',{erro:err}))
				res.end()
			})
		}
		else if(purl.pathname=='/limpaBD'){
			var tmp=[]
			jsonfile.readFile(tesesBD,(err,teses)=>{
				if(!err){
					console.dir(teses)
					jsonfile.writeFile(tesesBD,tmp,err2=>{
						if(!err2) console.log('Listagem de teses apagada.')
						else console.log('Ocorreu um erro a eliminar as entradas da base de dados.') // mais aqui
					})
				}
				else{
					console.log('erro no readfile'+err) // aui tb
				}
			})
			res.end(pug.renderFile('index.pug',{conf:tmp}))
		}
		else{
			res.writeHead(501,{'Content-Type':'text/html;charset=utf-8'})
			console.log('ERRO(GET): '+purl.pathname+' não especificado.')
			res.end('ERRO(GET): '+purl.pathname+' não especificado.')
		}
	}
	else if(req.method=='POST'){
		if(purl.pathname=='/processaForm'){
			recuperaInfo(req,result=>{
				jsonfile.readFile(tesesBD,(err,teses)=>{
					if(!err){
						teses.push(result)
						jsonfile.writeFile(tesesBD,teses,err2=>{
							if(!err2) console.log('Nova tese adicionada com sucesso.')
							else console.log('Ocorreu um erro a submeter a tese') // mais aqui
						})
					}
					else{
						console.log('erro no readfile'+err)
					}
				})
				console.log(result)
				res.end(pug.renderFile('tese-adicionada.pug',{novo:result}))
			})
			
		}
		else{
			res.writeHead(501,{'Content-Type':'text/html;charset=utf-8'})
			console.log('ERRO(POST): '+purl.pathname+' não especificado.')
			res.end('ERRO(POST): '+purl.pathname+' não especificado.')
		}
	}
	else {
		res.writeHead(501,{'Content-Type':'text/html;charset=utf-8'})
		console.log('ERRO('+req.method+':) '+purl.pathname+' não especificado.')
		res.end('ERRO('+req.method+':) '+purl.pathname+' não especificado.')
	}

})

srv.listen(5006,()=>{
	console.log('SERVIDOR à escuta na porta 5006.')
})
function recuperaInfo(request, callback){
	const FORM_URLENCODED='application/x-www-form-urlencoded'
	if(request.headers['content-type']===FORM_URLENCODED){
		let body = ''
		request.on('data',chunk=>{
			body+=chunk.toString()
		})
		request.on('end',()=>{
			callback(parse(body))
		})
	}
	else{
		console.log('erro no encoding do formulario')
		callback(null)
	}
}
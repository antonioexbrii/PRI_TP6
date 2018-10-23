var http = require('http')
var url = require('url')
var fs = require('fs')
var pug = require('pug')
var parser = require('xml2json')
// EXPRESSOES REGULARES
var estilo = /w3\.css/
var index = /index/
var arqelem = /arqelem/

http.createServer((req,res)=>{
	var purl = url.parse(req.url,true)

	if(index.test(purl.pathname)){
		res.writeHead(200, {'Content-type': 'text/html'})
		fs.readFile('data/index.xml', (erro,dados)=>{
			if(!erro){
				var myObj = JSON.parse(parser.toJson(dados))					// fazer console log do myobj
				res.write(pug.renderFile('index.pug', {ind: myObj}))
			}
			else
				res.write('<p><b>Erro:</b> '+erro+'</p>') //usar template para pags de erro
		})

	}
	else if(estilo.test(purl.pathname)){
		res.writeHead(200, {'Content-type': 'text/css'})
		fs.readFile('estilo/w3.css', (erro,dados)=>{
			if(!erro){
				res.write(dados)
			}
			else
				res.write('<p><b>Erro:</b> '+erro+'</p>')
			res.end()
		})
	}
	else if(arqelem.test(purl.pathname)){
		var ficheiro = purl.pathname.split('/')[2]+'.xml'
		console.log('ler ficheiro: '+ficheiro)
		res.writeHead(200, {'Content-type': 'text/html'})
		fs.readFile('data/xml/'+ficheiro, (erro,dados)=>{
			if(!erro){
				var myObj = JSON.parse(parser.toJson(dados))					// fazer console log do myobj
				res.write(pug.renderFile('template.pug', {arq: myObj}))
			}
			else
				res.write('<p><b>Erro:</b> '+erro+'</p>') //usar template para pags de erro
			res.end()
		})		
	}
	else {
		res.writeHead(200,'text/html')
		res.write('<p><b>ERRO:</b> '+purl.pathname+'</p>')
		res.write('<br/><p>Rota desconhecida</p>')
		res.end()
	}
}).listen(5000,()=>{
	console.log('Nova ligacao: 5000')
})


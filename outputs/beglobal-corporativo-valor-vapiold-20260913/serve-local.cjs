const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'site');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.md':'text/plain; charset=utf-8','.vtt':'text/vtt','.srt':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8','.mp4':'video/mp4'};
const csp="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; media-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'";
http.createServer((req,res)=>{try{
  let rel=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);if(rel.endsWith('/'))rel+='index.html';
  const file=path.resolve(root,'.'+rel);
  if(!file.startsWith(root+path.sep)||path.basename(file).startsWith('.')){res.writeHead(403);return res.end();}
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}
  const size=fs.statSync(file).size,headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':size,'Content-Security-Policy':csp,'X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
  if(/\.(md|srt|txt)$/.test(file))headers['Content-Disposition']='attachment';
  const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);let start=0,end=size-1;
  if(range){start=Number(range[1]);end=range[2]?Math.min(Number(range[2]),size-1):size-1;if(start>end){res.writeHead(416);return res.end();}headers['Content-Range']=`bytes ${start}-${end}/${size}`;headers['Content-Length']=end-start+1;}
  res.writeHead(range?206:200,headers);if(req.method==='HEAD')res.end();else fs.createReadStream(file,{start,end}).pipe(res);
}catch{res.writeHead(500);res.end();}}).listen(8914,'127.0.0.1',()=>console.log('BeGlobal review: http://127.0.0.1:8914/'));

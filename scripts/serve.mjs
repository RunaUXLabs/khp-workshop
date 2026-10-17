import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const project=fileURLToPath(new URL('../',import.meta.url));
const publicRoot=path.join(project,'public');
const dev=process.argv.includes('--dev');
const port=Number(process.env.PORT)||4173;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.md':'text/plain; charset=utf-8','.mmd':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{try{
 let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const prefix=process.env.BASE_PATH||'';
 if(prefix){if(!pathname.startsWith(prefix+'/')){res.writeHead(404);res.end('Not found');return;}pathname=pathname.slice(prefix.length);}
 const relative=pathname.endsWith('/')?pathname+'index.html':pathname;
 const candidates=dev
  ? relative==='/index.html'?[{base:project,relative:'/index.html'}]
   :relative.startsWith('/src/')?[{base:path.join(project,'src'),relative:relative.slice(4)}]
   :[{base:publicRoot,relative},{base:root,relative}]
  :[{base:root,relative}];
 for(const candidate of candidates){
  const target=path.resolve(candidate.base,'.'+candidate.relative);
  const within=path.relative(candidate.base,target);
  if(within.startsWith('..')||path.isAbsolute(within)){res.writeHead(403);res.end();return;}
  try{
   const content=await readFile(target);
   res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
   res.end(content);return;
  }catch(error){if(error.code!=='ENOENT'&&error.code!=='EISDIR')throw error;}
 }
 res.writeHead(404);res.end('Not found');
}catch{res.writeHead(404);res.end('Not found');}}).listen(port,'127.0.0.1',()=>console.log(`Workshop ${dev?'dev (source files)':'preview (dist)'}: http://127.0.0.1:${port}${process.env.BASE_PATH||''}/`));

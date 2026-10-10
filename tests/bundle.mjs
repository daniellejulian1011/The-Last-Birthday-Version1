import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
export function combinedSource(){return ['story','engine','scene','audio','storage','app'].map(name=>fs.readFileSync(path.join(root,'js',name+'.js'),'utf8').replace(/^import .*?;\s*$/gm,'').replace(/\bexport (?=(?:const|let|function|class)\b)/g,'')).join('\n\n');}
if(process.argv[1]===import.meta.filename){
 const assets={};for(const name of fs.readdirSync(path.join(root,'assets'))){if(!/\.(webp|svg)$/.test(name))continue;assets['assets/'+name]=`data:${name.endsWith('.svg')?'image/svg+xml':'image/webp'};base64,`+fs.readFileSync(path.join(root,'assets',name)).toString('base64');}
 let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 html=html.replace('<link rel="stylesheet" href="./styles.css">',`<style>${fs.readFileSync(path.join(root,'styles.css'),'utf8')}</style>`);
 html=html.replace('./assets/favicon.svg',assets['assets/favicon.svg']);
 const code=combinedSource();new Function(code);
 const script=`window.GAME_ASSETS=${JSON.stringify(assets)};\n(()=>{\n${code}\n})();`;
 html=html.replace('<script type="module" src="./js/app.js"></script>',`<script>${script.replace(/<\/script/gi,'<\\/script')}</script>`);
 const outfile=path.join(root,'PLAY_OFFLINE.html');fs.writeFileSync(outfile,html);console.log('Bundled PLAY_OFFLINE.html · '+(Buffer.byteLength(html)/1024/1024).toFixed(2)+' MiB · no external dependencies.');
}

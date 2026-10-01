import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import katex from '../apps/practice/vendor/katex/katex.mjs';

const decode = s => s.replace(/&quot;/g,'"').replace(/&#x27;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const problems = JSON.parse(readFileSync('apps/practice/problems.json','utf8'));
let count=0;
for (const [id,source] of [...problems.map(p=>[p.id,p.description]),['page',readFileSync('apps/practice/index.html','utf8')]]) {
  const expressions=[...source.matchAll(/data-tex="([^"]+)"/g)].map(m=>decode(m[1]));
  assert.ok(expressions.length>0,`${id}: no LaTeX`);
  if(id!=='page')assert.equal((source.match(/class="formula" data-display="true" data-tex=/g)||[]).length,1,`${id}: missing display formula`);
  for (const expression of expressions) {
    const rendered=katex.renderToString(expression,{displayMode:true,output:'htmlAndMathml',throwOnError:true,strict:'error',trust:false});
    assert.ok(rendered.includes('<math') && rendered.includes('katex-html'),`${id}: missing accessible or visual output`);
    count++;
  }
}
const css=readFileSync('apps/practice/vendor/katex/katex.min.css','utf8');
for(const [,url] of css.matchAll(/url\(([^)]+)\)/g))assert.ok(existsSync(`apps/practice/vendor/katex/${url}`),`Missing math font: ${url}`);
console.log(`${count} LaTeX expressions parsed; HTML, MathML and all local math fonts verified.`);

const $ = (id) => document.getElementById(id);
const key = 'zzong-ml-practice-v1';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(key) || '{}'); if (!saved || typeof saved !== 'object') saved = {}; } catch {}
let problems, current, worker, ready = false, running = false, timer;
const persist = () => { try { localStorage.setItem(key, JSON.stringify(saved)); $('save-state').textContent = '이 기기에 저장됨'; } catch { $('save-state').textContent = '저장 불가 · 코드를 따로 복사하세요'; } };
function updateProgress() {
  const count = problems.filter(p => saved[p.id]?.passed).length;
  $('progress').textContent = `${count} / ${problems.length}`;
  $('progress-bar').value = count;
  for (const p of problems) {
    const button = document.querySelector(`[data-id="${p.id}"]`);
    button.setAttribute('aria-current', String(current.id === p.id));
    button.querySelector('.number').textContent = saved[p.id]?.passed ? '✓' : String(problems.indexOf(p)+1).padStart(2,'0');
    button.classList.toggle('completed',!!saved[p.id]?.passed);
  }
}
function select(id) {
  if (running) stop('문제를 바꿔 실행을 중지했습니다.');
  current = problems.find(p => p.id === id) || problems[0];
  history.replaceState(null,'',`#${current.id}`);
  for (const name of ['title','category','difficulty','example','solution']) $(name).textContent = current[name];
  $('description').innerHTML = current.description; // repository-owned content only
  $('source').href = current.source;
  $('source').textContent = `${current.sourceLabel} · 원문 ↗`;
  $('constraints').replaceChildren(...current.constraints.map(t => {const li=document.createElement('li');li.textContent=t;return li;}));
  $('hints').replaceChildren(...current.hints.map((t,i) => {const d=document.createElement('details');const s=document.createElement('summary');s.textContent=`힌트 ${i+1}`;const p=document.createElement('p');p.textContent=t;d.append(s,p);return d;}));
  $('solution-details').open = false;
  $('editor').value = typeof saved[current.id]?.code === 'string' ? saved[current.id].code : current.starter;
  $('status').textContent = saved[current.id]?.passed ? '이전에 통과한 문제' : '실행 전';
  $('result-content').replaceChildren();
  const p = document.createElement('p');p.className='muted';p.textContent=`${current.tests.length}개의 공개 테스트 · 허용 오차 rtol=1e-6, atol=1e-8`;$('result-content').append(p);
  $('stdout').hidden = true;
  updateProgress();
}
function saveCode() { saved[current.id] = {...saved[current.id],code:$('editor').value,passed:false}; persist(); updateProgress(); $('status').textContent='수정됨 · 다시 채점하세요'; }
function finish() { clearTimeout(timer);running=false;$('run').disabled=false;$('stop').hidden=true;$('reset').disabled=false;$('use-solution').disabled=false;$('editor').readOnly=false; }
function stop(message='실행을 중지했습니다. 다시 실행할 수 있습니다.') { if(worker)worker.terminate();worker=null;ready=false;finish();$('status').textContent=message; }
function fail(error) { finish();$('status').textContent='실행 실패';const pre=document.createElement('pre');pre.className='fail';pre.textContent=error;$('result-content').replaceChildren(pre); }
function send() {
  $('status').textContent='테스트 실행 중…';
  clearTimeout(timer);
  timer=setTimeout(()=>stop('8초 제한을 초과했습니다. 반복문과 종료 조건을 확인하세요.'),8000);
  worker.postMessage({code:$('editor').value,function:current.function,tests:current.tests});
}
function run() {
  if(running)return;
  saved[current.id]={...saved[current.id],code:$('editor').value,passed:false};persist();updateProgress();
  running=true;$('run').disabled=true;$('stop').hidden=false;$('reset').disabled=true;$('use-solution').disabled=true;$('editor').readOnly=true;$('stdout').hidden=true;
  $('result-content').replaceChildren();
  if(worker && ready){send();return;}
  $('status').textContent='Python 준비 중 · 첫 실행은 다운로드가 필요합니다…';
  timer=setTimeout(()=>stop('실행 환경 다운로드가 지연됩니다. 네트워크를 확인한 뒤 다시 실행하세요.'),120000);
  try { worker=new Worker('./worker.js'); } catch(e) { stop();fail(String(e));return; }
  worker.onerror=(e)=>{stop();fail(`Python 실행 환경을 불러오지 못했습니다. 네트워크 또는 CDN 접근을 확인하세요.\n${e.message}`);};
  worker.onmessage=({data})=>{
    if(data.type==='ready'){ready=true;if(running)send();return;}
    if(data.type==='error'){stop();fail(data.error);}
    if(data.type==='result'){
      finish();const passed=data.results.filter(t=>t.passed).length;
      $('status').textContent=`${passed} / ${data.results.length} 통과`;
      $('result-content').replaceChildren(...data.results.map(t=>{
        const row=document.createElement('div');row.className='test-row';
        const line=document.createElement('div');const label=document.createElement('span');label.textContent=t.name;
        const badge=document.createElement('span');badge.className=t.passed?'pass':'fail';badge.textContent=t.passed?'통과':'실패';line.append(label,badge);row.append(line);
        if(!t.passed){const pre=document.createElement('pre');pre.textContent=`입력: ${t.input}\n기대: ${t.expected}\n실제: ${t.actual}`;row.append(pre);}return row;
      }));
      saved[current.id]={code:$('editor').value,passed:passed===data.results.length};persist();updateProgress();
    }
    if(data.output){$('stdout').textContent=data.output;$('stdout').hidden=false;}
  };
}
$('editor').addEventListener('input',saveCode);
$('editor').addEventListener('keydown',e=>{
  if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();run();}
  if(e.key==='Tab'&&!e.shiftKey&&!$('editor').readOnly){e.preventDefault();const el=$('editor');el.setRangeText('    ',el.selectionStart,el.selectionEnd,'end');saveCode();}
});
$('run').onclick=run;$('stop').onclick=()=>stop();
$('reset').onclick=()=>{if(confirm('이 문제의 코드를 초기 코드로 되돌릴까요?')){$('editor').value=current.starter;saveCode();}};
$('use-solution').onclick=()=>{if(confirm('작성 중인 코드를 참고 풀이로 바꿀까요?')){$('editor').value=current.solution;saveCode();$('editor').focus();}};
function experiment(){const n=Number($('length').value),r=Number($('ratio').value);$('length-value').textContent=`${n} tokens`;$('ratio-value').textContent=r.toFixed(4);const v=Math.exp(n*Math.log(r));$('product').textContent=v>1e5||v<.0001?v.toExponential(3):v.toFixed(4);$('geomean').textContent=r.toFixed(4);}
$('length').oninput=experiment;$('ratio').oninput=experiment;experiment();
try {
  const response=await fetch('./problems.json');if(!response.ok)throw new Error(`HTTP ${response.status}`);problems=await response.json();
  $('problem-nav').replaceChildren(...problems.map(p=>{const b=document.createElement('button');b.dataset.id=p.id;const num=document.createElement('span');num.className='number';const title=document.createElement('span');title.textContent=p.short;b.append(num,title);b.onclick=()=>select(p.id);return b;}));
  select(location.hash.slice(1));
  window.addEventListener('hashchange',()=>select(location.hash.slice(1)));
}catch(e){$('title').textContent='문제를 불러오지 못했습니다.';$('description').textContent='페이지를 새로고침해 주세요. '+String(e);$('run').disabled=true;}

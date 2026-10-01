const $ = (id) => document.getElementById(id);
const key = 'zzong-ml-practice-v1';
const courses = {
  basics: {title:'경사하강법과 회귀',description:'한 걸음부터 선형회귀 학습과 Momentum까지. 처음이라면 이 코스부터 시작하세요.'},
  foundations: {title:'벡터와 전처리',description:'내적, 행렬 곱, 스케일링을 직접 구현하며 모델 입력을 준비합니다.'},
  neural: {title:'활성화와 분류',description:'Sigmoid·ReLU·Softmax에서 분류 loss와 정확도까지 이어집니다.'},
  advanced: {title:'GRPO · GSPO',description:'심화 코스 · policy update를 네 개의 함수로 구현합니다.'},
};
let saved = {};
try { saved = JSON.parse(localStorage.getItem(key) || '{}'); if (!saved || typeof saved !== 'object') saved = {}; } catch {}
let problems, current, worker, ready = false, running = false, timer;
const courseProblems = () => problems.filter(p => p.course === current.course);
const persist = () => { try { localStorage.setItem(key, JSON.stringify(saved)); $('save-state').textContent = '이 기기에 저장됨'; } catch { $('save-state').textContent = '저장 불가 · 코드를 따로 복사하세요'; } };
function updateProgress() {
  const visible = courseProblems();
  const count = problems.filter(p => saved[p.id]?.passed).length;
  $('progress').textContent = `${count} / ${problems.length}`;
  $('progress-bar').max = problems.length;
  $('progress-bar').value = count;
  for (const [id,course] of Object.entries(courses)) {
    const items = problems.filter(p=>p.course===id);
    const button = document.querySelector(`[data-course="${id}"]`);
    button.setAttribute('aria-current',String(current.course===id));
    button.querySelector('small').textContent=`${items.length}문제 · ${items.filter(p=>saved[p.id]?.passed).length}개 완료`;
  }
  $('course-count').textContent=`${courses[current.course].title} · ${visible.length}문제 / 전체 ${problems.length}문제`;
  for (const p of visible) {
    const button = document.querySelector(`[data-id="${p.id}"]`);
    button.setAttribute('aria-current', String(current.id === p.id));
    button.querySelector('.number').textContent = saved[p.id]?.passed ? '✓' : String(visible.indexOf(p)+1).padStart(2,'0');
    button.classList.toggle('completed',!!saved[p.id]?.passed);
  }
}
function select(id) {
  if (running) stop('문제를 바꿔 실행을 중지했습니다.');
  current = problems.find(p => p.id === id) || problems[0];
  $('problem-nav').replaceChildren(...courseProblems().map(p=>{const b=document.createElement('button');b.dataset.id=p.id;const num=document.createElement('span');num.className='number';const title=document.createElement('span');title.textContent=p.short;b.append(num,title);b.onclick=()=>select(p.id);return b;}));
  $('course-description').textContent = courses[current.course].description;
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
function experiment(){
  const n=Number($('steps').value),lr=Number($('learning-rate').value);
  $('steps-value').textContent=`${n}회`;$('learning-rate-value').textContent=lr.toFixed(2);
  let w=4; const trace=['0회: w = 4.0000, loss = 9.0000'];
  for(let i=1;i<=n;i++){w-=lr*2*(w-1);if(i<=4||i===n)trace.push(`${i}회: w = ${w.toFixed(4)}, loss = ${((w-1)**2).toFixed(4)}`);else if(i===5)trace.push('…');}
  $('parameter-value').textContent=w.toFixed(4);$('loss-value').textContent=((w-1)**2).toFixed(4);
  $('trajectory').textContent=trace.join('\n');
  $('experiment-note').textContent=lr===0?'학습률이 0이면 이동하지 않습니다.':lr<.5?'최솟값 w=1을 향해 같은 쪽에서 접근합니다.':lr===.5?'한 번 업데이트하면 정확히 w=1에 도착합니다.':lr<1?'최솟값을 번갈아 넘으면서 가까워집니다.':lr===1?'w=4와 −2를 왕복하며 loss가 줄지 않습니다.':'학습률이 너무 커서 최솟값에서 점점 멀어집니다.';
}
$('steps').oninput=experiment;$('learning-rate').oninput=experiment;experiment();
try {
  const response=await fetch('./problems.json');if(!response.ok)throw new Error(`HTTP ${response.status}`);problems=await response.json();
  $('course-nav').replaceChildren(...Object.entries(courses).map(([id,course])=>{
    const b=document.createElement('button');b.dataset.course=id;
    const title=document.createElement('strong');title.textContent=course.title;
    const count=document.createElement('small');b.append(title,count);
    b.onclick=()=>select(problems.find(p=>p.course===id).id);return b;
  }));
  $('catalog-title').textContent=`전체 ${problems.length}문제 한눈에 보기`;
  $('catalog-list').replaceChildren(...Object.entries(courses).map(([id,course])=>{
    const section=document.createElement('section');const h=document.createElement('h3');h.textContent=course.title;
    const ul=document.createElement('ul');
    for(const p of problems.filter(p=>p.course===id)){const li=document.createElement('li');const a=document.createElement('a');a.href=`#${p.id}`;a.textContent=p.title;a.onclick=e=>{e.preventDefault();select(p.id);$('catalog').open=false;$('title').scrollIntoView({block:'start'});};li.append(a);ul.append(li);}
    section.append(h,ul);return section;
  }));
  select(location.hash.slice(1));
  window.addEventListener('hashchange',()=>select(location.hash.slice(1)));
}catch(e){$('title').textContent='문제를 불러오지 못했습니다.';$('description').textContent='페이지를 새로고침해 주세요. '+String(e);$('run').disabled=true;}

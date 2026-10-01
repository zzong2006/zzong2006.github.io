// Ace is vendored locally so editing does not depend on an editor CDN.
export function createEditor(textarea, onChange, onRun) {
  if (!window.ace) {
    textarea.addEventListener('input', onChange);
    document.getElementById('complete').hidden=true;
    return {getValue:()=>textarea.value,setValue:v=>{textarea.value=v;},setReadOnly:v=>{textarea.readOnly=v;},focus:()=>textarea.focus()};
  }
  const host=document.createElement('div');host.className='code-editor';
  textarea.before(host);textarea.hidden=true;
  ace.config.set('basePath',new URL('./vendor/ace/',import.meta.url).href);
  const view=ace.edit(host,{
    mode:'ace/mode/python',theme:'ace/theme/tomorrow_night',
    fontSize:15,fontFamily:'Consolas, monospace',tabSize:4,useSoftTabs:true,
    showPrintMargin:false,enableBasicAutocompletion:true,enableLiveAutocompletion:true,
    textInputAriaLabel:'Python 코드 편집기',
    enableSnippets:false,showLineNumbers:true,highlightActiveLine:true,
  });
  view.session.setUseWorker(false);
  view.textInput.getElement().setAttribute('aria-label','Python 코드 편집기');
  let replacing=false;
  view.session.on('change',()=>{if(!replacing)onChange();});
  const functions={
    np:['array','asarray','arange','zeros','ones','zeros_like','ones_like','mean','std','var','sum','max','min','exp','log','sqrt','abs','clip','where','dot','matmul','reshape','concatenate','stack','maximum','minimum','isfinite','allclose','argmax','argmin'],
    math:['exp','log','sqrt','sin','cos','fabs','isfinite','isclose','floor','ceil'],
  };
  const keywords='def return if elif else for while in import from as True False None and or not pass raise try except with lambda'.split(' ');
  const builtins='len range zip sum min max abs float int list tuple dict enumerate print sorted round bool isinstance ValueError'.split(' ');
  view.completers=[{
    identifierRegexps:[/[a-zA-Z_0-9.]/],
    getCompletions(editor,session,pos,prefix,callback){
      const token=session.getTokenAt(pos.row,pos.column);
      if(token && /comment|string/.test(token.type))return callback(null,[]);
      const module=prefix.split('.')[0];
      if(prefix.includes('.')){
        const name=module==='numpy'?'np':module;
        return callback(null,(functions[name]||[]).map(word=>({caption:`${module}.${word}`,value:`${module}.${word}`,meta:name==='np'?'NumPy':'math',score:1000})));
      }
      const local=[...new Set(editor.getValue().match(/\b[A-Za-z_][A-Za-z_0-9]*\b/g)||[])];
      callback(null,[...keywords.map(value=>({value,meta:'Python',score:800})),...builtins.map(value=>({value,meta:'builtin',score:900})),...local.filter(v=>!keywords.includes(v)&&!builtins.includes(v)).map(value=>({value,meta:'코드 안의 이름',score:700}))]);
    },
  }];
  view.commands.addCommand({name:'runPractice',bindKey:{win:'Ctrl-Enter',mac:'Command-Enter'},exec:onRun});
  document.getElementById('complete').onclick=()=>{view.focus();view.execCommand('startAutocomplete');};
  return {
    getValue:()=>view.getValue(),
    setValue(value){replacing=true;try{view.setValue(value,-1);view.session.setUndoManager(new (ace.require('ace/undomanager').UndoManager)());}finally{replacing=false;}},
    setReadOnly:value=>view.setReadOnly(value),focus:()=>view.focus(),
  };
}

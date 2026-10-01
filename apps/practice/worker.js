// Isolated from the UI so loops and Python failures can be terminated safely.
importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');
let output = '';
const runtime = loadPyodide({
  indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/',
  stdout: (line) => { if (output.length < 8000) output += line.slice(0, 1000) + '\n'; },
  stderr: (line) => { if (output.length < 8000) output += line.slice(0, 1000) + '\n'; },
}).then(async py => { await py.loadPackage('numpy'); return py; });
runtime.then(() => postMessage({type:'ready'})).catch(e => postMessage({type:'error',error:String(e)}));
self.onmessage = async ({data}) => {
  const py = await runtime;
  output = '';
  const scope = py.toPy({ source_code:data.code, test_json:JSON.stringify(data.tests), function_name:data.function, helper_code:data.helpers || '', enforce_pure:!!data.enforcePure });
  try {
    const result = await py.runPythonAsync(`
import json, math, traceback, copy, sys, types
import numpy as np
def grade(source, function_name, test_json, helper_code, enforce_pure):
    # Rebuild the provided module for every submission; learner edits never carry over.
    helpers = types.ModuleType("course")
    sys.modules["course"] = helpers
    exec(compile(helper_code, "course.py", "exec"), helpers.__dict__)
    scope = {"__name__": "__submission__"}
    exec(compile(source, "solution.py", "exec"), scope)
    fn = scope.get(function_name)
    if not callable(fn):
        raise ValueError(f"{function_name} 함수를 정의하세요.")
    def close(a, b):
        if isinstance(a, np.ndarray):
            a = a.tolist()
        elif isinstance(a, np.generic):
            a = a.item()
        if isinstance(b, list):
            return isinstance(a, (list, tuple)) and len(a) == len(b) and all(close(x,y) for x,y in zip(a,b))
        return isinstance(a, (int,float)) and not isinstance(a,bool) and math.isfinite(a) and math.isclose(a,b,rel_tol=1e-6,abs_tol=1e-8)
    results = []
    for case in json.loads(test_json):
        expected = case.get("expected", case.get("raises"))
        learning = None
        try:
            args = copy.deepcopy(case["args"])
            value = fn(*args)
            unchanged = not enforce_pure or args == case["args"]
            passed = "raises" not in case and close(value, expected) and unchanged
            actual = repr(value)[:1500]
            if not unchanged:
                actual += " (입력 객체가 변경되었습니다.)"
            if passed and case.get("trackLoss"):
                history = value[2]
                learning = [float(history[0]), float(history[-1]), len(history)]
        except Exception as e:
            passed = type(e).__name__ == case.get("raises")
            actual = type(e).__name__ + ": " + str(e)[:500]
        results.append({"name":case["name"], "passed":passed, "actual":actual, "expected":repr(expected), "input":repr(case["args"])[:1500], "learning":learning})
    return json.dumps(results, ensure_ascii=False)
grade(source_code, function_name, test_json, helper_code, enforce_pure)
`, {globals:scope});
    postMessage({type:'result',results:JSON.parse(result),output});
  } catch(e) { postMessage({type:'error',error:String(e),output}); }
  finally { scope.destroy(); }
};

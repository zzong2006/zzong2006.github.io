"""Check published reference answers and meaningful negative cases without packages."""
import json
import math
from pathlib import Path

problems = json.loads(Path('apps/practice/problems.json').read_text(encoding='utf-8'))
def close(a, b):
    if isinstance(b, list):
        return isinstance(a, (list, tuple)) and len(a) == len(b) and all(close(x,y) for x,y in zip(a,b))
    return isinstance(a, (int,float)) and not isinstance(a,bool) and math.isfinite(a) and math.isclose(a,b,rel_tol=1e-6,abs_tol=1e-8)

def check(fn, case):
    try:
        value = fn(*case['args'])
        return 'raises' not in case and close(value, case['expected'])
    except Exception as error:
        return type(error).__name__ == case.get('raises')

wrong = {
    'gradient-step': lambda w, grad, lr: w + lr * grad,
    'quadratic-descent': lambda w, target, lr, steps: w - steps * lr * 2 * (w-target),
    'mse-loss': lambda pred, target: sum(abs(p-y) for p,y in zip(pred,target))/len(pred),
    'linear-gradient': lambda x,y,w,b: [sum((w*xi+b-yi)*xi for xi,yi in zip(x,y))/len(x),sum(w*xi+b-yi for xi,yi in zip(x,y))/len(x)],
    'train-linear': lambda x,y,lr,steps: [2,1],
    'group-advantage': lambda rewards, eps=1e-8: [(r-sum(rewards)/len(rewards))/(math.sqrt(sum((x-sum(rewards)/len(rewards))**2 for x in rewards)/max(1,len(rewards)-1))+eps) for r in rewards],
    'token-ratio': lambda new, old: [math.exp(n)/math.exp(o) for n,o in zip(new,old)],
    'sequence-ratio': lambda new, old, mask: sum(math.exp(n-o)*m for n,o,m in zip(new,old,mask))/sum(mask),
    'clipped-objective': lambda ratios, advantages, epsilon=.2: sum(min(r,min(max(r,1-epsilon),1+epsilon))*a for r,a in zip(ratios,advantages))/len(ratios),
}
total = 0
for p in problems:
    scope = {}
    exec(p['solution'], scope)
    fn = scope[p['function']]
    for case in p['tests']:
        assert check(fn, case), (p['id'], case['name'])
        total += 1
    assert not all(check(wrong[p['id']], c) for c in p['tests']), f"Tests did not reject misconception: {p['id']}"
    assert (Path('content') / (p.get('sourceNote',p['source']).lstrip('/') + '.md')).is_file(), p['source']
def sequential_update(x, y, lr, steps):
    w, b = 0., 0.
    for _ in range(steps):
        w -= lr * 2 * sum((w*xi+b-yi)*xi for xi,yi in zip(x,y)) / len(x)
        b -= lr * 2 * sum(w*xi+b-yi for xi,yi in zip(x,y)) / len(x)
    return [w,b]

training = next(p for p in problems if p['id']=='train-linear')
assert not all(check(sequential_update,c) for c in training['tests']), 'Sequential update bug escaped'
ids = [p['id'] for p in problems]
assert len(ids)==len(set(ids))
assert problems[0]['id']=='gradient-step'
assert sum(p['course']=='basics' for p in problems)==5
assert sum(p['course']=='advanced' for p in problems)==4
print(f'{total} reference cases passed; {len(wrong)+1} misconception implementations rejected; source notes exist.')

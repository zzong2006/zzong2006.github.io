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
    assert (Path('content') / (p['source'].lstrip('/') + '.md')).is_file(), p['source']
print(f'{total} reference cases passed; all 4 misconception implementations rejected; source notes exist.')

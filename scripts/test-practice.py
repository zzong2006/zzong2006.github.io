"""Check published reference answers and meaningful negative cases without packages."""
import json
import math
import copy
import sys
import types
from pathlib import Path

problems = json.loads(Path('apps/practice/problems.json').read_text(encoding='utf-8'))
by_id = {p['id']:p for p in problems}

def setup_helpers(p):
    module = types.ModuleType('course')
    sys.modules['course'] = module
    for id in p.get('helpers', []):
        exec(by_id[id]['solution'], module.__dict__)
    return module
def close(a, b):
    if isinstance(b, list):
        return isinstance(a, (list, tuple)) and len(a) == len(b) and all(close(x,y) for x,y in zip(a,b))
    return isinstance(a, (int,float)) and not isinstance(a,bool) and math.isfinite(a) and math.isclose(a,b,rel_tol=1e-6,abs_tol=1e-8)

def check(fn, case):
    try:
        args = copy.deepcopy(case['args'])
        value = fn(*args)
        return 'raises' not in case and close(value, case['expected']) and args == case['args']
    except Exception as error:
        return type(error).__name__ == case.get('raises')

wrong = {
    'dot-product': lambda a,b: [x*y for x,y in zip(a,b)],
    'matrix-vector': lambda a,b: [sum(x*y for x,y in zip(col,b)) for col in zip(*a)],
    'min-max': lambda values: [(x-min(values))/max(values) for x in values],
    'standardize': lambda values: [(x-sum(values)/len(values))/math.sqrt(sum((v-sum(values)/len(values))**2 for v in values)/(len(values)-1)) for x in values],
    'sigmoid': lambda x: 1/(1+math.exp(-x)),
    'relu': lambda values: [x for x in values if x>0],
    'softmax': lambda values: [math.exp(x)/sum(math.exp(v) for v in values) for x in values],
    'binary-cross-entropy': lambda pred,target,eps=1e-7: -sum(y*math.log(max(p,eps)) for p,y in zip(pred,target))/len(pred),
    'categorical-cross-entropy': lambda probs,labels,eps=1e-7: -sum(math.log(max(max(row),eps)) for row in probs)/len(labels),
    'classification-accuracy': lambda pred,target: 100*sum(p==y for p,y in zip(pred,target))/len(pred),
    'momentum-step': lambda w,v,g,lr,beta: [w-lr*(beta*v+lr*g),beta*v+lr*g],
    'gradient-step': lambda w, grad, lr: w + lr * grad,
    'quadratic-descent': lambda w, target, lr, steps: w - steps * lr * 2 * (w-target),
    'mse-loss': lambda pred, target: sum(abs(p-y) for p,y in zip(pred,target))/len(pred),
    'lr-predict': lambda X,w,b: [sum(x*g for x,g in zip(row,w)) for row in X],
    'lr-gradient': lambda X,y,w,b: [[sum((sum(a*c for a,c in zip(row,w))+b-yi)*row[j] for row,yi in zip(X,y))/len(X) for j in range(len(w))],0],
    'lr-step': lambda X,y,w,b,lr: [w,b],
    'lr-train': lambda X,y,w,b,lr,steps: [w,b,[]],
    'lr-minibatch': lambda X,y,w,b,lr,epochs,batch_size: [w,b,[]],
    'group-advantage': lambda rewards, eps=1e-8: [(r-sum(rewards)/len(rewards))/(math.sqrt(sum((x-sum(rewards)/len(rewards))**2 for x in rewards)/max(1,len(rewards)-1))+eps) for r in rewards],
    'token-ratio': lambda new, old: [math.exp(n)/math.exp(o) for n,o in zip(new,old)],
    'sequence-ratio': lambda new, old, mask: sum(math.exp(n-o)*m for n,o,m in zip(new,old,mask))/sum(mask),
    'clipped-objective': lambda ratios, advantages, epsilon=.2: sum(min(r,min(max(r,1-epsilon),1+epsilon))*a for r,a in zip(ratios,advantages))/len(ratios),
}
total = 0
for p in problems:
    setup_helpers(p)
    scope = {}
    exec(p['solution'], scope)
    fn = scope[p['function']]
    for case in p['tests']:
        assert check(fn, case), (p['id'], case['name'])
        total += 1
    assert not all(check(wrong[p['id']], c) for c in p['tests']), f"Tests did not reject misconception: {p['id']}"
    assert (Path('content') / (p.get('sourceNote',p['source']).lstrip('/') + '.md')).is_file(), p['source']
ids = [p['id'] for p in problems]
assert len(ids)==len(set(ids))
assert problems[0]['id']=='lr-predict'
assert sum(p['course']=='basics' for p in problems)==6
assert sum(p['course']=='optimization' for p in problems)==3
assert sum(p['course']=='foundations' for p in problems)==4
assert sum(p['course']=='neural' for p in problems)==6
assert sum(p['course']=='advanced' for p in problems)==4
for p in problems:
    if p['course']=='basics':
        assert p['starter'].splitlines()[1:]==['    pass']
        assert p['connection'] and len(p['hints'])==3
        for helper in p.get('helpers',[]):
            assert ids.index(helper)<ids.index(p['id']), 'Only earlier stages may be provided'

# Independent finite differences verify every feature derivative and the bias.
module=setup_helpers(by_id['lr-step'])
X,y,w,b=[[1,2,-1],[0,-1,3],[2,0,1]],[2,-1,3],[.4,-.2,.1],.3
dw,db=module.gradients(X,y,w,b)
loss=lambda w,b:sum((pred-target)**2 for pred,target in zip(module.predict(X,w,b),y))/len(y)
eps=1e-5
for j in range(len(w)):
    plus,minus=w.copy(),w.copy();plus[j]+=eps;minus[j]-=eps
    assert math.isclose(dw[j],(loss(plus,b)-loss(minus,b))/(2*eps),rel_tol=1e-6)
assert math.isclose(db,(loss(w,b+eps)-loss(w,b-eps))/(2*eps),rel_tol=1e-6)

def sequential_update(X,y,w,b,lr):
    dw,_=module.gradients(X,y,w,b)
    w=[v-lr*g for v,g in zip(w,dw)]
    _,db=module.gradients(X,y,w,b)
    return [w,b-lr*db]
assert not all(check(sequential_update,c) for c in by_id['lr-step']['tests'])

def mini_variant(drop_tail=False, record_batch=False, frozen=False):
    def fn(X,y,w0,b0,lr,epochs,batch_size):
        m=sys.modules['course'];w,b=list(w0),b0
        history=[m.mse_loss(m.predict(X,w,b),y)]
        for _ in range(epochs):
            initial_w,initial_b=list(w),b
            end=len(X)//batch_size*batch_size if drop_tail else len(X)
            for start in range(0,end,batch_size):
                w,b=m.gd_step(X[start:start+batch_size],y[start:start+batch_size],initial_w if frozen else w,initial_b if frozen else b,lr)
                if record_batch:history.append(m.mse_loss(m.predict(X,w,b),y))
            if not record_batch:history.append(m.mse_loss(m.predict(X,w,b),y))
        return [w,b,history]
    return fn
setup_helpers(by_id['lr-minibatch'])
for bad in [mini_variant(drop_tail=True),mini_variant(record_batch=True),mini_variant(frozen=True)]:
    assert not all(check(bad,c) for c in by_id['lr-minibatch']['tests'])
print(f'{total} reference cases passed; {len(wrong)+4} misconception implementations rejected; finite differences and source notes verified.')

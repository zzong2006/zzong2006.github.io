# ML Practice

Public personal study surface at `/practice/`, deployed with the existing Quartz
GitHub Pages workflow. Canonical lesson data is `problems.json`; it is derived from
public notes, not a vault synchronization target. The default beginner course
is gradient step, quadratic descent, MSE, linear gradients, and linear regression
training. The original four GRPO/GSPO exercises remain in the advanced course;
stable problem IDs preserve saved code, progress, and old hash links.

Curriculum inspiration: NeetCode ML (https://neetcode.io/practice/machine-learning)
and TensorTonic Cracking ML (https://www.tensortonic.com/study-plans/cracking-ml).
Explanations, examples, reference code, and tests are original to this site.
The MSE derivatives follow Google ML Crash Course:
https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent
Beginner exercises use MSE with 1/N, not the 1/(2N) convention in the GD note.

Run `python scripts/test-practice.py` and `node scripts/build-practice.mjs` from the
repository root. After a Quartz build, copy the practice assets **after** Quartz
(which can clean `public/`). The CI workflow does this automatically.

Python 3 runs through Pyodide 0.27.7 in a Web Worker. The first run downloads the
runtime from jsDelivr. Exercises use only the standard library. Execution is
limited to eight seconds after runtime initialization; Stop destroys the worker.
This is a self-study runner, not a secure assessment or a hidden-test service.
All tests and reference solutions are intentionally public. There is no backend,
account, telemetry, leaderboard, or server submission. Browser-local progress is
not shared between devices. User code can use Pyodide's normal browser APIs; do
not treat it as a security boundary for running code from strangers.

To add a lesson, add a problem with a stable id, function name, starter, reference
solution, explicit constraints, tests, and a link to its published source note.
The advanced course uses population standard deviation and adds epsilon to the
denominator. Its clipped objective excludes KL and returns a maximization
objective, not a negated training loss. It does not train an LLM.

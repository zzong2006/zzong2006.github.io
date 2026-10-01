import {test} from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {exercisesForNote} from './matching.js'
const problems=JSON.parse(fs.readFileSync('apps/practice/problems.json','utf8'))
test('notes link to the right published exercise IDs',()=>{
  assert.deepEqual(exercisesForNote(problems,'machine_learning/optimization/gradient-descent').map(p=>p.id),['gradient-step','quadratic-descent','linear-gradient','train-linear'])
  assert.deepEqual(exercisesForNote(problems,'machine_learning/linear_models/linear-regression').map(p=>p.id),['linear-gradient','train-linear'])
  assert.deepEqual(exercisesForNote(problems,'machine_learning/generative_ai/LLM/GSPO').map(p=>p.id),['sequence-ratio','clipped-objective'])
  assert.equal(exercisesForNote(problems,'index').length,0)
  assert.equal(exercisesForNote(problems,'database/normalization').length,0)
  for(const p of problems) assert.ok(exercisesForNote(problems,p.source).includes(p))
})

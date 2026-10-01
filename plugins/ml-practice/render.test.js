import {test} from 'node:test'
import assert from 'node:assert/strict'
import {render} from 'preact-render-to-string'
import {PracticeLinks} from './components/index.js'
test('rendered note actions leave Quartz routing for the standalone runner',()=>{
  const Component=PracticeLinks()
  const html=render(Component({fileData:{slug:'machine_learning/optimization/gradient-descent'}}))
  assert.ok(html.includes('전체 20문제'))
  for(const id of ['gradient-step','quadratic-descent','linear-gradient','train-linear']) {
    assert.ok(html.includes(`href="/practice/#${id}"`))
  }
  assert.equal((html.match(/data-router-ignore/g)||[]).length,5)
  assert.equal(Component({fileData:{slug:'index'}}),null)
  assert.equal(Component({fileData:{slug:'machine_learning/optimization/gradient-descent',unlisted:true}}),null)
})

import katex from './vendor/katex/katex.mjs';

// Only repository-authored math is rendered; code examples and the editor stay literal.
export function renderMath(root) {
  for (const element of root.querySelectorAll('[data-tex]')) {
    try {
      katex.render(element.dataset.tex, element, {
        displayMode: element.dataset.display === 'true',
        output: 'htmlAndMathml',
        throwOnError: true,
        strict: 'error',
        trust: false,
      });
    } catch (error) {
      element.textContent = element.dataset.tex;
      element.dataset.mathError = 'true';
      console.error('Formula rendering failed', error);
    }
  }
}

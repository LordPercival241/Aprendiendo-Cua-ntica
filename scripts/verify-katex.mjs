import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';

const sourcePaths = [
  path.resolve('src/content/modulesData.ts'),
  path.resolve('src/content/completionSections.ts'),
];
const formulas = sourcePaths.flatMap((sourcePath) => {
  const source = fs.readFileSync(sourcePath, 'utf8');
  return [...source.matchAll(/formula:\s*'((?:\\'|[^'])*)'/g)]
    .map((match) => match[1].replace(/\\\\/g, '\\').replace(/\\'/g, "'"));
});

if (formulas.length === 0) {
  throw new Error('No se encontraron fórmulas para validar.');
}

const failures = [];
for (const [index, formula] of formulas.entries()) {
  try {
    katex.renderToString(formula, { throwOnError: true, strict: false });
  } catch (error) {
    failures.push({ index: index + 1, formula, error: error.message });
  }
}

if (failures.length > 0) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}

console.log('KaTeX validó ' + formulas.length + ' fórmulas de contenido académico.');

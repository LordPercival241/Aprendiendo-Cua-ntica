import fs from 'node:fs';
import path from 'node:path';

const sourcePaths = [
  path.resolve('src/app/[locale]/recursos/page.tsx'),
  path.resolve('src/types/module.ts'),
];
const publicRoot = path.resolve('public');
const referencedFiles = new Set();

for (const sourcePath of sourcePaths) {
  const source = fs.readFileSync(sourcePath, 'utf8');
  for (const match of source.matchAll(/['"](\/(?:lectures|books|syllabus)\/[^'"]+\.pdf)['"]/g)) {
    referencedFiles.add(match[1]);
  }
}

const missingFiles = [...referencedFiles]
  .filter((resourcePath) => !fs.existsSync(path.join(publicRoot, decodeURI(resourcePath))));

if (missingFiles.length > 0) {
  console.error(`Recursos públicos ausentes:\n${missingFiles.map((resourcePath) => `- ${resourcePath}`).join('\n')}`);
  process.exit(1);
}

console.log(`Se verificaron ${referencedFiles.size} recursos PDF públicos.`);

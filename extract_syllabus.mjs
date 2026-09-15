import * as fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function extract() {
  const data = new Uint8Array(fs.readFileSync('../IF411 MECANICA CUANTICA.pdf'));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  let fullText = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str).join(' ');
    fullText += `\n--- PAGE ${i} ---\n` + strings;
  }
  fs.writeFileSync('../syllabus_text.txt', fullText, 'utf-8');
  console.log('Extracted ' + doc.numPages + ' pages to syllabus_text.txt');
}

extract().catch(console.error);

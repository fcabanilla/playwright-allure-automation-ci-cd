import fs from 'fs';
import path from 'path';

const resultsDir = './allure-results';
const results = [];

// Leer todos los archivos de resultado
const files = fs.readdirSync(resultsDir);
const resultFiles = files.filter(file => file.endsWith('-result.json'));

console.log('🎯 ALLURE TEST RESULTS SUMMARY\n');
console.log('=' * 50);

resultFiles.forEach(file => {
  const content = fs.readFileSync(path.join(resultsDir, file), 'utf8');
  const result = JSON.parse(content);

  console.log(`\n📋 Test: ${result.name}`);
  console.log(`📊 Status: ${result.status.toUpperCase()}`);
  console.log(`⏱️  Duration: ${((result.stop - result.start) / 1000).toFixed(2)}s`);

  if (result.labels) {
    const tags = result.labels.filter(l => l.name === 'tag').map(l => l.value);
    if (tags.length > 0) {
      console.log(`🏷️  Tags: ${tags.join(', ')}`);
    }
  }

  if (result.steps && result.steps.length > 0) {
    console.log(`📝 Steps executed: ${result.steps.length}`);
    result.steps.forEach((step, index) => {
      if (step.name && !step.name.includes('Hook')) {
        console.log(`   ${index + 1}. ${step.name} - ${step.status}`);
      }
    });
  }

  results.push(result);
});

console.log('\n' + '=' * 50);
console.log(`\n📈 SUMMARY:`);
console.log(`✅ Total tests: ${results.length}`);
console.log(`✅ Passed: ${results.filter(r => r.status === 'passed').length}`);
console.log(`❌ Failed: ${results.filter(r => r.status === 'failed').length}`);
console.log(`⏸️  Skipped: ${results.filter(r => r.status === 'skipped').length}`);

const totalDuration = results.reduce((sum, r) => sum + (r.stop - r.start), 0);
console.log(`⏱️  Total execution time: ${(totalDuration / 1000).toFixed(2)}s`);

console.log('\n📁 Allure results files generated: ');
console.log(`   - JSON files: ${resultFiles.length}`);
console.log(`   - Attachments: ${files.filter(f => f.includes('attachment')).length}`);
console.log(`   - Categories: ${files.includes('categories.json') ? 'Yes' : 'No'}`);

console.log('\n💡 To generate full HTML report, install Java and run: npm run report');
console.log('💡 Results location: ./allure-results/');

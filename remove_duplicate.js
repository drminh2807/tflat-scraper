
const fs = require('fs');
const raw = fs.readFileSync('./oxford.csv', { encoding: 'utf8', flag: 'r' });
const lines = raw.split('\n')
const set = new Set(lines)
const newLines = [...set].join('\n')
fs.writeFileSync('./oxford_remove_duplicate.csv', newLines)
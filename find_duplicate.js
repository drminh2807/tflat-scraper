const fs = require('fs');
const raw = fs.readFileSync('./oxford_parsed.csv', { encoding: 'utf8', flag: 'r' });
const lines = raw.split('\n').map(i => i.split(';'))
const newLines = lines.map((item, index) => {
    if (lines.slice(index + 1).find(i => i[0] === item[0] || i[1] === item[1])) {
        return `${item[0]};${item[1]} (hint :${item[0].charAt(0)}...)`
    }
    return item.join(';')
})
fs.writeFileSync('./oxford_add_hint.csv', newLines.join('\n'))
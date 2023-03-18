const start = async (page) => {
    const response = await fetch(`https://tienganhtflat.com/blog/tu-vung-oxford-phan-${page}`)
    const html = await response.text()
    const trimmedHtml = html.replaceAll('\n', '')
    const regex = /<b style="color: #337ab7;">(.+?)<\/b>\((.+?)\): <i>(.+?)<\/i>/gm;
    let m
    const result = new Set()
    while ((m = regex.exec(trimmedHtml)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        let word
        let meaning
        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            if (groupIndex === 1) {
                word = match
            } else if (groupIndex === 2) {
                meaning = match
            } else if (groupIndex === 3) {
                meaning = meaning + ' ' + match
            }
        });
        result.add(word + ';' + meaning.replaceAll(';', ','))
    }
    const lines = [...result]
    const newLines = lines.map((item, index) => {
        if (lines.slice(index + 1).find(i => i[0] === item[0] || i[1] === item[1])) {
            return `${item[0]};${item[1]} (hint :${item[0].charAt(0)}...)`
        }
        return item.join(';')
    })
    return newLines.join('\n')
}

const main = async () => {
    const results = await Promise.all(Array.from({ length: 71 }).map((_, index) => start(index + 1)))
    const fs = require('fs');
    fs.writeFileSync('./oxford.csv', results.join('\n'))
}

main()
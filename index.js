const path = 'https://tienganhtflat.com/blog/tu-vung-ielts-phan-'
const total = 18
const name = 'ielts'

const start = async (page) => {
    const response = await fetch(`${path}${page}`)
    const html = await response.text()
    const trimmedHtml = html.replaceAll('\n', '')
    const regex = /<b style="color: #337ab7;">(.+?)<\/b>\((.+?)\): <i>(.+?)<\/i>/gm;
    let m
    const result = []
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
        result.push(word + ';' + meaning.replaceAll(';', ','))
    }
    return result.join('\n')
}

const main = async () => {
    const results = await Promise.all(Array.from({ length: total }).map((_, index) => start(index + 1)))
    const lines = [...(new Set(results.join('\n').split('\n')))].map(i => i.split(';'))
    const newLines = lines.map((item, index) => {
        if (lines.find((i, k) => i[1] === item[1] && k !== index)) {
            return `${item[0]};${item[1]} (hint :${item[0].charAt(0)}...)`
        }
        return item.join(';')
    })
    const fs = require('fs');
    fs.writeFileSync(`./${name}.csv`, newLines.join('\n'))
}

main()
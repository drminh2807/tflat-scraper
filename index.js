const name = "adventure-phrases";
const start = async (url) => {
    const response = await fetch(url)
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
    const fs = require('fs')
    const urls = fs.readFileSync('./urls.csv','utf-8').split('\n')
    const results = await Promise.all(urls.map((url) => start(url)))
    const lines = [...(new Set(results.join('\n').split('\n')))].map(i => i.split(';'))
    const newLines = lines.map((item, index) => {
        if (lines.find((i, k) => i[1] === item[1] && k !== index)) {
            return `${item[0]};${item[1]} (hint :${item[0].charAt(0)}...)`
        }
        return item.join(';')
    })
    fs.writeFileSync(`./${name}.csv`, newLines.join('\n'))
}

main()
const fs = require("fs/promises");
const cheerio = require("cheerio");
const main = async () => {
  const file = await fs.readFile(
    "./input/4000_essential_words_list.csv",
    "utf8"
  );
  const folderPath = "/Users/minhdv/Desktop/Cambridge";
  const dir = await fs.readdir(folderPath);
  const lines = file.split("\n");
  const processWords = async (word) => {
    const htmlPath = dir.find(
      (path) => path.split(".")[0].split(" ")[1] === word
    );
    if (!htmlPath) {
      console.log(`Not found ${word}`);
      return null;
    }
    const html = await fs.readFile(`${folderPath}/${htmlPath}`, "utf8");
    const $ = cheerio.load(html);
    const type = $("span.pos").first().text().trim().replace(/;/g, ",");
    const en = $("div.def").first().text().trim().replace(/;/g, ",");
    const vi = $("span.trans").first().text().trim().replace(/;/g, ",");
    if (vi) {
      const mean = [type, en, vi].filter(Boolean).join(". ");
      return `${word};${mean}`;
    } else {
      console.log(
        `Incomplete data for ${word}: type=${type}, en=${en}, vi=${vi}`
      );
      return null;
    }
  };

  let results = await Promise.all(lines.map(processWords));
  results = results.filter(Boolean);

  // Second pass: check for duplicates and add hints
  const processedRows = results.map((item) => {
    const [word, meaning] = item.split(";");

    // Check if meaning is duplicated
    const isDuplicated = results.some((r) => {
      const [rWord, rMeaning] = r.split(";");
      return rWord !== word && rMeaning === meaning;
    });
    let newMeaning = meaning;
    if (isDuplicated) {
      const hint = `(${word.charAt(0)}_${word.charAt(
        Math.floor(word.length / 2)
      )}_${word.charAt(word.length - 1)})`;
      newMeaning = `${meaning} ${hint}`;
    }

    return [word, newMeaning].join(";");
  });

  await fs.writeFile(
    "./set/4000_essential_words.csv",
    processedRows.join("\n"),
    "utf8"
  );
};

main();

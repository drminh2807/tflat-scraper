const fs = require("fs");
const pdf = require("pdf-parse");

async function parsePDF(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  try {
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (err) {
    console.error("Error parsing PDF:", err);
    throw err;
  }
}

function cleanText(text) {
  return text
    .replace(/Thuong Jessica.*\d+/g, "") // Remove "Thuong Jessica" and phone number
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
}

function splitSentences(text) {
  // Split by dash or period, but keep the period
  return text
    .split(/\s*[-\.]\s*/)
    .map((s) => s.trim())
    .filter((s) => s && !s.match(/^\d+$/)) // Remove empty strings and standalone numbers
    .filter((s) => s !== "I"); // Remove standalone "I"
}

const filterLine = (line) => {
  const t = line.trim();
  return !!t && !t.match(/^\d+$/);
};

function parse900Sentences(pdfText) {
  const pages = pdfText.split("Thuong Jessica – 0967.836.692");
  const result = [];
  for (const page of pages) {
    if (page.trim()) {
      const lines = page
        .trim()
        .split("\n")
        .filter((i) => filterLine(i));
      const en = [];
      const vi = [];
      let curr = vi;
    //   console.log(lines);
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (/^\d+\. /.test(line)) {
          curr = curr === vi ? en : vi;
          const sentence = line.replace(/^\d+\. /, "").replace(/\.$/, "");
          curr.push(sentence);
        } else if (/^- /.test(line)) {
          const sentence = line.replace(/^- /, "").replace(/\.$/, "");
          curr.push(sentence);
        } else {
          const sentence = line.replace(/\.$/, "");
          curr[curr.length - 1] += " " + sentence;
        }
      }
      result.push(...en.map((i, idx) => `${i};${vi[idx]}`));
    }
  }
  const text = result.join("\n");
  fs.writeFileSync("sentences.csv", text, "utf8");
}

function writeToCSV(pairs, outputFile) {
  const csvContent = pairs.map((pair) => `${pair[0]};${pair[1]}`).join("\n");
  fs.writeFileSync(outputFile, csvContent, "utf8");
}

async function main() {
  try {
    const pdfText = await parsePDF("900.pdf");
    parse900Sentences(pdfText);

    // console.log('\nFirst 10 sentence pairs:');
    // sentencePairs.slice(0, 10).forEach(pair => {
    //     console.log(`${pair[0]};${pair[1]}`);
    // });

    // writeToCSV(sentencePairs, "sentences.csv");
    console.log("\nProcessing complete. Check sentences.csv for results.");
  } catch (err) {
    console.error("Error in main execution:", err);
  }
}

main();

const fs = require("fs");

// Read the CSV file
fs.readFile("./input/4000 Essential English Words.csv", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Split the data by newlines
  const lines = data.split("\n");

  // First pass: extract words and meanings, removing duplicates
  const wordSet = new Set();
  lines.forEach((row, index) => {
    const columns = row.split("\t");
    const word = columns[index > 270 ? 0 : 2];
    if (word && /^[a-zA-Z]+$/.test(word)) {
      wordSet.add(word.toLowerCase());
    }
  });
  const rows = [...wordSet];
  rows.sort();
  // Log rows containing non-word characters
  const nonWordRegex = /[^a-zA-Z\s-]/;
  rows.forEach((row, index) => {
    if (nonWordRegex.test(row)) {
      console.log(`Row ${index + 1} contains non-word characters: ${row}`);
    }
  });
  // Join the processed rows
  const processedData = rows.join("\n");

  // Write the processed data to a new file in the 'set' folder
  fs.writeFile(
    "./input/4000_essential_words_list.csv",
    processedData,
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("File has been saved successfully in the set folder.");
    }
  );
});

// ... existing code ...

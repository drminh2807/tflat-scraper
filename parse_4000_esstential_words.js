const fs = require("fs");

// Read the CSV file
fs.readFile("./input/4000_essential_words.csv", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Split the data by newlines
  const lines = data.split("\n");

  // First pass: extract words and meanings, removing duplicates
  const wordMap = new Map();
  lines.forEach((row, index) => {
    const columns = row.split("\t");
    const word =
      columns[
        index >= 2400
          ? 1
          : index >= 1800
          ? 1
          : index >= 1200
          ? 0
          : index >= 600
          ? 6
          : 1
      ];
    const meaningIndex =
      index >= 2400
        ? 6
        : index >= 1800
        ? 5
        : index >= 1200
        ? 5
        : index >= 600
        ? 4
        : 3;
    const meaning = columns[meaningIndex];
    
    if (word && meaning && !wordMap.has(word.toLowerCase())) {
      wordMap.set(word.toLowerCase(), { word, meaning });
    }
  });

  // Second pass: check for duplicates and add hints
  const processedRows = Array.from(wordMap.values()).map((item) => {
    let { word, meaning } = item;

    // Check if meaning is duplicated
    const isDuplicated = Array.from(wordMap.values()).some(
      (r) => r.word !== word && r.meaning === meaning
    );
    if (isDuplicated) {
      const hint = `(${word.charAt(0)}_${word.charAt(Math.floor(word.length / 2))}_${word.charAt(word.length - 1)})`;
      meaning = `${meaning} ${hint}`;
    }

    return [word, meaning].map((i) => i.replaceAll(";", ".")).join(";");
  });

  // Join the processed rows
  const processedData = processedRows.join("\n");

  // Write the processed data to a new file in the 'set' folder
  fs.writeFile(
    "./set/4000_essential_words.csv",
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

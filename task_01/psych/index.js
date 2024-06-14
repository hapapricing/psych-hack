const fs = require("fs");
const readline = require("readline");
const findDifferenceIds = async (fullFile, diffFile, outFile) => {
  console.log("Starting . . .");
  const fullFileIds = new Map();

  // Read ids from fullFile and store them in a Map for search
  const fullFileStream = fs.createReadStream(fullFile, "utf-8");
  const fullFileReadLine = readline.createInterface({
    input: fullFileStream,
    crlfDelay: Infinity,
  });

  for await (const line of fullFileReadLine) {
    fullFileIds.set(line.trim(), true);
  }

  fullFileStream.close();

  // Read diffFile, 
  const diffFileStream = fs.createReadStream(diffFile);
  const diffFileReadLine = readline.createInterface({
    input: diffFileStream,
    crlfDelay: Infinity,
  });

  const outputStream = fs.createWriteStream(`${Date.now()}-${outFile}`);

  for await (const line of diffFileReadLine) {
    // compare diffFile ids with ids from fullFileStream, and write unique to a new file
    const uuid = line.trim();
    if (!fullFileIds.has(uuid)) {
      outputStream.write(`${uuid}\n`);
    }
  }

  diffFileStream.close();
  outputStream.close();
};

findDifferenceIds('scraped_content_ids.txt', 'scraped_links_ids.txt', 'unique_ids.txt').then(()=>console.log("Done"));

const fs = require("fs");
const path = require("path");
const { getEmbedding } = require("../services/ragService");

// Paths
const DATA_DIR = path.join(__dirname, "../data");
const RAW_DIR = path.join(DATA_DIR, "raw");
const OUTPUT_FILE = path.join(DATA_DIR, "vectors.json");

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR);

/**
 * Split text into chunks of approx `tokenLimit` tokens (simulated by words/chars).
 * Simple implementation: split by generic delimiters or fixed size.
 */
function chunkText(text, sourceName, chunkSize = 1000) {
  const chunks = [];
  // Normalize newlines
  const cleanText = text.replace(/\r\n/g, "\n");

  // Simple overlapping window or paragraph-based chunking
  // For statutes, it's better to split by "Section" if possible, but general fallback:
  let start = 0;
  while (start < cleanText.length) {
    let end = start + chunkSize;
    if (end < cleanText.length) {
      // Try to find a sentence break near the end
      const lastPeriod = cleanText.lastIndexOf(".", end);
      if (lastPeriod > start) end = lastPeriod + 1;
    }

    const chunkContent = cleanText.slice(start, end).trim();
    if (chunkContent.length > 50) {
      // Skip tiny chunks
      chunks.push({
        text: chunkContent,
        source: sourceName,
        // Add simplified metadata
        type: "General",
      });
    }
    start = end;
  }
  return chunks;
}

async function ingest() {
  console.log("Starting ingestion...");
  const vectorStore = [];

  const files = fs.readdirSync(RAW_DIR);
  if (files.length === 0) {
    console.log("No files found in data/raw. Please add text files there.");
    return;
  }

  for (const file of files) {
    if (!file.endsWith(".txt") && !file.endsWith(".md")) {
      // Add .pdf support later via pdf-parse
      console.log(`Skipping non-text file: ${file}`);
      continue;
    }

    console.log(`Processing ${file}...`);
    const filePath = path.join(RAW_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");

    const chunks = chunkText(content, file);
    console.log(`  - Generated ${chunks.length} chunks.`);

    for (const chunk of chunks) {
      try {
        const embedding = await getEmbedding(chunk.text);
        vectorStore.push({
          ...chunk,
          embedding,
        });
      } catch (err) {
        console.error(`  - Failed to embed chunk: ${err.message}`);
      }
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(vectorStore, null, 2));
  console.log(
    `Ingestion complete. Saved ${vectorStore.length} vectors to ${OUTPUT_FILE}`
  );
}

// Run if called directly
if (require.main === module) {
  ingest();
}

module.exports = { ingest };

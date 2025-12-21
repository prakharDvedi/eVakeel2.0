const { pipeline, env } = require("@xenova/transformers");
const fs = require("fs");
const path = require("path");

// Configure to allow local caching
env.cacheDir = path.join(__dirname, "../.cache");
env.allowRemoteModels = true;

let extractor = null;
// We use a high-quality efficient embedding model compatible with transformers.js
// If an ONNX version of InLegalBERT becomes available, we can switch to 'law-ai/InLegalBERT' or similar.
const MODEL_NAME = "Xenova/all-MiniLM-L6-v2";

const VECTOR_STORE_PATH = path.join(__dirname, "../data/vectors.json");
let vectorStore = [];

async function loadModel() {
  if (!extractor) {
    console.log(`Loading embedding model: ${MODEL_NAME}...`);
    // feature-extraction pipeline automatically handles tokenization and model inference
    extractor = await pipeline("feature-extraction", MODEL_NAME, {
      quantized: false,
    });
    console.log("RAG Model loaded successfully.");
  }
}

async function getEmbedding(text) {
  if (!text || typeof text !== "string")
    throw new Error("Invalid text for embedding");
  await loadModel();

  // pooling: 'mean' usually gives the best sentence representation for retrieval
  // normalize: true ensures the vectors are unit length, making dot product == cosine similarity
  const result = await extractor(text, { pooling: "mean", normalize: true });

  // The result is a Tensor, we want a plain array
  return Array.from(result.data);
}

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0.0;
  // Since vectors are normalized, we only need dot product
  // But for safety against non-normalized inputs, we essentially compute full cosine
  // (Optimization: if strictly normalized, just dot product)
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
  }
  return dot; // Assumes normalized inputs from getEmbedding
}

function loadVectors() {
  try {
    if (fs.existsSync(VECTOR_STORE_PATH)) {
      const raw = fs.readFileSync(VECTOR_STORE_PATH, "utf-8");
      vectorStore = JSON.parse(raw);
      console.log(`[RAG Service] Loaded ${vectorStore.length} vectors/chunks.`);
    } else {
      console.warn(
        "[RAG Service] No vector store found at " + VECTOR_STORE_PATH
      );
      vectorStore = [];
    }
  } catch (err) {
    console.error("Failed to load vector store:", err);
    vectorStore = [];
  }
}

/**
 * Retrieves the most relevant chunks for a given query.
 * @param {string} query - The user's question.
 * @param {number} topK - Number of chunks to return.
 * @returns {Array} - Array of chunk objects with { text, source, score, ... }
 */
async function retrieveContext(query, topK = 5) {
  // Reload vectors if empty (or could add a file watcher)
  if (vectorStore.length === 0) loadVectors();
  if (vectorStore.length === 0) return []; // Still empty

  console.log(`Embedding query: "${query}"`);
  const queryVec = await getEmbedding(query);

  const scored = vectorStore.map((chunk) => {
    if (!chunk.embedding) return { ...chunk, score: -1 };
    return {
      ...chunk,
      score: cosineSimilarity(queryVec, chunk.embedding),
    };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  const results = scored.slice(0, topK);
  console.log(`Retrieved ${results.length} relevant chunks.`);
  return results;
}

// Initialize on load
loadVectors();

module.exports = {
  getEmbedding,
  retrieveContext,
  loadVectors,
};

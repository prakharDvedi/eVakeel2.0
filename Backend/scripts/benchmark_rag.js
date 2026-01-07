const ragService = require("../services/ragService");
const fs = require("fs");
const path = require("path");

const VECTOR_STORE_PATH = path.join(__dirname, "../data/vectors.json");

// Force URL for testing to avoid env issues
process.env.PYTHON_RAG_URL = "http://127.0.0.1:8000/embed";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runBenchmark() {
  console.log("=== eVakeel RAG Benchmark System ===\n");

  // 1. Dataset Metrics
  let vectorCount = 0;
  try {
    if (fs.existsSync(VECTOR_STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(VECTOR_STORE_PATH, "utf-8"));
      vectorCount = data.length;
    }
  } catch (e) {
    console.error("Could not read vectors.json");
  }

  console.log(`[Metric] Dataset Size (Chunks): ${vectorCount}`);
  console.log(`[Metric] Embedding Model:       law-ai/InLegalBERT`);
  console.log(`[Metric] Retrieval Strategy:    Cosine Similarity (Top-K=8)`);
  console.log(`[Metric] Query Expansion:       Gemini Pro (Semantic Mapping)`);

  // 2. Cold Start Test
  // We assume the node process just started. The Python server is already running,
  // but the connection and file load in Node are "cold".
  console.log("\n--- Latency Tests ---");
  const query = "What is the punishment for murder under Section 302?";

  console.log("Running Cold Start Query...");
  const t0 = performance.now();
  try {
    await ragService.retrieveContext(query, 8);
  } catch (e) {
    console.error("Cold start failed:", e.message);
  }
  const t1 = performance.now();
  const coldLatency = (t1 - t0).toFixed(2);
  console.log(`[Metric] Cold Start Latency:    ${coldLatency} ms`);

  // 3. Warm Start Test
  console.log("Running Warm Start Queries (x5)...");
  let totalTime = 0;
  const iterations = 5;
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await ragService.retrieveContext(query, 8); // Cached vectors, kept-alive connection
    const end = performance.now();
    totalTime += end - start;
    // tiny sleep to separate calls slightly
    await sleep(50);
  }
  const warmLatency = (totalTime / iterations).toFixed(2);
  console.log(`[Metric] Warm Start Avg:        ${warmLatency} ms`);

  console.log("\n=== Benchmark Complete ===");
}

runBenchmark();

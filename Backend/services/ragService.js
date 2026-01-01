const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const PYTHON_RAG_URL =
  process.env.PYTHON_RAG_URL || "http://127.0.0.1:8000/embed";

const VECTOR_STORE_PATH = path.join(__dirname, "../data/vectors.json");
let vectorStore = [];

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-pro";
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: GEMINI_MODEL }) : null;

async function getEmbedding(text) {
  if (!text || typeof text !== "string")
    throw new Error("Invalid text for embedding");

  try {
    const response = await fetch(PYTHON_RAG_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Python RAG Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding;
  } catch (error) {
    console.error("Failed to get embedding from Python server:", error.message);
    throw error;
  }
}

async function expandQuery(query) {
  if (!model) return query;

  try {
    const prompt = `You are a legal search assistant.
    Translate the following casual user query into specific Indian legal keywords and section numbers for vector search.
    
    User Query: "${query}"
    
    Output ONLY a single line of keywords/sections.
    Example: "I hit someone with car" -> "Section 279 IPC rash driving Section 304A IPC death by negligence road accident"
    
    Keywords:`;

    const result = await model.generateContent(prompt);
    const expanded = result.response.text().trim();
    console.log(`[RAG] Expanded Query: "${query}" -> "${expanded}"`);
    return expanded;
  } catch (error) {
    console.warn(
      "[RAG] Query expansion failed, using original:",
      error.message
    );
    return query;
  }
}

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
  }
  return dot;
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

async function retrieveContext(query, topK = 8) {
  if (vectorStore.length === 0) loadVectors();
  if (vectorStore.length === 0) return [];

  const searchTerms = await expandQuery(query);

  console.log(`Embedding search terms: "${searchTerms}"`);
  let queryVec;
  try {
    queryVec = await getEmbedding(searchTerms);
  } catch (e) {
    console.error("Embedding generation failed, retrieving nothing.");
    return [];
  }

  const scored = vectorStore.map((chunk) => {
    if (!chunk.embedding) return { ...chunk, score: -1 };
    return {
      ...chunk,
      score: cosineSimilarity(queryVec, chunk.embedding),
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const results = scored.slice(0, topK);
  console.log(`Retrieved ${results.length} relevant chunks.`);
  return results;
}

loadVectors();

module.exports = {
  getEmbedding,
  retrieveContext,
  loadVectors,
};

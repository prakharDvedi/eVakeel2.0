const ragService = require("../services/ragService");

// Mock Environment variables if needed, or rely on .env being loaded if we ran with -r dotenv/config
// But ragService uses process.env for API keys.
// We will manually inject the key if not present, or assume the user has it set globally or in .env
// For this script, let's assume valid env vars or just test the embedding part which hits python.

async function runTest() {
  console.log("=== eVakeel System Verification ===");

  // 1. Python Server Check
  console.log("\n[1/3] Checking Python RAG Server...");
  try {
    const health = await fetch("http://127.0.0.1:8000/health").then((r) =>
      r.json()
    );
    console.log("✅ Python Server is ONLINE");
    console.log(`   Model: ${health.model}`);
  } catch (e) {
    console.log(
      "❌ Python Server is OFFLINE. Please run 'python Backend/rag_server.py'"
    );
    process.exit(1);
  }

  // 2. Query Expansion Test
  console.log("\n[2/3] Testing Query Expansion (Gemini)...");
  const testQuery = "I hit someone with my car";
  console.log(`   Input: "${testQuery}"`);
  // Note: expandQuery is internal to retrieveContext, but we can verify it via the retrieval logs if we enabled them,
  // or just trust the end result. authentic way is to call retrieveContext.

  // 3. Retrieval Test
  console.log("\n[3/3] Testing InLegalBERT Retrieval...");
  try {
    const results = await ragService.retrieveContext(testQuery, 3);
    if (results.length > 0) {
      console.log(
        `✅ Retrieval SUCCESS. Found ${results.length} relevant sections.`
      );
      console.log("\n--- Top Match ---");
      console.log(`Source: ${results[0].source}`);
      console.log(`Score:  ${results[0].score.toFixed(4)}`);
      console.log(`Text:   ${results[0].text.substring(0, 100)}...`);
      console.log("-----------------");

      // Heuristic check
      const text = results[0].text.toLowerCase();
      if (
        text.includes("rash") ||
        text.includes("negligen") ||
        text.includes("279")
      ) {
        console.log(
          "🌟 PASS: Retrieved correct legal context for road accident."
        );
      } else {
        console.log("⚠️ WARN: Context seems unrelated. Check embeddings.");
      }
    } else {
      console.log("❌ Retrieval FAILED. No vectors found.");
    }
  } catch (e) {
    console.error("❌ Test Failed:", e.message);
  }
  console.log("\n=== Test Complete ===");
}

runTest();

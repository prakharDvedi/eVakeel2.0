require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    console.log("Fetching model list via listModels() API...");
    // Note: The Node SDK exposes listModels on the class instance in some versions? No, usually not directly.
    // But we can try the `GEMINI_API_KEY` to access the REST endpoint via fetch if SDK fails, or rely on internal logic.
    // However, `getGenerativeModel` is the main entry.

    // Let's try to infer from the user error:
    // 1. gemini-2.0-flash -> 429 (Exists, but no quota)
    // 2. gemini-1.5-flash -> 404 (Not Found)

    // The 404 strongly implies the model name is wrong OR the API key doesn't have access to it (e.g. older key).
    // Try 'gemini-1.0-pro' (stable) and 'gemini-pro' (alias).

    const modelNames = [
      "gemini-pro",
      "gemini-1.0-pro",
      "gemini-1.5-flash-latest",
    ];

    for (const name of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: name });
        const result = await model.generateContent("Test");
        await result.response;
        console.log(`\n\n!!! FOUND WORKING MODEL: ${name} !!!\n\n`);
        return;
      } catch (e) {
        console.log(`${name} failed: ${e.message.split("[")[0]}`);
      }
    }
  } catch (error) {
    console.error("Fatal Error:", error);
  }
}

listModels();

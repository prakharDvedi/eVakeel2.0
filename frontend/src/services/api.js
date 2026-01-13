const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

/* chat api */
export async function sendChatMessage(payload) {
  try {
    console.log("[API] Sending chat message:", payload);

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: payload.messages || [],
        sessionId: payload.sessionId || null,
        jurisdiction: payload.jurisdiction || "india",
        domain: payload.domain || null,
        pdf_path: payload.pdf_path || null,
        image_path: payload.image_path || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("[API] Chat response received:", data);
    console.log("[API] Response status:", data.status);
    console.log("[API] Response data:", data.data);
    console.log("[API] Answer:", data.data?.answer);
    return data;
  } catch (error) {
    console.error("[API] Chat error:", error);
    throw error;
  }
}

/* doc upload & analyze */
export async function analyzeDocument(file, inputText = null) {
  try {
    console.log("[API] Analyzing document:", file.name);

    const formData = new FormData();
    formData.append("file", file);

    const uploadResponse = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse
        .json()
        .catch(() => ({ error: "Upload failed" }));
      throw new Error(errorData.error || "File upload failed");
    }

    const uploadData = await uploadResponse.json();
    console.log("[API] File uploaded:", uploadData);

    const filePath =
      uploadData.data?.filePath ||
      uploadData.data?.storageUrl?.replace("file:", "") ||
      uploadData.filePath;

    if (!filePath) {
      throw new Error(
        "File path not returned from upload. Response: " +
          JSON.stringify(uploadData)
      );
    }

    const isPDF = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");

    const analyzeResponse = await fetch(`${API_BASE_URL}/documents/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input_text:
          inputText ||
          "Is this document legal? What are the key points and any red flags?",
        pdf_path: isPDF ? filePath : null,
        image_path: isImage ? filePath : null,
      }),
    });

    if (!analyzeResponse.ok) {
      const errorData = await analyzeResponse
        .json()
        .catch(() => ({ error: "Analysis failed" }));
      throw new Error(errorData.error || "Document analysis failed");
    }

    const analyzeData = await analyzeResponse.json();
    console.log("[API] Analysis response received:", analyzeData);

    if (analyzeData.status === "ok" && analyzeData.data) {
      return analyzeData.data;
    } else if (analyzeData.error) {
      throw new Error(analyzeData.error);
    }
    return analyzeData;
  } catch (error) {
    console.error("[API] Document analysis error:", error);
    throw error;
  }
}

/* analyze by file path */
export async function analyzeDocumentByPath(
  filePath,
  fileType,
  inputText = null
) {
  try {
    console.log("[API] Analyzing document by path:", filePath);

    const payload = {
      input_text:
        inputText ||
        "Is this document legal? What are the key points and any red flags?",
    };

    if (fileType === "pdf") {
      payload.pdf_path = filePath;
    } else if (fileType === "image") {
      payload.image_path = filePath;
    }

    const response = await fetch(`${API_BASE_URL}/documents/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Analysis failed" }));
      throw new Error(errorData.error || "Document analysis failed");
    }

    const responseData = await response.json();
    console.log("[API] Analysis response received:", responseData);

    if (responseData.status === "ok" && responseData.data) {
      return responseData.data;
    } else if (responseData.error) {
      throw new Error(responseData.error);
    }
    return responseData;
  } catch (error) {
    console.error("[API] Document analysis error:", error);
    throw error;
  }
}

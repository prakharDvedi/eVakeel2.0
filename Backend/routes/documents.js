const fs = require("fs");
const path = require("path");
const os = require("os");
const { v4: uuidv4 } = require("uuid");
const aiProxy = require("../services/aiProxy");

module.exports = async function (fastify, opts) {
  fastify.post("/upload", async (request, reply) => {
    try {
      const parts = await request.saveRequestFiles();
      if (!parts || parts.length === 0)
        return reply
          .code(400)
          .send({ status: "error", error: "No file uploaded" });
      const file = parts[0];
      const tmpPath = file.filepath || file.file;
      const docId = uuidv4();
      const filename = file.filename || `upload-${Date.now()}`;

      let storageUrl = null;
      if (fastify.firebaseStorage) {
        const bucket = fastify.firebaseStorage.bucket();
        const dest = `documents/${docId}/${filename}`;
        await bucket.upload(tmpPath, { destination: dest });
        const fileRef = bucket.file(dest);
        await fileRef.makePublic().catch(() => {});
        storageUrl = `gs://${bucket.name}/${dest}`;
      } else {
        const destDir = path.join(os.tmpdir(), "evakeel_uploads");
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        const dest = path.join(destDir, `${docId}-${filename}`);
        fs.renameSync(tmpPath, dest);
        storageUrl = `file:${dest}`;
      }

      const metadata = {
        documentId: docId,
        ownerUid: "anonymous",
        filename,
        storageUrl,
        status: "uploaded",
      };

      // if (fastify.firestore) {
      //     await fastify.firestore.collection('documents').doc(docId).set({
      //         ...metadata,
      //         uploadedAt: fastify.firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      //     });
      // }

      return reply.code(201).send({
        status: "ok",
        data: {
          documentId: docId,
          storageUrl,
          filePath: storageUrl.startsWith("file:")
            ? storageUrl.replace("file:", "")
            : storageUrl,
          filename,
        },
      });
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ status: "error", error: "Upload failed" });
    }
  });

  fastify.post("/:id/analyze", async (request, reply) => {
    const docId = request.params.id;
    try {
      const body = request.body || {};
      const inputText = body.input_text || body.query || null;

      let imagePath = null;
      let pdfPath = null;

      if (body.file_path || body.pdf_path) {
        pdfPath = body.file_path || body.pdf_path;
      } else if (body.image_path) {
        imagePath = body.image_path;
      }

      if (!imagePath && !pdfPath) {
        return reply
          .code(400)
          .send({
            status: "error",
            error:
              "No file path provided. Provide file_path or pdf_path in request body.",
          });
      }

      const aiResp = await aiProxy.callAI("analyze", {
        document_id: docId,
        input_text: inputText,
        image_path: imagePath,
        pdf_path: pdfPath,
      });

      // if (fastify.firestore) {
      //     await fastify.firestore.collection('documents').doc(docId).collection('analysis').add({
      //         analysis: aiResp,
      //         requestedBy: 'anonymous',
      //         createdAt: fastify.firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      //     });
      //     await fastify.firestore.collection('documents').doc(docId).update({
      //         status: 'analyzed',
      //         lastAnalyzedAt: fastify.firebaseAdmin.firestore.FieldValue.serverTimestamp()
      //     });
      // }

      return reply.send({ status: "ok", data: aiResp });
    } catch (err) {
      request.log.error(err);
      return reply
        .code(502)
        .send({
          status: "error",
          error: "Analysis failed",
          details: err.message,
        });
    }
  });

  fastify.post("/analyze", async (request, reply) => {
    try {
      const body = request.body || {};
      const inputText = body.input_text || body.query || null;
      const pdfPath = body.pdf_path || body.file_path;
      const imagePath = body.image_path;

      if (!pdfPath && !imagePath) {
        return reply
          .code(400)
          .send({ status: "error", error: "pdf_path or image_path required" });
      }

      // RAG Integration
      const ragService = require("../services/ragService");
      const aiProxy = require("../services/aiProxy");

      let legalContext = [];
      try {
        // Determine query for retrieval: input_text or document content snippet
        let retrievalQuery = inputText;
        if (!retrievalQuery && pdfPath) {
          // Extract a snippet if we don't have one (this might be expensive, so we use inputText if available)
          // Or we can rely on aiProxy to do it, but we need context *before* callAI.
          // Ideally, we extract text here or have a way to peek.
          // For now, if inputText is null, we might query generic "legal contract risks" OR
          // we can quickly read the PDF here.
          const text = await aiProxy.extractTextFromPDF(pdfPath);
          if (text) retrievalQuery = text.substring(0, 1000); // Use first 1000 chars
        }

        if (retrievalQuery) {
          legalContext = await ragService.retrieveContext(retrievalQuery);
        }
      } catch (err) {
        request.log.warn("RAG retrieval failed for document:", err);
      }

      const aiResp = await aiProxy.callAI("analyze", {
        input_text: inputText,
        image_path: imagePath,
        pdf_path: pdfPath,
        legalContext,
      });

      return reply.send({ status: "ok", data: aiResp });
    } catch (err) {
      request.log.error(err);
      return reply
        .code(502)
        .send({
          status: "error",
          error: "Analysis failed",
          details: err.message,
        });
    }
  });
};

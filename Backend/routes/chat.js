const aiProxy = require("../services/aiProxy");
const { v4: uuidv4 } = require("uuid");

module.exports = async function (fastify, opts) {
  fastify.post(
    "/chat",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            messages: { type: "array" },
            sessionId: { type: "string" },
            jurisdiction: { type: "string" },
            domain: { type: "string" },
            context_doc_ids: { type: "array" },
            image_path: { type: "string" },
            pdf_path: { type: "string" },
            file_path: { type: "string" },
          },
          required: ["messages"],
        },
      },
    },
    async (request, reply) => {
      const body = request.body || {};
      const {
        messages,
        sessionId,
        jurisdiction = "india",
        domain = null,
        context_doc_ids = [],
      } = body;

      const userId = "anonymous";
      const path = require("path");

      let conversationHistory = [];
      let existingSessionId = sessionId;

      // Firebase disabled - skip session history loading
      // if (sessionId && fastify.firestore) {
      //     try {
      //         const sessionSnap = await fastify.firestore.collection('sessions').doc(sessionId).get();
      //         if (sessionSnap.exists) {
      //             const sessionData = sessionSnap.data();
      //             if (sessionData.conversation && Array.isArray(sessionData.conversation)) {
      //                 conversationHistory = sessionData.conversation;
      //             } else if (sessionData.messages && Array.isArray(sessionData.messages)) {
      //                 conversationHistory = sessionData.messages;
      //                 if (sessionData.answer) {
      //                     conversationHistory.push({
      //                         role: 'assistant',
      //                         content: sessionData.answer
      //                     });
      //                 }
      //             }
      //         }
      //     } catch (err) {
      //         request.log.warn('Failed to load session history:', err);
      //     }
      // }

      const fullConversation = [...conversationHistory];

      if (messages && Array.isArray(messages) && messages.length > 0) {
        fullConversation.push(...messages);
      } else if (conversationHistory.length === 0) {
        return reply
          .code(400)
          .send({
            status: "error",
            error: "messages is required for new conversation",
          });
      }

      const context = [];
      let imagePath = null;
      let pdfPath = null;

      try {
        // Firebase disabled - skip context_doc_ids lookup
        // if (context_doc_ids && context_doc_ids.length > 0 && fastify.firestore) {
        //     const docsColl = fastify.firestore.collection('documents');
        //     for (const id of context_doc_ids.slice(0, 5)) {
        //         const docSnap = await docsColl.doc(id).get();
        //         if (docSnap.exists) {
        //             const data = docSnap.data();
        //             context.push({ doc_id: id, title: data.title || data.filename, snippet: data.summary || null });
        //
        //             // Extract file paths for the first document (Python module handles one file at a time)
        //             if (!imagePath && !pdfPath) {
        //                 const storageUrl = data.storageUrl || '';
        //                 if (storageUrl.startsWith('file:')) {
        //                     const filePath = storageUrl.replace('file:', '');
        //                     const ext = path.extname(filePath).toLowerCase();
        //                     if (['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(ext)) {
        //                         imagePath = filePath;
        //                     } else if (ext === '.pdf') {
        //                         pdfPath = filePath;
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }

        if (body.image_path) imagePath = body.image_path;
        if (body.pdf_path || body.file_path)
          pdfPath = body.pdf_path || body.file_path;

        request.log.info("[chat] Conversation state:", {
          fullConversationLength: fullConversation.length,
          lastMessage: fullConversation[fullConversation.length - 1],
          hasMessages: fullConversation.length > 0,
        });

        // RAG Integration
        const ragService = require("../services/ragService");
        let legalContext = [];
        try {
          // Use the last user message for retrieval
          const lastMsg = fullConversation[fullConversation.length - 1];
          if (lastMsg && lastMsg.role === "user") {
            legalContext = await ragService.retrieveContext(lastMsg.content);
          }
        } catch (err) {
          request.log.warn("RAG retrieval failed:", err);
        }

        const payload = {
          user_id: userId,
          jurisdiction,
          domain,
          messages: fullConversation,
          context,
          image_path: imagePath,
          pdf_path: pdfPath,
          legalContext,
        };

        const aiResp = await aiProxy.generate(payload);

        request.log.info("[chat] AI proxy response:", {
          hasAnswer: !!aiResp.answer,
          hasText: !!aiResp.text,
          answerLength: aiResp.answer ? aiResp.answer.length : 0,
          error: aiResp.error,
        });

        const assistantAnswer = aiResp.answer || aiResp.text || aiResp;

        const updatedConversation = [
          ...fullConversation,
          {
            role: "assistant",
            content: assistantAnswer,
          },
        ];

        const finalSessionId = existingSessionId || uuidv4();

        // save/update session (if Firebase available - disabled for now)
        // if (fastify.firestore) {
        //     const sessionData = {
        //         sessionId: finalSessionId,
        //         userId,
        //         conversation: updatedConversation,
        //         sources: aiResp.sources || [],
        //         updatedAt: fastify.firebaseAdmin.firestore.FieldValue.serverTimestamp(),
        //     };
        //
        //     if (!existingSessionId) {
        //         sessionData.createdAt = fastify.firebaseAdmin.firestore.FieldValue.serverTimestamp();
        //     }
        //
        //     await fastify.firestore.collection('sessions').doc(finalSessionId).set(sessionData, { merge: true });
        // }

        request.log.info("[chat] AI response received:", {
          hasAnswer: !!assistantAnswer,
          answerLength: assistantAnswer ? assistantAnswer.length : 0,
          sessionId: finalSessionId,
        });

        return reply.send({
          status: "ok",
          data: {
            sessionId: finalSessionId,
            answer: assistantAnswer,
            sources: aiResp.sources || [],
            hasContext: !!(imagePath || pdfPath),
            conversationLength: updatedConversation.length,
          },
        });
      } catch (err) {
        request.log.error(err);
        const errorMessage = err.message || "AI service error";
        return reply.code(502).send({
          status: "error",
          error: "AI service error",
          details: errorMessage,
          ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
        });
      }
    }
  );
};

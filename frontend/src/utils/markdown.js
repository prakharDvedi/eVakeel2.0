/* custom md to html parser */

export const parseMarkdown = (text) => {
  if (!text) return "";

  let html = text;

  html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="bg-gray-800 text-gray-100 p-3 rounded my-3 overflow-x-auto border border-gray-700"><code class="text-sm">${code.trim()}</code></pre>`;
  });

  const lines = html.split("\n");
  const processedLines = [];
  let inList = false;
  let listItems = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.match(/^####\s+/)) {
      if (inList) {
        processedLines.push(
          `<ul class="list-disc ml-6 my-2 space-y-1">${listItems.join("")}</ul>`
        );
        listItems = [];
        inList = false;
      }
      processedLines.push(
        `<h4 class="text-base font-bold mt-3 mb-2 text-text">${line
          .replace(/^####\s+/, "")
          .trim()}</h4>`
      );
      continue;
    }
    if (line.match(/^####(?!\#)/)) {
      if (inList) {
        processedLines.push(
          `<ul class="list-disc ml-6 my-2 space-y-1">${listItems.join("")}</ul>`
        );
        listItems = [];
        inList = false;
      }
      processedLines.push(
        `<h4 class="text-base font-bold mt-3 mb-2 text-text">${line
          .replace(/^####/, "")
          .trim()}</h4>`
      );
      continue;
    }
    if (line.match(/^###\s+/)) {
      if (inList) {
        processedLines.push(
          `<ul class="list-disc ml-6 my-2 space-y-1">${listItems.join("")}</ul>`
        );
        listItems = [];
        inList = false;
      }
      processedLines.push(
        `<h3 class="text-lg font-bold mt-4 mb-2 text-text">${line
          .replace(/^###\s+/, "")
          .trim()}</h3>`
      );
      continue;
    }
    if (line.match(/^###(?!\#)/)) {
      if (inList) {
        processedLines.push(
          `<ul class="list-disc ml-6 my-2 space-y-1">${listItems.join("")}</ul>`
        );
        listItems = [];
        inList = false;
      }
      processedLines.push(
        `<h3 class="text-lg font-bold mt-4 mb-2 text-text">${line
          .replace(/^###/, "")
          .trim()}</h3>`
      );
      continue;
    }
    if (line.match(/^##\s+/)) {
      if (inList) {
        processedLines.push(
          `<ul class="list-disc ml-6 my-2 space-y-1">${listItems.join("")}</ul>`
        );
        listItems = [];
        inList = false;
      }
      processedLines.push(
        `<h2 class="text-xl font-bold mt-5 mb-3 text-text">${line
          .replace(/^##\s+/, "")
          .trim()}</h2>`
      );
      continue;
    }
    if (line.match(/^##(?!\#)/)) {
      if (inList) {
        processedLines.push(
          `<ul class="list-disc ml-6 my-2 space-y-1">${listItems.join("")}</ul>`
        );
        listItems = [];
        inList = false;
      }
      processedLines.push(
        `<h2 class="text-xl font-bold mt-5 mb-3 text-text">${line
          .replace(/^##/, "")
          .trim()}</h2>`
      );
      continue;
    }
    if (line.match(/^#\s+/)) {
      if (inList) {
        processedLines.push(
          `<ul class="list-disc ml-6 my-2 space-y-1">${listItems.join("")}</ul>`
        );
        listItems = [];
        inList = false;
      }
      processedLines.push(
        `<h1 class="text-2xl font-bold mt-6 mb-4 text-text">${line
          .replace(/^#\s+/, "")
          .trim()}</h1>`
      );
      continue;
    }
    if (line.match(/^#(?!\#)/)) {
      if (inList) {
        processedLines.push(
          `<ul class="list-disc ml-6 my-2 space-y-1">${listItems.join("")}</ul>`
        );
        listItems = [];
        inList = false;
      }
      processedLines.push(
        `<h1 class="text-2xl font-bold mt-6 mb-4 text-text">${line
          .replace(/^#/, "")
          .trim()}</h1>`
      );
      continue;
    }

    if (line.match(/^[\*\-\+]\s/) || line.match(/^\d+\.\s/)) {
      if (!inList) inList = true;
      const content = line.replace(/^[\*\-\+]\s/, "").replace(/^\d+\.\s/, "");
      listItems.push(`<li class="ml-4 mb-1">${content}</li>`);
      continue;
    }

    if (inList && line.trim() === "") {
      processedLines.push(
        `<ul class="list-disc ml-6 my-2 space-y-1">${listItems.join("")}</ul>`
      );
      listItems = [];
      inList = false;
      processedLines.push("<br />");
      continue;
    }

    if (inList) {
      processedLines.push(
        `<ul class="list-disc ml-6 my-2 space-y-1">${listItems.join("")}</ul>`
      );
      listItems = [];
      inList = false;
    }

    if (line.trim()) {
      processedLines.push(`<p class="mb-2 text-text">${line}</p>`);
    } else {
      processedLines.push("<br />");
    }
  }

  // Close any remaining list
  if (inList) {
    processedLines.push(
      `<ul class="list-disc ml-6 my-2 space-y-1">${listItems.join("")}</ul>`
    );
  }

  html = processedLines.join("");

  html = html.replace(
    /\*\*([^*]+?)\*\*/g,
    '<strong class="font-semibold text-text">$1</strong>'
  );

  html = html.replace(
    /([^*])\*([^*]+?)\*([^*])/g,
    '$1<em class="italic">$2</em>$3'
  );

  html = html.replace(
    /`([^`\n]+)`/g,
    '<code class="bg-gray-800 text-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
  );

  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline hover:opacity-80">$1</a>'
  );

  return html;
};

export const stripMarkdown = (text) => {
  if (!text) return "";

  let plain = text;

  plain = plain.replace(/```[\s\S]*?```/g, "");

  plain = plain.replace(/`([^`]+)`/g, "$1");

  plain = plain.replace(/\*\*([^*]+?)\*\*/g, "$1");
  plain = plain.replace(/__([^_]+?)__/g, "$1");

  plain = plain.replace(/(^|[^*])\*([^*]+?)\*([^*]|$)/g, "$1$2$3");
  plain = plain.replace(/(^|[^_])_([^_]+?)_([^_]|$)/g, "$1$2$3");

  plain = plain.replace(/^#{1,6}\s+(.+)$/gm, "$1");

  plain = plain.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  plain = plain.replace(/^[\*\-\+]\s+/gm, "");
  plain = plain.replace(/^\d+\.\s+/gm, "");

  plain = plain.replace(/\*\*/g, "");
  plain = plain.replace(/__/g, "");

  return plain.trim();
};

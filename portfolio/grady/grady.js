const API_URL = "/_grady/rag";

const chatWindow = document.getElementById("chat-window");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const slider = document.getElementById("rag-strength");
const questionButtons = document.querySelectorAll(".grady-test-questions button");

/* =========================
   Markdown normalization
========================= */

function normalizeGradyMarkdown(text) {
  let t = text.trim();

  // Ensure blank line after bold opening sentence
  t = t.replace(
    /^\*\*(.+?)\*\*(?!\n\n)/,
    "**$1**\n\n"
  );

  // Ensure Summary label is isolated
  t = t.replace(
    /\*\*Summary:\*\*/g,
    "\n\n**Summary:**\n"
  );

  // Ensure bullets start on new lines
  t = t.replace(
    /([^\n])\s*([-*]\s+)/g,
    "$1\n$2"
  );

  // Ensure blank line before bullet lists
  t = t.replace(
    /(\*\*Summary:\*\*\n)([-*])/g,
    "$1\n$2"
  );

  return t;
}

/* =========================
   Message rendering
========================= */

function addMessage(text, role = "user") {
  const div = document.createElement("div");
  div.className = `chat-message ${role}`;

  if (role === "assistant") {
    const normalized = normalizeGradyMarkdown(text);
    div.innerHTML = marked.parse(normalized);
  } else {
    div.textContent = text;
  }

  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* =========================
   Ask Grady
========================= */

async function askGrady(question) {
  addMessage(question, "user");
  chatInput.value = "";

  const level = parseInt(slider.value, 10);
  addMessage("Thinking…", "system");

  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        rag_strength: level
      })
    });

    if (!resp.ok) {
      throw new Error(`Server error (${resp.status})`);
    }

    const data = await resp.json();

    // Remove "Thinking…" message
    chatWindow.lastChild.remove();

    addMessage(data.answer, "assistant");

  } catch (err) {
    chatWindow.lastChild.remove();
    addMessage("Error: " + err.message, "system");
  }
}

/* =========================
   UI wiring
========================= */

// Send button
sendBtn.addEventListener("click", () => {
  const question = chatInput.value.trim();
  if (question) askGrady(question);
});

// Enter key
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendBtn.click();
  }
});

// Preset question buttons
questionButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    askGrady(btn.getAttribute("data-q"));
  });
});

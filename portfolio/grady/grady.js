// ======================================================
// CONFIG
// ======================================================

const WORKER_URL = "https://grady-worker.round-hill-0906.workers.dev/rag";

// Grounding labels by slider level
const GROUNDING_LABELS = [
  "generic",
  "light-hybrid",
  "hybrid",
  "repo-strong",
  "repo-only"
];

// ======================================================
// ELEMENTS
// ======================================================

const chatWindow = document.getElementById("chat-window");
const chatInput  = document.getElementById("chat-input");
const sendBtn    = document.getElementById("send-btn");
const slider     = document.getElementById("rag-strength");

// ======================================================
// HELPERS
// ======================================================

function appendMessage(text, role, meta = {}) {
  const msg = document.createElement("div");
  msg.classList.add("message", role);

  if (role === "grady" && meta.grounding) {
    msg.classList.add(`response-${meta.grounding}`);
  }

  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function appendLoading() {
  const msg = document.createElement("div");
  msg.classList.add("message", "loading");
  msg.textContent = "Grady is thinking…";
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return msg;
}

// ======================================================
// SEND MESSAGE
// ======================================================

async function sendMessage() {
  const question = chatInput.value.trim();
  if (!question) return;

  const level = Number(slider.value);

  appendMessage(question, "user");
  chatInput.value = "";

  const loadingMsg = appendLoading();

  try {
    const resp = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question,
        level
      })
    });

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }

    const data = await resp.json();

    loadingMsg.remove();

    appendMessage(
      data.answer,
      "grady",
      {
        grounding: data.grounding,
        similarity: data.similarity
      }
    );

  } catch (err) {
    loadingMsg.remove();
    appendMessage(
      "Grady encountered an error contacting the knowledge base.",
      "grady"
    );
    console.error(err);
  }
}

// ======================================================
// EVENT WIRING
// ======================================================

// Send button
sendBtn.addEventListener("click", sendMessage);

// Enter key
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Pre-formed question buttons
document
  .querySelectorAll(".grady-test-questions button")
  .forEach(btn => {
    btn.addEventListener("click", () => {
      chatInput.value = btn.dataset.q;
      sendMessage();
    });
  });

// ======================================================
// OPTIONAL: Slider debug (remove later)
// ======================================================

slider.addEventListener("input", () => {
  console.debug(
    `Grounding level: ${slider.value} (${GROUNDING_LABELS[slider.value]})`
  );
});

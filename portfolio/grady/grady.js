// ❌ REMOVE THIS LINE COMPLETELY
// import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const API_URL = "/_grady/rag";

const chatWindow = document.getElementById("chat-window");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const slider = document.getElementById("rag-strength");
const questionButtons = document.querySelectorAll(".grady-test-questions button");

function addMessage(text, role = "user") {
  const div = document.createElement("div");
  div.className = `chat-message ${role}`;

  if (role === "assistant") {
    // uses window.marked from marked.min.js
    div.innerHTML = window.marked.parse(text);
  } else {
    div.textContent = text;
  }

  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function askGrady(question) {
  addMessage(question, "user");
  chatInput.value = "";

  const level = parseInt(slider.value, 10);
  addMessage("Thinking…", "system");

  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, rag_strength: level })
    });

    if (!resp.ok) {
      throw new Error(`Server error (${resp.status})`);
    }

    const data = await resp.json();

    chatWindow.lastChild.remove(); // remove Thinking…
    addMessage(data.answer, "assistant");

  } catch (err) {
    chatWindow.lastChild.remove();
    addMessage("Error: " + err.message, "system");
  }
}

// UI wiring unchanged
sendBtn.addEventListener("click", () => {
  const question = chatInput.value.trim();
  if (question) askGrady(question);
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendBtn.click();
  }
});

questionButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    askGrady(btn.getAttribute("data-q"));
  });
});

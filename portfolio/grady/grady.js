const chatWindow = document.getElementById("chat-window");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const slider = document.getElementById("rag-strength");

// --- helpers ---
function addMessage(text, sender, cls = "") {
  const div = document.createElement("div");
  div.className = `message ${sender} ${cls}`;
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// --- send question ---
function sendQuestion(question) {
  if (!question) return;

  addMessage(question, "user");

  const ragMode = Number(slider.value); // 0–4

  fetch("https://grady-worker.round-hill-0906.workers.dev/rag", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      rag_mode: ragMode
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        addMessage(data.error, "grady", "fail");
      } else {
        addMessage(
          data.answer,
          "grady",
          data.source || "generic"
        );
      }
    })
    .catch(err => {
      console.error(err);
      addMessage(
        "Grady encountered an error contacting the knowledge base.",
        "grady",
        "fail"
      );
    });
}

// --- events ---
sendBtn.addEventListener("click", () => {
  sendQuestion(chatInput.value.trim());
  chatInput.value = "";
});

chatInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    sendQuestion(chatInput.value.trim());
    chatInput.value = "";
  }
});

// --- pre-formed questions ---
document.querySelectorAll(".grady-test-questions button").forEach(btn => {
  btn.addEventListener("click", () => {
    sendQuestion(btn.dataset.q);
  });
});

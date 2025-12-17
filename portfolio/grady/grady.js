const API_URL = "https://grady.gradient-analytics.com/_grady/rag";

const chatWindow = document.getElementById("chat-window");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const slider = document.getElementById("rag-strength");
const questionButtons = document.querySelectorAll(".grady-test-questions button");

function addMessage(text, role = "user") {
  const div = document.createElement("div");
  div.className = `chat-message ${role}`;
  div.textContent = text;
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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question, level })
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
    const q = btn.getAttribute("data-q");
    askGrady(q);
  });
});

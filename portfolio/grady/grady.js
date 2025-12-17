const slider = document.getElementById("rag-strength");
const labels = document.querySelectorAll(".rag-labels-horizontal span");
const chatWindow = document.getElementById("chat-window");
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

/* ---------------------------------
   Slider label activation
---------------------------------- */

function updateLabels() {
  labels.forEach(l => l.classList.remove("active"));
  const active = document.querySelector(
    `.rag-labels-horizontal span[data-v="${slider.value}"]`
  );
  if (active) active.classList.add("active");
}

slider.addEventListener("input", updateLabels);
updateLabels();

/* ---------------------------------
   Pre-formed questions
---------------------------------- */

document.querySelectorAll(".grady-test-questions button")
  .forEach(btn => {
    btn.addEventListener("click", () => {
      input.value = btn.textContent.trim();
      sendBtn.click();
    });
  });

/* ---------------------------------
   Send message
---------------------------------- */

sendBtn.addEventListener("click", () => {
  if (!input.value.trim()) return;

  const question = input.value.trim();
  const mode = Number(slider.value);

  addMessage(question, "user");

  // MOCK RESPONSE LOGIC (replace with API)
  if (mode === 4) {
    addMessage(
      "I do not have sufficient repository information to answer this question.",
      "grady",
      "fail"
    );
  } else {
    addMessage(
      "This is where Grady’s answer will appear.",
      "grady",
      mode <= 1 ? "generic" : mode === 2 ? "hybrid" : "repo"
    );
  }

  input.value = "";
});

/* ---------------------------------
   Helpers
---------------------------------- */

function addMessage(text, who, extraClass = "") {
  const div = document.createElement("div");
  div.className = `message ${who} ${extraClass}`;
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

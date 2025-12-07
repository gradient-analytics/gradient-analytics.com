// URL of your Cloudflare Worker RAG endpoint
const WORKER_URL = "https://grady-worker.round-hill-0906.workers.dev/rag";

const chatLog = document.getElementById("chat-log");
const input = document.getElementById("chat-input");
const send = document.getElementById("chat-send");

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  // Show user message
  chatLog.innerHTML += `YOU: ${text}\n`;
  chatLog.scrollTop = chatLog.scrollHeight;
  input.value = "";

  // Send to worker
  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: text })
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    chatLog.innerHTML += "\nERROR: Invalid response.\n";
    return;
  }

  const reply = data?.choices?.[0]?.message?.content ?? "[No reply]";
  chatLog.innerHTML += `GRADY: ${reply}\n\n`;
  chatLog.scrollTop = chatLog.scrollHeight;
}

send.onclick = sendMessage;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

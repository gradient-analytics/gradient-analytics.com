// IMPORTANT: This MUST be your worker's /grady endpoint.
const WORKER_URL = "https://grady-worker.round-hill-0906.workers.dev/grady";

const chatLog = document.getElementById("chat-log");
const input = document.getElementById("chat-input");
const send = document.getElementById("chat-send");

// Start with a system message so the Worker knows the persona
let messages = [
  {
    role: "system",
    content: "You are Grady, an AI assistant trained on four technical agronomy PDFs."
  }
];

send.onclick = async () => {
  const userText = input.value.trim();
  if (!userText) return;

  // Add user text to chat log visually
  chatLog.innerHTML += `YOU: ${userText}\n`;
  chatLog.scrollTop = chatLog.scrollHeight;

  input.value = "";

  // Add to messages for API
  messages.push({ role: "user", content: userText });

  // Call the Worker
  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  });

  let data;
  try {
    data = await res.json();
  } catch (err) {
    chatLog.innerHTML += `\nERROR: Could not parse reply.\n`;
    return;
  }

  const reply = data?.choices?.[0]?.message?.content || "[No reply received]";

  // Add to message history
  messages.push({ role: "assistant", content: reply });

  // Show reply visually
  chatLog.innerHTML += `GRADY: ${reply}\n\n`;
  chatLog.scrollTop = chatLog.scrollHeight;
};

// Use the RAG endpoint so Grady can reference the PDFs
const WORKER_URL = "https://grady-worker.round-hill-0906.workers.dev/rag";

const chatLog = document.getElementById("chat-log");
const input = document.getElementById("chat-input");
const send = document.getElementById("chat-send");

// For the /rag endpoint, we send { question: "..." }
// No message history needed — it's stateless RAG Q&A
send.onclick = async () => {
  const userText = input.value.trim();
  if (!userText) return;

  chatLog.innerHTML += `YOU: ${userText}\n`;
  chatLog.scrollTop = chatLog.scrollHeight;

  input.value = "";

  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: userText })
  });

  let data;
  try {
    data = await res.json();
  } catch (err) {
    chatLog.innerHTML += `\nERROR: Could not parse reply.\n`;
    return;
  }

  const reply = data?.choices?.[0]?.message?.content || "[No reply received]";

  chatLog.innerHTML += `GRADY: ${reply}\n\n`;
  chatLog.scrollTop = chatLog.scrollHeight;
};

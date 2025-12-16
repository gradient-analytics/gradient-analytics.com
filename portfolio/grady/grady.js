const WORKER_URL = "https://grady-worker.round-hill-0906.workers.dev/grady";

const chatWindow = document.getElementById("chat-window");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = "message " + sender;
    div.textContent = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage() {
    const question = chatInput.value.trim();
    if (!question) return;

    addMessage(question, "user");
    chatInput.value = "";

    // ---- loading message ----
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "message grady loading";
    loadingDiv.textContent = "Grady is reviewing relevant documents…";
    chatWindow.appendChild(loadingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    // -------------------------

    try {
        const res = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question })
        });

        const data = await res.json();

        // remove loading message
        loadingDiv.remove();

        addMessage(data.answer, "grady");

    } catch (err) {
        loadingDiv.remove();
        addMessage(
          "Grady couldn’t retrieve documents right now. Please try again.",
          "grady"
        );
        console.error(err);
    }
}


sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

document.querySelectorAll(".grady-prompts button").forEach(btn => {
  btn.addEventListener("click", () => {
    chatInput.value = btn.dataset.q;
    sendMessage();
  });
});

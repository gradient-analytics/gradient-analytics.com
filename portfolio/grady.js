const WORKER_URL = "https://grady-worker.round-hill-0906.workers.dev/rag";

async function askGrady(question) {
    try {
        const res = await fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question })
        });

        if (!res.ok) {
            return `Worker error: ${res.status}`;
        }

        const data = await res.json();

        if (data?.choices?.[0]?.message?.content) {
            return data.choices[0].message.content;
        }

        return "Unexpected worker response:\n" + JSON.stringify(data, null, 2);

    } catch (err) {
        return "Network error:\n" + err.message;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Grady loaded.");

    const input = document.getElementById("grady-input");
    const output = document.getElementById("grady-output");
    const button = document.getElementById("grady-send");

    if (!input || !output || !button) {
        console.error("Missing DOM elements. Check HTML IDs.");
        return;
    }

    button.addEventListener("click", async () => {
        const q = input.value.trim();
        if (!q) return;

        output.value += `You: ${q}\n`;
        input.value = "";

        const answer = await askGrady(q);

        output.value += `Grady: ${answer}\n\n`;
        output.scrollTop = output.scrollHeight;
    });
});

const WORKER_URL = "https://grady-worker.round-hill-0906.workers.dev/rag";

async function askGrady(question) {
    const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
    });

    const data = await res.json();

    try {
        return data.choices[0].message.content;
    } catch (e) {
        return "Grady error: Could not read response.\n\nRaw:\n" + JSON.stringify(data, null, 2);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("grady-input");
    const output = document.getElementById("grady-output");
    const button = document.getElementById("grady-send");

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

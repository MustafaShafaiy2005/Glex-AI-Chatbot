const glexAiToggle = document.getElementById("glexAiToggle");
const glexAiPanel = document.getElementById("glexAiPanel");
const glexAiClose = document.getElementById("glexAiClose");
const glexAiSend = document.getElementById("glexAiSend");
const messageInput = document.getElementById("message");
const chatBox = document.getElementById("chat-box");
const typingIndicator = document.getElementById("typing-indicator");

function openGlexAI() {
    if (!glexAiPanel || !glexAiToggle) return;
    glexAiPanel.classList.add("open");
    glexAiPanel.setAttribute("aria-hidden", "false");
    glexAiToggle.setAttribute("aria-expanded", "true");
    if (messageInput) setTimeout(() => messageInput.focus(), 100);
    scrollToBottom();
}

function closeGlexAI() {
    if (!glexAiPanel || !glexAiToggle) return;
    glexAiPanel.classList.remove("open");
    glexAiPanel.setAttribute("aria-hidden", "true");
    glexAiToggle.setAttribute("aria-expanded", "false");
}

if (glexAiToggle) {
    glexAiToggle.addEventListener("click", () => {
        if (glexAiPanel.classList.contains("open")) closeGlexAI();
        else openGlexAI();
    });
}
if (glexAiClose) glexAiClose.addEventListener("click", closeGlexAI);

async function sendMessage() {
    if (!messageInput) return;
    const message = messageInput.value.trim();
    if (!message) return;

    addUserMessage(message);
    messageInput.value = "";
    messageInput.disabled = true;
    showTyping();

    try {
        const response = await fetch("https://glex-ai-chatbot-1.onrender.com/api/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({message: message})
        });

        if (!response.ok) throw new Error("Server error: " + response.status);

        const data = await response.json();
        console.log("Flask response:", data);
        hideTyping();

        const reply = data.reply;
        if (!reply) {
            addAssistantMessage("Sorry, I couldn't generate a response right now.");
            return;
        }
        addAssistantMessage(reply);
    } catch (error) {
        console.error("Error:", error);
        hideTyping();
        addAssistantMessage("Sorry, something went wrong. Please try again.");
    } finally {
        messageInput.disabled = false;
        messageInput.focus();
    }
}

function addUserMessage(message) {
    const messageRow = document.createElement("div");
    messageRow.className = "glex-ai-message-row glex-ai-user-row";
    const bubble = document.createElement("div");
    bubble.className = "glex-ai-bubble glex-ai-user-bubble";
    bubble.innerHTML = formatMessage(message);
    messageRow.appendChild(bubble);
    chatBox.appendChild(messageRow);
    scrollToBottom();
}

function addAssistantMessage(message) {
    const messageRow = document.createElement("div");
    messageRow.className = "glex-ai-message-row glex-ai-assistant-row";
    messageRow.innerHTML = `
        <img src="/static/assistant-avatar.png" alt="Glex" class="glex-ai-message-avatar">
        <div class="glex-ai-message-column">
            <div class="glex-ai-signature">Glex by Jeeyya <span>✦</span></div>
            <div class="glex-ai-bubble glex-ai-assistant-bubble">${formatMessage(message)}</div>
        </div>
    `;
    chatBox.appendChild(messageRow);
    scrollToBottom();
}

function formatMessage(message) {
    if (!message) return "";
    let formattedMessage = String(message)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    formattedMessage = formattedMessage.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formattedMessage = formattedMessage.replace(/\n/g, "<br>");
    return formattedMessage;
}

function showTyping() {
    if (!typingIndicator) return;
    typingIndicator.style.display = "flex";
    typingIndicator.setAttribute("aria-hidden", "false");
    scrollToBottom();
}

function hideTyping() {
    if (!typingIndicator) return;
    typingIndicator.style.display = "none";
    typingIndicator.setAttribute("aria-hidden", "true");
}

function scrollToBottom() {
    if (!chatBox) return;
    requestAnimationFrame(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

if (messageInput) {
    messageInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
}
if (glexAiSend) glexAiSend.addEventListener("click", sendMessage);

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") closeGlexAI();
});

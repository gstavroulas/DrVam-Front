let chatbtn = document.getElementById("chatbtn");
let chat = document.getElementById("chat");
let chatbot= 0;

function hideShowChat(){
   if(chat.style.display === "none"){
       chat.style.display = "block";
       if (chatbot === 0) {
           chatbot = 1;
           let introMessage = document.getElementById("intro-message");
           introMessage.offsetHeight;
           introMessage.classList.add("show");
       }
   }
   else {
       chat.style.display = "none";
   }
   if(chatbtn.style.display === "none"){
       chatbtn.style.display = "block";
   }
   else {
       chatbtn.style.display = "none";
   }
}
function scrollToBottom() {
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
function createChatMessage(sender, message){
    let chatContainer = document.getElementById("message-interface");
    let newChatRow = document.createElement("div");
    newChatRow.className = "chat-row";
    let newMessage = document.createElement("div");
    chatContainer.appendChild(newChatRow);
    newChatRow.appendChild(newMessage);
    if(sender===1){
        newMessage.className = "chat-box-user";
    }
    else{
        newMessage.className = "chat-box-dr";
    }
    let newMessageText = document.createElement("div");
    newMessageText.className = "chat-box-item-text";
    newMessageText.textContent = message;
    newMessage.appendChild(newMessageText);
    newMessage.offsetHeight;
    newMessage.classList.add("show");
    scrollToBottom();
}
function event(event){
    if(event.key === "Enter" || event.type === "click"){
        event.preventDefault();
        let message = document.getElementById("chatbot-query-bar").value;
        createChatMessage(1, message);
        document.getElementById("chatbot-query-bar").value = "";

        let typingIndicator = showTypingIndicator();

        fetch('http://localhost:5000/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ variable: message })
        })
            .then(response => response.json())
            .then(data => {
                // Remove the typing indicator once the response is received
                removeTypingIndicator();

                const reply = data.variable;
                createChatMessage(0, reply);
            })
            .catch(error => {
                console.error('Error:', error);
                // Ensure typing indicator is removed even if there's an error
                removeTypingIndicator();
            });
    }
}

function showTypingIndicator() {
    let chatContainer = document.getElementById("message-interface");
    let typingRow = document.createElement("div");
    typingRow.className = "chat-row";

    let typingIndicator = document.createElement("div");
    typingIndicator.className = "chat-box-typing";
    typingIndicator.id = "typing-indicator";

    let typingDots = document.createElement("div");
    typingDots.innerHTML = '<span class="typing-dots"></span><span class="typing-dots"></span><span class="typing-dots"></span>';

    typingIndicator.appendChild(typingDots);
    typingRow.appendChild(typingIndicator);
    chatContainer.appendChild(typingRow);

    typingIndicator.offsetHeight;
    typingIndicator.classList.add("show");

    scrollToBottom();
    return typingRow;  // Return this row so we can remove it later
}

function removeTypingIndicator(){
    let typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
        let typingRow = typingIndicator.parentNode;
        typingRow.remove(); // Remove the typing row
    }
}

document.getElementById("chatbot-query-bar").addEventListener("keydown", event);
document.getElementById("send").addEventListener("click", event);


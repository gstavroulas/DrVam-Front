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
    let newMessageText = document.createElement("div");
    newMessageText.className = "chat-box-item-text";
    if(sender===1){
        newMessage.className = "chat-box-user";
        newMessageText.textContent = message;
    }
    else{
        newMessage.className = "chat-box-dr";
        newMessageText.innerHTML = message;
    }
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
// session management start
    // Check if a session token exists in localStorage
    let sessionId = sessionStorage.getItem('session_id');
    
    // If no session token exists, create a new one and store it
    if (!sessionId) {
        sessionId = 'sess_' + Date.now() + Math.floor(Math.random() * 10000);
        sessionStorage.setItem('session_id', sessionId);
    }
// session management end
        fetch('https://gandro7.pythonanywhere.com/drVam_jksdhfs432254rffjkhajks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-ID': sessionId,  // Add session token in the headers
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


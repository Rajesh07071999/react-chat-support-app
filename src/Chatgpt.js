import React, { useEffect } from "react";

const Chatgpt = () => {
  useEffect(() => {
    const chatInput = document.querySelector("#chat-input");
    const sendButton = document.querySelector("#send-btn");
    const chatContainer = document.querySelector(".chat-container");
    const themeButton = document.querySelector("#theme-btn");
    const deleteButton = document.querySelector("#delete-btn");

    let userText = null;
    const API_KEY = "replace your chatgpt api key here";

    const loadDataFromLocalstorage = () => {
      const themeColor = localStorage.getItem("themeColor");
      console.log(themeColor);
      document.body.classList.toggle("light-mode", themeColor === "light_mode");
      themeButton.innerText = document.body.classList.contains("light-mode")
        ? "dark_mode"
        : "light_mode";

      const defaultText = `<div class="default-text">
                          <h1>WELCOME TO CHATBOT</h1>
                          <p>Start a conversation and explore the power of AI.<br> Your chat history will be displayed here.</p>
                      <img src="https://i.gifer.com/ZAbi.gif" />
                          </div>`;

      chatContainer.innerHTML =
        localStorage.getItem("all-chats") || defaultText;
      chatContainer.scrollTo(0, chatContainer.scrollHeight);
    };

    const createChatElement = (content, className) => {
      const chatDiv = document.createElement("div");
      chatDiv.classList.add("chat", className);
      chatDiv.innerHTML = content;
      return chatDiv; // Return the created chat div
    };

    const getChatResponse = async (incomingChatDiv, userText) => {
      const API_URL = "https://api.openai.com/v1/chat/completions";
      const pElement = document.createElement("p");

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant.",
            },
            {
              role: "user",
              content: userText,
            },
          ],
          max_tokens: 2048,
          temperature: 0.2,
          n: 1,
          stop: null,
        }),
      };

      try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        console.log(data);
        pElement.textContent = data.choices[0].message.content.trim();
      } catch (error) {
        pElement.classList.add("error");
        pElement.textContent =
          "Oops! Something went wrong while retrieving the response. Please try again.";
      }

      incomingChatDiv.querySelector(".typing-animation").remove();
      incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
      localStorage.setItem("all-chats", chatContainer.innerHTML);
      chatContainer.scrollTo(0, chatContainer.scrollHeight);
    };

    const copyResponse = (copyBtn) => {
      const reponseTextElement = copyBtn.parentElement.querySelector("p");
      navigator.clipboard.writeText(reponseTextElement.textContent);
      copyBtn.textContent = "done";
      setTimeout(() => (copyBtn.textContent = "content_copy"), 1000);
    };

    const showTypingAnimation = () => {
      const html = `<div class="chat-content">
                  <div class="chat-details">
                      <img src="https://seeklogo.com/images/S/Smile-logo-A18DBD791A-seeklogo.com.png" alt="chatbot-img">
                      <div class="typing-animation">
                          <div class="typing-dot" style="--delay: 0.2s"></div>
                          <div class="typing-dot" style="--delay: 0.3s"></div>
                          <div class="typing-dot" style="--delay: 0.4s"></div>
                      </div>
                  </div>
                  <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
              </div>`;
      // Create an incoming chat div with typing animation and append it to chat container
      const incomingChatDiv = createChatElement(html, "incoming");
      chatContainer.appendChild(incomingChatDiv);
      chatContainer.scrollTo(0, chatContainer.scrollHeight);
      getChatResponse(incomingChatDiv);
    };

    const handleOutgoingChat = () => {
      userText = chatInput.value.trim();
      if (!userText) return;
      chatInput.value = "";

      const html = `<div class="chat-content">
                  <div class="chat-details">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/50/Smile_Image.png">
                      <p>${userText}</p>
                  </div>
              </div>`;

      const outgoingChatDiv = createChatElement(html, "outgoing");
      chatContainer.querySelector(".default-text")?.remove();
      chatContainer.appendChild(outgoingChatDiv);
      chatContainer.scrollTo(0, chatContainer.scrollHeight);
      setTimeout(showTypingAnimation, 500);
    };

    deleteButton.addEventListener("click", () => {
      if (window.confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
      }
    });

    themeButton.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      localStorage.setItem("themeColor", themeButton.innerText);
      themeButton.innerText = document.body.classList.contains("light-mode")
        ? "dark_mode"
        : "light_mode";
    });

    const initialInputHeight = chatInput.scrollHeight;

    chatInput.addEventListener("input", () => {
      chatInput.style.height = `${initialInputHeight}px`;
      chatInput.style.height = `${chatInput.scrollHeight}px`;
    });

    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
      }
    });

    loadDataFromLocalstorage();

    sendButton.addEventListener("click", handleOutgoingChat);

    return () => {
      deleteButton.removeEventListener("click", () => {});
      themeButton.removeEventListener("click", () => {});
      sendButton.removeEventListener("click", handleOutgoingChat);
    };
  }, []);

  return (
    <div>
      <div className="chat-container"></div>

      <div className="typing-container">
        <div className="typing-content">
          <div className="typing-textarea">
            <textarea
              id="chat-input"
              spellCheck="false"
              placeholder="Start Questioning . . ."
              required
            ></textarea>
            <span id="send-btn" className="material-symbols-rounded">
              send
            </span>
          </div>
          <div className="typing-controls">
            <span id="theme-btn" className="material-symbols-rounded">
              light_mode
            </span>
            <span id="delete-btn" className="material-symbols-rounded">
              delete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatgpt;

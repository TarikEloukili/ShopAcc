class ChatBot {
    constructor() {
      this.isOpen = false;
      this.messages = [];
      this.isLoading = false;
      this.setupDOM();
      this.attachEventListeners();
    }
  
    setupDOM() {
      this.widget = document.createElement('div');
      this.widget.className = 'chat-widget';
      
      this.chatButton = document.createElement('button');
      this.chatButton.className = 'chat-button';
      this.chatButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>`;
      
      this.chatWindow = document.createElement('div');
      this.chatWindow.className = 'chat-window';
      this.chatWindow.innerHTML = `
        <div class="chat-header">
          <h3>Game Store Assistant</h3>
          <button class="close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="chat-messages"></div>
        <form class="chat-input">
          <div class="input-form">
            <input type="text" class="message-input" placeholder="Ask about games...">
            <button type="submit" class="send-button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </form>
      `;
      
      this.widget.appendChild(this.chatButton);
      this.widget.appendChild(this.chatWindow);
      document.body.appendChild(this.widget);
      
      this.messagesContainer = this.chatWindow.querySelector('.chat-messages');
      this.closeButton = this.chatWindow.querySelector('.close-button');
      this.form = this.chatWindow.querySelector('form');
      this.input = this.chatWindow.querySelector('.message-input');
  
      // Add welcome message
      this.addMessage({
        type: 'text',
        content: "Hello! I'm your Game Store Assistant. Ask me about available games, prices, or specific accounts!"
      }, false);
    }
  
    attachEventListeners() {
      this.chatButton.addEventListener('click', () => this.toggleChat());
      this.closeButton.addEventListener('click', () => this.toggleChat());
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  
    toggleChat() {
      this.isOpen = !this.isOpen;
      this.chatWindow.classList.toggle('open', this.isOpen);
      if (this.isOpen) {
        this.input.focus();
      }
    }
  
    formatGameData(response) {
      if (response.type === 'game_data') {
        const games = response.content;
        return `
          <div class="game-data">
            <div class="game-data-header">${response.message}</div>
            ${games.map(game => `
              <div class="game-item">
                <div class="game-item-title">${game.name}</div>
                <div class="game-item-details">
                  <span class="game-item-label">Genre:</span>
                  <span class="game-item-value">${game.genre}</span>
                  
                  <span class="game-item-label">Level:</span>
                  <span class="game-item-value">${game.level}</span>
                  
                  <span class="game-item-label">Price:</span>
                  <span class="game-item-value price">$${game.price.toFixed(2)}</span>
                  
                  <span class="game-item-label">Negotiable:</span>
                  <span class="game-item-value negotiable">${game.negotiable ? 'Yes' : 'No'}</span>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
      return response.content;
    }
  
    addMessage(response, isUser = false) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
      messageDiv.innerHTML = `
        <div class="message-content">
          ${isUser ? response : this.formatGameData(response)}
        </div>
      `;
      this.messagesContainer.appendChild(messageDiv);
      this.scrollToBottom();
    }
  
    showTypingIndicator() {
      const indicator = document.createElement('div');
      indicator.className = 'message bot';
      indicator.innerHTML = `
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      `;
      this.messagesContainer.appendChild(indicator);
      this.scrollToBottom();
      return indicator;
    }
  
    scrollToBottom() {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  
    async handleSubmit(e) {
      e.preventDefault();
      if (this.isLoading || !this.input.value.trim()) return;
  
      const message = this.input.value.trim();
      this.input.value = '';
      this.addMessage(message, true);
  
      this.isLoading = true;
      const typingIndicator = this.showTypingIndicator();
  
      try {
        const response = await fetch('/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        typingIndicator.remove();
        this.addMessage(data.response);
      } catch (error) {
        console.error('Chat error:', error);
        typingIndicator.remove();
        this.addMessage({
          type: 'text',
          content: 'Sorry, I\'m having trouble connecting right now. Please try again later.'
        });
      } finally {
        this.isLoading = false;
      }
    }
  }
  
  // Initialize chatbot when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
  });
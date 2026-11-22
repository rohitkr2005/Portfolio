// ==========================================================================
// Ask Rohit's AI Assistant - Controller & Real-Time Streaming Client
// ==========================================================================

class AskAIController {
  constructor() {
    this.messagesContainer = document.getElementById('ai-messages');
    this.inputField = document.getElementById('ai-input-field');
    this.sendBtn = document.getElementById('ai-send-btn');
    this.statusBadge = document.getElementById('ai-status-badge');
    
    this.history = [];
    this.isStreaming = false;
    this.abortController = null;
    
    this.initEventListeners();
    this.renderInitialGreeting();
  }

  initEventListeners() {
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.handleSendMessage());
    }

    if (this.inputField) {
      this.inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSendMessage();
        }
      });
    }

    // Quick Prompt Chips
    document.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-prompt') || btn.innerText;
        this.askQuestion(query);
      });
    });

    // Clear Chat Button
    const clearBtn = document.getElementById('ai-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearChat());
    }
  }

  renderInitialGreeting() {
    if (!this.messagesContainer) return;
    this.messagesContainer.innerHTML = '';
    
    const greetingHtml = `
      <div class="chat-bubble assistant">
        <h3>👋 Hi, I'm Rohit's AI Assistant!</h3>
        <p>I have direct access to Rohit Kumar Mandal's complete portfolio, resumes, 29+ GitHub projects, and hackathon wins.</p>
        <p>Ask me anything about his technical skills in <strong>Computer Vision, Machine Learning, Power BI, or Data Science</strong>, his <strong>NovaNectar internship</strong>, or his <strong>Tech Fest 1st place victories</strong>!</p>
      </div>
    `;
    this.messagesContainer.innerHTML = greetingHtml;
  }

  async askQuestion(query) {
    if (this.isStreaming) return;
    if (this.inputField) {
      this.inputField.value = query;
    }
    await this.handleSendMessage();
  }

  async handleSendMessage() {
    if (this.isStreaming) return;
    const text = this.inputField ? this.inputField.value.trim() : '';
    if (!text) return;

    // Clear input
    if (this.inputField) this.inputField.value = '';

    // Append User Message Bubble
    this.appendMessage('user', text);
    this.history.push({ role: 'user', content: text });

    // Append Assistant Bubble placeholder with cursor
    const assistantBubble = this.createAssistantBubble();
    this.messagesContainer.appendChild(assistantBubble);
    this.scrollToBottom();

    // Set streaming status
    this.isStreaming = true;
    this.updateStatus(true);
    this.abortController = new AbortController();

    let fullResponse = '';

    try {
      // Backend handles model and API key securely via server-side .env
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          history: this.history.slice(-6),
          streaming: true // Requested requirement: streaming=true
        }),
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep remainder

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const data = JSON.parse(dataStr);
              if (data.token) {
                fullResponse += data.token;
                assistantBubble.innerHTML = this.renderMarkdown(fullResponse) + '<span class="streaming-cursor"></span>';
                this.scrollToBottom();
              }
              if (data.done) {
                break;
              }
            } catch (err) {
              console.error('Error parsing SSE event:', err);
            }
          }
        }
      }

      // Remove blinking cursor on completion
      assistantBubble.innerHTML = this.renderMarkdown(fullResponse);
      this.history.push({ role: 'assistant', content: fullResponse });

    } catch (error) {
      if (error.name === 'AbortError') {
        assistantBubble.innerHTML += '<br/><em>[Stream stopped by user]</em>';
      } else {
        console.error('Streaming error:', error);
        assistantBubble.innerHTML = `
          <p style="color: #ef4444;">⚠️ Encountered an error generating the AI response: ${error.message}</p>
        `;
      }
    } finally {
      this.isStreaming = false;
      this.abortController = null;
      this.updateStatus(false);
      this.scrollToBottom();
    }
  }

  createAssistantBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble assistant';
    bubble.innerHTML = '<span class="streaming-cursor"></span>';
    return bubble;
  }

  appendMessage(role, text) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role}`;
    if (role === 'user') {
      bubble.textContent = text;
    } else {
      bubble.innerHTML = this.renderMarkdown(text);
    }
    this.messagesContainer.appendChild(bubble);
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  updateStatus(generating) {
    if (!this.statusBadge) return;
    if (generating) {
      this.statusBadge.textContent = 'Generating...';
      this.statusBadge.style.color = '#a855f7';
      this.statusBadge.style.background = 'rgba(168, 85, 247, 0.15)';
    } else {
      this.statusBadge.textContent = 'Online';
      this.statusBadge.style.color = '#16a34a';
      this.statusBadge.style.background = 'rgba(34, 197, 94, 0.15)';
    }
  }

  clearChat() {
    if (this.isStreaming && this.abortController) {
      this.abortController.abort();
    }
    this.history = [];
    this.renderInitialGreeting();
  }

  // Safe and clean Markdown rendering
  renderMarkdown(text) {
    if (!text) return '';
    let html = text;

    // Escape basic html tags except what we generate
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Headings (###, ##, #)
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h3>$1</h3>');

    // Bold (**text** or __text__)
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');

    // Italics (*text* or _text_)
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Inline code (`code`)
    html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

    // Markdown Links [text](url)
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>');

    // Bullet points (- or * )
    html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
    // Consolidate adjacent <ul>
    html = html.replace(/<\/ul>\s*<ul>/gim, '');

    // Numbered lists
    html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>');

    // Line breaks
    html = html.replace(/\n\n/g, '<br/><br/>');
    html = html.replace(/\n/g, '<br/>');

    return html;
  }
}

// Instantiate on load
window.addEventListener('DOMContentLoaded', () => {
  window.askAI = new AskAIController();
});

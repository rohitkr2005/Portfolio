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
        console.warn('Backend streaming encountered status error, falling back to instant client intelligence:', error);
        // Seamless Client-Side Fallback: streams direct, brain-powered answers without showing errors
        const fallbackAnswer = this.generateClientFallbackAnswer(text);
        await this.simulateTokenStream(assistantBubble, fallbackAnswer);
        this.history.push({ role: 'assistant', content: fallbackAnswer });
      }
    } finally {
      this.isStreaming = false;
      this.abortController = null;
      this.updateStatus(false);
      this.scrollToBottom();
    }
  }

  async simulateTokenStream(bubble, fullText) {
    bubble.innerHTML = '<span class="streaming-cursor"></span>';
    const words = fullText.split(' ');
    let current = '';

    for (let i = 0; i < words.length; i++) {
      current += (i === 0 ? '' : ' ') + words[i];
      bubble.innerHTML = this.renderMarkdown(current) + '<span class="streaming-cursor"></span>';
      this.scrollToBottom();
      await new Promise(r => setTimeout(r, 18));
    }
    bubble.innerHTML = this.renderMarkdown(fullText);
  }

  generateClientFallbackAnswer(query) {
    const q = query.toLowerCase().trim();

    // Python
    if (q.includes('python')) {
      return (
        "**Yes, absolutely!** Rohit is highly proficient in **Python** and uses it as his primary language for " +
        "Data Science, Machine Learning, Computer Vision, and backend development.\n\n" +
        "Here is how he applies Python in real-world engineering:\n" +
        "- **Data Manipulation & Analytics:** Extensive use of `Pandas` and `NumPy` for data cleaning, preprocessing, and exploratory data analysis.\n" +
        "- **Computer Vision & AI:** Built real-time systems running at 30+ FPS with `OpenCV`, `MediaPipe`, and `YOLO` (such as **Safe Drive Vision AI**, which won 1st Place at Tech Fest 2026).\n" +
        "- **Machine Learning:** Developed regression, classification, and clustering models using `Scikit-learn` during his **NovaNectar Services internship**, achieving a **+12% accuracy gain**.\n" +
        "- **Web Apps & APIs:** Built data apps with `Flask` (**AutoAnalyst Pro**) and `Streamlit` (**Resume Scanner AI**).\n" +
        "- **Certifications:** Holds IBM's *Python for Data Science, AI & Development* and *Data Analysis with Python* from Coursera."
      );
    }

    // SQL / Database
    if (q.includes('sql') || q.includes('postgres') || q.includes('database')) {
      return (
        "**Yes!** Rohit is skilled in **SQL** and relational databases like **PostgreSQL**.\n\n" +
        "- Uses SQL for complex multi-table joins, subqueries, CTEs, data aggregation, and database schema design.\n" +
        "- Integrated PostgreSQL with Python and Flask in **AutoAnalyst Pro** to store and manage analysis metadata.\n" +
        "- Frequently combines SQL data pipelines with **Power BI** for automated business intelligence reporting."
      );
    }

    // Power BI / DAX / Analytics
    if (q.includes('power bi') || q.includes('powerbi') || q.includes('dax') || q.includes('dashboard') || q.includes('307')) {
      return (
        "**Yes!** Rohit is an expert in **Power BI, DAX, and Power Query (M)** for end-to-end business intelligence:\n\n" +
        "- **UK Road Accident Analysis:** Analyzed **307,973 accident records across 21 variables**, developing interactive DAX measures to diagnose severe crash hotspots.\n" +
        "- **Netflix Global Intelligence:** Built an executive dashboard analyzing **5,000+ streaming titles** across genres, countries, and YoY trends.\n" +
        "- **Sample Superstore Profit Report:** Designed star-schema dimensional models with custom DAX KPIs to uncover regional profit leakages.\n" +
        "- **Corporate Job Simulations:** Completed official Data Analytics simulations from **Tata Group** and **Deloitte Australia** via Forage."
      );
    }

    // Computer Vision & YOLO
    if (q.includes('computer vision') || q.includes('opencv') || q.includes('mediapipe') || q.includes('yolo') || /\bcv\b/.test(q)) {
      return (
        "**Yes!** Computer Vision is one of Rohit's core specializations:\n\n" +
        "- **Safe Drive Vision AI (1st Place, Tech Fest 2026):** Uses Google MediaPipe to stream 468 3D facial landmarks at 30+ FPS, computing Eye Aspect Ratio (EAR) for micro-sleep detection and Mouth Aspect Ratio (MAR) for yawning, alongside custom YOLO phone distraction detection.\n" +
        "- **Smart Physio Detection System (1st Place, Tech Fest 2025):** Tracks human skeletal joints with MediaPipe Pose to evaluate rehabilitation posture and joint kinematics in real time.\n" +
        "- **Technologies:** `OpenCV`, `MediaPipe`, `YOLO (v8/v11)`, `TensorFlow`, `PyTorch`."
      );
    }

    // NovaNectar Internship
    if (q.includes('novanectar') || q.includes('intern') || q.includes('experience') || q.includes('job')) {
      return (
        "### 💼 Experience: Data Science Intern at NovaNectar Services\n\n" +
        "**Company:** NovaNectar Services Pvt. Ltd. | **Role:** Data Science Intern (60 Days) | **Timeline:** May 2025 – Jul 2025\n\n" +
        "- **Data Cleaning & EDA:** Processed diverse datasets, engineered predictive features, and performed visual storytelling using Python, Pandas, and NumPy.\n" +
        "- **Model Tuning (+12% Accuracy):** Built and fine-tuned regression and classification models with Scikit-learn, cross-validation, and hyperparameter tuning to achieve a **+12% accuracy gain**.\n" +
        "- **Models Delivered:** Car price prediction, house valuation, landslide hazard prediction, coupon sales forecasting, Iris flower classification, and IMDB sentiment analysis."
      );
    }

    // Contact & Hiring
    if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('phone') || q.includes('reach') || q.includes('join')) {
      return (
        "### 📬 Contact & Hire Rohit Kumar Mandal\n\n" +
        "- **📧 Email:** [rohitkr02092005@gmail.com](mailto:rohitkr02092005@gmail.com)\n" +
        "- **📞 Phone:** [+91 9334208157](tel:+919334208157)\n" +
        "- **📍 Location:** Dhanbad, Jharkhand, India (Open to Relocation & Remote)\n" +
        "- **💼 LinkedIn:** [linkedin.com/in/rohit-kumar-mandal-31223929a](https://www.linkedin.com/in/rohit-kumar-mandal-31223929a/)\n" +
        "- **🐙 GitHub:** [github.com/rohitkr2005](https://github.com/rohitkr2005)\n\n" +
        "Rohit is actively open to internships and full-time hiring discussions as a Data Scientist, AI/ML Engineer, or Data Analyst!"
      );
    }

    // Tech Fest Wins & Achievements
    if (q.includes('tech fest') || q.includes('safe drive') || q.includes('smart physio') || q.includes('award') || q.includes('achievement') || q.includes('air 43')) {
      return (
        "### 🏆 Honors & Key Achievements\n\n" +
        "1. **🥇 1st Place – Tech Fest 2026:** Led a team of 4 engineers to develop *Safe Drive Vision AI* (Real-time Driver Fatigue Monitoring at 30+ FPS).\n" +
        "2. **🥇 1st Place – Tech Fest 2025:** Led a team of 4 engineers to architect *Smart Physio Detection System* (AI Rehabilitation Posture Assessment).\n" +
        "3. **🎖️ All India Rank 43 (AIR 43):** Secured top 50 nationally in the Common Internship Test by Internship Studio.\n" +
        "4. **🥇 1st Place – Open House Debate 2025:** 1st position among 30+ participants."
      );
    }

    // Education
    if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('cgpa') || q.includes('school') || q.includes('nalanda')) {
      return (
        "### 🎓 Education & Academic Record\n\n" +
        "- **B.Sc. (Hons.) Data Science (2023 – 2027):**\n" +
        "  - Tribhuvan College of Environment & Development Sciences, Nalanda University Centre, Neemrana\n" +
        "  - **Current CGPA: 8.86 / 10** (Till 6th semester)\n" +
        "- **CBSE Class XII (2023):** **87%** (Science with Mathematics & Computer Science)\n" +
        "- **CBSE Class X (2021):** **94.5%** with Distinction"
      );
    }

    // Why Hire / HR
    if (q.includes('why should we hire') || q.includes('why hire') || q.includes('why you') || q.includes('strength')) {
      return (
        "### 🎯 Why You Should Hire Rohit Kumar Mandal\n\n" +
        "Rohit brings a rare blend of **hackathon-proven leadership**, **real-world business impact**, and **end-to-end technical versatility**:\n\n" +
        "1. **Proven High-Stakes Performer:** Twice captained 4-engineer teams to **1st Place at Tech Fest 2026** and **Tech Fest 2025**, proving his ability to deliver under tight deadlines.\n" +
        "2. **Measurable Business Impact:** Delivered a **+12% accuracy gain** on predictive ML models during his internship at **NovaNectar Services**.\n" +
        "3. **End-to-End Capabilities:** From wrangling 307K+ records in Power BI, to optimizing Flask backends by 40%, to deploying 30 FPS Computer Vision models.\n" +
        "4. **Academic Excellence:** Top student with an **8.86 / 10 CGPA** and scored **AIR 43** nationwide."
      );
    }

    // Projects
    if (q.includes('project') || q.includes('projects') || q.includes('what did he build') || q.includes('portfolio') || q.includes('built')) {
      return (
        "### 🚀 Rohit's Flagship Engineering Projects\n\n" +
        "Rohit has built **29+ repositories on GitHub**, specializing in Computer Vision, Machine Learning, and Power BI Analytics. His flagship systems include:\n\n" +
        "1. **Safe Drive Vision AI 🥇 (Tech Fest 2026 Winner):** Real-time driver fatigue monitoring running at 30+ FPS via MediaPipe (EAR for drowsiness, MAR for yawning) & YOLO phone detection.\n" +
        "2. **Smart Physio Detection System 🥇 (Tech Fest 2025 Winner):** Real-time biomechanical angle calculation and posture monitoring using MediaPipe Pose.\n" +
        "3. **UK Road Accident Analysis (307K+ Records):** Interactive Power BI dashboard analyzing 307,973 casualty records across 21 variables with dynamic DAX metrics.\n" +
        "4. **AutoAnalyst Pro:** Web-based automated exploratory data analysis tool with Flask, Pandas, and PostgreSQL, slashing memory spikes by 40%.\n\n" +
        "*Double-click any folder on the desktop or launch Finder to explore all 29 projects!*"
      );
    }

    // Default Overview
    return (
      "**I'm Rohit's AI Assistant.** I can answer any questions about Rohit Kumar Mandal's projects, " +
      "technical skills, internship experience, or HR-related inquiries.\n\n" +
      "Here are a few quick topics to explore:\n" +
      "- 💼 **'What did Rohit do at NovaNectar Services?'**\n" +
      "- 📬 **'How can I contact or hire Rohit?'**\n" +
      "- 🏆 **'Tell me about his Tech Fest winning projects'**\n" +
      "- 👁️ **'Does Rohit know Computer Vision & YOLO?'**\n" +
      "- 📊 **'Show me his Power BI & Data Analytics work'**"
    );
  }
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

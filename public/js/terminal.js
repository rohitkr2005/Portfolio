// ==========================================================================
// Interactive macOS Terminal for Rohit Kumar Mandal
// ==========================================================================

class TerminalController {
  constructor() {
    this.window = document.getElementById('app-terminal');
    this.container = document.getElementById('terminal-content');
    this.input = document.getElementById('terminal-input');
    this.inputRow = document.getElementById('terminal-input-row');
    this.history = [];
    this.historyIndex = -1;

    this.commands = [
      'help', 'whoami', 'bio', 'skills', 'projects', 'exp',
      'education', 'awards', 'certs', 'contact', 'neofetch',
      'clear', 'ask', 'github', 'linkedin', 'ls', 'pwd', 'date',
      'cat', 'python', 'uv'
    ];

    this.init();
  }

  init() {
    if (!this.input || !this.container) return;

    // Listen to Enter, Arrows, and Tab on input
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = this.input.value.trim();
        this.input.value = '';
        if (cmd) {
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.executeCommand(cmd);
        } else {
          this.printPrompt('');
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.history.length > 0 && this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const prefix = this.input.value.trim().toLowerCase();
        const match = this.commands.find(c => c.startsWith(prefix));
        if (match) {
          this.input.value = match;
        }
      }
    });

    // Clicking ANYWHERE in the terminal window focuses input
    if (this.window) {
      this.window.addEventListener('click', () => {
        this.focus();
      });
      this.window.addEventListener('mousedown', () => {
        this.focus();
      });
    }

    if (this.container) {
      this.container.addEventListener('click', () => {
        this.focus();
      });
    }

    // Capture global typing if terminal window is active
    document.addEventListener('keydown', (e) => {
      if (this.window && this.window.classList.contains('active') && !this.window.classList.contains('minimized') && this.window.style.display !== 'none') {
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          if (document.activeElement !== this.input) {
            this.input.focus();
          }
        }
      }
    });

    // Initial welcome Neofetch
    this.printNeofetch();
    setTimeout(() => this.focus(), 200);
  }

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  printPrompt(cmdText) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span class="terminal-prompt">rohit@macbook-pro</span> <span class="terminal-path">~ %</span> <span class="terminal-cmd">${this.escape(cmdText)}</span>`;
    this.container.appendChild(line);
    this.scrollToBottom();
  }

  printOutput(html) {
    const out = document.createElement('div');
    out.className = 'terminal-line';
    out.innerHTML = html;
    this.container.appendChild(out);
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.container) {
      this.container.scrollTop = this.container.scrollHeight;
    }
  }

  escape(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  executeCommand(rawCmd) {
    this.printPrompt(rawCmd);
    const parts = rawCmd.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ').trim();

    switch (cmd) {
      case 'help':
        this.printOutput(`
<span style="color: #22c55e; font-weight: bold;">Available macOS Terminal Commands:</span>
  <span style="color: #38bdf8;">neofetch</span>     - Display system info & ASCII workstation art
  <span style="color: #38bdf8;">whoami</span> / <span style="color: #38bdf8;">bio</span> - Executive summary of Rohit Kumar Mandal
  <span style="color: #38bdf8;">skills</span>       - Full technical skill matrix (Python, SQL, CV, ML, BI)
  <span style="color: #38bdf8;">projects</span>     - Detailed list of key AI, BI, and ML repositories
  <span style="color: #38bdf8;">exp</span>          - NovaNectar Services internship details (+12% accuracy gain)
  <span style="color: #38bdf8;">education</span>    - Nalanda University B.Sc. (CGPA: 8.86/10) & schooling
  <span style="color: #38bdf8;">awards</span>       - Tech Fest 2026/2025 1st prizes & All India Rank 43
  <span style="color: #38bdf8;">certs</span>        - Tata, Deloitte, British Airways & IBM certificates
  <span style="color: #38bdf8;">contact</span>      - Email, phone, location & verified links
  <span style="color: #38bdf8;">ask &lt;query&gt;</span>  - Ask Rohit's streaming AI assistant directly
  <span style="color: #38bdf8;">ls</span>           - List project files & folders
  <span style="color: #38bdf8;">cat &lt;file&gt;</span>   - View contents of a file (e.g. cat resume, cat contact)
  <span style="color: #38bdf8;">pwd</span>          - Print working directory
  <span style="color: #38bdf8;">date</span>         - Current date and time
  <span style="color: #38bdf8;">python</span>       - Python environment version
  <span style="color: #38bdf8;">uv</span>           - uv package manager version
  <span style="color: #38bdf8;">github</span>       - Open Rohit's GitHub in browser
  <span style="color: #38bdf8;">linkedin</span>     - Open Rohit's LinkedIn in browser
  <span style="color: #38bdf8;">clear</span>        - Clear terminal screen
`);
        break;

      case 'whoami':
      case 'bio':
        this.printOutput(`
<strong>Rohit Kumar Mandal</strong>
• <strong>Role:</strong> Data Scientist | Computer Vision & ML Practitioner | BI Developer
• <strong>Education:</strong> B.Sc. (Hons.) Data Science @ Nalanda Univ Centre (CGPA: <strong>8.86 / 10</strong>)
• <strong>Experience:</strong> Ex-Data Science Intern @ NovaNectar Services Pvt. Ltd. (+12% model accuracy gain)
• <strong>Hackathon Honors:</strong> 🥇 1st Place Tech Fest 2026 (Safe Drive Vision AI) & 🥇 1st Place Tech Fest 2025 (Smart Physio)
• <strong>National Standing:</strong> All India Rank 43 in Common Internship Test
• <strong>Location:</strong> Dhanbad, Jharkhand, India | <strong>Email:</strong> rohitkr02092005@gmail.com
`);
        break;

      case 'skills':
        this.printOutput(`
<span style="color: #a855f7; font-weight: bold;">[Programming]</span>      Python (Primary), SQL (PostgreSQL), C, HTML/CSS, JavaScript
<span style="color: #a855f7; font-weight: bold;">[Computer Vision]</span>  OpenCV, Google MediaPipe, YOLO (v8/v11), CNNs, Pose Estimation
<span style="color: #a855f7; font-weight: bold;">[Data Analytics]</span>   Power BI, DAX, Power Query, Pandas, NumPy, Statistics, EDA, Excel
<span style="color: #a855f7; font-weight: bold;">[Machine Learning]</span> Scikit-learn, Regression, Classification, Clustering, Hyperparameter Tuning
<span style="color: #a855f7; font-weight: bold;">[Developer Tools]</span>  uv, Git, GitHub, VS Code, Jupyter, Flask, Streamlit, PostgreSQL
`);
        break;

      case 'projects':
        this.printOutput(`
1. <strong>Safe Drive Vision AI</strong> [Python, MediaPipe, YOLO]
   → 🥇 1st Prize Tech Fest 2026. 468 facial points, EAR micro-sleep detection, YOLO phone detection.
   → Repo: <a href="https://github.com/rohitkr2005/SafeDriveVision.ai" target="_blank" style="color: #38bdf8;">github.com/rohitkr2005/SafeDriveVision.ai</a>

2. <strong>Smart Physio Detection System</strong> [Python, MediaPipe Pose]
   → 🥇 1st Prize Tech Fest 2025. Real-time joint kinematics for rehabilitation injury prevention.

3. <strong>UK Road Accident Analysis</strong> [Python, Pandas, Power BI]
   → Analyzed 307,973 incident records across 21 parameters. Interactive DAX reports.
   → Repo: <a href="https://github.com/rohitkr2005/Road_Accident_Analysis" target="_blank" style="color: #38bdf8;">github.com/rohitkr2005/Road_Accident_Analysis</a>

4. <strong>AutoAnalyst Pro</strong> [Python, Flask, Scikit-learn, PostgreSQL]
   → Automated profiling, clustering, 40% backend memory optimization.
   → Repo: <a href="https://github.com/rohitkr2005/AutoAnalyst_Pro" target="_blank" style="color: #38bdf8;">github.com/rohitkr2005/AutoAnalyst_Pro</a>

5. <strong>Netflix Global BI Dashboard</strong> [Power BI, DAX, Power Query]
   → 5,000+ streaming titles analyzed across release cycles, genres, and regions.
   → Repo: <a href="https://github.com/rohitkr2005/Netflix-Analysis-PowerBI" target="_blank" style="color: #38bdf8;">github.com/rohitkr2005/Netflix-Analysis-PowerBI</a>
`);
        break;

      case 'exp':
      case 'experience':
        this.printOutput(`
<strong>NovaNectar Services Pvt. Ltd. — Data Science Intern</strong>
• <strong>Duration:</strong> May 2025 – Jul 2025 (60-Day Internship)
• Preprocessed messy multi-source datasets and engineered predictive features with Pandas/NumPy.
• Trained regression/classification models with Scikit-learn, achieving a <strong>+12% accuracy gain</strong>.
• Delivered models for car pricing, house valuation, landslide hazard risk, and IMDB sentiment analysis.
`);
        break;

      case 'education':
      case 'edu':
        this.printOutput(`
• <strong>B.Sc. (Hons.) Data Science (2023 – 2027)</strong>
  Tribhuvan College of Env & Dev Sciences, Nalanda University Centre, Neemrana
  Current Academic Standing: <strong>CGPA: 8.86 / 10</strong> (Till 6th semester)
• <strong>CBSE Senior Secondary Class XII (2023)</strong>: 87% (Science with Mathematics & Computer Science)
• <strong>CBSE Secondary Class X (2021)</strong>: 94.5% Distinction
`);
        break;

      case 'awards':
      case 'achievements':
        this.printOutput(`
🏆 <strong>1st Place Winner – Tech Fest 2026</strong>: Safe Drive Vision AI (Team Lead)
🏆 <strong>1st Place Winner – Tech Fest 2025</strong>: Smart Physio Detection System (Team Lead)
🏆 <strong>1st Place Winner – Open House Debate 2025</strong>: 1st among 30+ debaters
🎖️ <strong>All India Rank 43</strong>: Common Internship Test by Internship Studio
`);
        break;

      case 'certs':
      case 'certifications':
        this.printOutput(`
• Tata Group – Data Analytics Job Simulation (Forage, Jan 2026)
• Deloitte Australia – Data Analytics Job Simulation (Forage, Jan 2026)
• British Airways – Data Science Job Simulation (Forage, Dec 2025)
• Forage Academy – Data Labeling Analyst (Nov 2025)
• IBM – Data Analysis with Python (Coursera)
• IBM – Data Visualization with Python (Coursera)
• IBM – Python for Data Science, AI & Dev (Coursera)
• Internship Studio – AI Internship (2024)
`);
        break;

      case 'contact':
        this.printOutput(`
• <strong>Email:</strong> <a href="mailto:rohitkr02092005@gmail.com" style="color: #38bdf8;">rohitkr02092005@gmail.com</a>
• <strong>Phone:</strong> <a href="tel:+919334208157" style="color: #38bdf8;">+91 9334208157</a>
• <strong>Location:</strong> Dhanbad, Jharkhand, India (Open to Relocation & Remote)
• <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/rohit-kumar-mandal-31223929a/" target="_blank" style="color: #38bdf8;">rohit-kumar-mandal-31223929a ↗</a>
• <strong>GitHub:</strong> <a href="https://github.com/rohitkr2005" target="_blank" style="color: #38bdf8;">rohitkr2005 ↗</a>
`);
        break;

      case 'ask':
        if (!args) {
          this.printOutput('Usage: ask &lt;question about Rohit&gt;');
        } else {
          window.macOS.openWindow('app-ask-ai');
          if (window.askAI) {
            window.askAI.askQuestion(args);
          }
          this.printOutput(`Asking Ask Rohit's AI Assistant: "${this.escape(args)}"...`);
        }
        break;

      case 'ls':
      case 'dir':
        this.printOutput(`
<span style="color: #38bdf8; font-weight: bold;">SafeDriveVision.ai/</span>   <span style="color: #38bdf8; font-weight: bold;">AutoAnalyst_Pro/</span>   <span style="color: #38bdf8; font-weight: bold;">Road_Accident_Analysis/</span>
<span style="color: #38bdf8; font-weight: bold;">Netflix-Analysis/</span>     <span style="color: #38bdf8; font-weight: bold;">SmartPhysio/</span>       <span style="color: #38bdf8; font-weight: bold;">Certificates/</span>
<span style="color: #f1f5f9;">README.md</span>             <span style="color: #f1f5f9;">resume_ds.pdf</span>      <span style="color: #f1f5f9;">resume_bi.pdf</span>
`);
        break;

      case 'cat':
        if (!args) {
          this.printOutput('Usage: cat &lt;filename&gt; (e.g. cat README.md, cat resume)');
        } else if (args.toLowerCase().includes('readme')) {
          this.printOutput(`<strong>README.md:</strong> Rohit Kumar Mandal Portfolio - Data Science, Machine Learning, Computer Vision & Business Intelligence.`);
        } else if (args.toLowerCase().includes('resume')) {
          this.printOutput(`Opening resume in Preview app...`);
          window.macOS.openWindow('app-preview');
        } else if (args.toLowerCase().includes('contact')) {
          this.executeCommand('contact');
        } else {
          this.printOutput(`cat: ${this.escape(args)}: No such file or directory. Try: cat README.md`);
        }
        break;

      case 'pwd':
        this.printOutput(`/Users/rohit/Portfolio_AI`);
        break;

      case 'date':
        this.printOutput(new Date().toString());
        break;

      case 'python':
      case 'python3':
        this.printOutput(`Python 3.13.7 (CPython) [Virtual environment managed via uv]`);
        break;

      case 'uv':
        this.printOutput(`uv 0.13.6 (Extremely fast Python package manager)`);
        break;

      case 'github':
        window.open('https://github.com/rohitkr2005', '_blank');
        this.printOutput('Opening https://github.com/rohitkr2005 in new tab...');
        break;

      case 'linkedin':
        window.open('https://www.linkedin.com/in/rohit-kumar-mandal-31223929a/', '_blank');
        this.printOutput('Opening LinkedIn profile in new tab...');
        break;

      case 'neofetch':
        this.printNeofetch();
        break;

      case 'clear':
        this.container.innerHTML = '';
        break;

      default:
        this.printOutput(`zsh: command not found: <span style="color: #f43f5e;">${this.escape(cmd)}</span>. Type <span style="color: #38bdf8;">help</span> for a list of available commands.`);
        break;
    }

    this.focus();
  }

  printNeofetch() {
    this.printOutput(`
<pre style="color: #a855f7; font-family: var(--font-mono); margin: 0; line-height: 1.35;">
                    'c.
                 ,xNMM.          <span style="color: #38bdf8; font-weight: bold;">rohit@macbook-pro</span>
               .OMMMMo           -----------------
               OMMM0,            <span style="color: #22c55e;">OS:</span> macOS Sequoia 15.2 (Data Scientist Edition)
     .;loddo:' loolloddol;.      <span style="color: #22c55e;">Host:</span> MacBook Pro 16-inch (M3 Max Neural Engine)
   cKMMMMMMMMMMNWMMMMMMMMMM0:    <span style="color: #22c55e;">Kernel:</span> Darwin 24.2.0 (x86_64)
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.    <span style="color: #22c55e;">Uptime:</span> 3+ Years Building AI & ML
 XMMMMMMMMMMMMMMMMMMMMMMMX.      <span style="color: #22c55e;">Shell:</span> zsh 5.9
;MMMMMMMMMMMMMMMMMMMMMMMM:       <span style="color: #22c55e;">Terminal:</span> Terminal.app
:MMMMMMMMMMMMMMMMMMMMMMMM:       <span style="color: #22c55e;">CPU:</span> Apple M3 Max (16 Cores + 32-core GPU)
.MMMMMMMMMMMMMMMMMMMMMMMX.       <span style="color: #22c55e;">Memory:</span> 64GB Unified Architecture
 kMMMMMMMMMMMMMMMMMMMMMMWd.      <span style="color: #22c55e;">Primary Stack:</span> Python, SQL, Power BI, OpenCV, YOLO
 .XMMMMMMMMMMMMMMMMMMMMMMMMK:    <span style="color: #22c55e;">Package Mgr:</span> uv (ultra-fast Python package tool)
  kMMMMMMMMMMMMMMMMMMMMMMd.      <span style="color: #22c55e;">Tech Fest Wins:</span> 🥇 2026 (Safe Drive) & 🥇 2025 (Physio)
   .cldxxddxxllxxddxxlc.         <span style="color: #22c55e;">National Rank:</span> AIR 43 (Common Internship Test)
</pre>
<p style="margin-top: 6px;">Type <span style="color: #38bdf8; font-weight: bold;">help</span> to see commands or <span style="color: #a855f7; font-weight: bold;">ask &lt;question&gt;</span> to query Ask Rohit's AI Assistant.</p>
`);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.terminalApp = new TerminalController();
});

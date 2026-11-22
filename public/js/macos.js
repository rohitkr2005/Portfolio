// ==========================================================================
// macOS Sequoia Window Manager & Desktop Environment
// ==========================================================================

class MacOSManager {
  constructor() {
    this.highestZIndex = 100;
    this.activeWindow = null;
    this.windows = {};
    this.desktop = document.getElementById('macos-desktop');
    this.currentTheme = localStorage.getItem('macos_theme') || 'dark';
    this.currentWallpaper = localStorage.getItem('macos_wallpaper') || 'wallpaper-sonoma';
    
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.applyWallpaper(this.currentWallpaper);
    this.initClock();
    this.initWindows();
    this.initDock();
    this.initDesktopIcons();
    this.initSpotlight();
    this.initFinderContent();
    this.initPreviewContent();
    this.initSettingsContent();
    this.initDropdownMenu();

    // Default open Ask AI (and Finder on desktop) on launch to welcome visitor!
    const isMobile = window.innerWidth <= 768;
    setTimeout(() => {
      this.openWindow('app-ask-ai');
      if (!isMobile) {
        this.openWindow('app-finder');
      }
    }, 400);
  }

  // Clock in Top Menu Bar
  initClock() {
    const clockEl = document.getElementById('topbar-clock');
    const updateTime = () => {
      if (!clockEl) return;
      const now = new Date();
      const options = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      };
      clockEl.textContent = now.toLocaleDateString('en-US', options).replace(/,/g, '');
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  // Windows Setup & Dragging
  initWindows() {
    const windowEls = document.querySelectorAll('.macos-window');
    windowEls.forEach((win) => {
      const id = win.id;
      this.windows[id] = {
        el: win,
        isMinimized: false,
        isMaximized: false,
        prevBounds: null
      };

      // Click to focus
      win.addEventListener('mousedown', () => {
        this.focusWindow(id);
      });

      // Traffic Light Buttons
      const closeBtn = win.querySelector('.traffic-close');
      const minBtn = win.querySelector('.traffic-min');
      const maxBtn = win.querySelector('.traffic-max');

      if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); this.closeWindow(id); });
      if (minBtn) minBtn.addEventListener('click', (e) => { e.stopPropagation(); this.minimizeWindow(id); });
      if (maxBtn) maxBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleMaximizeWindow(id); });

      // Title bar drag
      const titlebar = win.querySelector('.window-titlebar');
      if (titlebar) {
        this.makeDraggable(win, titlebar);
      }
    });
  }

  makeDraggable(winEl, handle) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    const onMouseDown = (e) => {
      // Do not drag on mobile to preserve natural touch scrolling
      if (window.innerWidth <= 768) return;
      if (e.target.closest('.traffic-lights') || e.target.closest('button')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = winEl.offsetLeft;
      initialTop = winEl.offsetTop;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;

      // Keep within viewport bounds
      const minTop = 28; // height of menubar
      const maxTop = window.innerHeight - 90;
      const maxLeft = window.innerWidth - 100;
      const minLeft = -winEl.offsetWidth + 100;

      newTop = Math.max(minTop, Math.min(newTop, maxTop));
      newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));

      winEl.style.left = `${newLeft}px`;
      winEl.style.top = `${newTop}px`;
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    handle.addEventListener('mousedown', onMouseDown);
  }

  focusWindow(id) {
    const win = this.windows[id];
    if (!win) return;
    this.highestZIndex += 2;
    win.el.style.zIndex = this.highestZIndex;

    document.querySelectorAll('.macos-window').forEach(w => w.classList.remove('active'));
    win.el.classList.remove('minimized');
    win.el.classList.add('active');
    this.activeWindow = id;

    // Update active app title in top menu bar
    const titleEl = win.el.querySelector('.window-title');
    const appNameEl = document.getElementById('menubar-app-name');
    if (appNameEl && titleEl) {
      appNameEl.textContent = titleEl.textContent;
    }

    if (id === 'app-terminal' && window.terminalApp) {
      setTimeout(() => window.terminalApp.focus(), 50);
    }
  }

  openWindow(id) {
    const win = this.windows[id];
    if (!win) return;

    win.el.style.display = 'flex';
    win.el.classList.remove('minimized', 'closing');
    win.isMinimized = false;
    this.focusWindow(id);

    if (id === 'app-terminal' && window.terminalApp) {
      setTimeout(() => window.terminalApp.focus(), 80);
    }

    // Mark dock icon as open
    const dockIcon = document.querySelector(`.dock-item[data-window="${id}"]`);
    if (dockIcon) {
      dockIcon.classList.add('open');
    }
  }

  closeWindow(id) {
    const win = this.windows[id];
    if (!win) return;
    win.el.classList.add('closing');
    setTimeout(() => {
      win.el.style.display = 'none';
      win.el.classList.remove('closing');
      // Update dock
      const dockIcon = document.querySelector(`.dock-item[data-window="${id}"]`);
      if (dockIcon) {
        dockIcon.classList.remove('open');
      }
    }, 180);
  }

  minimizeWindow(id) {
    const win = this.windows[id];
    if (!win) return;
    win.el.classList.add('minimized');
    win.isMinimized = true;
  }

  toggleMaximizeWindow(id) {
    const win = this.windows[id];
    if (!win) return;
    if (win.isMaximized) {
      // Restore
      if (win.prevBounds) {
        win.el.style.top = win.prevBounds.top;
        win.el.style.left = win.prevBounds.left;
        win.el.style.width = win.prevBounds.width;
        win.el.style.height = win.prevBounds.height;
      }
      win.el.classList.remove('maximized');
      win.isMaximized = false;
    } else {
      // Maximize
      win.prevBounds = {
        top: win.el.style.top,
        left: win.el.style.left,
        width: win.el.style.width,
        height: win.el.style.height
      };
      win.el.classList.add('maximized');
      win.isMaximized = true;
    }
    this.focusWindow(id);
  }

  // Dock items handling
  initDock() {
    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-window');
        if (targetId) {
          const win = this.windows[targetId];
          if (win && win.isMinimized) {
            win.el.classList.remove('minimized');
            win.isMinimized = false;
            this.focusWindow(targetId);
          } else if (win && win.el.style.display !== 'none' && this.activeWindow === targetId) {
            // Minimize if already active
            this.minimizeWindow(targetId);
          } else {
            this.openWindow(targetId);
          }
        }
      });
    });
  }

  // Desktop Icons selection & double click (or single tap on mobile) to launch
  initDesktopIcons() {
    const icons = document.querySelectorAll('.desktop-icon');
    const isTouchOrMobile = () => window.innerWidth <= 768 || ('ontouchstart' in window);

    icons.forEach(icon => {
      const launch = () => {
        const target = icon.getAttribute('data-target');
        const filter = icon.getAttribute('data-filter');
        if (target) {
          this.openWindow(target);
          if (target === 'app-finder' && filter) {
            this.filterFinder(filter);
          }
        }
      };

      icon.addEventListener('click', (e) => {
        e.stopPropagation();
        icons.forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
        // On mobile or touch devices, single tap immediately opens the item
        if (isTouchOrMobile()) {
          launch();
        }
      });

      icon.addEventListener('dblclick', () => {
        launch();
      });
    });

    // Deselect icons when clicking desktop background
    if (this.desktop) {
      this.desktop.addEventListener('click', (e) => {
        if (!e.target.closest('.desktop-icon') && !e.target.closest('.macos-window') && !e.target.closest('.macos-dock')) {
          icons.forEach(i => i.classList.remove('selected'));
        }
      });
    }
  }

  // Spotlight Search
  initSpotlight() {
    const modal = document.getElementById('spotlight-modal');
    const input = document.getElementById('spotlight-input');
    const results = document.getElementById('spotlight-results');
    const trigger = document.getElementById('topbar-spotlight-btn');

    const toggle = () => {
      if (modal.classList.contains('show')) {
        modal.classList.remove('show');
      } else {
        modal.classList.add('show');
        if (input) {
          input.value = '';
          input.focus();
          renderSearchResults('');
        }
      }
    };

    if (trigger) trigger.addEventListener('click', toggle);

    // Cmd+K or Ctrl+K
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
      }
    });

    const renderSearchResults = (query) => {
      if (!results) return;
      results.innerHTML = '';
      const q = query.toLowerCase().trim();

      const items = [
        { title: 'Ask Rohit AI Assistant', sub: 'Chat with streaming AI about Rohit\'s profile', action: () => this.openWindow('app-ask-ai') },
        { title: 'Safe Drive Vision AI', sub: '1st Place Tech Fest 2026 Winner (Computer Vision)', action: () => { this.openWindow('app-finder'); this.filterFinder('cv'); } },
        { title: 'UK Road Accident Analysis', sub: 'Power BI Dashboard analyzing 307,973 records', action: () => { this.openWindow('app-finder'); this.filterFinder('bi'); } },
        { title: 'Smart Physio Detection System', sub: '1st Place Tech Fest 2025 Winner', action: () => { this.openWindow('app-finder'); this.filterFinder('cv'); } },
        { title: 'AutoAnalyst Pro', sub: 'Full Stack automated data cleaning & clustering platform', action: () => { this.openWindow('app-finder'); this.filterFinder('ml'); } },
        { title: 'View Resume (Preview)', sub: 'Data Science & Data Analytics Resumes', action: () => this.openWindow('app-preview') },
        { title: 'Interactive Terminal', sub: 'Explore skills, projects, neofetch via CLI', action: () => this.openWindow('app-terminal') },
        { title: 'GitHub Profile (@rohitkr2005)', sub: 'Open 29 public repositories in Safari', action: () => this.openWindow('app-safari') },
        { title: 'NovaNectar Services Internship', sub: 'Data Science Intern experience & models', action: () => { this.openWindow('app-ask-ai'); window.askAI.askQuestion('Tell me about your NovaNectar internship'); } }
      ];

      const filtered = q ? items.filter(i => i.title.toLowerCase().includes(q) || i.sub.toLowerCase().includes(q)) : items;

      filtered.forEach(item => {
        const row = document.createElement('div');
        row.className = 'spotlight-item';
        row.innerHTML = `
          <div class="spotlight-item-icon">🔍</div>
          <div class="spotlight-item-text">
            <div class="spotlight-item-title">${item.title}</div>
            <div class="spotlight-item-sub">${item.sub}</div>
          </div>
        `;
        row.addEventListener('click', () => {
          modal.classList.remove('show');
          item.action();
        });
        results.appendChild(row);
      });
    };

    if (input) {
      input.addEventListener('input', (e) => {
        renderSearchResults(e.target.value);
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const first = results.querySelector('.spotlight-item');
          if (first) first.click();
        }
      });
    }
  }

  // Populate Finder Content with project cards
  initFinderContent() {
    const grid = document.getElementById('finder-projects-grid');
    if (!grid || !PORTFOLIO_DATA) return;

    this.renderFinderProjects(PORTFOLIO_DATA.projects);

    // Sidebar navigation
    document.querySelectorAll('.finder-sidebar .sidebar-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.finder-sidebar .sidebar-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const filter = item.getAttribute('data-filter');
        this.filterFinder(filter);
      });
    });

    // Finder Search
    const searchInput = document.getElementById('finder-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = PORTFOLIO_DATA.projects.filter(p => 
          p.title.toLowerCase().includes(query) || 
          p.tech.some(t => t.toLowerCase().includes(query)) ||
          p.category.toLowerCase().includes(query)
        );
        this.renderFinderProjects(filtered);
      });
    }
  }

  filterFinder(category) {
    if (!PORTFOLIO_DATA) return;
    let list = PORTFOLIO_DATA.projects;
    if (category === 'cv') {
      list = list.filter(p => p.category.includes('Vision'));
    } else if (category === 'bi') {
      list = list.filter(p => p.category.includes('BI') || p.category.includes('Analytics'));
    } else if (category === 'ml') {
      list = list.filter(p => p.category.includes('Machine Learning') || p.category.includes('Predictive'));
    } else if (category === 'featured') {
      list = list.filter(p => p.featured);
    }
    this.renderFinderProjects(list);
  }

  renderFinderProjects(projects) {
    const grid = document.getElementById('finder-projects-grid');
    if (!grid) return;
    grid.innerHTML = '';

    projects.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-card-header">
          <div class="project-card-title">${p.title}</div>
          ${p.badge ? `<div class="project-card-badge">${p.badge}</div>` : ''}
        </div>
        <div class="project-card-desc">${p.summary}</div>
        <div class="project-card-tech">
          ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <div class="project-card-footer">
          <span style="font-size: 11px; opacity: 0.7;">${p.category}</span>
          ${p.github ? `<a href="${p.github}" target="_blank" class="project-link-btn">GitHub Repo ↗</a>` : ''}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Preview App (Dual Resumes)
  initPreviewContent() {
    const tabs = document.querySelectorAll('.preview-tab');
    const docWrapper = document.getElementById('preview-doc');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const resumeType = tab.getAttribute('data-type');
        this.renderResume(resumeType);
      });
    });

    // Render default Data Science resume
    this.renderResume('ds');
  }

  renderResume(type) {
    const docWrapper = document.getElementById('preview-doc');
    if (!docWrapper) return;

    const isDS = type === 'ds';

    docWrapper.innerHTML = `
      <div class="resume-paper">
        <div class="resume-header">
          <div class="resume-name">ROHIT KUMAR MANDAL</div>
          <div class="resume-tagline">${isDS ? 'Data Science | Machine Learning | Computer Vision | NLP' : 'Data Analyst | Power BI | SQL | Python'}</div>
          <div class="resume-contact">Dhanbad, Jharkhand, India &nbsp;|&nbsp; +91 9334208157 &nbsp;|&nbsp; rohitkr02092005@gmail.com &nbsp;|&nbsp; LinkedIn &nbsp;|&nbsp; GitHub</div>
        </div>

        <div class="resume-section">
          <div class="resume-section-title">Professional Summary</div>
          <p style="font-size: 12px; line-height: 1.5; color: #374151;">
            ${isDS ? 
              'Data Science undergraduate with internship and project experience in data analysis, machine learning, predictive modeling, computer vision, and NLP. Skilled in Python, SQL, Pandas, NumPy, Scikit-learn, and AI development. Experienced in data preprocessing, EDA, model evaluation, and building data-driven applications.' : 
              'Data Science undergraduate focused on data analytics, business intelligence, and dashboard development. Skilled in Power BI, DAX, Power Query, SQL, Excel, Python, Pandas, and NumPy. Experienced in data cleaning, exploratory analysis, KPI development, visualization, and presenting data-driven insights.'}
          </p>
        </div>

        <div class="resume-section">
          <div class="resume-section-title">Experience</div>
          <div class="resume-item">
            <div class="resume-item-row">
              <span>NovaNectar Services Pvt. Ltd.</span>
              <span>May 2025 – Jul 2025</span>
            </div>
            <div class="resume-item-sub">Data Science Intern (60-Day Internship)</div>
            <ul class="resume-bullets">
              <li>Cleaned and preprocessed datasets; performed EDA, feature engineering, and visualization using Python, Pandas, NumPy, and Scikit-learn.</li>
              <li>Developed and evaluated regression and classification models using Scikit-learn, cross-validation, and hyperparameter tuning (+12% accuracy improvement).</li>
              <li>Worked on car and house price prediction, landslide prediction, coupon sales, Iris classification, and IMDB sentiment analysis.</li>
            </ul>
          </div>
        </div>

        <div class="resume-section">
          <div class="resume-section-title">Projects</div>
          ${isDS ? `
            <div class="resume-item">
              <div class="resume-item-row"><span>Safe Drive Vision AI</span> <span>Python, OpenCV, MediaPipe, YOLO</span></div>
              <ul class="resume-bullets">
                <li>Built real-time driver fatigue monitoring using facial landmarks, Eye Aspect Ratio (EAR), and yawning detection.</li>
                <li>Integrated YOLO-based phone detection and audio alerts.</li>
              </ul>
            </div>
            <div class="resume-item">
              <div class="resume-item-row"><span>AutoAnalyst Pro</span> <span>Python, Flask, Pandas, Scikit-learn, PostgreSQL</span></div>
              <ul class="resume-bullets">
                <li>Developed a data analysis platform supporting data cleaning, clustering, and anomaly detection.</li>
                <li>Optimized backend data-merging workflows to reduce memory-related failures.</li>
              </ul>
            </div>
            <div class="resume-item">
              <div class="resume-item-row"><span>Road Accident Analysis</span> <span>Python, Pandas, Power BI</span></div>
              <ul class="resume-bullets">
                <li>Analyzed 307,973 accident records across 21 variables, addressing missing values, duplicates, outliers, and inconsistencies.</li>
                <li>Explored accident severity, road conditions, junctions, and contributing factors through analysis and visualization.</li>
              </ul>
            </div>
          ` : `
            <div class="resume-item">
              <div class="resume-item-row"><span>Netflix Data Analysis Dashboard</span> <span>Power BI, DAX, Power Query</span></div>
              <ul class="resume-bullets">
                <li>Analyzed 5,000+ titles by content type, genre, rating, country, and release trends using interactive visualizations.</li>
                <li>Cleaned and transformed data and created DAX measures and KPIs.</li>
              </ul>
            </div>
            <div class="resume-item">
              <div class="resume-item-row"><span>Sample Superstore Profit Report</span> <span>Power BI, DAX, Data Modeling</span></div>
              <ul class="resume-bullets">
                <li>Analyzed sales, profit, and quantity across regions, segments, categories, and sub-categories.</li>
                <li>Created KPI cards, slicers, and interactive report views.</li>
              </ul>
            </div>
            <div class="resume-item">
              <div class="resume-item-row"><span>Free Apps' Hidden Costs</span> <span>Power BI, DAX, Data Cleaning</span></div>
              <ul class="resume-bullets">
                <li>Explored app usage, popularity, and privacy-related risks through data cleaning, feature engineering, and category comparisons.</li>
              </ul>
            </div>
            <div class="resume-item">
              <div class="resume-item-row"><span>Road Accident Analysis</span> <span>Python, Pandas, Power BI</span></div>
              <ul class="resume-bullets">
                <li>Analyzed 307,973 accident records across 21 variables to explore patterns involving accident severity and junctions.</li>
              </ul>
            </div>
          `}
        </div>

        <div class="resume-section">
          <div class="resume-section-title">Technical Skills</div>
          <div style="font-size: 11.5px; line-height: 1.6; color: #374151;">
            ${isDS ? `
              <div><strong>Programming:</strong> Python, SQL, C</div>
              <div><strong>Data Analysis:</strong> Pandas, NumPy, Statistics, EDA, Excel, Power BI, Matplotlib, Seaborn</div>
              <div><strong>Machine Learning:</strong> Scikit-learn, Regression, Classification, Clustering, Feature Engineering, NLP</div>
              <div><strong>AI / Computer Vision:</strong> TensorFlow, PyTorch, CNN, OpenCV, MediaPipe, YOLO, Image Processing</div>
              <div><strong>Tools:</strong> Git, GitHub, Jupyter Notebook, VS Code, Streamlit, Google Colab</div>
            ` : `
              <div><strong>BI & Visualization:</strong> Power BI, DAX, Power Query, KPI Development, Data Modeling, Excel, Dashboard Design</div>
              <div><strong>Data Analysis:</strong> SQL, Python, Pandas, NumPy, Statistics, EDA, Data Cleaning, Data Transformation</div>
              <div><strong>Machine Learning:</strong> Scikit-learn, Regression, Classification, Feature Engineering, Model Evaluation</div>
              <div><strong>Tools:</strong> Git, GitHub, Jupyter Notebook, VS Code, Google Colab</div>
            `}
          </div>
        </div>

        <div class="resume-section">
          <div class="resume-section-title">Education</div>
          <div class="resume-item">
            <div class="resume-item-row">
              <span>Nalanda University Centre, Neemrana</span>
              <span>2023 – 2027</span>
            </div>
            <div class="resume-item-sub">B.Sc. (Hons.) Data Science &nbsp;|&nbsp; <strong>CGPA: 8.86 / 10</strong> (Till 6th semester)</div>
          </div>
          <div class="resume-item">
            <div class="resume-item-row">
              <span>CBSE Senior Secondary (Class XII)</span>
              <span>2023 (87%)</span>
            </div>
          </div>
          <div class="resume-item">
            <div class="resume-item-row">
              <span>CBSE Secondary (Class X)</span>
              <span>2021 (94.5%)</span>
            </div>
          </div>
        </div>

        <div class="resume-section">
          <div class="resume-section-title">Certifications</div>
          <ul class="resume-bullets">
            <li>Tata Group – Data Analytics Job Simulation, Forage (Jan 2026)</li>
            <li>Deloitte Australia – Data Analytics Job Simulation, Forage (Jan 2026)</li>
            <li>British Airways – Data Science Job Simulation, Forage (Dec 2025)</li>
            <li>IBM – Data Analysis with Python, Coursera</li>
            <li>IBM – Data Visualization with Python, Coursera</li>
            <li>IBM – Python for Data Science, AI & Development, Coursera</li>
          </ul>
        </div>

        <div class="resume-section" style="margin-bottom: 0;">
          <div class="resume-section-title">Achievements</div>
          <ul class="resume-bullets">
            <li><strong>1st Place, Tech Fest 2026</strong> – Led a team of 4 to develop Safe Drive Vision AI.</li>
            <li><strong>1st Place, Tech Fest 2025</strong> – Led a team of 4 to develop Smart Physio Detection System.</li>
            <li><strong>1st Place, Open House Debate 2025</strong> – Among 30+ participants.</li>
            <li><strong>All India Rank 43</strong> – Common Internship Test by Internship Studio.</li>
          </ul>
        </div>
      </div>
    `;
  }

  // System Settings App
  initSettingsContent() {
    const thumbs = document.querySelectorAll('.wallpaper-thumb');
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('selected'));
        thumb.classList.add('selected');
        const wp = thumb.getAttribute('data-wallpaper');
        this.applyWallpaper(wp);
      });
    });

    const themeSelect = document.getElementById('settings-theme-select');
    if (themeSelect) {
      themeSelect.value = this.currentTheme;
      themeSelect.addEventListener('change', (e) => {
        this.applyTheme(e.target.value);
      });
    }
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('macos_theme', theme);
  }

  applyWallpaper(wallpaperClass) {
    this.currentWallpaper = wallpaperClass;
    if (this.desktop) {
      this.desktop.className = `macos-desktop ${wallpaperClass}`;
    }
    localStorage.setItem('macos_wallpaper', wallpaperClass);
  }

  // Apple Logo Menu
  initDropdownMenu() {
    const appleBtn = document.getElementById('apple-menu-btn');
    const menu = document.getElementById('apple-dropdown-menu');

    if (appleBtn && menu) {
      appleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
      });

      document.addEventListener('click', () => {
        menu.classList.remove('show');
      });
    }
  }
}

// Launch on load
window.addEventListener('DOMContentLoaded', () => {
  window.macOS = new MacOSManager();
});

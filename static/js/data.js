// Rohit Kumar Mandal - Portfolio Data Store
const PORTFOLIO_DATA = {
  profile: {
    name: "Rohit Kumar Mandal",
    roles: [
      "Data Scientist",
      "Machine Learning Practitioner",
      "Computer Vision & Deep Learning Specialist",
      "BI & Data Analytics Developer"
    ],
    tagline: "Aspiring Data Scientist & AI Engineer passionate about building real-time Computer Vision systems, predictive ML pipelines, and actionable BI dashboards.",
    email: "rohitkr02092005@gmail.com",
    phone: "+91 9334208157",
    location: "Dhanbad, Jharkhand, India",
    github: "https://github.com/rohitkr2005",
    githubUsername: "rohitkr2005",
    linkedin: "https://www.linkedin.com/in/rohit-kumar-mandal-31223929a/",
    stats: {
      repos: 29,
      techFestWins: "2x 1st Place (2025 & 2026)",
      airRank: "AIR 43 (Common Internship Test)",
      cgpa: "8.86 / 10"
    }
  },

  education: [
    {
      degree: "B.Sc. (Hons.) Data Science",
      institution: "Tribhuvan College of Environment & Development Sciences, Nalanda University Centre, Neemrana",
      period: "2023 – 2027",
      score: "CGPA: 8.86 / 10 (Till 6th semester)",
      badge: "In Progress",
      courses: [
        "Machine Learning & Statistical Modeling",
        "Computer Vision & Deep Learning",
        "Data Structures & Algorithms",
        "Big Data Analytics & SQL",
        "Business Intelligence & Data Warehousing"
      ]
    },
    {
      degree: "CBSE Senior Secondary (Class XII)",
      institution: "CBSE Board",
      period: "2023",
      score: "87%",
      badge: "Science (PCM + CS)",
      courses: ["Mathematics", "Physics", "Chemistry", "Computer Science"]
    },
    {
      degree: "CBSE Secondary (Class X)",
      institution: "CBSE Board",
      period: "2021",
      score: "94.5%",
      badge: "Distinction",
      courses: ["Science", "Mathematics", "Social Science", "English", "Hindi"]
    }
  ],

  experience: [
    {
      role: "Data Science Intern",
      company: "NovaNectar Services Pvt. Ltd.",
      type: "60-Day Internship",
      period: "May 2025 – Jul 2025",
      location: "Remote / Hybrid",
      highlights: [
        "Cleaned and preprocessed large multi-source datasets; performed exploratory data analysis (EDA), feature engineering, and visual storytelling using Python, Pandas, NumPy, and Scikit-learn.",
        "Engineered, trained, and benchmarked regression and classification models with Scikit-learn, cross-validation, and systematic hyperparameter tuning to achieve a +12% accuracy improvement.",
        "Delivered production-grade predictive models for vehicle resale pricing, real-estate house valuations, landslide hazard prediction, promotional coupon sales forecasting, Iris flower classification, and IMDB sentiment analysis.",
        "Synthesized findings into interactive dashboards and technical reports presented to senior team leads."
      ],
      technologies: ["Python", "Pandas", "NumPy", "Scikit-learn", "EDA", "Feature Engineering", "Data Cleaning"]
    }
  ],

  achievements: [
    {
      title: "1st Place Winner – Tech Fest 2026",
      project: "Safe Drive Vision AI",
      team: "Led a team of 4 engineers",
      description: "Architected a real-time computer vision system to prevent driver fatigue and distracted driving using MediaPipe facial mesh (EAR, MAR calculation) and YOLO object detection.",
      badge: "🥇 1st Prize"
    },
    {
      title: "1st Place Winner – Tech Fest 2025",
      project: "Smart Physio Detection System",
      team: "Led a team of 4 engineers",
      description: "Developed an AI-driven physiotherapy rehabilitation assistant evaluating biomechanical joint angles in real time to guide recovery and prevent exercise injury.",
      badge: "🥇 1st Prize"
    },
    {
      title: "1st Place Winner – Open House Debate 2025",
      team: "Individual Speaker",
      description: "Awarded 1st place among 30+ debaters articulating key societal and ethical arguments surrounding artificial intelligence.",
      badge: "🥇 1st Prize"
    },
    {
      title: "All India Rank 43 (AIR 43)",
      project: "Common Internship Test by Internship Studio",
      team: "Nationwide Examination",
      description: "Secured top-tier 43rd rank across thousands of participating engineering students in India.",
      badge: "🎖️ Top 50 National"
    }
  ],

  certifications: [
    {
      name: "Data Analytics Job Simulation",
      issuer: "Tata Group (Forage)",
      date: "Jan 2026",
      icon: "🏢",
      skills: "Business Intelligence, Strategic Data Analysis, Executive Reporting"
    },
    {
      name: "Data Analytics Job Simulation",
      issuer: "Deloitte Australia (Forage)",
      date: "Jan 2026",
      icon: "🏢",
      skills: "Forensic Data Analytics, Dashboard Design, Customer Segmentation"
    },
    {
      name: "Data Science Job Simulation",
      issuer: "British Airways (Forage)",
      date: "Dec 2025",
      icon: "✈️",
      skills: "Customer Booking Prediction, Web Scraping, Sentiment Analytics"
    },
    {
      name: "Data Labeling Analyst Job Simulation",
      issuer: "Forage Academy",
      date: "Nov 2025",
      icon: "🏷️",
      skills: "Data Annotation, Computer Vision Quality Assurance, Taxonomy Design"
    },
    {
      name: "Data Analysis with Python",
      issuer: "IBM (Coursera)",
      date: "2024",
      icon: "💻",
      skills: "Pandas, NumPy, Scikit-learn, Model Evaluation, Data Wrangling"
    },
    {
      name: "Data Visualization with Python",
      issuer: "IBM (Coursera)",
      date: "2024",
      icon: "📈",
      skills: "Matplotlib, Seaborn, Folium, Interactive Storytelling"
    },
    {
      name: "Python for Data Science, AI & Development",
      issuer: "IBM (Coursera)",
      date: "2024",
      icon: "🐍",
      skills: "Object-Oriented Python, APIs, Web Scraping"
    },
    {
      name: "Artificial Intelligence Internship Certificate",
      issuer: "Internship Studio",
      date: "2024",
      icon: "🤖",
      skills: "Deep Learning Foundations, Supervised Algorithms, Neural Networks"
    }
  ],

  skills: {
    programming: [
      { name: "Python", level: 95, icon: "🐍" },
      { name: "SQL", level: 90, icon: "🗄️" },
      { name: "C", level: 75, icon: "⚡" },
      { name: "JavaScript / HTML / CSS", level: 80, icon: "🌐" }
    ],
    analytics: [
      { name: "Power BI & DAX", level: 95, icon: "📊" },
      { name: "Power Query (M)", level: 90, icon: "🔄" },
      { name: "Pandas & NumPy", level: 95, icon: "🐼" },
      { name: "Exploratory Data Analysis (EDA)", level: 92, icon: "🔍" },
      { name: "Statistical Modeling", level: 88, icon: "📐" },
      { name: "Data Cleaning & Transformation", level: 94, icon: "🧹" }
    ],
    ml_cv: [
      { name: "OpenCV & Image Processing", level: 90, icon: "👁️" },
      { name: "Google MediaPipe", level: 92, icon: "📍" },
      { name: "YOLO (Object Detection)", level: 88, icon: "🎯" },
      { name: "Scikit-learn", level: 92, icon: "🧠" },
      { name: "TensorFlow & PyTorch (CNNs)", level: 82, icon: "🔥" },
      { name: "NLP & Sentiment Analysis", level: 85, icon: "💬" }
    ],
    tools: [
      { name: "Git & GitHub", icon: "🐙" },
      { name: "VS Code", icon: "💻" },
      { name: "Jupyter Notebook", icon: "📓" },
      { name: "Streamlit", icon: "🎈" },
      { name: "Flask", icon: "🌶️" },
      { name: "PostgreSQL", icon: "🐘" },
      { name: "Google Colab", icon: "☁️" },
      { name: "uv Package Manager", icon: "⚡" }
    ]
  },

  projects: [
    {
      id: "safe-drive-vision",
      title: "Safe Drive Vision AI",
      category: "Computer Vision & AI",
      badge: "🏆 1st Prize Tech Fest 2026",
      featured: true,
      github: "https://github.com/rohitkr2005/SafeDriveVision.ai",
      tech: ["Python", "OpenCV", "MediaPipe", "YOLO", "Pygame Audio"],
      summary: "Real-time intelligent driver fatigue and distraction monitoring system preventing vehicular accidents.",
      details: [
        "Streams 468 3D facial landmarks at 30+ FPS using Google MediaPipe.",
        "Computes Eye Aspect Ratio (EAR) dynamically to detect micro-sleeps and drowsiness with adaptive thresholds.",
        "Computes Mouth Aspect Ratio (MAR) for precise yawning detection.",
        "Integrates custom YOLO object detector to recognize mobile phone usage and driver distraction.",
        "Triggers multi-frequency sound alerts when driver impairment is detected."
      ]
    },
    {
      id: "smart-physio",
      title: "Smart Physio Detection System",
      category: "Computer Vision & AI",
      badge: "🏆 1st Prize Tech Fest 2025",
      featured: true,
      github: "https://github.com/rohitkr2005",
      tech: ["Python", "OpenCV", "MediaPipe Pose", "Healthcare AI"],
      summary: "AI-driven rehabilitation assistant evaluating patient exercise posture in real time to prevent re-injury.",
      details: [
        "Led a 4-member cross-functional team in architecting real-time biomechanical angle calculations.",
        "Calculates joint kinematics (elbow, shoulder, knee, hip angles) against clinical benchmarks.",
        "Provides visual and auditory correctional feedback during patient physiotherapy regimens."
      ]
    },
    {
      id: "road-accident-analysis",
      title: "UK Road Accident Comprehensive Analysis",
      category: "Data Analytics & BI",
      badge: "📊 307,973 Records Analyzed",
      featured: true,
      github: "https://github.com/rohitkr2005/Road_Accident_Analysis",
      tech: ["Python", "Pandas", "Power BI", "DAX", "Seaborn"],
      summary: "Deep exploratory data analysis and Power BI intelligence report covering 307,973 accident events across 21 variables.",
      details: [
        "Cleaned messy multi-year traffic incident records handling missing values, duplicates, and categorical anomalies.",
        "Analyzed accident severity patterns across junction types, lighting conditions, speed limits, and vehicle types.",
        "Constructed high-impact interactive Power BI dashboard featuring dynamic DAX KPIs and drill-through filters."
      ]
    },
    {
      id: "autoanalyst-pro",
      title: "AutoAnalyst Pro",
      category: "Machine Learning & Web",
      badge: "⭐ Full-Stack Analytics",
      featured: true,
      github: "https://github.com/rohitkr2005/AutoAnalyst_Pro",
      tech: ["Python", "Flask", "Pandas", "Scikit-learn", "PostgreSQL"],
      summary: "Automated data analysis and insight generation engine handling large CSV/Excel uploads.",
      details: [
        "Performs automated data profiling, missing-value imputation, and duplicate elimination.",
        "Executes unsupervised clustering (K-Means, DBSCAN) and anomaly detection.",
        "Optimized backend data-merging pipelines to reduce memory spikes by 40% on large datasets."
      ]
    },
    {
      id: "netflix-bi",
      title: "Netflix Global Content Intelligence Dashboard",
      category: "Data Analytics & BI",
      badge: "🎬 5,000+ Titles Explored",
      featured: true,
      github: "https://github.com/rohitkr2005/Netflix-Analysis-PowerBI",
      tech: ["Power BI", "DAX", "Power Query", "Excel"],
      summary: "Strategic media analytics dashboard analyzing over 5,000 titles by content type, genre, country, and release trends.",
      details: [
        "Transformed unnested genre and country data using M/Power Query ETL pipelines.",
        "Created DAX measures for Year-over-Year (YoY) content addition and country saturation.",
        "Designed executive-ready dark-themed Power BI report with interactive slicers."
      ]
    },
    {
      id: "superstore-profit",
      title: "Sample Superstore Profit & Sales Report",
      category: "Data Analytics & BI",
      badge: "📈 Executive BI Dashboard",
      featured: true,
      github: "https://github.com/rohitkr2005/Superstore-Profit-Report-Dashboard",
      tech: ["Power BI", "DAX", "Data Modeling", "Business Intelligence"],
      summary: "Comprehensive financial and retail analytics dashboard diagnosing profit leakages across regions and categories.",
      details: [
        "Built dimensional star-schema data model connecting sales, customers, products, and geographies.",
        "Calculated custom DAX metrics: Profit Margin %, Discount Impact, and Returns Rate.",
        "Identified loss-making sub-categories (e.g. Tables/Supplies in certain regions) to drive margin recovery."
      ]
    },
    {
      id: "free-apps-costs",
      title: "Free Apps' Hidden Costs Dashboard",
      category: "Data Analytics & BI",
      badge: "🛡️ Privacy & Risk Analytics",
      featured: false,
      github: "https://github.com/rohitkr2005/Hidden_Cost_Of_Free_Apps_Dashboard",
      tech: ["Power BI", "DAX", "Python", "Data Cleaning"],
      summary: "Empirical study on the correlation between 'free' app monetization, intrusive permissions, and user privacy risks.",
      details: [
        "Scraped and aggregated metadata across Google Play store apps.",
        "Formulated risk metrics quantifying permission greed vs app utility.",
        "Visualized ad-tracker proliferation in gaming and utility apps."
      ]
    },
    {
      id: "resume-scanner-ai",
      title: "Resume Scanner AI",
      category: "Machine Learning & Web",
      badge: "🤖 NLP & Streamlit",
      featured: false,
      github: "https://github.com/rohitkr2005/resume-scanner-ai",
      tech: ["Python", "Streamlit", "NLP", "Scikit-learn"],
      summary: "AI-powered Applicant Tracking System (ATS) resume scanner matching candidate profiles to job descriptions.",
      details: [
        "Calculates cosine similarity and semantic overlap between candidate CVs and target role specifications.",
        "Flags missing industry keywords and suggests actionable formatting improvements."
      ]
    },
    {
      id: "gender-age-detection",
      title: "Gender & Age Detection",
      category: "Computer Vision & AI",
      badge: "👁️ Deep Learning CNN",
      featured: false,
      github: "https://github.com/rohitkr2005/gender-and-age-detection",
      tech: ["Python", "OpenCV", "Caffe/CNN", "Deep Learning"],
      summary: "Real-time webcam demographic attribute estimation using pre-trained convolutional neural networks.",
      details: [
        "Utilizes deep CNN models to classify gender and predict binned age brackets.",
        "Renders real-time bounding boxes with statistical confidence scores."
      ]
    },
    {
      id: "blockchain-voting",
      title: "Blockchain-Based Voting System",
      category: "Web & Security",
      badge: "🔐 Cryptographic Security",
      featured: false,
      github: "https://github.com/rohitkr2005/Blockchain-Based-Voting-System",
      tech: ["Python", "Jupyter Notebook", "Cryptography", "SHA-256"],
      summary: "Decentralized, tamper-resistant digital voting architecture ensuring election integrity and cryptographic immutability.",
      details: [
        "Implements cryptographic hash chaining and proof-of-work validation.",
        "Prevents double voting through digital wallet signatures and auditable ledgers."
      ]
    },
    {
      id: "car-price-prediction",
      title: "Car Price Prediction",
      category: "Machine Learning & Predictive Models",
      badge: "🚗 NovaNectar Internship",
      featured: false,
      github: "https://github.com/rohitkr2005/Elementary-task-Car-Price-Prediction-",
      tech: ["Python", "Pandas", "Scikit-learn", "Regression"],
      summary: "Vehicle resale price forecasting pipeline developed during NovaNectar Services internship.",
      details: [
        "Conducted extensive outlier detection, mileage depreciation curves, and categorical encoding.",
        "Tuned Ridge, Lasso, and Random Forest regressors to achieve superior R2 score."
      ]
    },
    {
      id: "landslide-prediction",
      title: "Landslide Risk Prediction & Analysis",
      category: "Machine Learning & Predictive Models",
      badge: "⛰️ Geospatial ML",
      featured: false,
      github: "https://github.com/rohitkr2005/LandslidePredictionAnalysis",
      tech: ["Python", "Scikit-learn", "Pandas", "Jupyter"],
      summary: "Geological risk forecasting model identifying high-probability landslide hazard zones.",
      details: [
        "Aggregated terrain slope, rainfall volume, soil composition, and seismic indices.",
        "Trained classification models to output early-warning hazard indicators."
      ]
    },
    {
      id: "house-price-prediction",
      title: "House Price Prediction",
      category: "Machine Learning & Predictive Models",
      badge: "🏠 Regression Pipeline",
      featured: false,
      github: "https://github.com/rohitkr2005/HousePricePrediction",
      tech: ["Python", "Scikit-learn", "Pandas"],
      summary: "Real-estate valuation modeling using advanced gradient boosted regression.",
      details: [
        "Engineered neighborhood clustering, square-footage ratios, and age decay metrics.",
        "Benchmarked XGBoost, LightGBM, and Random Forest models."
      ]
    },
    {
      id: "stock-data-viz",
      title: "Extracting & Visualizing Stock Data",
      category: "Data Analytics & BI",
      badge: "📈 Financial Analytics",
      featured: false,
      github: "https://github.com/rohitkr2005/Extracting-and-Visualizing-Stock-Data",
      tech: ["Python", "yfinance", "Plotly", "Pandas"],
      summary: "Historical financial data extraction, automated transformation, and interactive candlestick charting.",
      details: [
        "Extracted historical stock and revenue data via financial APIs.",
        "Generated multi-asset comparative trend charts with rolling volatility averages."
      ]
    }
  ]
};

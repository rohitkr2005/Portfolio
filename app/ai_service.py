import os
import json
import asyncio
import re
from typing import AsyncGenerator, List, Dict, Any, Optional
import httpx
from app.knowledge import SYSTEM_PROMPT, ROHIT_PROFILE_DATA

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "google/gemini-2.0-flash-exp:free")


def get_grounded_fallback_response(query: str) -> str:
    """
    Intelligent brain-powered grounded response engine for Rohit Kumar Mandal.
    Provides direct answers, insightful HR answers, and technical breakdowns
    WITHOUT dumping raw generic tables.
    """
    q = query.lower().strip()

    # =========================================================================
    # 1. SPECIFIC SKILL QUESTIONS (Direct Answers)
    # =========================================================================

    # Python
    if "python" in q and any(w in q for w in ["know", "does", "do", "skill", "exp", "use", "profic", "good"]):
        return (
            "**Yes, absolutely!** Rohit is highly proficient in **Python** and uses it as his primary language for "
            "Data Science, Machine Learning, Computer Vision, and backend development.\n\n"
            "Here is how he applies Python in real-world engineering:\n"
            "- **Data Manipulation & Analytics:** Extensive use of `Pandas` and `NumPy` for data cleaning, preprocessing, and exploratory data analysis.\n"
            "- **Computer Vision & AI:** Built real-time systems running at 30+ FPS with `OpenCV`, `MediaPipe`, and `YOLO` (such as **Safe Drive Vision AI**, which won 1st Place at Tech Fest 2026).\n"
            "- **Machine Learning:** Developed regression, classification, and clustering models using `Scikit-learn` during his **NovaNectar Services internship**, achieving a **+12% accuracy gain**.\n"
            "- **Web Apps & APIs:** Built data apps with `Flask` (**AutoAnalyst Pro**) and `Streamlit` (**Resume Scanner AI**).\n"
            "- **Certifications:** Holds IBM's *Python for Data Science, AI & Development* and *Data Analysis with Python* from Coursera."
        )

    # SQL / Database
    if "sql" in q and any(w in q for w in ["know", "does", "do", "skill", "exp", "use", "query", "database"]):
        return (
            "**Yes!** Rohit is skilled in **SQL** and relational databases like **PostgreSQL**.\n\n"
            "- Uses SQL for complex multi-table joins, subqueries, CTEs, data aggregation, and database schema design.\n"
            "- Integrated PostgreSQL with Python and Flask in **AutoAnalyst Pro** to store and manage analysis metadata.\n"
            "- Frequently combines SQL data pipelines with **Power BI** for automated business intelligence reporting."
        )

    # Power BI / DAX / Business Intelligence
    if any(k in q for k in ["power bi", "powerbi", "dax", "power query", "dashboard"]):
        return (
            "**Yes!** Rohit is an expert in **Power BI, DAX, and Power Query (M)** for end-to-end business intelligence:\n\n"
            "- **UK Road Accident Analysis:** Analyzed **307,973 accident records across 21 variables**, developing interactive DAX measures to diagnose severe crash hotspots.\n"
            "- **Netflix Global Intelligence:** Built an executive dashboard analyzing **5,000+ streaming titles** across genres, countries, and YoY trends.\n"
            "- **Sample Superstore Profit Report:** Designed star-schema dimensional models with custom DAX KPIs to uncover regional profit leakages.\n"
            "- **Corporate Job Simulations:** Completed official Data Analytics simulations from **Tata Group** and **Deloitte Australia** via Forage."
        )

    # Computer Vision / OpenCV / MediaPipe / YOLO
    if any(k in q for k in ["computer vision", "opencv", "mediapipe", "yolo", "cv"]):
        return (
            "**Yes!** Computer Vision is one of Rohit's core specializations:\n\n"
            "- **Safe Drive Vision AI (1st Place, Tech Fest 2026):** Uses Google MediaPipe to stream 468 3D facial landmarks at 30+ FPS, computing Eye Aspect Ratio (EAR) for micro-sleep detection and Mouth Aspect Ratio (MAR) for yawning, alongside custom YOLO phone distraction detection.\n"
            "- **Smart Physio Detection System (1st Place, Tech Fest 2025):** Tracks human skeletal joints with MediaPipe Pose to evaluate rehabilitation posture and joint kinematics in real time.\n"
            "- **Gender & Age Detection:** Deployed deep convolutional neural networks (CNNs) for live video demographic classification.\n"
            "- **Technologies:** `OpenCV`, `MediaPipe`, `YOLO (v8/v11)`, `TensorFlow`, `PyTorch`."
        )

    # Machine Learning / Scikit-learn
    if any(k in q for k in ["machine learning", "ml", "scikit", "scikit-learn", "deep learning"]):
        return (
            "**Yes, definitely!** Rohit is an accomplished **Machine Learning** practitioner:\n\n"
            "- **Internship Experience:** At **NovaNectar Services**, he trained and fine-tuned regression, classification, and clustering models with Scikit-learn, achieving a **+12% model accuracy improvement**.\n"
            "- **Algorithms:** Linear/Ridge/Lasso Regression, Random Forest, XGBoost, K-Means Clustering, DBSCAN, and CNNs.\n"
            "- **Production Projects:** Resale car price forecasting, landslide risk prediction, house valuation, and IMDB sentiment analysis using NLP."
        )

    # C Language
    if re.search(r'\b(c\s+language|knows?\s+c|c\s+programming)\b', q) or (q == "does rohit know c" or q == "do rohit know c"):
        return (
            "**Yes!** Rohit knows **C programming** alongside Python. He learned C as part of his foundational computer science coursework, "
            "providing him with a solid understanding of low-level memory management, pointers, and data structures."
        )

    # =========================================================================
    # 2. HR & BEHAVIORAL QUESTIONS (Brain-Powered Answers)
    # =========================================================================

    # "Why should we hire Rohit?" / "Why hire him?" / "Why you?"
    if any(k in q for k in ["why should we hire", "why hire", "why should i hire", "why rohit", "why hire you"]):
        return (
            "### 🎯 Why You Should Hire Rohit Kumar Mandal\n\n"
            "Rohit brings a rare blend of **hackathon-proven leadership**, **real-world business impact**, and **end-to-end technical versatility**:\n\n"
            "1. **Proven High-Stakes Performer:** He led 4-engineer teams to **1st Place at Tech Fest 2026** (*Safe Drive Vision AI*) and **1st Place at Tech Fest 2025** (*Smart Physio*), proving he can architect complex AI systems under tight deadlines and inspire teams to win.\n"
            "2. **Measurable Business Impact:** During his 60-day Data Science internship at **NovaNectar Services**, he delivered a **+12% accuracy improvement** on predictive models through systematic feature engineering and hyperparameter tuning.\n"
            "3. **End-to-End Capabilities:** Rohit doesn't just train models; he builds complete solutions — from wrangling messy datasets of **307,000+ records** in Power BI, to optimizing backend memory by 40% in Flask (**AutoAnalyst Pro**), to deploying 30 FPS Computer Vision models.\n"
            "4. **Exceptional Academics & National Standing:** Holds an **8.86 / 10 CGPA** in B.Sc. (Hons.) Data Science at Nalanda University Centre and scored **All India Rank 43** in the nationwide Common Internship Test.\n\n"
            "He is adaptable, proactive, and ready to make an immediate, tangible impact from Day 1."
        )

    # Strengths
    if any(k in q for k in ["strength", "what are his strengths", "strongest skill", "greatest strength"]):
        return (
            "### 🌟 Rohit's Greatest Strengths\n\n"
            "- **Technical Versatility:** Seamlessly transitions between Data Analytics (Power BI, DAX, SQL) and Advanced AI (Computer Vision, YOLO, MediaPipe, ML pipelines).\n"
            "- **Leadership & Collaboration:** Twice captained 4-member teams to 1st Place victories in university tech fests, showing strong project management, task delegation, and communication skills.\n"
            "- **Problem-Solving Mindset:** Demonstrated by his **AIR 43** ranking in the nationwide Common Internship Test and his 1st Place award in the Open House Debate.\n"
            "- **Optimization & Engineering Rigor:** Not satisfied with just 'working' code — optimized data-merging pipelines in AutoAnalyst Pro to slash memory spikes by 40%."
        )

    # Weaknesses / Areas of Improvement
    if any(k in q for k in ["weakness", "area of improvement", "areas of improvement", "what are his weaknesses"]):
        return (
            "### 🔍 Areas of Improvement & Growth Mindset\n\n"
            "Rohit approaches his development with high self-awareness and active learning:\n\n"
            "- **Enterprise Cloud Scale:** While he has built and deployed robust applications with Flask, Streamlit, and local GPU pipelines, he is actively expanding his expertise in large-scale cloud-native MLOps architectures (such as Kubernetes clusters and CI/CD model deployment).\n"
            "- **Perfectionism in Delivery:** Because he aims for optimal model metrics (like his +12% accuracy gain at NovaNectar), he sometimes spends extra time fine-tuning hyperparameters. He manages this by adhering to structured agile milestones."
        )

    # Leadership & Teamwork
    if any(k in q for k in ["leadership", "teamwork", "team player", "lead a team", "manage people"]):
        return (
            "### 🤝 Leadership & Team Collaboration\n\n"
            "Rohit has a proven track record as an empathetic and decisive team leader:\n\n"
            "- **Tech Fest 2026 Winner (Safe Drive Vision AI):** Led a team of 4 engineers, dividing work between facial landmark tracking, YOLO model training, audio alert triggers, and UI integration.\n"
            "- **Tech Fest 2025 Winner (Smart Physio Detection):** Directed a 4-person team to translate clinical physiotherapy requirements into real-time biomechanical angle calculation algorithms.\n"
            "- **Effective Communication:** Won 1st Place in the Open House Debate 2025 among 30+ participants, demonstrating clear articulation and persuasive communication."
        )

    # 5-Year Vision / Career Goals
    if any(k in q for k in ["5 years", "where do you see", "career goal", "future plan"]):
        return (
            "### 🚀 Rohit's Career Goals & 5-Year Vision\n\n"
            "In the near term, Rohit is eager to contribute as a **Data Analyst**, **Data Scientist**, or **Machine Learning Engineer**, solving core business problems and optimizing data architectures.\n\n"
            "Over the next 3 to 5 years, he aims to grow into a **Lead AI / Machine Learning Architect**, designing scalable, production-grade Computer Vision and intelligent automated decision systems that deliver meaningful human and business impact."
        )

    # Tell Me About Yourself / Introduction / Bio
    if any(k in q for k in ["tell me about yourself", "who is rohit", "introduce", "walk me through your resume", "bio"]):
        return (
            "### 👋 About Rohit Kumar Mandal\n\n"
            "Rohit is a **Data Scientist and AI Developer** currently pursuing his B.Sc. (Hons.) in Data Science at **Nalanda University Centre, Neemrana** with a stellar **8.86 / 10 CGPA**.\n\n"
            "His highlights include:\n"
            "- **Industry Experience:** Data Science Intern at **NovaNectar Services**, where he engineered ML models with a **+12% accuracy improvement**.\n"
            "- **Hackathon Champion:** Led teams of 4 to **1st Place at Tech Fest 2026** (*Safe Drive Vision AI*) and **1st Place at Tech Fest 2025** (*Smart Physio*).\n"
            "- **Data Analytics:** Built high-impact Power BI reports analyzing over **307,000 real-world records**.\n"
            "- **National Recognition:** Ranked **AIR 43** in the nationwide Common Internship Test.\n\n"
            "He is passionate about turning raw data into actionable intelligence and building real-time AI solutions."
        )

    # Relocation / Availability / Work Mode
    if any(k in q for k in ["relocat", "remote", "notice period", "availab", "join", "location", "where is he based"]):
        return (
            "### 📍 Location & Availability\n\n"
            "- **Current Location:** Dhanbad, Jharkhand, India.\n"
            "- **Open to Relocation:** **Yes**, fully open to relocating across India (Bangalore, Hyderabad, Pune, Delhi NCR, Mumbai, etc.).\n"
            "- **Work Mode:** Open to **Remote**, **Hybrid**, or **On-site** opportunities.\n"
            "- **Availability:** Available for immediate internship and full-time hiring discussions.\n"
            "- **Contact:** [rohitkr02092005@gmail.com](mailto:rohitkr02092005@gmail.com) | [+91 9334208157](tel:+919334208157)"
        )

    # Handling Challenges / Difficult Problems
    if any(k in q for k in ["challenge", "difficult problem", "failure", "conflict", "pressure"]):
        return (
            "### 💡 Problem Solving & Handling Challenges\n\n"
            "When faced with engineering bottlenecks, Rohit relies on data-driven root cause analysis:\n\n"
            "- **The Challenge:** In **AutoAnalyst Pro**, user uploads of large CSV files caused memory spikes and backend crashes during multi-table joins.\n"
            "- **The Solution:** Rohit refactored the data-merging pipeline using chunked Pandas processing and generator-based memory streaming in Python and PostgreSQL.\n"
            "- **The Result:** Reduced memory consumption by **40%**, eliminating out-of-memory errors on large datasets."
        )

    # =========================================================================
    # 3. SPECIFIC PROJECT DEEP-DIVES
    # =========================================================================

    if any(k in q for k in ["safe drive", "safedrive", "driver fatigue", "yawning"]):
        return (
            "### 🚗 Safe Drive Vision AI (1st Place – Tech Fest 2026)\n\n"
            "A real-time driver assistance system designed to prevent fatigue-related road accidents:\n\n"
            "- **Facial Mesh Analysis:** Tracks 468 3D landmarks at 30+ FPS via Google MediaPipe.\n"
            "- **Drowsiness Detection:** Calculates dynamic **Eye Aspect Ratio (EAR)** to catch micro-sleep episodes.\n"
            "- **Yawning Detection:** Computes **Mouth Aspect Ratio (MAR)** to identify drowsiness before eye closure.\n"
            "- **Distraction Alerts:** Parallel **YOLO** model detects mobile phone use and sounds audio alert tones.\n"
            "- **GitHub:** [rohitkr2005/SafeDriveVision.ai](https://github.com/rohitkr2005/SafeDriveVision.ai)"
        )

    if any(k in q for k in ["smart physio", "physio", "posture"]):
        return (
            "### 🏥 Smart Physio Detection System (1st Place – Tech Fest 2025)\n\n"
            "An AI-driven physiotherapy rehabilitation assistant evaluating patient form in real time:\n\n"
            "- **Biomechanical Kinematics:** Uses MediaPipe Pose to compute joint angles (elbow, shoulder, knee, hip) against clinical benchmarks.\n"
            "- **Corrective Feedback:** Issues visual and audio corrections during rehabilitation exercises to avoid re-injury.\n"
            "- **Leadership:** Rohit led a team of 4 engineers from conceptualization to victory."
        )

    if any(k in q for k in ["autoanalyst", "auto analyst"]):
        return (
            "### 🤖 AutoAnalyst Pro\n\n"
            "A full-stack automated data analysis and ML clustering web platform:\n\n"
            "- **Data Cleaning:** Automates missing value imputation, type casting, and outlier removal.\n"
            "- **Unsupervised ML:** Runs K-Means and DBSCAN clustering with anomaly detection.\n"
            "- **Architecture:** Python, Flask, Pandas, Scikit-learn, PostgreSQL, TailwindCSS.\n"
            "- **Memory Optimization:** Refactored backend workflows to reduce memory spikes by 40%.\n"
            "- **GitHub:** [rohitkr2005/AutoAnalyst_Pro](https://github.com/rohitkr2005/AutoAnalyst_Pro)"
        )

    if any(k in q for k in ["road accident", "accident analysis", "307"]):
        return (
            "### 📊 UK Road Accident Comprehensive Analysis\n\n"
            "An extensive data analytics study exploring **307,973 accident records** across 21 parameters:\n\n"
            "- **Data Cleansing:** Addressed missing data, inconsistent speed categories, and outlier values in Python and Pandas.\n"
            "- **Power BI Dashboard:** Developed interactive report views with dynamic DAX KPIs uncovering high-risk junction types and adverse weather correlations.\n"
            "- **GitHub:** [rohitkr2005/Road_Accident_Analysis](https://github.com/rohitkr2005/Road_Accident_Analysis)"
        )

    if any(k in q for k in ["netflix", "netflix bi"]):
        return (
            "### 🎬 Netflix Global Content Intelligence Dashboard\n\n"
            "A strategic media analytics dashboard built in Power BI:\n\n"
            "- Analyzed over **5,000 titles** by content type (Movies vs TV Shows), genre, country, and release trends.\n"
            "- Built custom DAX metrics for Year-over-Year (YoY) content addition rates.\n"
            "- **GitHub:** [rohitkr2005/Netflix-Analysis-PowerBI](https://github.com/rohitkr2005/Netflix-Analysis-PowerBI)"
        )

    # =========================================================================
    # 4. EXPERIENCE / INTERNSHIP
    # =========================================================================

    if any(k in q for k in ["novanectar", "intern", "experience", "job", "work"]):
        return (
            "### 💼 Experience: Data Science Intern at NovaNectar Services\n\n"
            "**Company:** NovaNectar Services Pvt. Ltd. | **Role:** Data Science Intern (60 Days) | **Timeline:** May 2025 – Jul 2025\n\n"
            "- **Data Cleaning & EDA:** Processed diverse datasets, engineered predictive features, and performed visual storytelling using Python, Pandas, and NumPy.\n"
            "- **Model Tuning (+12% Accuracy):** Built and fine-tuned regression and classification models with Scikit-learn, cross-validation, and hyperparameter tuning to achieve a **+12% accuracy gain**.\n"
            "- **Models Delivered:** Car price prediction, house valuation, landslide hazard prediction, coupon sales forecasting, Iris flower classification, and IMDB sentiment analysis."
        )

    # =========================================================================
    # 5. EDUCATION & ACHIEVEMENTS
    # =========================================================================

    if any(k in q for k in ["education", "college", "degree", "cgpa", "school", "nalanda"]):
        return (
            "### 🎓 Education & Academic Record\n\n"
            "- **B.Sc. (Hons.) Data Science (2023 – 2027):**\n"
            "  - Tribhuvan College of Environment & Development Sciences, Nalanda University Centre, Neemrana\n"
            "  - **Current CGPA: 8.86 / 10** (Till 6th semester)\n"
            "- **CBSE Class XII (2023):** **87%** (Science with Mathematics & Computer Science)\n"
            "- **CBSE Class X (2021):** **94.5%** with Distinction"
        )

    if any(k in q for k in ["award", "achievement", "prize", "tech fest", "air 43", "debate"]):
        return (
            "### 🏆 Honors & Key Achievements\n\n"
            "1. **🥇 1st Place – Tech Fest 2026:** Led team of 4 to build *Safe Drive Vision AI* (Real-time Driver Fatigue Monitoring).\n"
            "2. **🥇 1st Place – Tech Fest 2025:** Led team of 4 to architect *Smart Physio Detection System* (AI Rehabilitation Posture Assessment).\n"
            "3. **🥇 1st Place – Open House Debate 2025:** 1st position among 30+ participants.\n"
            "4. **🎖️ All India Rank 43 (AIR 43):** Secured top 50 nationally in the Common Internship Test by Internship Studio."
        )

    if any(k in q for k in ["contact", "email", "phone", "linkedin", "reach"]):
        return (
            "### 📬 Contact Rohit Kumar Mandal\n\n"
            "- **📧 Email:** [rohitkr02092005@gmail.com](mailto:rohitkr02092005@gmail.com)\n"
            "- **📞 Phone:** [+91 9334208157](tel:+919334208157)\n"
            "- **📍 Location:** Dhanbad, Jharkhand, India (Open to Relocation & Remote)\n"
            "- **💼 LinkedIn:** [linkedin.com/in/rohit-kumar-mandal-31223929a](https://www.linkedin.com/in/rohit-kumar-mandal-31223929a/)\n"
            "- **🐙 GitHub:** [github.com/rohitkr2005](https://github.com/rohitkr2005)"
        )

    if any(k in q for k in ["certif", "coursera", "forage", "ibm"]):
        return (
            "### 📜 Professional Certifications\n\n"
            "- 🏢 **Tata Group:** Data Analytics Job Simulation *(Forage, Jan 2026)*\n"
            "- 🏢 **Deloitte Australia:** Data Analytics Job Simulation *(Forage, Jan 2026)*\n"
            "- ✈️ **British Airways:** Data Science Job Simulation *(Forage, Dec 2025)*\n"
            "- 🏷️ **Forage Academy:** Certified Data Labeling Analyst *(Nov 2025)*\n"
            "- 💻 **IBM (Coursera):** Data Analysis with Python • Data Visualization with Python • Python for Data Science, AI & Dev\n"
            "- 🤖 **Internship Studio:** AI Internship Certificate *(2024)*"
        )

    # General / Default response
    return (
        f"**I'm Rohit's AI Assistant.** I can answer any questions about Rohit Kumar Mandal's projects, "
        f"technical skills, internship experience, or HR-related inquiries.\n\n"
        f"Here are a few quick topics to explore:\n"
        f"- 🎯 **'Why should we hire Rohit?'** or **'What are his greatest strengths?'**\n"
        f"- 👁️ **'Does Rohit know Computer Vision & YOLO?'**\n"
        f"- 🏆 **'Tell me about his Tech Fest winning projects'**\n"
        f"- 💼 **'What did he do at NovaNectar Services?'**\n"
        f"- 📊 **'Show me his Power BI & Data Analytics work'**\n"
        f"- 📬 **'How do I contact Rohit?'**"
    )


async def stream_ai_response(
    query: str,
    history: Optional[List[Dict[str, str]]] = None,
    api_key: Optional[str] = None,
    model: Optional[str] = None,
    streaming: bool = True
) -> AsyncGenerator[str, None]:
    """
    Stream response chunks.
    Ensures `streaming=true` behavior.
    Uses OpenRouter / OpenAI if key is available.
    Otherwise uses the grounded intelligent answer engine.
    """
    effective_key = (api_key or os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY") or "").strip()
    effective_model = model or os.getenv("OPENROUTER_MODEL") or DEFAULT_OPENROUTER_MODEL

    # If an API key is provided, attempt live LLM streaming
    if effective_key:
        try:
            is_openai = effective_key.startswith("sk-proj-") or (not effective_key.startswith("sk-or-") and "openai" in effective_model.lower())
            api_endpoint = "https://api.openai.com/v1/chat/completions" if is_openai else OPENROUTER_URL

            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            if history:
                for h in history[-6:]:
                    role = h.get("role", "user")
                    content = h.get("content", "")
                    if role in ["user", "assistant"] and content:
                        messages.append({"role": role, "content": content})
            messages.append({"role": "user", "content": query})

            headers = {
                "Authorization": f"Bearer {effective_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:8000",
                "X-Title": "Rohit Kumar Mandal Portfolio"
            }

            payload = {
                "model": "gpt-4o-mini" if is_openai else effective_model,
                "messages": messages,
                "stream": True,  # streaming=true
                "temperature": 0.4
            }

            async with httpx.AsyncClient(timeout=30.0) as client:
                async with client.stream("POST", api_endpoint, headers=headers, json=payload) as response:
                    if response.status_code == 200:
                        async for line in response.aiter_lines():
                            if not line:
                                continue
                            if line.startswith("data: "):
                                data_str = line[6:].strip()
                                if data_str == "[DONE]":
                                    break
                                try:
                                    data_json = json.loads(data_str)
                                    choices = data_json.get("choices", [])
                                    if choices:
                                        delta = choices[0].get("delta", {})
                                        content_chunk = delta.get("content", "")
                                        if content_chunk:
                                            yield f"data: {json.dumps({'token': content_chunk})}\n\n"
                                except Exception:
                                    continue
                        yield f"data: {json.dumps({'done': True})}\n\n"
                        return
        except Exception:
            pass

    # High-fidelity brain-powered direct grounded response
    full_text = get_grounded_fallback_response(query)

    # Stream out tokens word-by-word with realistic micro-pauses
    words = re.findall(r'\S+|\n', full_text)
    buffer = ""
    for idx, token in enumerate(words):
        if token == '\n':
            buffer += '\n'
            yield f"data: {json.dumps({'token': buffer})}\n\n"
            buffer = ""
            await asyncio.sleep(0.012)
        else:
            buffer += token + " "
            if len(buffer) >= 6 or idx == len(words) - 1:
                yield f"data: {json.dumps({'token': buffer})}\n\n"
                buffer = ""
                await asyncio.sleep(0.015)

    if buffer:
        yield f"data: {json.dumps({'token': buffer})}\n\n"
    yield f"data: {json.dumps({'done': True})}\n\n"

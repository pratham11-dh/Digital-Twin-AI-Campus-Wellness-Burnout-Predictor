<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=250&section=header&text=Digital%20Twin%20AI&fontSize=70&animation=fadeIn&fontAlignY=38&desc=Your%20AI-Powered%20Campus%20Wellness%20Companion&descAlignY=55&descAlign=50" alt="Digital Twin AI Banner" />

### 🧠 Predict. Prevent. Perform.
*An AI-powered wellness companion that predicts burnout, stress spikes, and academic overload — hyper-personalised to your semester, branch, and daily patterns.*

**🏆 Built for the AWS Builder Center Hackathon by Ctrl C Ctrl V Engineers**

<p align="center">
  <img src="https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" />
</p>

</div>

---

## ✨ Features at a Glance

| 🌟 Feature | 📝 Description |
| :--- | :--- |
| **🧬 Neural Avatar** | A living 3D digital twin (Three.js) that mirrors your academic DNA — reflecting stress patterns, sleep cycles, and workload peaks. |
| **🔮 Burnout Prediction** | AI models predict your burnout risk **48 hours before it hits** using your daily check-in data. |
| **⏱️ Daily Check-In** | A rapid 2-minute pulse check covering sleep, deadlines, and mood. |
| **🎯 Smart Coping** | Hyper-personalised wellness strategies built for your exact situation and workload. |
| **💬 Neural Chat** | Context-aware AI chat that remembers your deadlines, patterns, and past conversations. |
| **📊 Live Dashboard** | Real-time stress heatmaps, workload graphs, and your 3D avatar reflecting your current state. |
| **🏫 University Portal** | A dedicated portal for universities to monitor campus-wide student wellness trends. |
| **🚑 Emergency Support** | Instant access to emergency mental health resources. |

---

## 🛠️ The Tech Stack

<div align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nextjs,ts,tailwind,mongodb,firebase,gcp,react,nodejs,pnpm&theme=dark" />
  </a>
</div>

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)  
* **Language:** TypeScript  
* **Styling:** Tailwind CSS v4  
* **Database:** MongoDB via [Mongoose](https://mongoosejs.com/)  
* **Auth:** Firebase Auth (Google OAuth) + JWT (`jose`)  
* **AI:** Google Gemini 1.5 Flash (`@google/generative-ai`)  
* **3D / UI:** Three.js, Framer Motion, Recharts  

---

## 🚀 Getting Started

Follow these steps to run your own local instance of Digital Twin AI.

### Prerequisites

Make sure you have installed:
- Node.js `>= 18`
- `pnpm` (Install via `npm install -g pnpm`)
- MongoDB Atlas cluster (or local setup)
- Firebase project with Google Auth enabled
- Google Gemini API key

### Installation & Setup

**1. Clone the repository**
```bash
git clone https://github.com/<your-username>/DigitalTwinAI.git
cd DigitalTwinAI
```

**2. Install dependencies**
```bash
pnpm install
```

**3. Configure Environment Variables**
Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=<your_mongodb_connection_string>

# Authentication
JWT_SECRET=<your_jwt_secret>

# AI Integration
GEMINI_API_KEY=<your_gemini_api_key>

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=<your_firebase_api_key>
```

**4. Fire it up!**
```bash
pnpm dev
```

> 🌐 Open http://localhost:3000 and meet your digital twin.

---

## 🔐 Architecture & AI Engine

### 🛡️ Authentication Flow

- **Dual Auth:** Email/password or Google OAuth via Firebase  
- **Stateless Security:** JWTs issued on login are stored as HTTP-only cookies (`token`)  
- **Protected Routes:** `middleware.ts` guards student routes. University portal uses `uni_token`  

### 🧠 Gemini AI & Scoring (`lib/gemini.ts`)

1. **Metric Computation:** Calculates scores (0-100) for `stress`, `burnout`, `anxiety`, `sleep`, and `wellbeing`  
2. **Generative Insights:** Feeds scores + academic load into Gemini to generate 2–3 sentence personalized insights  

---

## 📁 Project Structure

```text
DigitalTwinAI/
├── app/                    # Next.js App Router
│   ├── api/                # REST endpoints
│   ├── components/         # Shared UI
│   ├── dashboard/          # Student view
│   ├── university/         # University view
├── controllers/            # JWT logic
├── lib/                    # DB, Firebase, Gemini
├── models/                 # Mongoose schemas
├── utils/                  # Auth helpers
└── middleware.ts           # Route protection
```

---

## 🤝 Contributing

We welcome contributions!

1. Fork the project  
2. Create a branch:  
```bash
git checkout -b feat/AmazingFeature
```
3. Commit changes:  
```bash
git commit -m "feat: Add AmazingFeature"
```
4. Push:  
```bash
git push origin feat/AmazingFeature
```
5. Open a Pull Request  

---

## 👥 Meet the Engineers


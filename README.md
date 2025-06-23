<h1 align="center" style="font-family: Orbitron, sans-serif; font-weight: 800; font-size: 3rem; color: #ffffff; background-color: #0f0f0f; padding: 1.5rem 0;">
  🚀 CypherShare
</h1>

<p align="center" style="font-family: Orbitron, sans-serif; color: #cccccc; font-size: 1.1rem;">
  <strong>A futuristic, encrypted peer-to-peer file storage platform</strong><br/>
  <em>Powering digital freedom with decentralization, AES-256 encryption, and IPFS</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/built%20with-MERN%20Stack-black?style=flat-square&logo=node.js" alt="Tech Stack"/>
  <img src="https://img.shields.io/badge/secure-AES--256%20Encrypted-white?style=flat-square&logo=lock" alt="Encryption"/>
  <img src="https://img.shields.io/badge/powered%20by-IPFS-black?style=flat-square&logo=ipfs" alt="IPFS"/>
</p>

<br/>

<p align="center">
  <img src="https://user-images.githubusercontent.com/placeholder/demo.gif" alt="CypherShare Preview" width="80%"/>
</p>

---

## 🌐 What Can CypherShare Do?

> <span style="font-family: Orbitron, sans-serif; font-size: 1.05rem; color: #e0e0e0;">
> CypherShare isn’t just a file-sharing platform — it’s a decentralized digital vault built for modern needs.
> </span>

🔒 **Upload Securely**  
Users (Renters) can upload any file — documents, media, software, etc. — and trust it will be encrypted, protected, and stored safely across a distributed network of Providers.

🖥️ **Earn by Hosting Files**  
Users (Providers) can register and run the CypherShare Desktop Agent to rent out their disk space and earn passive rewards while hosting encrypted files they can’t read or modify.

📡 **Download from Anywhere**  
Renters can download their files from anywhere, even if the original Provider is offline — thanks to distributed syncing.

💬 **No Server Needed**  
There’s no central server dependency. All communication, storage, and delivery happens between verified peers on the CypherShare network.

⚡ **Real-Time File Visibility**  
Providers see which files are assigned to them in real time — and can manually or automatically sync them.

🎛️ **Seamless Experience**  
The platform includes:
- A modern website to manage your account.
- A lightweight, auto-launching desktop agent.
- A futuristic UI in dark mode, styled for both performance and elegance.

🧭 **Choose Your Role, Anytime**  
Whether you want to store files or earn from your free storage — just switch roles. The system is designed to support flexibility without friction.

🚫 **No Manual Sharing, No Links**  
You don’t need to generate links, upload to drives, or send files manually. Just drop the file and it’s securely handled by the platform — end-to-end.

---

> _CypherShare gives control back to users in a world of centralized cloud giants. You own your files, your space, and your earnings._



## 🧠 What is CypherShare?

> <span style="font-family: Orbitron, sans-serif; font-size: 1.1rem; color: #e0e0e0;">
> CypherShare is a decentralized, encrypted peer-to-peer file sharing and storage platform that lets users rent out their disk space and earn passive income.
> </span>

- 🔐 **AES-256 Encrypted**: Files are encrypted before leaving the renter’s device — ensuring privacy and security.
- 🌐 **Decentralized via IPFS**: Files are stored across providers, enabling redundancy and distributed access.
- 🤝 **Dual Roles**: Choose to be a **Renter** (upload & retrieve files securely) or a **Provider** (host encrypted files & earn rewards).
- ⚡ **Electron Agent**: A dedicated desktop agent allows Providers to manage file syncing and background tasks seamlessly.
- 🧬 **Modern MERN Stack**: Built with MongoDB, Express.js, React.js, Node.js — optimized for performance and scalability.


## 🚀 Key Features

> <span style="font-family: Orbitron, sans-serif; font-size: 1.05rem; color: #e0e0e0;">
> CypherShare blends simplicity, security, and decentralization into a seamless user experience.
> </span>

### 🛡️ Military-Grade Encryption
- End-to-end AES-256-CBC encryption.
- Providers cannot view or tamper with the files they host.

### 📡 Decentralized Storage Network
- Powered by IPFS (InterPlanetary File System).
- Files are stored on multiple provider nodes for high availability.

### 🖥️ Electron Desktop Agent
- Auto-launch, background sync, and secure file handling.
- Can check the release section of this repo.

### 👥 Role-Based Access
- Seamless login/register for Renters and Providers.
- Protected routes ensure only authorized users access the dashboard.

### 🌐 Responsive UI + Modern UX
- Sleek black & white themed interface.
- Built with Tailwind CSS and React for performance and design consistency.

### 📊 Real-time File Monitoring
- Providers get a live view of files assigned to them.
- Auto-deletion of expired/consumed files using background IPC tasks.


## 🛠 Tech Stack

> <span style="font-family: Orbitron, sans-serif; font-size: 1.05rem; color: #e0e0e0;">
> Modern tools, minimal clutter — built for performance and security.
> </span>

### 🔧 Frontend
- **React.js** — Core UI framework.
- **Tailwind CSS** — Utility-first styling with responsive design.
- **React Router** — Declarative client-side routing.
- **Framer Motion** — Subtle animations and transitions.
- **GSAP** — Animations and Transition.
- **Electron.js** — For the CypherShare desktop agent.

### 🔐 Backend
- **Node.js + Express.js** — API backend for auth, file handling, and role-based access.
- **MongoDB + Mongoose** — Storing user, file, and token metadata.
- **JWT + Cookies** — Token-based authentication with secure cookie handling.

### 📦 Infra + Storage
- **IPFS (via Pinata)** — Decentralized file hosting.
- **AES-256-CBC** — Encryption for files before upload.
- **Cloudflare** — Dynamic tunneling for provider agents (runtime IP resolution).

### 📁 Project Architecture
- `Pages/` — All route-level components.
- `Components/` — Reusable UI elements.
- `DesktopAgent/` — Electron-based background app.
- `utils/`, `services/`, `api/` — Separated concerns for better maintainability.

graph TD

    A[User Uploads File] --> B[Frontend (React.js)]
    B --> C[Backend (Express.js)]
    C --> D{AES-256 Encryption}
    D --> E[Encrypted File Stored to IPFS (via Fleek)]
    E --> F[File Metadata stored in MongoDB]
    F --> G[Provider Info Assigned]

    G --> H[CypherShare Desktop Agent (Electron)]
    H --> I[Local Provider Storage]
    I --> J{File Synced Periodically}
    J --> K[On-demand File Delivery]

    C --> L[Cloudflare Tunnel for Secure Peer Access]

## 🛠️ Setup & Installation

> <span style="font-family: Orbitron, sans-serif; font-size: 1.05rem; color: #e0e0e0;">
> Minimal, secure, and efficient – just like CypherShare.
> </span>

---

### 📦 Prerequisites

- 🟢 **Node.js** (v18+)
- 🍃 **MongoDB** (Cloud or Local)
- 🌐 **Cloudflare Tunnel** (for provider agents)
- 🧶 **Yarn** or **npm**
- ⚙️ **Electron** (auto-handled)

---

### 🖥️ Web Platform (Frontend)

```bash
# 1. Clone the repository
git clone https://github.com/akhil-k-se/CypherShare-Peer-to-Peer-Space-Renting-Platform.git
cd cyphershare

# 2. Install dependencies
yarn install     # or npm install

# 3. Start the development server
yarn dev         # or npm run dev
```

---

### 💾 Backend Server

```bash
# 1. Navigate to backend
cd backend

# 2. Install backend dependencies
yarn install     # or npm install

# 3. Create a `.env` file like below:
```

```env
PORT=5000
MONGO_URI=mongodb+srv://your-cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

```bash
# 4. Start the backend server
yarn start       # or npm run start
```

---

### 💻 CypherShare Desktop Agent

```bash
# 1. Navigate to desktop agent folder
cd desktop-agent

# 2. Install dependencies
yarn install     # or npm install

# 3. Run the Electron app (development mode)
yarn dev         # or npm run dev
```

---
## 🔒 Security Model

> _CypherShare is engineered with **privacy-first principles** and **zero trust architecture**._

- 🔐 **AES-256 Encryption**  
  Every file is encrypted using AES-256-CBC **before it ever leaves the renter’s machine**. Each file has its own unique key and IV.

- 🕶️ **Zero-Knowledge Storage**  
  Providers have **no access** to the contents of the files they store. They cannot read, decrypt, modify, or delete user data.

- 🧩 **Role-Based Access Control**  
  User roles (Renter/Provider) are strictly enforced at both frontend and backend levels. Unauthorized access is blocked by default.

- 🛡️ **Token-Based Authentication**  
  Auth is handled via **JWT tokens stored in secure HttpOnly cookies**. Tokens are verified on every protected route.

- 🌐 **Decentralized Tunnels via Cloudflare**  
  Instead of relying on fixed ports or IPs, CypherShare uses **Cloudflare Tunnels** to enable encrypted, on-demand file access to provider nodes — **removing dependency on ngrok** or other legacy tools.

- ⚙️ **Automatic File Cleanup**  
  Encrypted files are automatically removed from provider nodes when they're no longer needed (e.g., downloaded or expired).

---

## 🐞 Found a Bug?

> We care about security and stability. If you find a bug or vulnerability:

📧 **Email us directly** at: [akhil.se2024@gmail.com](mailto:akhil.se2024@gmail.com)  
🌐 Or visit the contact section at the bottom of our [Portfolio Website](https://akkhill-portfolio.netlify.app/)

Please include:
- A clear description of the issue.
- Steps to reproduce (if possible).
- Screenshots or logs (if available).

_Thank you for helping keep CypherShare secure and reliable!_

> 🔐 _Ensure your backend is running, and your **Cloudflare Tunnel** is active to allow incoming file delivery._


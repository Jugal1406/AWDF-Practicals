# ITUE301: Advanced Web Development Frameworks
## Practical 2: State Management and Routing in React

**Student Name:** Jugal Kshatriya  
**Role:** Student  
**Topic:** Client-Side Routing with React Router v6 & State Management with React `useState`

---

## 📌 Project Overview

This repository contains the complete implementation of **Practical 2: State Management and Routing in React**, extending the student portfolio application developed in Practical 1.

The project demonstrates:
1. **Multi-page client-side navigation** without full-page reloads using `react-router-dom` v6 (`BrowserRouter`, `Routes`, `Route`, `Link`, and `NavLink`).
2. **Controlled input handling** and **real-time UI updates** with React's `useState` hook.
3. **Live character counting** that updates synchronously on every keystroke.
4. **Conditional rendering / visibility toggling** using state.
5. **Dynamic list rendering** with unique keys using JavaScript `.map()`.
6. **Dark / Light theme switcher** driven entirely by React state and CSS custom properties.
7. **Custom 404 Catch-All Route** (`path="*"`) handling invalid URLs smoothly.

---

## 🛠️ Technology Stack

- **Framework:** React 18
- **Build Tool / Bundler:** Vite
- **Routing:** React Router DOM v6
- **State Management:** React `useState` (functional components)
- **Styling:** Vanilla CSS (Custom CSS Variables, Flexbox, Grid, Clean Design)
- **Language:** JavaScript (ES6+) & JSX

---

## 🧭 Routes Added in Practical 2

| Route Path | Component | Description |
| :--- | :--- | :--- |
| `/` | `Home.jsx` | Portfolio intro, student bio, technical skills, and navigation CTAs |
| `/projects` | `Projects.jsx` | Dynamic showcase of student projects rendered with `.map()` |
| `/contact` | `Contact.jsx` | Controlled textarea, live message preview, character counter, and toggleable help |
| `*` | `NotFound.jsx` | Custom 404 error page with navigation back to Home |

---

## ✅ Main Features & Practical Requirements

### 1. React Router Navigation
- Root application wrapped in `<BrowserRouter>` once in `src/main.jsx`.
- Clean navigation bar with `<NavLink>` components for active link indicator.
- Single-page application (SPA) architecture — fast route transitions without browser refresh.

### 2. State Management with `useState`
- **Controlled Message Input:** `const [message, setMessage] = useState('')` bound to `<textarea value={message} onChange={...} />`.
- **Live Text Display:** The typed message is reflected instantaneously in a live preview card.
- **Immediate Character Counter:** Synchronous character count calculated directly from `message.length`.
- **Help Section Toggle:** `const [showHelp, setShowHelp] = useState(false)` toggling contextual form instructions with an interactive button.

### 3. Theme Toggle (Dark & Light Mode)
- Managed via `const [theme, setTheme] = useState('light')` in `App.jsx`.
- Dynamically applies `.light` or `.dark` CSS class to the root container.
- High contrast, legible typography, and custom borders in both themes.

### 4. Custom 404 Error Page
- Uses catch-all route `<Route path="*" element={<NotFound />} />`.
- Displays friendly error message and direct links back to Home and Projects.

---

## 📂 Project Structure

```text
ITUE301-AWDF_Practical2/
├── dist/                   # Production build output
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── Header.jsx      # Student header banner
│   │   ├── NavBar.jsx      # Navigation links and theme switcher
│   │   ├── About.jsx       # Student bio and academic details
│   │   ├── Skills.jsx      # Technical skills grid
│   │   └── Footer.jsx      # Portfolio footer
│   ├── pages/
│   │   ├── Home.jsx        # Landing page with hero and overview
│   │   ├── Projects.jsx    # Project cards rendered via .map()
│   │   ├── Contact.jsx     # Controlled state, live counter, help toggle
│   │   └── NotFound.jsx    # Custom 404 page
│   ├── App.jsx             # Main router definition and theme state
│   ├── App.css             # Component and layout styling
│   ├── index.css           # Global reset & CSS custom properties (theme vars)
│   └── main.jsx            # Entry point wrapping App in BrowserRouter
├── index.html              # HTML entry template
├── package.json            # Project dependencies and npm scripts
├── vite.config.js          # Vite configuration
└── README.md               # Documentation and practical viva notes
```

---

## 🚀 Installation & Running the Project

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Preview the Production Build
```bash
npm run preview
```

---

## 💡 Suggested Git Commit Message
```bash
git add .
git commit -m "feat: add React Router and useState functionality"
```
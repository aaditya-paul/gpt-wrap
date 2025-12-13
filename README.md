# 🎉 GPT Wrapped

> **Your year with ChatGPT, beautifully visualized.**

Like Spotify Wrapped, but for your AI conversations. GPT Wrapped transforms your ChatGPT export data into stunning, shareable insights about your AI journey.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## ✨ Features

- 🎨 **Wrapped Experience** - Beautiful animated slides showcasing your ChatGPT journey
- 📊 **Deep Analytics** - Comprehensive stats on messages, words, models, and time patterns
- 🔒 **Privacy First** - All data processing happens in your browser - nothing is ever uploaded
- ⚡ **Instant Results** - No waiting, no server processing, instant analysis
- 📱 **Mobile Optimized** - Swipe through your stats on any device
- 💾 **IndexedDB Storage** - Handles large exports efficiently with browser storage
- 📤 **Export & Share** - Download your stats as beautiful PNG/JPEG images
- 🔍 **Single Chat Analysis** - Deep dive into individual conversations
- 📚 **All Conversations** - Browse and search through your entire chat history
- 🤖 **AI Summary** - Gemini-powered context summaries for each conversation
- 🧠 **AI Insights Chat** - Chat with AI about your patterns, mental state, and thought process

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Your ChatGPT conversation export (`conversations.json`)
- (Optional) Gemini API key for AI features

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/aaditya-paul/gpt-wrap.git
   cd gpt-wrap
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 How to Use

### 1. Export Your ChatGPT Data

1. Go to [ChatGPT](https://chat.openai.com/)
2. Click on your profile → **Settings**
3. Navigate to **Data controls** → **Export data**
4. Wait for the email with your data export
5. Download and extract the ZIP file

### 2. Upload Your Data

1. Open GPT Wrapped
2. Drag and drop `conversations.json` or click to browse
3. Wait for the analysis to complete (happens instantly in your browser)

### 3. Explore Your Stats

- **Wrapped Slides** - Swipe through 11 beautiful slides with your stats
- **All Conversations** - Browse and search your entire chat history
- **Individual Chats** - Click any conversation for detailed analysis
- **Export & Share** - Download your favorite stats as images

---

## 🛠️ Tech Stack

### Core

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Styling & Animation

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations

### Data & Charts

- **[Recharts](https://recharts.org/)** - Beautiful data visualizations
- **[date-fns](https://date-fns.org/)** - Date manipulation
- **[idb-keyval](https://github.com/jakearchibald/idb-keyval)** - IndexedDB wrapper

### Export & Share

- **[html-to-image](https://github.com/bubkoo/html-to-image)** - Export stats as images
- **[lucide-react](https://lucide.dev/)** - Beautiful icons
- **[react-countup](https://github.com/glennreyes/react-countup)** - Animated counters

---

## 📁 Project Structure

```
gpt-wrap/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Landing page
│   ├── about/               # About page
│   ├── privacy/             # Privacy policy
│   ├── terms/               # Terms & conditions
│   └── wrapped/             # Wrapped experience
│       ├── page.tsx         # Main wrapped slides
│       ├── [chatId]/        # Single chat analysis
│       └── all/             # All conversations list
├── components/              # React components
│   ├── Header.tsx           # Reusable header
│   ├── footer.tsx           # Footer with socials
│   ├── FileUpload.tsx       # File upload component
│   ├── ExportShare.tsx      # Export & share modal
│   ├── charts/              # Chart components
│   └── stats/               # Stat card components
├── lib/                     # Core logic
│   ├── types.ts             # TypeScript interfaces
│   ├── parser.ts            # Conversation parser
│   ├── analytics.ts         # Analytics engine
│   └── storage.ts           # IndexedDB operations
└── context/                 # React Context
    └── ConversationContext.tsx
```

---

## 🔒 Privacy & Security

- ✅ **100% Client-Side** - All processing happens in your browser
- ✅ **No Server Uploads** - Your data never leaves your device
- ✅ **No Tracking** - We don't collect any analytics or user data
- ✅ **IndexedDB Storage** - Data stored locally in your browser
- ✅ **Open Source** - Full transparency, inspect the code yourself

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Aaditya Paul**

- GitHub: [@aaditya-paul](https://github.com/aaditya-paul)
- Twitter: [@aaditya_paul](https://twitter.com/aaditya_paul)
- LinkedIn: [Aaditya Paul](https://linkedin.com/in/aaditya-paul)

---

## 🙏 Acknowledgments

- Inspired by Spotify Wrapped
- Built with love for the AI community
- Thanks to OpenAI for ChatGPT

---

## 📸 Screenshots

> Add screenshots here after deployment

---

## 🚀 Deploy

### Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aaditya-paul/gpt-wrap)

### Manual Deployment

```bash
npm run build
npm start
```

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/aaditya-paul">Aaditya Paul</a></p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>

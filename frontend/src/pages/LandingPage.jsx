import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import WispyMascot from "../components/WispyMascot";

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState("chat");

  // Track page scroll to subtly animate background elements
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Scroll smoothly helper
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-blush-pink text-ink-brown font-sans selection:bg-hot-pink selection:text-white relative overflow-x-hidden">
      
      {/* 🔮 Fixed Retro Grid Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(#4A3F52 2px, transparent 2px), linear-gradient(90deg, #4A3F52 2px, transparent 2px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* 🧭 Retro Pixel Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full bg-white border-b-4 border-ink-brown z-50 px-6 py-4 flex items-center justify-between shadow-[0_4px_0_0_rgba(74,63,82,0.1)]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="text-2xl animate-pulse">🐾</span>
          <span className="font-pixel text-xs tracking-wider text-titlebar-purple">WISPY.EXE</span>
        </div>
        
        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 font-pixel text-[9px] text-slate-600">
          <button onClick={() => scrollToSection("intro")} className="hover:text-hot-pink transition-colors">01. INTRO</button>
          <button onClick={() => scrollToSection("features")} className="hover:text-hot-pink transition-colors">02. FEATURES</button>
          <button onClick={() => scrollToSection("about")} className="hover:text-hot-pink transition-colors">03. ABOUT US</button>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => navigate("/workspace")}
          className="font-pixel text-[8px] bg-hot-pink text-white border-[3px] border-ink-brown px-4 py-2 hover:bg-gold-accent hover:text-ink-brown transition-colors active:translate-y-1 shadow-[3px_3px_0px_0px_#4A3F52]"
        >
          ENTER_APP
        </button>
      </nav>

      {/* 🌟 SECTION 1: HERO & WELCOME (Full Screen) */}
      <section id="intro" className="min-h-screen flex flex-col justify-center items-center pt-24 px-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full text-center space-y-8 z-10"
        >
          {/* Wispy Welcome Bubble */}
          <div className="relative inline-block mb-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white border-4 border-ink-brown px-4 py-2 rounded-lg shadow-[4px_4px_0px_0px_#4A3F52] whitespace-nowrap"
            >
              <span className="font-pixel text-[8px] text-ink-brown uppercase">"Oh! Hi there, friend!" 🐱</span>
              <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-ink-brown" />
            </motion.div>
            
            {/* Mascot Container */}
            <div className="w-32 h-32 mx-auto bg-cream border-4 border-ink-brown rounded-full flex items-center justify-center p-2 shadow-[4px_4px_0px_0px_#4A3F52]">
              <WispyMascot state="idle" size="lg" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="font-pixel text-2xl md:text-4xl text-ink-brown uppercase leading-relaxed tracking-tight">
              This is <span className="text-titlebar-purple">Wispy</span>,<br />your AI study assistant <br />
              <span className="text-hot-pink">— and a sweet friend.</span>
            </h1>
            <p className="text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed text-slate-700">
              Wispy.exe is a cozy, desktop study companion. Wispy reads your textbooks, extracts clear summaries, and helps you memorize with active flashcards.
            </p>
          </div>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button 
              onClick={() => navigate("/workspace")}
              className="font-pixel text-[10px] bg-gold-accent hover:bg-yellow-300 border-4 border-ink-brown px-8 py-4 shadow-[6px_6px_0px_0px_#4A3F52] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              GET STARTED (FREE) &gt;&gt;
            </button>
            <button 
              onClick={() => scrollToSection("features")}
              className="font-pixel text-[8px] text-slate-600 hover:text-ink-brown flex items-center gap-2 p-2 mt-2 sm:mt-0"
            >
              Scroll to explore <span className="animate-bounce">↓</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* 🚀 SECTION 2: THE INTERACTIVE FEATURES (Full Screen) */}
      <section id="features" className="min-h-screen bg-cream border-y-8 border-ink-brown flex flex-col justify-center py-20 px-6 relative">
        <div className="max-w-5xl w-full mx-auto grid md:grid-cols-12 gap-12 items-center">
          
          {/* Feature Selector & Explanations */}
          <div className="md:col-span-6 space-y-8">
            <div className="space-y-2">
              <span className="font-pixel text-[9px] text-titlebar-purple uppercase">[ SYSTEM FEATURES ]</span>
              <h2 className="font-pixel text-2xl uppercase text-ink-brown">How Wispy Saves Your Study Sessions</h2>
            </div>

            <div className="space-y-4">
              {/* Feature Tab 1 */}
              <button 
                onClick={() => setActiveFeature("chat")}
                className={`w-full text-left p-4 border-4 border-ink-brown rounded transition-all flex items-start gap-4 ${activeFeature === 'chat' ? 'bg-window-purple text-white shadow-none' : 'bg-white shadow-[4px_4px_0px_0px_#4A3F52]'}`}
              >
                <span className="text-xl">💬</span>
                <div>
                  <h3 className="font-pixel text-[10px] mb-1">01. Interactive Q&amp;A Chat</h3>
                  <p className="text-xs opacity-90 leading-relaxed font-semibold">Talk directly to your study docs. Ask Wispy to clarify tough logic, summarize pages, or write practice prompts.</p>
                </div>
              </button>

              {/* Feature Tab 2 */}
              <button 
                onClick={() => setActiveFeature("notes")}
                className={`w-full text-left p-4 border-4 border-ink-brown rounded transition-all flex items-start gap-4 ${activeFeature === 'notes' ? 'bg-window-purple text-white shadow-none' : 'bg-white shadow-[4px_4px_0px_0px_#4A3F52]'}`}
              >
                <span className="text-xl">📝</span>
                <div>
                  <h3 className="font-pixel text-[10px] mb-1">02. Auto-Formatted Notes</h3>
                  <p className="text-xs opacity-90 leading-relaxed font-semibold">Wispy parses complex chapters and structures neat markdown study guides, bullet lists, and takeaways instantly.</p>
                </div>
              </button>

              {/* Feature Tab 3 */}
              <button 
                onClick={() => setActiveFeature("cards")}
                className={`w-full text-left p-4 border-4 border-ink-brown rounded transition-all flex items-start gap-4 ${activeFeature === 'cards' ? 'bg-window-purple text-white shadow-none' : 'bg-white shadow-[4px_4px_0px_0px_#4A3F52]'}`}
              >
                <span className="text-xl">🎴</span>
                <div>
                  <h3 className="font-pixel text-[10px] mb-1">03. Interactive Flashcards</h3>
                  <p className="text-xs opacity-90 leading-relaxed font-semibold">Turn concepts into active-recall test cards. Flip, practice, track progress, and celebrate with dynamic confetti milestones.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Interactive Live Mascot Sandbox Panel */}
          <div className="md:col-span-6 flex justify-center">
            <div className="w-full max-w-sm bg-white border-[6px] border-ink-brown p-6 rounded shadow-[8px_8px_0px_0px_#4A3F52] flex flex-col items-center text-center">
              <div className="bg-titlebar-purple w-full py-2 border-b-4 border-ink-brown mb-4 -mx-6 -mt-6 px-4 flex justify-between select-none">
                <span className="font-pixel text-[8px] text-white">feature_preview.exe</span>
                <span className="font-pixel text-[8px] text-white">X</span>
              </div>
              
              <div className="my-6">
                <WispyMascot 
                  state={activeFeature === "chat" ? "thinking" : activeFeature === "notes" ? "idle" : "happy"} 
                  size="xl" 
                />
              </div>

              <div className="bg-cream border-4 border-ink-brown p-4 rounded w-full">
                <p className="font-pixel text-[8px] text-slate-400 mb-1 uppercase">[ WISPY'S STATUS ]</p>
                <p className="text-xs font-bold leading-relaxed text-ink-brown italic">
                  {activeFeature === "chat" && '"Ready to research! Drop a PDF in workspace and watch me go!"'}
                  {activeFeature === "notes" && '"Summaries are complete! No heavy readings left behind."'}
                  {activeFeature === "cards" && '"Great progress! Spot on! Let\'s earn a crown!"'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 🐾 SECTION 3: ABOUT US (Full Screen) */}
      <section id="about" className="min-h-screen flex flex-col justify-center py-20 px-6 relative">
        <div className="max-w-4xl w-full mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="font-pixel text-[9px] text-titlebar-purple uppercase">[ MEETS THE TEAM ]</span>
            <h2 className="font-pixel text-2xl uppercase text-ink-brown">Behind Wispy.exe</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            
            {/* Card 1: Vision */}
            <div className="bg-white border-4 border-ink-brown p-6 rounded shadow-[6px_6px_0px_0px_#4A3F52]">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">☕</span>
                <h3 className="font-pixel text-[11px] text-ink-brown uppercase">A Cozy Philosophy</h3>
              </div>
              <p className="text-sm font-semibold leading-relaxed text-slate-600">
                We believe studying shouldn't feel like navigating cold, sterile enterprise software. Inspired by retro-desktop interfaces and cozy virtual pets, we created Wispy to bring personality, companionship, and a little bit of fun back into productivity.
              </p>
            </div>

            {/* Card 2: Technology */}
            <div className="bg-white border-4 border-ink-brown p-6 rounded shadow-[6px_6px_0px_0px_#4A3F52]">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🕹️</span>
                <h3 className="font-pixel text-[11px] text-ink-brown uppercase">Interactive Tech</h3>
              </div>
              <p className="text-sm font-semibold leading-relaxed text-slate-600">
                Built on top of ultra-fast LLM engines, structured vector databases, and responsive design frameworks. We layer functional performance with delightful retro CSS layouts, animated companions, and tiny design touches that reward your hard work.
              </p>
            </div>

          </div>

          {/* Bottom Final CTA */}
          <div className="text-center pt-8">
            <button 
              onClick={() => navigate("/workspace")}
              className="font-pixel text-[10px] bg-hot-pink text-white border-4 border-ink-brown px-8 py-4 shadow-[6px_6px_0px_0px_#4A3F52] hover:bg-gold-accent hover:text-ink-brown transition-all active:translate-y-1 active:shadow-none"
            >
              START STUDYING WITH WISPY NOW
            </button>
          </div>

        </div>
      </section>

      {/* 📁 Retro Footer */}
      <footer className="bg-white border-t-4 border-ink-brown py-8 px-6 text-center">
        <span className="font-pixel text-[8px] text-slate-400">
          © 2026 WISPY SYSTEMS INC. // DELULU LOADING... PLEASE STAND BY.
        </span>
      </footer>

    </div>
  );
}
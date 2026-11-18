"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Header from "../components/Header";
import ParticleBackground from "../components/ParticleBackground";

const SUGGESTED = [
  "Why am I feeling so burned out?",
  "How can I improve my sleep?",
  "Help me plan for my pending tasks",
  "How do I reduce stress before exams?",
  "Give me a study schedule for today",
  "I feel overwhelmed, what should I do?",
  "How do I stay motivated?",
  "What should I focus on right now?",
];

type Message = { role: "user" | "ai"; text: string; time: string };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [userName, setUserName] = useState("Student");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.get("/api/profile", { withCredentials: true })
      .then(r => {
        if (r.data.success) {
          const name = r.data.user.name?.split(" ")[0] || "Student";
          setUserName(name);
          setMessages([{
            role: "ai",
            text: `Hey ${name}! I'm your Digital Twin AI — I know your academic profile and recent check-in data. Ask me anything about improving your wellbeing, managing stress, planning your work, or just talk about how you're feeling.`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }]);
        }
      })
      .catch(() => {
        setMessages([{
          role: "ai",
          text: "Hey! I'm your Digital Twin AI. Ask me anything about stress, burnout, sleep, or how to improve your wellbeing.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }]);
      });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim() || typing) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { role: "user", text, time };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setTyping(true);

    try {
      // Send conversation history (excluding the initial AI greeting) for context
      const historyForAPI = updated.slice(1).slice(-10); // last 10 msgs, skip greeting
      const res = await axios.post("/api/chat", { message: text, history: historyForAPI }, { withCredentials: true });
      setMessages(prev => [...prev, {
        role: "ai",
        text: res.data.reply || "I couldn't generate a response. Try again.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "ai",
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative" }}>
      <ParticleBackground />
      <Header />

      <div style={{ paddingTop: 64, height: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 800, width: "100%", margin: "0 auto", flex: 1, display: "flex", flexDirection: "column", padding: "24px 24px 0" }}>

          {/* Chat header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", borderRadius: "16px 16px 0 0",
              background: "rgba(13,27,46,0.9)", border: "1px solid rgba(0,212,255,0.15)", borderBottom: "none" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg,#00d4ff,#7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff" }}>Ψ</div>
              <div style={{ position: "absolute", bottom: 2, right: 2, width: 10, height: 10, borderRadius: "50%",
                background: "#10b981", border: "2px solid var(--bg)" }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 16 }}>Digital Twin AI</div>
              <div style={{ fontSize: 12, color: "#10b981" }}>● Online · Knows your profile & check-in history</div>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 12, color: "#64748b", textAlign: "right" }}>
              <div style={{ color: "#94a3b8" }}>{userName}</div>
              <div style={{ color: "#475569" }}>Personalised AI</div>
            </div>
          </motion.div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px",
            background: "rgba(13,27,46,0.6)", border: "1px solid rgba(0,212,255,0.1)", borderTop: "none", borderBottom: "none" }}>
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                  style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    marginBottom: 16, gap: 10, alignItems: "flex-end" }}>
                  {msg.role === "ai" && (
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#00d4ff,#7c3aed)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", flexShrink: 0 }}>Ψ</div>
                  )}
                  <div style={{ maxWidth: "72%" }}>
                    <div style={{
                      padding: "12px 16px",
                      borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: msg.role === "user" ? "linear-gradient(135deg,#00d4ff,#7c3aed)" : "rgba(17,34,64,0.9)",
                      border: msg.role === "ai" ? "1px solid rgba(0,212,255,0.15)" : "none",
                      color: "#e2e8f0", fontSize: 14, lineHeight: 1.65, whiteSpace: "pre-wrap",
                    }}>{msg.text}</div>
                    <div style={{ fontSize: 11, color: "#475569", marginTop: 4, textAlign: msg.role === "user" ? "right" : "left" }}>{msg.time}</div>
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#00d4ff,#7c3aed)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff" }}>Ψ</div>
                  <div style={{ padding: "12px 16px", borderRadius: "16px 16px 16px 4px",
                    background: "rgba(17,34,64,0.9)", border: "1px solid rgba(0,212,255,0.15)", display: "flex", gap: 4, alignItems: "center" }}>
                    {[0, 1, 2].map(d => (
                      <motion.div key={d} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: d * 0.15 }}
                        style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d4ff" }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          <div style={{ padding: "12px 24px", background: "rgba(13,27,46,0.7)",
            border: "1px solid rgba(0,212,255,0.1)", borderTop: "1px solid rgba(0,212,255,0.06)", borderBottom: "none", overflowX: "auto" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "nowrap" }}>
              {SUGGESTED.slice(0, 5).map((q, i) => (
                <button key={i} onClick={() => send(q)} disabled={typing}
                  style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid rgba(0,212,255,0.2)",
                    background: "rgba(0,212,255,0.05)", color: "#94a3b8", fontSize: 12,
                    cursor: typing ? "not-allowed" : "pointer", whiteSpace: "nowrap", flexShrink: 0,
                    opacity: typing ? 0.5 : 1, transition: "all 0.2s" }}
                  onMouseEnter={e => { if (!typing) { (e.target as HTMLButtonElement).style.borderColor = "#00d4ff"; (e.target as HTMLButtonElement).style.color = "#00d4ff"; }}}
                  onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = "rgba(0,212,255,0.2)"; (e.target as HTMLButtonElement).style.color = "#94a3b8"; }}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div style={{ padding: "16px 24px", background: "rgba(13,27,46,0.9)",
            border: "1px solid rgba(0,212,255,0.15)", borderRadius: "0 0 16px 16px", marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)}
                placeholder="Ask your Digital Twin anything..."
                disabled={typing}
                style={{ flex: 1, padding: "12px 16px", borderRadius: 10,
                  border: "1px solid rgba(0,212,255,0.2)", background: "rgba(255,255,255,0.03)",
                  color: "#e2e8f0", fontSize: 14, outline: "none", opacity: typing ? 0.6 : 1 }} />
              <button onClick={() => send(input)} disabled={!input.trim() || typing}
                style={{ padding: "12px 20px", borderRadius: 10, border: "none",
                  background: input.trim() && !typing ? "linear-gradient(135deg,#00d4ff,#7c3aed)" : "rgba(255,255,255,0.05)",
                  color: input.trim() && !typing ? "white" : "#475569",
                  cursor: input.trim() && !typing ? "pointer" : "not-allowed",
                  fontWeight: 600, fontSize: 14, transition: "all 0.2s" }}>
                {typing ? "..." : "Send →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

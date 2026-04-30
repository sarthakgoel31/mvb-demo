"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ─── Demo conversation ─── */
const demoConversation = [
  { role: "user" as const, text: "aaj kitni sales hui?", lang: "Hindi" },
  { role: "ai" as const, text: "Aaj ki total sales ₹1,24,350 hai, 47 invoices se. Sabse zyada bechne wala item Gold Ring hai (12 units, ₹42,000). Aapka sabse bada buyer aaj Sharma Traders hai — ₹28,500.", hasChart: true, chartType: "bar" as const },
  { role: "user" as const, text: "pending payment kitni hai?", lang: "Hindi" },
  { role: "ai" as const, text: "Total pending payment ₹4,32,500 hai — 23 parties se. Sabse zyada pending: Gupta Electronics (₹1,15,000, 45 din purana). Top 5 defaulters ki list:", hasChart: true, chartType: "table" as const },
  { role: "user" as const, text: "last month ka revenue trend dikhao", lang: "Hindi" },
  { role: "ai" as const, text: "March 2026 mein aapka total revenue ₹18,45,230 tha. Peak day: 15 March (₹1,12,000 — month-end rush). Average daily: ₹59,500. Previous month se 14% zyada.", hasChart: true, chartType: "line" as const },
];

/* ─── Mini Bar Chart ─── */
function MiniBarChart() {
  return (
    <div className="mt-3 flex items-end gap-1 h-12">
      {[35, 50, 42, 65, 38, 72, 45, 80, 55, 68, 90, 48].map((h, i) => (
        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          className="flex-1 rounded-t bg-accent/50" />
      ))}
    </div>
  );
}

/* ─── Mini Line Chart ─── */
function MiniLineChart() {
  const points = [20, 35, 28, 45, 38, 55, 42, 60, 50, 72, 65, 80, 58, 75, 90, 70, 85, 78, 92, 88, 95, 82, 78, 85, 90, 88, 92, 95, 88, 92];
  const w = 280, h = 48;
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (points.length - 1)) * w} ${h - (p / 100) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full h-12">
      <motion.path d={path} fill="none" stroke="#4F6EF7" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />
    </svg>
  );
}

/* ─── Mini Table ─── */
function MiniTable() {
  const rows = [
    { name: "Gupta Electronics", amount: "₹1,15,000", days: "45 din" },
    { name: "Mehta Wholesale", amount: "₹85,200", days: "32 din" },
    { name: "Jain Textiles", amount: "₹72,000", days: "28 din" },
  ];
  return (
    <div className="mt-3 rounded-lg border border-white/5 overflow-hidden text-xs">
      <div className="grid grid-cols-3 gap-0 bg-white/[0.03] px-3 py-1.5 text-[10px] font-semibold text-zinc-500">
        <span>Party</span><span>Pending</span><span>Age</span>
      </div>
      {rows.map((r) => (
        <div key={r.name} className="grid grid-cols-3 gap-0 px-3 py-1.5 border-t border-white/5 text-zinc-400">
          <span>{r.name}</span><span className="text-red-400">{r.amount}</span><span>{r.days}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Features ─── */
const features = [
  { icon: "🎤", title: "Voice-First", desc: "Hold mic, speak in Hindi or English. Answer comes back in 2-3 seconds." },
  { icon: "📊", title: "Real Charts", desc: "Auto-generated bar, pie, line charts and data tables from your Snowflake data." },
  { icon: "💬", title: "Follow-ups", desc: "'Inme se kitne paid the?' — works in context of your previous question." },
  { icon: "⚡", title: "300ms Dashboard", desc: "KPI cards load instantly. LLM only fires for ad-hoc questions." },
  { icon: "🔒", title: "Your Data Only", desc: "OTP verified. You only see your company's invoices, items, and parties." },
  { icon: "🇮🇳", title: "Hindi + English", desc: "Ask 'pichle mahine kitne invoice bane?' or 'top 5 products this month'." },
];

/* ─── Main Page ─── */
export default function Home() {
  const [demoIndex, setDemoIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", company: "" });
  const [submitted, setSubmitted] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-play demo conversation
  useEffect(() => {
    if (demoIndex >= demoConversation.length) return;
    const delay = demoConversation[demoIndex].role === "user" ? 2000 : 3500;
    const t = setTimeout(() => setDemoIndex((i) => i + 1), delay);
    return () => clearTimeout(t);
  }, [demoIndex]);

  useEffect(() => {
    // Scroll only within the chat container, not the page
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [demoIndex]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.phone) return;

    // Save to Supabase
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      setSubmitted(true); // show success anyway
    }
  }

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative flex min-h-[95vh] flex-col items-center justify-center px-4 pt-16 pb-8 overflow-hidden">
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full bg-accent/[0.04] blur-[150px]" />

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-xl">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">myVoiceBooksAI</h2>
            <p className="text-xs text-muted">Apne business ke sawal poochho</p>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-4 max-w-3xl text-center text-4xl font-bold leading-tight md:text-6xl">
          <span className="text-foreground">Bolo Hindi mein.</span>
          <br />
          <span className="text-accent">Jawaab turant.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-10 max-w-xl text-center text-lg text-muted">
          myBillBook ke andar — apni sales, payments, inventory ke baare mein
          Hindi ya English mein sawaal poochho. AI turant jawaab dega charts ke saath.
        </motion.p>

        {/* Demo Phone */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="w-full max-w-sm">
          <div className="rounded-[32px] border-2 border-white/10 bg-[#0a0a14] p-3 shadow-2xl shadow-accent/5">
            <div className="rounded-[24px] bg-[#0c0c18] overflow-hidden">
              {/* Phone header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-xs font-bold text-white">V</div>
                  <div>
                    <p className="text-sm font-semibold">AI Assistant</p>
                    <p className="text-[10px] text-zinc-500">myVoiceBooksAI</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
                </span>
              </div>

              {/* Chat messages */}
              <div className="h-[360px] overflow-y-auto p-4 space-y-3">
                <AnimatePresence>
                  {demoConversation.slice(0, demoIndex).map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                        msg.role === "user"
                          ? "bg-accent/20 text-accent-light"
                          : "bg-white/[0.04] text-zinc-300"
                      }`}>
                        {msg.role === "user" && (
                          <p className="mb-1 text-[9px] font-bold text-accent/60 uppercase tracking-wider">{msg.lang}</p>
                        )}
                        {msg.text}
                        {msg.role === "ai" && "chartType" in msg && msg.chartType === "bar" && <MiniBarChart />}
                        {msg.role === "ai" && "chartType" in msg && msg.chartType === "line" && <MiniLineChart />}
                        {msg.role === "ai" && "chartType" in msg && msg.chartType === "table" && <MiniTable />}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {demoIndex < demoConversation.length && demoIndex > 0 && demoConversation[demoIndex]?.role === "ai" && (
                  <div className="flex justify-start">
                    <div className="bg-white/[0.04] rounded-xl px-4 py-3 flex gap-1.5">
                      <span className="typing-dot h-2 w-2 rounded-full bg-zinc-500" />
                      <span className="typing-dot h-2 w-2 rounded-full bg-zinc-500" />
                      <span className="typing-dot h-2 w-2 rounded-full bg-zinc-500" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Mic button */}
              <div className="border-t border-white/5 px-4 py-4 flex items-center gap-3">
                <div className="flex-1 rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm text-zinc-500">
                  Apna sawal yahan likhein...
                </div>
                <button
                  onClick={() => { setMicActive(!micActive); setTimeout(() => setMicActive(false), 2000); }}
                  className={`h-11 w-11 rounded-full bg-accent flex items-center justify-center transition-all ${micActive ? "pulse-mic scale-110" : "hover:bg-accent-light"}`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mb-12 text-center text-3xl font-bold">
          Kya kar sakta hai?
        </motion.h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="glass rounded-xl p-5">
              <span className="text-2xl mb-3 block">{f.icon}</span>
              <h3 className="mb-1 text-[15px] font-bold">{f.title}</h3>
              <p className="text-sm text-muted">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── REAL SCREENSHOT ── */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="mb-8 text-center text-3xl font-bold">Asli data, asli jawaab</h2>
          <div className="rounded-2xl border border-white/5 overflow-hidden">
            <img src="/mvb-chat.png" alt="myVoiceBooksAI — Hindi chat with real charts" className="w-full" />
          </div>
          <p className="mt-4 text-center text-sm text-muted">Real session — Hindi query with revenue trend chart and product breakdown</p>
        </motion.div>
      </section>

      {/* ── CTA / INTEREST FORM ── */}
      <section className="mx-auto max-w-lg px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass rounded-2xl p-8 text-center">
          {submitted ? (
            <div>
              <span className="text-5xl mb-4 block">🎉</span>
              <h2 className="mb-2 text-2xl font-bold">Thank you!</h2>
              <p className="text-muted">We&apos;ll reach out to you soon with early access.</p>
            </div>
          ) : !showForm ? (
            <>
              <h2 className="mb-3 text-2xl font-bold">Apne myBillBook data se sawaal poochho</h2>
              <p className="mb-6 text-muted">Early access ke liye apna number dein. Hum aapko jaldi se jaldi access denge.</p>
              <button onClick={() => setShowForm(true)}
                className="w-full rounded-xl bg-accent py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-accent-light">
                I want early access
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <h2 className="mb-2 text-xl font-bold text-center">Get Early Access</h2>
              <div>
                <label className="text-sm text-muted mb-1 block">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Aapka naam" className="w-full rounded-lg bg-white/[0.04] border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-accent/50" />
              </div>
              <div>
                <label className="text-sm text-muted mb-1 block">Phone Number *</label>
                <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] border border-glass-border px-4 py-3">
                  <span className="text-sm text-zinc-400">+91</span>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    placeholder="9876543210" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-zinc-600 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted mb-1 block">Company / Shop Name</label>
                <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Aapki dukaan ka naam" className="w-full rounded-lg bg-white/[0.04] border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-accent/50" />
              </div>
              <button type="submit" disabled={formData.phone.length < 10}
                className="w-full rounded-xl bg-accent py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed">
                Request Early Access
              </button>
              <p className="text-center text-xs text-zinc-600">No spam. Sirf early access notification.</p>
            </form>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-sm text-zinc-600">A product by FloBiz</p>
      </footer>
    </div>
  );
}

# myVoiceBooksAI

Voice-first analytics for Indian SMBs — speak in Hindi, get instant business answers with auto-generated charts.

**Live demo:** [mvb.sarthakgoel.cv](https://mvb.sarthakgoel.cv)

## Why

50M invoices in myBillBook, zero self-serve analytics. Shop owners manage inventory while serving customers — they can't type on a phone while packing orders. Built a voice app where users speak in Hindi ("aaj kitni sales hui?") and get instant answers backed by real Snowflake data.

## How

1. User opens the app, authenticates via OTP (phone number verified against myBillBook)
2. Dashboard loads instantly (300ms) with KPI cards — Sales Today, Revenue, Receivables, Top Product
3. User holds mic button, speaks in Hindi or English
4. Speech-to-text converts voice to text, LLM translates to SQL, Snowflake returns data
5. Answer displayed with auto-generated charts (bar, line, pie, table) + read aloud via ElevenLabs TTS
6. Follow-up questions work in context ("inme se kitne paid the?")

## Features

| Feature | Description |
|---|---|
| Voice-First | Hold mic, speak in Hindi or English. Answer in 2-3 seconds |
| 300ms Dashboard | KPI cards load via direct SQL — zero LLM cost for standard views |
| Auto Charts | Bar, line, pie, table charts generated automatically from data |
| Follow-ups | Multi-turn conversations with context preservation |
| OTP Auth | Phone number verified against myBillBook user database |
| Hindi + English | Regional language support via LLM translation |
| ElevenLabs TTS | Answers read aloud — hands-free operation |

## Tech

| Component | Technology |
|---|---|
| Frontend | React + Vite, TypeScript, Recharts |
| Voice | Web Speech API (STT) + ElevenLabs (TTS) |
| Backend | Express.js, flo-analytics-llm SDK |
| Data | Snowflake data warehouse |
| Auth | OTP via myBillBook API |
| Deploy | Render (demo), Vercel (case study) |

## Case Study

Full case study with architecture decisions, screenshots, and technical deep-dive:
[mvb.sarthakgoel.cv](https://mvb.sarthakgoel.cv)

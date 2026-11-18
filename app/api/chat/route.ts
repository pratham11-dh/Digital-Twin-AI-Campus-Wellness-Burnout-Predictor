import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import User from "@/models/userModel";
import MoodLog from "@/models/moodLog";
import { getUserFromRequest } from "@/controllers/authController";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const userId = await getUserFromRequest(req);
    if (!userId) return NextResponse.json({ success: false }, { status: 401 });

    const { message, history } = await req.json();
    if (!message?.trim()) return NextResponse.json({ success: false }, { status: 400 });

    const [user, logs] = await Promise.all([
      User.findById(userId).select("name academic goals"),
      MoodLog.find({ userId }).sort({ createdAt: -1 }).limit(3).select("scores dailySnapshot createdAt answers.stress_context"),
    ]);

    if (!user) return NextResponse.json({ success: false }, { status: 404 });

    // Compact context summary — only what's needed for advice
    const recentLogs = logs.map(l => {
      const d = new Date(l.createdAt).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
      const snap = l.dailySnapshot;
      return `${d}: stress=${l.scores.stress}, burnout=${l.scores.burnout}, anxiety=${l.scores.anxiety}, sleep≈${snap?.sleepHours ?? "?"}, tasks=${snap?.assignmentCount ?? "?"}, pendingHrs=${snap?.pendingHours?.toFixed(1) ?? "?"}${l.answers?.stress_context ? `, context="${l.answers.stress_context}"` : ""}`;
    }).join("\n");

    const latestScores = logs[0]?.scores;
    const latestSnap   = logs[0]?.dailySnapshot;

    const systemPrompt = `You are the user's Digital Twin AI — a smart, calm, personal assistant that knows their academic profile and mental health data.

STUDENT PROFILE:
Name: ${user.name}
Branch: ${user.academic?.branch ?? "Unknown"} | Semester: ${user.academic?.semester ?? "Unknown"} | CGPA: ${user.academic?.currentCGPA ?? "Unknown"}
Goals: ${user.goals?.selectedGoals?.join(", ") || "Not set"}

LATEST STATE${latestScores ? ` (most recent check-in)` : " (no check-ins yet)"}:
${latestScores ? `Stress: ${latestScores.stress}/100 | Burnout: ${latestScores.burnout}/100 | Anxiety: ${latestScores.anxiety}/100 | Wellbeing: ${latestScores.wellbeing}/100` : "No check-in data yet."}
${latestSnap ? `Sleep score: ${latestSnap.sleepHours}/100 | Pending tasks: ${latestSnap.assignmentCount} (~${latestSnap.pendingHours?.toFixed(1)}h of work)` : ""}

RECENT HISTORY (last ${logs.length} check-ins):
${recentLogs || "None yet."}

RULES:
- Be concise (2–4 sentences max unless user asks for a plan/schedule)
- Be specific — reference their actual scores, goals, or context when relevant
- Sound like a smart friend, not a therapist or a bot
- Give actionable advice: what to do, when, how
- If they ask for a plan or schedule, use a short numbered list
- Never be generic or preachy
- If no check-in data exists, still help but mention they should do a check-in for personalised advice`;

    // Build Groq messages array from conversation history
    const chatHistory = (history || []).map((m: { role: string; text: string }) => ({
      role: (m.role === "ai" ? "assistant" : "user") as "user" | "assistant",
      content: m.text,
    }));

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory,
        { role: "user", content: message },
      ],
      max_tokens: 512,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content?.trim() ?? "I'm having trouble connecting right now. Try again in a moment.";

    return NextResponse.json({ success: true, reply });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ success: false, reply: "I'm having trouble connecting right now. Try again in a moment." });
  }
}

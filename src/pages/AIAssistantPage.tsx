import React, { useState } from "react";
import { Plus, Send, Sparkles, MessageSquare, CheckCircle2 } from "lucide-react";
import { useProject, type ChatMessage } from "../context/ProjectContext";
import { generateAssistantReply, type AssistantPatchSuggestion } from "../services/aiAssistantService";
import TransparencyBanner from "../components/common/TransparencyBanner";
import { formatCurrency } from "../services/currencyService";

const SUGGESTED_PROMPTS = [
  "I have 2400 sq.ft. land. I want to build a modern two-floor house with four bedrooms and three bathrooms. My budget is ₹60 lakhs.",
  "How can I optimize my construction budget without reducing bedrooms?",
  "Recommend cost-saving materials for walls, flooring, and windows.",
  "Suggest an interior & exterior style direction for my house.",
];

export default function AIAssistantPage() {
  const {
    conversations,
    setConversations,
    activeThreadId,
    setActiveThreadId,
    landInfo,
    constructionConfig,
    setConstructionConfig,
    houseDesignInput,
    setHouseDesignInput,
    currency,
    constructionResult,
    generateDreamHouse,
    startNewProjectAtStep,
  } = useProject();

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const activeThread =
    conversations.find((t) => t.id === activeThreadId) || conversations[0];

  const handleNewConversation = () => {
    const newId = `thread-${Date.now()}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setConversations((prev) => [
      {
        id: newId,
        title: `Planning Session ${prev.length + 1}`,
        updatedAt: timeStr,
        messages: [
          {
            id: `welcome-${newId}`,
            role: "assistant",
            isDemoAssistant: true,
            timestamp: timeStr,
            text:
              "Hello! I'm your SquareFootIQ AI House Planning Assistant.\n\n" +
              "I can help you turn your ideas into architectural concepts, floor plans, and construction budget estimates.",
          },
        ],
      },
      ...prev,
    ]);
    setActiveThreadId(newId);
  };

  const sendMessage = (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || typing) return;

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: now,
    };

    setConversations((prev) =>
      prev.map((thread) =>
        thread.id === activeThread.id
          ? {
              ...thread,
              title:
                thread.messages.length <= 1
                  ? trimmed.slice(0, 34) + (trimmed.length > 34 ? "..." : "")
                  : thread.title,
              updatedAt: now,
              messages: [...thread.messages, userMsg],
            }
          : thread
      )
    );
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply = generateAssistantReply(trimmed, {
        landAreaSqFt: constructionResult.landAreaSqFt,
        country: landInfo.country,
        city: landInfo.city,
        buildingType: constructionConfig.buildingType,
        floors: constructionConfig.floors,
        bedrooms: constructionConfig.bedrooms,
        bathrooms: constructionConfig.bathrooms,
        style: houseDesignInput.style,
        quality: constructionConfig.quality,
        targetBudget: constructionConfig.targetBudget,
        currency,
        costResult: constructionResult,
      });

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        isDemoAssistant: true,
        text: reply.text,
        suggestion: reply.suggestion,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setConversations((prev) =>
        prev.map((thread) =>
          thread.id === activeThread.id
            ? { ...thread, messages: [...thread.messages, assistantMsg] }
            : thread
        )
      );
      setTyping(false);
    }, 450);
  };

  const applySuggestion = (msgId: string, suggestion: AssistantPatchSuggestion) => {
    if (suggestion.patch.quality) {
      setConstructionConfig((prev) => ({
        ...prev,
        quality: suggestion.patch.quality || prev.quality,
      }));
    }
    if (suggestion.patch.style) {
      setHouseDesignInput((prev) => ({
        ...prev,
        style: suggestion.patch.style || prev.style,
      }));
    }
    if (suggestion.patch.promptAppend) {
      setHouseDesignInput((prev) => ({
        ...prev,
        prompt: prev.prompt.includes(suggestion.patch.promptAppend || "")
          ? prev.prompt
          : `${prev.prompt} ${suggestion.patch.promptAppend}`,
      }));
    }

    setConversations((prev) =>
      prev.map((thread) =>
        thread.id === activeThread.id
          ? {
              ...thread,
              messages: thread.messages.map((m) =>
                m.id === msgId ? { ...m, applied: true } : m
              ),
            }
          : thread
      )
    );
  };

  return (
    <div className="space-y-5 animate-editorial">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-[#6E5A88]">SquareFootIQ · Conversational Planning</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#261E31]">
            SquareFootIQ AI House Planning Assistant
          </h2>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => startNewProjectAtStep(1)}
            className="px-4 py-2.5 rounded-xl border border-[#CDC4DC] bg-white text-xs font-bold text-[#261E31] hover:bg-[#CDC4DC]/30"
          >
            Edit Project Inputs
          </button>
          <button
            type="button"
            onClick={generateDreamHouse}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6E5A88] text-white text-xs font-bold hover:opacity-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate My Dream House</span>
          </button>
        </div>
      </div>

      <TransparencyBanner
        title="Demo Planning Assistant Notice"
        message="This interface uses a modular frontend rule-based planning engine grounded in your entered project details—no external ChatGPT, Gemini, or backend AI API is connected yet. Suggested changes are only applied when you explicitly click Apply."
      />

      {/* Chat Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-[#CDC4DC] bg-white overflow-hidden min-h-[620px]">
        {/* Left Conversations Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3 border-b lg:border-b-0 lg:border-r border-[#CDC4DC] bg-[#CDC4DC]/25 p-4 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleNewConversation}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6E5A88] text-white text-xs font-bold hover:opacity-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </button>

            <div className="space-y-1.5 pt-2">
              <p className="text-[11px] font-bold text-[#6E5A88] px-1">Session Conversations</p>
              {conversations.map((thread) => {
                const active = thread.id === activeThread.id;
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors flex items-start gap-2 ${
                      active
                        ? "bg-white border border-[#6E5A88] text-[#261E31] font-bold"
                        : "hover:bg-white/70 text-[#4A3D5C]"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#6E5A88]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate">{thread.title}</p>
                      <p className="text-[10px] opacity-75 mt-0.5">{thread.updatedAt}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl bg-white border border-[#CDC4DC] p-3.5 text-xs space-y-1">
            <p className="font-bold text-[#6E5A88]">Active Project Context</p>
            <p className="text-[#261E31] tabular-nums">
              {constructionResult.landAreaSqFt.toLocaleString()} sq. ft. · {constructionConfig.floors}F{" "}
              {houseDesignInput.style}
            </p>
            <p className="text-[#4A3D5C] tabular-nums">
              {constructionConfig.bedrooms} Bed · {constructionConfig.bathrooms} Bath · Target{" "}
              {formatCurrency(constructionConfig.targetBudget, currency, true)}
            </p>
          </div>
        </aside>

        {/* Main Chat Panel */}
        <section className="lg:col-span-8 xl:col-span-9 flex flex-col justify-between bg-[#F3EEF8]/35">
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[460px]">
            {activeThread.messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-2xl rounded-2xl px-4 py-3.5 text-sm leading-relaxed whitespace-pre-line ${
                      isUser
                        ? "bg-[#6E5A88] text-white"
                        : "bg-white border border-[#CDC4DC] text-[#261E31]"
                    }`}
                  >
                    {msg.text}

                    {msg.suggestion && (
                      <div className="mt-4 pt-3 border-t border-[#CDC4DC] flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-[#4A3D5C]">
                          <p className="font-bold text-[#6E5A88]">Optional Suggestion</p>
                          <p>{msg.suggestion.description}</p>
                        </div>
                        {msg.applied ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6E5A88]">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Applied to Project</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => applySuggestion(msg.id, msg.suggestion!)}
                            className="px-3.5 py-2 rounded-lg bg-[#6E5A88] text-white text-xs font-bold hover:opacity-95 shrink-0"
                          >
                            {msg.suggestion.label}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-[#4A3D5C] mt-1 px-1">{msg.timestamp}</span>
                </div>
              );
            })}

            {typing && (
              <div className="flex items-start">
                <div className="bg-white border border-[#CDC4DC] rounded-2xl px-4 py-3 text-xs text-[#6E5A88] italic">
                  SquareFootIQ is preparing planning suggestions...
                </div>
              </div>
            )}
          </div>

          {/* Suggested Prompts + Input */}
          <div className="border-t border-[#CDC4DC] bg-white p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="text-left text-xs px-3 py-1.5 rounded-lg bg-[#F3EEF8] border border-[#CDC4DC] text-[#261E31] hover:bg-[#CDC4DC]/40 transition-colors"
                >
                  {prompt.length > 68 ? `${prompt.slice(0, 68)}...` : prompt}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex gap-2.5"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your house idea, ask for room layouts, or request budget-saving options..."
                className="flex-1 rounded-xl border border-[#CDC4DC] px-4 py-3 text-sm bg-[#F3EEF8]/40 focus:outline-none focus:ring-2 focus:ring-[#6E5A88]"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="px-5 py-3 rounded-xl bg-[#6E5A88] text-white text-sm font-bold hover:opacity-95 disabled:opacity-45 flex items-center gap-2 shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

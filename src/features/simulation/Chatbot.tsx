"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Message = {
  role: "user" | "model";
  parts: { text: string }[];
};

const PREFILLED_QUESTIONS = [
  "What is VVPAT?",
  "How to register to vote?",
  "What are the key stages of an Indian election?",
  "How are EVMs secured?",
];

import { useSimulationStore } from "@/stores/useSimulationStore";

export function Chatbot() {
  const { userProfile } = useSimulationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      parts: [{ text: "Hello! I am your AI assistant for Indian Politics & Elections. How can I help you today?" }]
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", parts: [{ text }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          history: messages.map(m => ({ role: m.role, parts: m.parts })),
          userProfile
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || "Network response was not ok");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        setMessages((prev) => [...prev, { role: "model", parts: [{ text: "" }] }]);
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          
          setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg.role === "model") {
              const updatedMsg = { ...lastMsg, parts: [{ text: lastMsg.parts[0].text + chunk }] };
              return [...prev.slice(0, -1), updatedMsg];
            }
            return prev;
          });
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "model", parts: [{ text: "Sorry, I encountered an error while processing your request." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="icon"
              className="w-14 h-14 rounded-full shadow-2xl bg-indigo-600 hover:bg-indigo-700 text-white"
              aria-label="Open AI Assistant"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-2xl border-indigo-500/20 bg-background/95 backdrop-blur-xl flex flex-col h-[600px] max-h-[calc(100vh-6rem)]">
              <CardHeader className="p-4 border-b bg-indigo-500/10 flex flex-row items-center justify-between space-y-0 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-indigo-100">Election Assistant</CardTitle>
                    <p className="text-xs text-indigo-300">Powered by Gemini AI</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-zinc-400 hover:text-white" 
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Assistant"
                >
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4 pb-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role === "model" && (
                        <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-indigo-400" />
                        </div>
                      )}
                      <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                        msg.role === "user" 
                          ? "bg-indigo-600 text-white rounded-tr-sm" 
                          : "bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-tl-sm"
                      }`}>
                        {msg.parts[0].text}
                      </div>
                      {msg.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-zinc-300" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-zinc-800 border border-zinc-700 rounded-tl-sm flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-3 bg-zinc-900/50 border-t border-zinc-800">
                <ScrollArea className="w-full pb-2">
                  <div className="flex gap-2 whitespace-nowrap">
                    {PREFILLED_QUESTIONS.map((q, i) => (
                      <Button
                        key={i}
                        variant="secondary"
                        size="sm"
                        className="rounded-full text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 whitespace-nowrap"
                        onClick={() => handleSend(q)}
                        disabled={isLoading}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                
                <div className="flex gap-2 mt-2">
                  <input
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-500"
                    placeholder="Ask about Indian elections..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={() => handleSend()} 
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="rounded-full bg-indigo-600 hover:bg-indigo-700 shrink-0"
                    aria-label="Send Message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

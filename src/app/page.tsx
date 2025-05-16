"use client";

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Bot } from 'lucide-react'; // Using Bot icon for app logo
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

export default function GeminiFlowPage() {
  const [isGeminiEnabled, setIsGeminiEnabled] = useState(true);

  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 selection:bg-primary/30 selection:text-primary-foreground">
      <header className="w-full max-w-3xl my-6 md:my-8">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-card rounded-lg shadow-md space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <Bot className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-primary">GeminiFlow</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="gemini-toggle"
              checked={isGeminiEnabled}
              onCheckedChange={setIsGeminiEnabled}
              aria-label="Toggle Gemini AI"
            />
            <Label htmlFor="gemini-toggle" className="text-sm font-medium cursor-pointer">
              Enable Gemini
            </Label>
          </div>
        </div>
      </header>

      <main className="w-full max-w-3xl flex-1 flex flex-col mb-6 md:mb-8">
        <ChatInterface isGeminiEnabled={isGeminiEnabled} />
      </main>

      <footer className="w-full max-w-3xl text-center">
        <p className="text-xs text-muted-foreground">
          Powered by Gemini AI.
        </p>
      </footer>
      <Toaster />
    </div>
  );
}

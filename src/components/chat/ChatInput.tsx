"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isGeminiEnabled: boolean;
}

export function ChatInput({ onSendMessage, isLoading, isGeminiEnabled }: ChatInputProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading || !isGeminiEnabled) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const canSubmit = !isLoading && inputText.trim() !== '' && isGeminiEnabled;

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
      <Input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder={isGeminiEnabled ? "Type your message here..." : "Gemini AI is disabled"}
        className="flex-1 text-sm rounded-lg focus-visible:ring-primary/50"
        disabled={isLoading || !isGeminiEnabled}
        aria-label="Chat message input"
      />
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="submit"
              size="icon"
              disabled={!canSubmit}
              aria-label="Send message"
              className="rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-60 disabled:bg-accent/80"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{canSubmit ? "Send message" : !isGeminiEnabled ? "Gemini is disabled" : isLoading ? "Processing..." : "Enter a message"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </form>
  );
}


"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea'; // Changed from Input
import { Button } from '@/components/ui/button';
import { SendHorizontal, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isGeminiEnabled: boolean;
}

const MIN_TEXTAREA_HEIGHT_PX = 40; // Corresponds to h-10 or min-h-[40px]
const MAX_TEXTAREA_HEIGHT_PX = 160; // Corresponds to max-h-40 or max-h-[160px]

export function ChatInput({ onSendMessage, isLoading, isGeminiEnabled }: ChatInputProps) {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessageAndClearInput = () => {
    if (!inputText.trim() || isLoading || !isGeminiEnabled) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageAndClearInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessageAndClearInput();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to intrinsic height based on content, respecting CSS min/max height
      textareaRef.current.style.height = '0px'; // Temporarily shrink to accurately measure scrollHeight
      const scrollHeight = textareaRef.current.scrollHeight;

      if (scrollHeight > MAX_TEXTAREA_HEIGHT_PX) {
        textareaRef.current.style.height = `${MAX_TEXTAREA_HEIGHT_PX}px`;
        textareaRef.current.style.overflowY = 'auto';
      } else {
        textareaRef.current.style.height = `${Math.max(scrollHeight, MIN_TEXTAREA_HEIGHT_PX)}px`;
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  }, [inputText]);
  
  // Effect to reset textarea height when input is cleared (e.g., after sending a message)
  useEffect(() => {
    if (inputText === '' && textareaRef.current) {
        // Set to min height or auto to let CSS min-height take effect
        textareaRef.current.style.height = `${MIN_TEXTAREA_HEIGHT_PX}px`; 
        textareaRef.current.style.overflowY = 'hidden';
    }
  }, [inputText]);


  const canSubmit = !isLoading && inputText.trim() !== '' && isGeminiEnabled;

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
      <Textarea
        ref={textareaRef}
        rows={1} // Start as a single line
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isGeminiEnabled ? "Type your message here... (Shift+Enter for new line)" : "Gemini AI is disabled"}
        className="flex-1 text-sm rounded-lg focus-visible:ring-primary/50 min-h-[40px] max-h-[160px] resize-none overflow-y-hidden py-2.5" // py-2.5 to better match Input's visual height with text-sm
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
              className="rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-60 disabled:bg-accent/80 self-end" // Align button to bottom if textarea grows
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

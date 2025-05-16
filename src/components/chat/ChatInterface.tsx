"use client";

import React, { useState, useRef, useEffect } from 'react';
import { generateChatResponse, type GenerateChatResponseInput } from '@/ai/flows/generate-chat-response';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


export interface Message {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  isGeminiEnabled: boolean;
}

export function ChatInterface({ isGeminiEnabled }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Add initial greeting message on mount
    setMessages([
      { 
        id: 'initial-ai-greeting', 
        role: 'ai', 
        content: "Hello! I'm GeminiFlow. How can I assist you today?", 
        timestamp: new Date() 
      }
    ]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      // The viewport is the first child div of the ScrollArea component
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (inputText: string) => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    if (isGeminiEnabled) {
      setIsLoading(true);
      try {
        const input: GenerateChatResponseInput = { message: inputText };
        const aiResponse = await generateChatResponse(input);
        const aiMessage: Message = {
          id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: 'ai',
          content: aiResponse.response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (e: any) {
        console.error("Error generating AI response:", e);
        const errorMessageContent = `Error: Could not get response from AI. ${e.message || 'Unknown error'}`;
        const errorMessage: Message = {
          id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          role: 'system',
          content: errorMessageContent,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        toast({
          variant: "destructive",
          title: "AI Error",
          description: errorMessageContent,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      const systemMessage: Message = {
        id: `system-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'system',
        content: "Gemini AI is currently disabled. Your message was not sent to the AI.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, systemMessage]);
       toast({
        title: "Gemini Disabled",
        description: "Gemini AI is currently disabled. Enable it to chat.",
      });
    }
  };

  return (
    <Card className="w-full flex-1 flex flex-col shadow-xl rounded-lg overflow-hidden bg-card">
      <CardHeader className="border-b">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquareText className="h-6 w-6 text-primary" />
          Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-start space-x-3 mr-auto">
                 <ChatMessage 
                  key="ai-typing" 
                  message={{id: 'ai-typing', role: 'ai', content: 'Thinking...', timestamp: new Date()}} 
                  isTyping={true}
                />
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          isGeminiEnabled={isGeminiEnabled}
        />
      </CardFooter>
    </Card>
  );
}

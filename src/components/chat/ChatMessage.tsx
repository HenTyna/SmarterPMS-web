"use client";

import type { Message } from './ChatInterface';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, AlertTriangle, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

export function ChatMessage({ message, isTyping = false }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isAI = message.role === 'ai';
  const isSystem = message.role === 'system';

  const avatarIcon = isUser ? <User className="h-5 w-5" /> : isAI ? <Bot className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />;
  
  const avatarClasses = cn(
    "flex items-center justify-center h-full w-full rounded-full",
    isAI ? "bg-primary text-primary-foreground" : 
    isSystem ? "bg-destructive text-destructive-foreground" : 
    "bg-accent text-accent-foreground"
  );

  const bubbleClasses = cn(
    "p-3 rounded-lg shadow-sm max-w-full break-words",
    isUser ? "bg-primary text-primary-foreground rounded-br-none" :
    isAI ? "bg-card border border-border text-card-foreground rounded-bl-none" :
    "bg-destructive/10 text-destructive border border-destructive rounded-bl-none"
  );
  
  const timeStampClasses = cn(
    "text-xs mt-1.5",
     isUser ? "text-primary-foreground/70 text-right" : 
     isAI ? "text-muted-foreground text-left" : 
     "text-destructive/80 text-left"
  );


  return (
    <div
      className={cn(
        "flex items-end space-x-3 max-w-[80%]",
        isUser ? "ml-auto flex-row-reverse space-x-reverse" : "mr-auto"
      )}
    >
      <Avatar className="h-8 w-8 shrink-0 shadow-sm">
        <AvatarFallback className={avatarClasses}>
          {avatarIcon}
        </AvatarFallback>
      </Avatar>
      <div className={bubbleClasses}>
        {isTyping ? (
            <div className="flex items-center space-x-1">
              <MoreHorizontal className="h-5 w-5 animate-pulse text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{message.content}</p>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}
        {!isTyping && (
            <p className={timeStampClasses}>
              {format(message.timestamp, 'p')}
            </p>
        )}
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Send, X, Smile } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onTyping?: () => void;
  replyingTo?: {
    username: string;
    message: string;
  } | null;
  onCancelReply?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onTyping,
  replyingTo,
  onCancelReply,
  placeholder = 'Type a message...',
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  // Focus textarea on mount and when replying
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [replyingTo, disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Emit typing indicator
    if (onTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onTyping();
      typingTimeoutRef.current = setTimeout(() => {
        // Could emit "stopped typing" here if needed
      }, 3000);
    }
  };

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;

    onSendMessage(trimmedMessage);
    setMessage('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-card">
      {/* Reply Preview */}
      {replyingTo && (
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-l-4 border-primary">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-foreground">Replying to {replyingTo.username}</div>
            <div className="text-xs text-muted-foreground truncate">{replyingTo.message}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0"
            onClick={onCancelReply}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2 p-4">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              maxHeight: '200px',
              minHeight: '44px',
            }}
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="h-11 w-11 flex-shrink-0"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Hint Text */}
      <div className="px-4 pb-2">
        <p className="text-xs text-muted-foreground">
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send,{' '}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Shift</kbd> +{' '}
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
};

export default ChatInput;


import React, { useState } from 'react';
import { GrokIcon } from './icons';
import { X } from 'lucide-react';
import { CustomButton } from './ui/custom-button';

type Message = {
  id: string;
  text: string;
  fromUser: boolean;
  timestamp: Date;
};

const GrokChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Grok, your AI assistant. How can I help you today with your freelancing needs?",
      fromUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (input.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        text: input,
        fromUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      
      // Simulate Grok response (in a real app, this would call the Grok API)
      setTimeout(() => {
        const responses = [
          "I can help you find relevant jobs based on your skills and experience.",
          "Would you like me to help draft a professional proposal for this job?",
          "I can analyze this client's requirements and suggest approach strategies.",
          "Need help setting a competitive rate for this project? I can analyze market trends."
        ];
        
        const grokResponse: Message = {
          id: Date.now().toString(),
          text: responses[Math.floor(Math.random() * responses.length)],
          fromUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, grokResponse]);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-white text-accent scale-0' : 'bg-accent text-white scale-100'
        }`}
      >
        <GrokIcon className="w-6 h-6" />
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-0 right-0 md:right-6 md:bottom-6 z-50 w-full md:w-96 bg-white rounded-t-lg md:rounded-lg shadow-xl transition-transform duration-300 transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-[calc(100%+24px)]'
        }`}
        style={{ maxHeight: 'calc(100vh - 100px)' }}
      >
        {/* Header */}
        <div className="bg-accent px-4 py-3 flex items-center justify-between rounded-t-lg">
          <h3 className="text-lg font-medium text-white flex items-center">
            <GrokIcon className="w-5 h-5 mr-2" />
            Grok AI Assistant
          </h3>
          <button onClick={toggleChat} className="text-white hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="p-4 h-80 overflow-y-auto">
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${
                  message.fromUser
                    ? 'bg-primary/10 ml-auto'
                    : 'bg-gray-100'
                } p-3 rounded-lg max-w-[80%]`}
              >
                <p className="text-sm text-gray-800">{message.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Grok anything..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <CustomButton variant="accent" onClick={handleSend}>
              Send
            </CustomButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default GrokChatButton;

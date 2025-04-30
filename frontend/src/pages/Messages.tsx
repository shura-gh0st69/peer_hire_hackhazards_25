import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/services/DataService';
import type { Conversation, Message } from '@/types';
import { CustomButton } from '@/components/ui/custom-button';
import { Send, Paperclip, UserIcon } from 'lucide-react';
import { GroqIcon } from '@/components/icons';
import { toast } from 'sonner';

export const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showGroqSuggestions, setShowGroqSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const conversationsData = await dataService.getConversations(user.id);
        setConversations(conversationsData);

        // Set first conversation as current if none selected
        if (conversationsData.length > 0 && !currentConversation) {
          setCurrentConversation(conversationsData[0]);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast.error('Failed to load conversations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [user?.id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentConversation?.id) return;

      try {
        const messagesData = await dataService.getMessages(currentConversation.id);
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      }
    };

    fetchMessages();
  }, [currentConversation?.id]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, send the message to backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 flex flex-col md:flex-row h-[calc(100vh-180px)]">
          {/* Conversation List */}
          <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-lg">Messages</h2>
            </div>
            <div className="overflow-y-auto flex-grow">
              {conversations.map(conversation => (
                <div
                  key={conversation.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${currentConversation?.id === conversation.id ? 'bg-primary/5' : ''
                    }`}
                  onClick={() => setCurrentConversation(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                      {conversation.user && conversation.user.avatar ? (
                        <img src={conversation.user.avatar} alt={conversation.user.name} className="h-10 w-10 rounded-full" />
                      ) : (
                        <UserIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium text-gray-900 truncate">
                          {conversation.user ? conversation.user.name : 'Unknown'}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessage?.timestamp || ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage?.content || ''}
                      </p>
                    </div>
                    {conversation.lastMessage?.unread && (
                      <span className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-2"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Area */}
          <div className="flex-grow flex flex-col">
            {/* Conversation Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                  {currentConversation?.user?.avatar ? (
                    <img
                      src={currentConversation.user.avatar}
                      alt={currentConversation.user.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {currentConversation?.user?.name || 'Unknown'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {user?.role === 'client' ? 'Freelancer' : 'Client'} •
                    {currentConversation?.user?.online ? ' Online' : ' Last active recently'}
                  </p>
                </div>
              </div>
              <div>
                <button
                  className={`p-2 rounded-full ${showGroqSuggestions ? 'bg-accent/20' : 'hover:bg-gray-100'}`}
                  onClick={() => setShowGroqSuggestions(!showGroqSuggestions)}
                >
                  <GroqIcon className="w-5 h-5 text-accent" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.sender === 'self' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${message.sender === 'self'
                    ? 'bg-primary text-white rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-lg'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm rounded-tr-lg rounded-br-lg rounded-bl-lg'
                    } px-4 py-3 shadow-sm`}>
                    <p className="text-sm">{message.content}</p>
                    <span className={`text-xs mt-1 block ${message.sender === 'self' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Groq Suggestions */}
            {showGroqSuggestions && (
              <div className="p-3 bg-accent/5 border-t border-accent/10">
                <div className="flex items-start space-x-2">
                  <GroqIcon className="w-5 h-5 text-accent mt-0.5" />
                  <div className="text-sm">
                    <span className="font-medium text-accent">Message suggestions:</span>
                    <div className="mt-2 space-y-2">
                      {[
                        "Could you share some examples of your previous React projects?",
                        "What's your estimated timeline for completing this milestone?",
                        "My budget for this project is 2,000 USDC. Is this within your range?",
                        "Here's a breakdown of the project requirements..."
                      ].map((suggestion, i) => (
                        <button
                          key={i}
                          className="block w-full text-left p-2 rounded hover:bg-accent/10 transition-colors"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end space-x-2">
                <div className="flex-grow">
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Type your message..."
                    rows={2}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <CustomButton
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Send
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

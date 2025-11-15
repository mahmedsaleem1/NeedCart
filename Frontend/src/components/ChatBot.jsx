import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// Helper function to format Gemini response with markdown-like styling
const formatMessage = (text) => {
  // Split by code blocks first
  const parts = text.split(/(```[\s\S]*?```)/);
  
  return parts.map((part, index) => {
    // Handle code blocks
    if (part.startsWith('```') && part.endsWith('```')) {
      const code = part.slice(3, -3).trim();
      const lines = code.split('\n');
      const language = lines[0].trim();
      const codeContent = lines.slice(1).join('\n') || lines[0];
      
      return (
        <div key={index} className="my-2 bg-gray-900 rounded-md overflow-hidden">
          {language && language.length < 20 && (
            <div className="bg-gray-800 px-3 py-1 text-xs text-gray-300 font-mono">
              {language}
            </div>
          )}
          <pre className="p-3 overflow-x-auto">
            <code className="text-sm text-green-400 font-mono">
              {language.length < 20 ? codeContent : code}
            </code>
          </pre>
        </div>
      );
    }
    
    // Handle regular text with formatting
    const formatted = part
      .split('\n')
      .map((line, lineIndex) => {
        // Bold text
        line = line.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
        
        // Bullet points
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
          return `<li class="ml-4">${line.trim().substring(2)}</li>`;
        }
        
        // Numbered lists
        if (/^\d+\.\s/.test(line.trim())) {
          return `<li class="ml-4">${line.trim().replace(/^\d+\.\s/, '')}</li>`;
        }
        
        // Headings
        if (line.startsWith('### ')) {
          return `<h3 class="font-semibold text-base mt-2 mb-1">${line.substring(4)}</h3>`;
        }
        if (line.startsWith('## ')) {
          return `<h2 class="font-semibold text-lg mt-3 mb-1">${line.substring(3)}</h2>`;
        }
        if (line.startsWith('# ')) {
          return `<h1 class="font-bold text-xl mt-3 mb-2">${line.substring(2)}</h1>`;
        }
        
        return line || '<br/>';
      })
      .join('\n');
    
    return (
      <div 
        key={index} 
        dangerouslySetInnerHTML={{ __html: formatted }}
        className="formatted-content"
      />
    );
  });
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your NeedCart assistant. How can I help you today?',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message to chat
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Prepare conversation history (exclude the welcome message)
      const conversationHistory = newMessages
        .slice(1)
        .map((msg) => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        }));

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/chatbot/chat`,
        {
          message: userMessage,
          conversationHistory: conversationHistory.slice(0, -1), // Exclude the current message
        }
      );

      if (response.data.success) {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: response.data.response },
        ]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
          },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I\'m having trouble connecting. Please try again later.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl mb-4 w-96 h-[500px] flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-semibold text-lg">NeedCart Assistant</h3>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:bg-blue-700 rounded-full p-1 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 shadow-md border border-gray-200'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="text-sm prose prose-sm max-w-none">
                      {formatMessage(message.content)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-lg p-3 shadow-md border border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-200 bg-white rounded-b-lg"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Chatbot;

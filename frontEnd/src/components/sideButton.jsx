import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const url = import.meta.env.VITE_BACKEND_URL;
export default function SideChatButton() {
  const { user } = useUser();
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! What would you like to learn?", sender: "bot", timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const apiCall = async (inp) => {
    const user_id = user?.id || "unable to fetch";
    // console.log(user_id);
    const algo = { "Algo_name": inp, "userID": user_id };
    // console.log(algo);
    const response = await fetch(`${url}/make`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(algo)
    });
    const res = await response.json();
    return res;
  };
  const sendMessage = async (e) => {
    e.preventDefault(); // also prevents form reloads if triggered by Enter key
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputValue,
        sender: "user",
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setInputValue(''); // ✅ clear the input immediately

      try {
        const resData = await apiCall(inputValue); // call API with current input
        const newBotMessage = {
          text: `Your ${inputValue} page has been created`,
          sender: "bot",
          timestamp: new Date()
        };
        setTimeout(() => {
          setMessages(prev => [...prev, newBotMessage]);
        }, 1000);

        if (resData?.id) {
          navigate(`/algo/${resData.id}`);
        }
      } catch (e) {
        const errorMessage = {
          text: `Failed to create ${inputValue} page.`,
          sender: "bot",
          timestamp: new Date()
        };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage(e);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Interface */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="font-semibold">Chat Support</span>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); }}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-5 right-22 w-80 p-3 rounded-lg shadow-lg text-center text-sm
          bg-gray-100 text-black
          dark:bg-gray-800 dark:text-white
          transition-all duration-300">
          Need help? Ask me to create an algorithm page for you!
        </div>
      )}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full shadow-lg cursor-pointer flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isOpen
          ? 'bg-gray-600 hover:bg-gray-700'
          : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {isOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <MessageCircle className="text-white" size={24} />
        )}
      </button>

      {/* Notification Badge (optional) */}
      {/*{!isOpen && (*/}
      {/*  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">*/}
      {/*    1*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
}
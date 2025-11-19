import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const url = import.meta.env.VITE_BACKEND_URL;

export default function SideChatButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! What would you like to learn?", sender: "bot" }
  ]);

  const [inputValue, setInputValue] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const apiCall = async (inp) => {
    const user_id = user?.id || "unable to fetch";
    const algo = { Algo_name: inp, userID: user_id };

    const response = await fetch(`${url}/make`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(algo)
    });

    return await response.json();
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // User message
    const userMsg = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    // Show bot typing bubble
    const loadingMsg = {
      id: "loading-bubble",
      sender: "bot",
      loading: true
    };
    setMessages(prev => [...prev, loadingMsg]);
    setIsLoading(true);

    try {
      const resData = await apiCall(userMsg.text);

      // Remove loading bubble
      setMessages(prev => prev.filter(m => m.id !== "loading-bubble"));
      setIsLoading(false);

      // Add real bot message
      const botMsg = {
        id: Date.now(),
        text: `Your ${userMsg.text} page has been created!`,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);

      // Navigate to new page
      if (resData?.id) {
        setTimeout(() => navigate(`/algo/${resData.id}`), 800);
      }

    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== "loading-bubble"));
      setIsLoading(false);

      const errorMsg = {
        id: Date.now(),
        text: `Failed to create ${userMsg.text} page.`,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage(e);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col animate-in slide-in-from-bottom-5 duration-300">

          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="font-semibold">Chat Support</span>
            </div>
            <button onClick={toggleChat} className="hover:text-gray-200">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none"
                  }`}
                >
                  {/* Loading bubble */}
                  {msg.loading ? (
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce delay-150"></span>
                      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce delay-300"></span>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="text-black dark:text-white flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Help Message */}
      {!isOpen && (
        <div className="fixed bottom-5 right-20 w-80 p-3 rounded-lg shadow-lg text-center text-sm bg-gray-100 text-black dark:bg-gray-800 dark:text-white">
          Need help? Ask me to create an algorithm page for you!
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full shadow-lg cursor-pointer flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
          isOpen ? "bg-gray-600 hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isOpen ? <X className="text-white" size={24} /> : <MessageCircle className="text-white" size={24} />}
      </button>

    </div>
  );
}

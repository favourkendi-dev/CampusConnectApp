import React, { useState, useEffect, useRef } from 'react';
import { useChat, useGroups } from '../hooks/useFirestore'; 
import { useAuth } from '../context/AuthContext';

const GroupChat = ({ activeGroupId, activeGroupName }) => {
  const { user } = useAuth();
  const { messages, sendMessage } = useChat(activeGroupId);
  const [text, setText] = useState('');
  
  const scrollRef = useRef();

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    sendMessage(user.uid, user.displayName || "Student", text);
    setText('');
  };

  if (!activeGroupId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <p className="text-lg font-medium">Select a group to start vibing!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
        <h3 className="font-bold text-lg"># {activeGroupName}</h3>
        <span className="text-xs bg-indigo-500 px-2 py-1 rounded-full text-indigo-100">Live</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => {
          const isOwn = msg.senderId === user?.uid;
          return (
            <div key={msg.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
                isOwn 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
              }`}>
                {!isOwn && (
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-indigo-600 mb-1">
                    {msg.senderName}
                  </span>
                )}
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <span className={`text-[9px] mt-1 block text-right ${isOwn ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200 flex gap-2">
        <input 
          type="text" 
          className="flex-1 px-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          placeholder={`Message ${activeGroupName}...`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={!text.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-5 py-2 rounded-full text-sm font-bold transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default GroupChat;
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../hooks/useChat';
import { db, collection, getDocs } from '../firebase/config';
import UserList from '../components/profile/UserList';
import ChatWindow from '../components/chat/ChatWindow';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Chat = () => {
  const { user } = useAuth();
  const {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    loading,
    startConversation,
    sendMessage,
  } = useChat(user?.uid);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const usersData = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((u) => u.id !== user?.uid);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setUsersLoading(false);
      }
    };

    if (user) fetchUsers();
  }, [user]);

  const handleSelectUser = async (selectedUser) => {
    const result = await startConversation([user.uid, selectedUser.id]);
    if (result.success) {
      setActiveConversation({
        id: result.id,
        participants: [user.uid, selectedUser.id],
      });
    }
  };

  const handleSendMessage = async (conversationId, text) => {
    await sendMessage(conversationId, text);
  };

  const handleBack = () => {
    setActiveConversation(null);
  };

  // Merge conversation data with user data for the list
  const chatUsers = users.map((u) => {
    const convo = conversations.find((c) => c.participants.includes(u.id));
    return {
      ...u,
      lastMessage: convo?.lastMessage || '',
      conversationId: convo?.id,
    };
  });

  if (loading || usersLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* User List */}
        <div className={`${activeConversation ? 'hidden md:block' : 'block'} h-full`}>
          <UserList
            users={chatUsers}
            onSelectUser={handleSelectUser}
            selectedUserId={activeConversation?.participants?.find((id) => id !== user?.uid)}
          />
        </div>

        {/* Chat Window */}
        <div className={`${activeConversation ? 'block' : 'hidden md:block'} md:col-span-2 h-full`}>
          {activeConversation ? (
            <ChatWindow
              conversation={activeConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              onBack={handleBack}
            />
          ) : (
            <div className="h-full bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
                <p className="text-gray-500 mt-1">Choose a student to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
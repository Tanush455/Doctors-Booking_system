import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiSend } from "react-icons/fi";
import { useAdminContext } from "../context/AdminContext";

export interface Message {
  _id: string;
  sender: "user" | "admin";
  content: string;
  timestamp: string;
}

interface User {
  _id: string;
  name: string;
  image?: string;
}

const AdminChat = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const {
    backendUrl,
    users,
    unseenMessage,
    admin,
    token,
    message,
    setMessages,
    getMessages,
    markSeenMessages,
    socket,
  } = useAdminContext();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // Listen for real-time incoming messages
  useEffect(() => {
    if (!socket) return;
    
    const handler = (msg: Message & { chatId: string }) => {
      console.log('Received message in chat component:', msg);
      // Only append if this message belongs to the currently open chat
      if (msg.chatId === selectedChat) {
        setMessages((prev) => [...prev, msg]);
        // Mark messages as seen when received
        if (unseenMessage?.[selectedChat]) {
          markSeenMessages(selectedChat);
        }
      }
    };

    socket.on("receiveMessage", handler);
    
    return () => {
      socket.off("receiveMessage", handler);
    };
  }, [socket, selectedChat, setMessages, unseenMessage, markSeenMessages]);

  const handleSelectUser = async (user: User) => {
    console.log('Selecting user:', user._id);
    setSelectedChat(user._id);
    setSelectedUser(user);
    await getMessages(user._id);
    if (unseenMessage?.[user._id]) {
      await markSeenMessages(user._id);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !admin) return;

    try {
      console.log('Sending message to user:', selectedUser._id);
      const response = await axios.post(
        `${backendUrl}/api/v1/message/send`,
        {
          senderRole: "admin",
          senderId: admin._id,
          content: newMessage,
          receiverId: selectedUser._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status === "success") {
        console.log('Message sent successfully:', response.data.message);
        setMessages((prev) => [...prev, response.data.message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat List */}
      <div
        className={`w-full md:w-96 bg-white transform transition-transform ${
          selectedChat ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        }`}
      >
        <div className="p-4 bg-purple-600 text-white">
          <h1 className="text-xl font-bold">User Chats</h1>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          {users?.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedChat === user._id ? "bg-purple-50" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold truncate">{user.name}</h2>
                {(unseenMessage?.[user._id] ?? 0) > 0 && (
                  <span className="bg-purple-600 text-white rounded-full px-2 py-1 text-xs ml-2">
                    {unseenMessage?.[user._id]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {selectedChat && selectedUser && (
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 bg-purple-600 text-white flex items-center">
            <button
              onClick={() => {
                setSelectedChat(null);
                setSelectedUser(null);
                setMessages([]);
              }}
              className="md:hidden mr-4 p-2 hover:bg-purple-700 rounded-full"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <img
              src={selectedUser.image || "/default-avatar.png"}
              alt={selectedUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-4">
              <h2 className="font-semibold">{selectedUser.name}</h2>
              <p className="text-sm opacity-75">Active now</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-2">
            {(message || []).map((msg) => (
              <div
                key={msg._id}
                className={`max-w-xs p-3 rounded-lg shadow text-sm ${
                  msg.sender === "admin"
                    ? "bg-purple-600 text-white self-end ml-auto"
                    : "bg-gray-200 text-gray-800 self-start mr-auto"
                }`}
              >
                <p>{msg.content}</p>
                <p className="mt-1 text-xs opacity-60">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              onClick={handleSendMessage}
              className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChat;

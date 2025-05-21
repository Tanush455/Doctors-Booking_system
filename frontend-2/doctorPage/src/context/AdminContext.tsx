import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

// --- Define Types ---
interface Admin {
  _id: string;
}

interface Message {
  _id: string;
  sender: "user" | "admin";
  content: string;
  timestamp: string;
}

interface AdminContextType {
  backendUrl: string;
  token: string | null;
  setToken: (token: string | null) => void;
  users: User[] | null;
  setUsers: (users: User[] | null) => void;
  message: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  getMessages: (id: string) => Promise<void>;
  getusers: () => Promise<void>;
  markSeenMessages: (id: string) => Promise<void>;
  unseenMessage: Record<string, number> | null;
  admin: Admin | null;
  setAdmin: (admin: Admin | null) => void;
  socket: Socket | null;
  connectSockets: (userData: Admin) => void;
}

interface User {
  _id: string;
  name: string;
  image?: string;
}

// --- Create Context ---
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// --- Provider Props ---
interface AdminContextProviderProps {
  children: ReactNode;
}

export function AdminContextProvider({ children }: AdminContextProviderProps) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [message, setMessages] = useState<Message[]>([]);
  const [unseenMessage, setUnseenMessage] = useState<Record<string, number> | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const [token, setTokenState] = useState<string | null>(() => {
    const storedAuth = localStorage.getItem("authToken");
    if (storedAuth?.startsWith("Bearer ")) {
      return storedAuth.split(" ")[1];
    }
    return storedAuth || null;
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("authToken", `Bearer ${newToken}`);
    } else {
      localStorage.removeItem("authToken");
    }
  };

  // Fetch logged in admin details and connect socket
  const getUser = async () => {
    console.log('AdminContext: getUser running. Token:', token ? 'present' : 'absent');
    if (!token) return;

    try {
      const response = await axios.get(`${backendUrl}/api/v1/admin/getAdmin`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "success") {
        console.log('AdminContext: getUser successful, setting admin data and connecting socket.', response.data.data);
        setAdmin(response.data.data);
        // Socket connection is now handled by the main useEffect based on `admin` state
        connectSockets(response.data.data); // Removed direct call
      }
    } catch (error: any) {
      console.error("AdminContext: Error fetching admin data:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("authToken");
        setToken(null);
        setAdmin(null);
      } else {
        toast.error("Unable to fetch admin data.");
      }
    }
  };

  // Initialize socket connection
  const connectSockets = (userData: Admin) => {
    console.log('AdminContext: connectSockets running for admin:', userData?._id);
    if (!userData) {
      console.log('AdminContext: connectSockets - No user data, returning.');
      return;
    }

    // Disconnect existing socket if present
    if (socket) {
      console.log('AdminContext: Disconnecting existing admin socket before new connection.', socket.id);
      socket.disconnect();
      setSocket(null);
    }

    const newSocket = io(backendUrl, {
      query: { userId: userData._id, role: "admin" },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Socket event handlers
    const handleConnect = () => {
      console.log('AdminContext: Admin Socket connected successfully', newSocket.id);
      newSocket.emit('register', { userId: userData._id, role: 'admin' });
      console.log('AdminContext: Emitted register event for admin:', userData._id);
    };

    const handleReceiveMessage = (msg: Message) => {
      console.log('AdminContext: Admin Received message:', msg);
      setMessages((prev) => [...prev, msg]);
    };

    const handleDisconnect = (reason: Socket.DisconnectReason) => {
      console.log("AdminContext: Admin Socket disconnected:", newSocket.id, "Reason:", reason);
       // Handle potential state updates or re-connection logic if needed
    };

    const handleError = (error: Error) => {
      console.error("AdminContext: Admin Socket error:", error);
       // Handle error, possibly attempt to reconnect or show error message
    };

    // Add event listeners
    newSocket.on('connect', handleConnect);
    newSocket.on('receiveMessage', handleReceiveMessage);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('error', handleError);

    console.log('AdminContext: Setting new admin socket for:', userData._id, newSocket.id);
    setSocket(newSocket);

    // Return cleanup function
    return () => {
      console.log('AdminContext: Cleaning up admin socket listeners for:', userData._id);
      newSocket.off('connect', handleConnect);
      newSocket.off('receiveMessage', handleReceiveMessage);
      newSocket.off('disconnect', handleDisconnect);
      newSocket.off('error', handleError);
      // Do NOT disconnect the socket here, let the main useEffect handle it.
    };
  };

  // Main useEffect to manage socket connection based on admin data and backendUrl
  useEffect(() => {
    console.log('AdminContext useEffect [admin, backendUrl] running. Admin:', admin ? 'present' : 'absent', 'BackendUrl:', backendUrl);
    let cleanup: (() => void) | undefined;
    if (admin) {
      console.log('AdminContext useEffect [admin, backendUrl]: Admin data present, attempting to connect sockets.');
      cleanup = connectSockets(admin);
    }

    // Cleanup function for this effect
    return () => {
      console.log('AdminContext useEffect [admin, backendUrl] cleanup running. Socket:', socket ? 'present' : 'absent');
      cleanup?.(); // Remove event listeners managed by connectSockets

       // Disconnect socket only if it exists and is connected when dependencies change or component unmounts
      if (socket && socket.connected) {
         console.log('AdminContext useEffect [admin, backendUrl] cleanup: Disconnecting socket.');
        socket.disconnect(); 
        setSocket(null);
      } else if (socket && !socket.connected) {
         console.log('AdminContext useEffect [admin, backendUrl] cleanup: Socket exists but not connected, clearing state.');
         setSocket(null); // Clear the socket state if it exists but wasn't connected
      }
    };
  }, [admin, backendUrl]); // Dependency on admin and backendUrl

  // Fetch users chatting with admin
  const getusers = async () => {
    console.log('AdminContext useEffect [token] running (getusers/getUser).');
    if (!token) return;

    try {
      const response = await axios.get(`${backendUrl}/api/v1/message/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success") {
        console.log('AdminContext: getusers successful, setting users data and unseen messages.');
        setUsers(response.data.users);
        setUnseenMessage(response.data.unseenMessages);
      } else {
        toast.error("No user present");
      }
    } catch (error: any) {
      toast.error("No user present");
    }
  };

  // Fetch messages for a specific user
  const getMessages = async (id: string) => {
    console.log('AdminContext useEffect [token] running (getMessages).');
    if (!token) return;

    try {
      const response = await axios.get(`${backendUrl}/api/v1/message/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "success") {
        console.log(response.data);
        setMessages(response.data.messages);
      }
    } catch (error: any) {
      console.error("AdminContext: Error fetching messages:", error);
      toast.error("No message present");
    }
  };

  // Mark messages as seen for a user
  const markSeenMessages = async (id: string) => {
    console.log('AdminContext useEffect [token] running (markSeenMessages).');
    if (!token) return;

    try {
      await axios.get(`${backendUrl}/api/v1/message/mark/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // After marking as seen, update unseen messages locally or refetch
      setUnseenMessage((prev) => {
        if (!prev) return prev;
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (error: any) {
      toast.error("Cannot mark message as seen");
    }
  };

  useEffect(() => {
    console.log('AdminContext useEffect [token] running (getusers/getUser).');
    if (token) {
      getusers();
      getUser();
    }
     return () => console.log('AdminContext useEffect [token] cleanup running (getusers/getUser).');
  }, [token]);

  // Optional debug: log messages updates
  useEffect(() => {
     console.log("AdminContext useEffect [message] running. Messages count:", message.length);
     return () => console.log('AdminContext useEffect [message] cleanup running.');
  }, [message]);

  // Optional debug: log users updates
  useEffect(() => {
      console.log("AdminContext useEffect [users] running. Users count:", users ? users.length : 0);
      return () => console.log('AdminContext useEffect [users] cleanup running.');
  }, [users]);

  const contextValue: AdminContextType = {
    backendUrl,
    token,
    setToken,
    users,
    setUsers,
    message,
    setMessages,
    getMessages,
    getusers,
    markSeenMessages,
    unseenMessage,
    admin,
    setAdmin,
    socket,
    connectSockets,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

// --- Custom Hook ---
export function useAdminContext(): AdminContextType {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdminContext must be used within an AdminContextProvider");
  }
  return context;
}

import React, { useState, useEffect, useRef } from "react";
import { Send, User, Circle } from "lucide-react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001"; // backend URL

export default function ChatApp() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // socket connect
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socket server:", socket.id);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from socket server");
    });

    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("userJoined", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${data.username} joined the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    socket.on("userList", (users) => {
      setOnlineUsers(users);
    });

    socket.on("typing", (data) => {
      setTyping(data.username);
      setTimeout(() => setTyping(""), 2000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleJoin = () => {
    if (username.trim() && socketRef.current) {
      socketRef.current.emit("join", { username: username.trim() });
      setJoined(true);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && socketRef.current && username.trim()) {
      socketRef.current.emit("message", {
        username,
        message: message.trim(),
      });
      setMessage("");
    }
  };

  const handleTyping = () => {
    if (!socketRef.current || !username.trim()) return;
    socketRef.current.emit("typing", { username });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stopTyping", { username });
    }, 1000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ---------------- IF NOT JOINED ----------------
  if (!joined) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          background: "linear-gradient(to bottom right, #e0e7ff, #c7d2fe)",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 32,
            width: "100%",
            maxWidth: 400,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "#4f46e5",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto 20px",
            }}
          >
            <User size={32} color="#fff" />
          </div>

          <h1 style={{ fontSize: 26, marginBottom: 8, color: "#1f2937" }}>
            Join Chat
          </h1>
          <p style={{ color: "#6b7280", marginBottom: 24 }}>
            Enter your name to start chatting
          </p>

          <input
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 10,
              border: "2px solid #d1d5db",
              fontSize: 16,
              outline: "none",
            }}
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleJoin();
            }}
          />

          <button
            onClick={handleJoin}
            disabled={!username.trim()}
            style={{
              width: "100%",
              marginTop: 18,
              padding: "12px 0",
              background: username.trim() ? "#4f46e5" : "#9ca3af",
              cursor: username.trim() ? "pointer" : "not-allowed",
              color: "#fff",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 16,
              border: "none",
            }}
          >
            Join Chat Room
          </button>

          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              color: "#6b7280",
            }}
          >
            <Circle
              size={10}
              style={{
                color: isConnected ? "green" : "red",
                fill: isConnected ? "green" : "red",
              }}
            />
            {isConnected ? "Connected" : "Disconnected"}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- CHAT UI ----------------
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        background: "linear-gradient(to bottom right, #eef2ff, #c7d2fe)",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: 260,
          background: "#fff",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: 18,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: 700,
              color: "#111827",
              fontSize: 18,
            }}
          >
            Online Users
          </h2>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            {onlineUsers.length} online
          </p>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {onlineUsers.map((user, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
                padding: 10,
                borderRadius: 12,
                transition: "0.2s",
                cursor: "pointer",
                background: "#f9fafb",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "#4f46e5",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                {user.username[0].toUpperCase()}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{user.username}</div>
                <div
                  style={{
                    fontSize: 11,
                    color: "green",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Circle size={8} style={{ fill: "green" }} /> Online
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CHAT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* HEADER */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #e5e7eb",
            padding: 18,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
              Chat Room
            </h1>
            <p style={{ margin: 0, color: "#6b7280" }}>
              Welcome, {username} 👋
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "green",
              fontSize: 14,
            }}
          >
            <Circle size={10} style={{ fill: "green" }} /> Connected
          </div>
        </div>

        {/* MESSAGES */}
        <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: msg.system
                  ? "center"
                  : msg.username === username
                  ? "flex-end"
                  : "flex-start",
                marginBottom: 14,
              }}
            >
              {msg.system ? (
                <div
                  style={{
                    background: "#e5e7eb",
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontSize: 12,
                  }}
                >
                  {msg.message}
                </div>
              ) : (
                <div style={{ maxWidth: 330 }}>
                  <div
                    style={{
                      fontSize: 11,
                      marginBottom: 4,
                      color: "#6b7280",
                    }}
                  >
                    {msg.username === username ? "You" : msg.username}
                  </div>

                  <div
                    style={{
                      padding: "10px 14px",
                      background:
                        msg.username === username ? "#4f46e5" : "#fff",
                      color:
                        msg.username === username ? "#fff" : "#111827",
                      borderRadius: 18,
                      boxShadow:
                        msg.username !== username
                          ? "0 2px 5px rgba(0,0,0,0.15)"
                          : "none",
                    }}
                  >
                    <p style={{ margin: 0 }}>{msg.message}</p>
                    <p
                      style={{
                        margin: "6px 0 0",
                        fontSize: 10,
                        opacity: 0.7,
                        textAlign: "right",
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {typing && typing !== username && (
            <p
              style={{
                color: "#6b7280",
                fontStyle: "italic",
                fontSize: 13,
              }}
            >
              {typing} is typing...
            </p>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div
          style={{
            background: "#fff",
            borderTop: "1px solid #e5e7eb",
            padding: 18,
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <input
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 12,
                border: "2px solid #d1d5db",
                outline: "none",
                fontSize: 16,
              }}
              placeholder="Type a message..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              style={{
                background: message.trim() ? "#4f46e5" : "#9ca3af",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 20px",
                borderRadius: 12,
                color: "#fff",
                cursor: message.trim() ? "pointer" : "not-allowed",
                border: "none",
                fontWeight: 600,
              }}
            >
              <Send size={20} /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

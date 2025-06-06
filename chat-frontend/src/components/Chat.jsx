import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

function Chat({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("http://localhost:5500/api/auth/users");
      const otherUsers = res.data.filter(u => u._id !== currentUser._id);
      setUsers(otherUsers);
    };
    fetchUsers();
  }, [currentUser]);

  // Fetch message history when selecting a user
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      const res = await axios.get(
        `http://localhost:5500/api/messages/${currentUser._id}/${selectedUser._id}`
      );
      setMessages(res.data);
    };
    fetchMessages();
  }, [selectedUser, currentUser]);

  // Real-time incoming message
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      if (data.sender === selectedUser?._id) {
        setMessages(prev => [...prev, { sender: data.sender, message: data.message }]);
      }
    });
    return () => socket.off("receiveMessage");
  }, [selectedUser]);

  // Send message
  const sendMessage = async () => {
    if (!msg.trim()) return;
    const newMsg = {
      sender: currentUser._id,
      receiver: selectedUser._id,
      message: msg
    };

    // Save to DB
    await axios.post("http://localhost:5500/api/messages", newMsg);

    // Emit via socket
    socket.emit("sendMessage", newMsg);

    setMessages(prev => [...prev, newMsg]);
    setMsg("");
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      {/* Left: Users List */}
      <div style={{ width: "30%", borderRight: "1px solid gray", paddingRight: "10px" }}>
        <h3>Users</h3>
        {users.map(user => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            style={{ cursor: "pointer", marginBottom: "10px", fontWeight: selectedUser?._id === user._id ? 'bold' : 'normal' }}
          >
            {user.name}
          </div>
        ))}
      </div>

      {/* Right: Chat */}
      <div style={{ width: "70%", paddingLeft: "10px" }}>
        <h3>Chat with {selectedUser?.name || "..."}</h3>
        <div style={{ height: "300px", overflowY: "auto", border: "1px solid lightgray", padding: "10px" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ textAlign: m.sender === currentUser._id ? "right" : "left" }}>
              <p><strong>{m.sender === currentUser._id ? "You" : selectedUser.name}:</strong> {m.message}</p>
            </div>
          ))}
        </div>
        {selectedUser && (
          <>
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type a message"
              style={{ width: "80%" }}
            />
            <button onClick={sendMessage}>Send</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Chat;

'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, User, X, MessageSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function ChatWindow({ orderId, recipientName, onClose }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Polling for messages
    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat?orderId=${orderId}`);
      if (res.ok) setMessages(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, content: newMessage })
      });
      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '350px',
      height: '450px',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 3000,
      overflow: 'hidden',
      border: '1px solid #e2e8f0'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        background: '#1e293b',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--orange)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={16} />
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{recipientName}</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>En ligne</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: '#f8fafc'
        }}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            style={{
              alignSelf: msg.senderId === session?.user?.id ? 'flex-end' : 'flex-start',
              background: msg.senderId === session?.user?.id ? 'var(--orange)' : 'white',
              color: msg.senderId === session?.user?.id ? 'white' : '#1e293b',
              padding: '10px 14px',
              borderRadius: msg.senderId === session?.user?.id ? '18px 18px 0 18px' : '18px 18px 18px 0',
              maxWidth: '80%',
              fontSize: '0.9rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              border: msg.senderId === session?.user?.id ? 'none' : '1px solid #e2e8f0'
            }}
          >
            {msg.content}
            <div style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: '4px', textAlign: 'right' }}>
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} style={{ padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
        <input 
          type="text"
          placeholder="Écrivez un message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            outline: 'none',
            fontSize: '0.9rem'
          }}
        />
        <button type="submit" style={{ 
          background: 'var(--orange)', 
          color: 'white', 
          border: 'none', 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

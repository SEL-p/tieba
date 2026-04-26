'use client';
import { useState, useEffect } from 'react';
import { Bell, Check, ExternalLink, MessageSquare, Truck, Wallet, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function NotificationCenter({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        body: JSON.stringify({ id })
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    markAsRead('all');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'CHAT': return <MessageSquare size={16} color="#6366f1" />;
      case 'MISSION': return <Truck size={16} color="#f97316" />;
      case 'PAYOUT': return <Wallet size={16} color="#10b981" />;
      case 'ORDER': return <ShoppingBag size={16} color="#ec4899" />;
      default: return <Bell size={16} />;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: 'none', border: 'none', cursor: 'pointer', position: 'relative',
          padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <Bell size={22} color="white" />
        {unreadCount > 0 && (
          <span style={{ 
            position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: 'white',
            fontSize: '10px', minWidth: '16px', height: '16px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
            border: '2px solid #1e293b'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{ 
          position: 'absolute', top: '100%', right: 0, width: '320px', background: 'white',
          borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)', zIndex: 2000,
          marginTop: '10px', overflow: 'hidden', border: '1px solid #f1f5f9'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, color: '#1e293b', fontWeight: 800 }}>Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} style={{ fontSize: '11px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                Tout marquer lu
              </button>
            )}
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                <Bell size={40} style={{ opacity: 0.2, marginBottom: '10px' }} />
                <p style={{ fontSize: '13px' }}>Aucune notification</p>
              </div>
            ) : notifications.map(n => (
              <div 
                key={n.id} 
                style={{ 
                  padding: '16px', borderBottom: '1px solid #f8fafc', background: n.read ? 'white' : '#f0f9ff',
                  transition: 'background 0.2s', position: 'relative'
                }}
              >
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '10px', background: 'white', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    {getIcon(n.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{n.title}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>{n.message}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      {new Date(n.createdAt).toLocaleDateString()}
                      {!n.read && (
                        <button onClick={() => markAsRead(n.id)} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px' }}>
                          Marquer lu
                        </button>
                      )}
                    </div>
                  </div>
                  {n.link && (
                    <Link href={n.link} onClick={() => setIsOpen(false)} style={{ color: '#94a3b8' }}>
                      <ExternalLink size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

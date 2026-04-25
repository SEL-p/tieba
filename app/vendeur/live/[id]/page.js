'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Video, Mic, MicOff, VideoOff, PlayCircle, Square, 
  MessageSquare, Settings, Share2, Users
} from 'lucide-react';
import Link from 'next/link';

export default function LiveStudio({ params }) {
  const router = useRouter();
  const liveId = params.id;
  const videoRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [error, setError] = useState('');

  // Fetch live stream data
  useEffect(() => {
    fetch('/api/vendors/livestreams')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const current = data.find(l => l.id === liveId);
          if (current) {
            setLiveData(current);
            setIsLive(current.status === 'LIVE');
          }
        }
      });
  }, [liveId]);

  // Init Webcam
  useEffect(() => {
    const initWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('Erreur webcam:', err);
        setError('Impossible d\'accéder à la caméra ou au microphone. Vérifiez les permissions de votre navigateur.');
      }
    };

    initWebcam();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(t => t.enabled = isMicMuted);
      setIsMicMuted(!isMicMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(t => t.enabled = isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  const updateStatus = async (status) => {
    try {
      const res = await fetch(`/api/vendors/livestreams/${liveId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setIsLive(status === 'LIVE');
        if (status === 'ENDED') {
          router.push('/vendeur/dashboard');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!liveData) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Chargement du Studio...</div>;
  }

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Top Navigation */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/vendeur/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={20} /> Quitter le studio
          </Link>
          <div style={{ height: '24px', width: '1px', background: '#334155' }}></div>
          <h1 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '600' }}>{liveData.title}</h1>
          {isLive ? (
            <span style={{ padding: '4px 8px', background: '#ef4444', color: 'white', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{width:'8px',height:'8px',background:'white',borderRadius:'50%', animation:'pulse 1.5s infinite'}}></div> EN DIRECT
            </span>
          ) : (
            <span style={{ padding: '4px 8px', background: '#334155', color: '#cbd5e1', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              PRÊT À DIFFUSER
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {isLive ? (
            <button onClick={() => updateStatus('ENDED')} style={{ padding: '8px 24px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Square size={16} fill="currentColor" /> Terminer le Live
            </button>
          ) : (
            <button onClick={() => updateStatus('LIVE')} style={{ padding: '8px 24px', background: '#ef4444', border: 'none', color: 'white', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlayCircle size={18} /> Lancer la diffusion
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', height: 'calc(100vh - 73px)' }}>
        
        {/* Left: Video Feed */}
        <div style={{ position: 'relative', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {error ? (
            <div style={{ color: '#ef4444', textAlign: 'center', padding: '20px' }}>
              <VideoOff size={48} style={{ margin: '0 auto 16px' }} />
              <p>{error}</p>
            </div>
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          )}

          {/* Controls Overlay */}
          <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '16px', background: 'rgba(15, 23, 42, 0.8)', padding: '12px 24px', borderRadius: '40px', backdropFilter: 'blur(8px)' }}>
            <button onClick={toggleMic} style={{ width: '48px', height: '48px', borderRadius: '50%', border: 'none', background: isMicMuted ? '#ef4444' : '#334155', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isMicMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button onClick={toggleVideo} style={{ width: '48px', height: '48px', borderRadius: '50%', border: 'none', background: isVideoOff ? '#ef4444' : '#334155', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
            <div style={{ width: '1px', background: '#475569', margin: '0 8px' }}></div>
            <button style={{ width: '48px', height: '48px', borderRadius: '50%', border: 'none', background: '#334155', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={20} />
            </button>
            <button style={{ width: '48px', height: '48px', borderRadius: '50%', border: 'none', background: '#334155', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Right: Sidebar (Chat & Product) */}
        <div style={{ background: '#1e293b', borderLeft: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
          
          {/* Featured Product */}
          <div style={{ padding: '20px', borderBottom: '1px solid #334155' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Produit en vedette</h3>
            {liveData.product ? (
              <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', display: 'flex', gap: '12px' }}>
                <div style={{ width: '60px', height: '60px', background: '#334155', borderRadius: '6px', backgroundImage: `url(${liveData.product.image})`, backgroundSize: 'cover' }}></div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem' }}>{liveData.product.name}</h4>
                  <p style={{ margin: 0, color: '#f97316', fontWeight: 'bold' }}>{liveData.product.price} FCFA</p>
                </div>
              </div>
            ) : (
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Aucun produit sélectionné.</p>
            )}
            <button style={{ width: '100%', marginTop: '12px', padding: '8px', background: '#334155', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
              Changer le produit
            </button>
          </div>

          {/* Chat (Placeholder) */}
          <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} /> Chat en direct
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> 0 spectateurs</span>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '12px', paddingBottom: '16px' }}>
              <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                Le chat sera activé lorsque vous serez en direct.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <input type="text" placeholder="Écrire un message..." disabled style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', color: 'white', padding: '10px 12px', borderRadius: '6px', outline: 'none' }} />
              <button disabled style={{ background: '#334155', color: 'white', border: 'none', padding: '0 16px', borderRadius: '6px', cursor: 'not-allowed' }}>Envoyer</button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

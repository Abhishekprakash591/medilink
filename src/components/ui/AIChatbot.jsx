import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, ImagePlus, Loader } from 'lucide-react';
import { db, storage } from '../../firebase';
import { ref as dbRef, push, onValue } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// ─── Local AI response engine (unchanged) ────────────────────────────────────
const RESPONSES = {
  greeting:    ['Hello! 👋 I\'m MEDI-AI, your 24/7 health assistant. How can I help you today?'],
  fever:       ['Fever can be caused by viral or bacterial infections.\n\n**Immediate steps:**\n• Take Paracetamol 500mg every 6 hours\n• Drink plenty of fluids (ORS, coconut water)\n• Rest and avoid exertion\n\n⚕️ If fever is above 103°F or lasts >3 days, visit a doctor.'],
  headache:    ['Headaches have many causes — tension, dehydration, or infection.\n\n**Try these:**\n• Drink 2 glasses of water now\n• Rest in a quiet, dark room\n• Paracetamol or Ibuprofen for pain\n\n⚠️ Sudden severe headache needs emergency care.'],
  chest:       ['⚠️ **Chest pain needs immediate attention!**\n\nIf you experience:\n• Pressure or squeezing in chest\n• Pain radiating to arm/jaw\n• Shortness of breath\n\n🚨 Call 108 immediately and chew Aspirin if available.'],
  pharmacy:    ['**Finding open pharmacies:**\n\n🏪 Apollo Pharmacy — 500m — Open 24hrs\n🏪 MedPlus — 1.2km — Open till 10PM\n🏪 Jan Aushadhi — 2km — Open 9AM–9PM\n\nGo to the **Pharmacy Finder** section for more details.'],
  hospital:    ['**Nearest hospitals to you:**\n\n🏥 CityCare Hospital — 1.2km — Beds available\n🏥 Apollo Hospital — 2.4km — Limited beds\n🏥 Ruby Hall — 3.1km — Beds available\n\nUse **Emergency Mode** for real-time bed availability.'],
  medicine:    ['I can help with medicine information!\n\nTell me the medicine name and I\'ll explain:\n• Purpose and uses\n• Dosage guidance\n• Common side effects\n• Precautions\n\nWhat medicine would you like to know about?'],
  paracetamol: ['**Paracetamol (Crocin/Calpol)**\n\n✅ Purpose: Fever & mild pain relief\n💊 Dose: 500–1000mg every 4–6 hours\n⏱️ Max: 4g per day\n⚠️ Avoid on empty stomach\n❌ Do not combine with alcohol'],
  default:     ['I understand you\'re asking about a health concern. For accurate medical advice, please:\n\n• Use our **Symptom Checker** for AI diagnosis\n• Visit the **Find a Doctor** page\n• Call **104** (Health Helpline)\n\nIs there anything specific I can help with?'],
};

const getAIResponse = (text) => {
  const lower = text.toLowerCase();
  if (lower.match(/hi|hello|hey|good/))                                          return RESPONSES.greeting[0];
  if (lower.includes('chest') || lower.includes('heart'))                        return RESPONSES.chest[0];
  if (lower.includes('fever') || lower.includes('temperature'))                  return RESPONSES.fever[0];
  if (lower.includes('headache') || lower.includes('head pain'))                 return RESPONSES.headache[0];
  if (lower.includes('pharmacy') || lower.includes('medicine shop'))             return RESPONSES.pharmacy[0];
  if (lower.includes('hospital') || lower.includes('clinic'))                    return RESPONSES.hospital[0];
  if (lower.includes('paracetamol') || lower.includes('crocin'))                 return RESPONSES.paracetamol[0];
  if (lower.includes('medicine') || lower.includes('drug') || lower.includes('tablet')) return RESPONSES.medicine[0];
  return RESPONSES.default[0];
};

const SUGGESTIONS = ['I have fever', 'Chest pain help', 'Find pharmacy', 'Nearest hospital', 'About Paracetamol'];
// ─────────────────────────────────────────────────────────────────────────────

export const AIChatbot = () => {
  const [isOpen, setIsOpen]       = useState(false);
  const [messages, setMessages]   = useState([
    { id: 1, from: 'bot', text: 'Hi! 👋 I\'m MEDI-AI. Describe your symptoms or share an image!', time: Date.now(), imageUrl: null }
  ]);
  const [input, setInput]         = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState(null);
  const [uploading, setUploading] = useState(false);
  const bottomRef  = useRef(null);
  const fileRef    = useRef(null);

  // ── Scroll to bottom whenever messages update ──────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── Real-time listener: pull all past messages from Firebase on open ───────
  useEffect(() => {
    if (!isOpen) return;
    const msgRef = dbRef(db, 'messages');
    const unsub = onValue(msgRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      const loaded = Object.entries(data).map(([key, val]) => ({
        id: key,
        from: 'user',          // Firebase messages are always user-originated
        text: val.text || '',
        imageUrl: val.image || null,
        time: val.time || Date.now(),
        fromFirebase: true,
      }));
      // Merge: keep the initial bot greeting + any local bot replies, then add firebase messages
      setMessages(prev => {
        const localBotMsgs = prev.filter(m => m.from === 'bot');
        const combined = [...localBotMsgs, ...loaded].sort((a, b) => (a.time || 0) - (b.time || 0));
        return combined;
      });
    });
    return () => unsub();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // ── Handle image file selection ────────────────────────────────────────────
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  // ── Send message: text only or text + image ────────────────────────────────
  const sendMessage = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text && !imageFile) return;

    setUploading(true);

    try {
      let imageUrl = null;

      // 1. Upload image to Firebase Storage if one was selected
      if (imageFile) {
        const fileName   = `${Date.now()}_${imageFile.name}`;
        const imgRef     = storageRef(storage, `images/${fileName}`);
        await uploadBytes(imgRef, imageFile);
        imageUrl = await getDownloadURL(imgRef);
      }

      // 2. Push message to Firebase Realtime Database
      const msgRef = dbRef(db, 'messages');
      await push(msgRef, {
        text:  text || '(image)',
        image: imageUrl,
        time:  Date.now(),
      });

      // 3. Show user message locally immediately (optimistic update)
      const userMsg = { id: `local_${Date.now()}`, from: 'user', text, imageUrl, time: Date.now(), fromFirebase: false };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      clearImage();

      // 4. AI replies after a short delay
      if (!textOverride) {
        setIsTyping(true);
        await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
        const botText = imageUrl
          ? '📸 I received your image! If this is a prescription or lab report, please use the **Rx Analyzer** or **Lab AI** for a detailed reading.\n\nOtherwise, describe your symptoms and I\'ll help.'
          : getAIResponse(text);
        setIsTyping(false);
        setMessages(prev => [...prev, { id: `bot_${Date.now()}`, from: 'bot', text: botText, imageUrl: null, time: Date.now() }]);
      }
    } catch (err) {
      console.error('Firebase send error:', err);
      setMessages(prev => [...prev, { id: `err_${Date.now()}`, from: 'bot', text: '⚠️ Could not send. Please check your connection.', imageUrl: null, time: Date.now() }]);
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const renderText = (text) =>
    text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} style={{ margin: '0.15rem 0', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: bold }} />;
    });

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '5rem', left: '1.5rem',
          width: '56px', height: '56px', borderRadius: '50%',
          backgroundColor: 'var(--primary-color)', color: 'white',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 90, transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseOut={e  => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        {!isOpen && (
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', backgroundColor: '#ef4444', borderRadius: '50%', fontSize: '0.6rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>AI</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '8.5rem', left: '1.5rem',
          width: '360px', maxHeight: '520px',
          backgroundColor: 'var(--surface-color)',
          borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          border: '1px solid var(--border-color)',
          display: 'flex', flexDirection: 'column',
          zIndex: 89, animation: 'slideUpChat 0.25s ease'
        }}>

          {/* Header */}
          <div style={{ padding: '0.875rem 1rem', background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} color="white" />
            </div>
            <div>
              <p style={{ margin: 0, color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>MEDI-AI Assistant</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ade80' }} />
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem' }}>Online · Firebase Live</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: msg.from === 'user' ? 'row-reverse' : 'row', gap: '0.5rem', alignItems: 'flex-end' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: msg.from === 'bot' ? '#e0e7ff' : '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {msg.from === 'bot' ? <Bot size={14} color="var(--primary-color)" /> : <User size={14} color="var(--primary-color)" />}
                </div>
                <div style={{ maxWidth: '78%' }}>
                  <div style={{ padding: '0.625rem 0.875rem', borderRadius: msg.from === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px', backgroundColor: msg.from === 'user' ? 'var(--primary-color)' : 'var(--background-color)', color: msg.from === 'user' ? 'white' : 'var(--text-primary)', fontSize: '0.825rem' }}>
                    {msg.text && renderText(msg.text)}
                    {msg.imageUrl && (
                      <img src={msg.imageUrl} alt="uploaded" style={{ marginTop: '6px', maxWidth: '100%', borderRadius: '8px', display: 'block' }} />
                    )}
                  </div>
                  <p style={{ margin: '0.2rem 0.5rem 0', fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: msg.from === 'user' ? 'right' : 'left' }}>
                    {formatTime(msg.time)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={14} color="var(--primary-color)" />
                </div>
                <div style={{ padding: '0.625rem 0.875rem', borderRadius: '12px 12px 12px 2px', backgroundColor: 'var(--background-color)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-secondary)', animation: `dotBounce 1s ${i * 0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Suggestions */}
          <div style={{ padding: '0 0.875rem 0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'nowrap', overflowX: 'auto' }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => sendMessage(s)} style={{ padding: '3px 10px', borderRadius: '999px', border: '1px solid var(--border-color)', backgroundColor: 'var(--background-color)', fontSize: '0.7rem', cursor: 'pointer', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                {s}
              </button>
            ))}
          </div>

          {/* Image Preview Strip */}
          {preview && (
            <div style={{ padding: '0.5rem 0.875rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f0fdf4' }}>
              <img src={preview} alt="preview" style={{ height: '48px', width: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #bbf7d0' }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: '#166534' }}>Image ready to send</p>
                <p style={{ margin: 0, fontSize: '0.65rem', color: '#4ade80' }}>Will upload to Firebase Storage</p>
              </div>
              <button onClick={clearImage} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}>
                <X size={16} />
              </button>
            </div>
          )}

          {/* Input Bar */}
          <div style={{ padding: '0.625rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {/* Image Upload Button */}
            <button
              onClick={() => fileRef.current?.click()}
              title="Attach image"
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border-color)', backgroundColor: preview ? '#dcfce7' : 'var(--background-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <ImagePlus size={16} color={preview ? '#16a34a' : 'var(--text-secondary)'} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageSelect} />

            {/* Text Input */}
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !uploading && sendMessage()}
              placeholder="Ask or attach an image..."
              style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '999px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.8rem', backgroundColor: 'var(--background-color)' }}
            />

            {/* Send Button */}
            <button
              onClick={() => sendMessage()}
              disabled={(!input.trim() && !imageFile) || uploading}
              style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (input.trim() || imageFile) && !uploading ? 1 : 0.5 }}
            >
              {uploading ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={14} />}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUpChat { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dotBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </>
  );
};

export default AIChatbot;

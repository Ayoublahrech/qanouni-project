import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/api';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: '🌟 Bienvenue sur Qanouni ! Je suis votre assistant juridique intelligent spécialisé dans le droit marocain. Comment puis-je vous aider aujourd\'hui ?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quota, setQuota] = useState(20);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const data = await sendMessage(userMessage, 'test-user');
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: data.reply || 'Désolé, je n\'ai pas compris. Pouvez-vous reformuler ?',
        sources: data.sources || []
      }]);

      if (data.remainingQuota) setQuota(data.remainingQuota);

    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: '😔 Désolé, une erreur technique est survenue. Nos équipes ont été notifiées.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMagicAction = (action) => {
    setInput(`[Action ${action}] `);
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="logo-container">
          <div className="logo-icon">Q</div>
          <div className="header-title">
            <h1>QANOUNI <span className="badge">Bêta</span></h1>
          </div>
        </div>
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>Middleware Actif</span>
        </div>
      </header>

      <div className="messages-area">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">
              <p>{msg.content}</p>
              {msg.sources && msg.sources.length > 0 && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', opacity: 0.7 }}>
                  Sources: {msg.sources.join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {isLoading && (
        <div className="typing-indicator">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>Qanouni réfléchit...</span>
        </div>
      )}

      <div className="magic-tools">
        <button className="magic-btn" onClick={() => handleMagicAction('summarize')}>
          <i className="fas fa-compress-alt"></i> Résumer
        </button>
        <button className="magic-btn" onClick={() => handleMagicAction('simplify')}>
          <i className="fas fa-magic"></i> Simplifier
        </button>
        <button className="magic-btn" onClick={() => handleMagicAction('darija')}>
          <i className="fas fa-language"></i> Darija
        </button>
        <button className="magic-btn" onClick={() => handleMagicAction('verify')}>
          <i className="fas fa-check-double"></i> Vérifier
        </button>
        <button className="magic-btn" onClick={() => handleMagicAction('contract')}>
          <i className="fas fa-file-contract"></i> Contrat
        </button>
      </div>

      <div className="input-area">
        <div className="input-wrapper">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question juridique..."
            disabled={isLoading}
            rows="1"
          />
        </div>
        <button 
          className="send-btn" 
          onClick={handleSend} 
          disabled={isLoading || !input.trim()}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>

      <div className="chat-footer">
        <div className="footer-left">
          <i className="fas fa-shield-alt"></i> Session sécurisée
        </div>
        <div className="footer-right">
          <i className="fas fa-gavel"></i> Droit marocain • {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default Chat;

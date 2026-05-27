'use client';
import { useState } from 'react';

export default function ChatIA() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hola! Soy Axo, tu asistente de Axora. Estoy aqui para ayudarte a enviar dinero a Mexico de forma rapida y segura. En que puedo ayudarte hoy?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const colors = {
    principal: "#294C74",
    secundario: "#F17633",
    apoyo: "#C0B9AB",
    fondo: "#E7E1DB",
    textoSec: "#8E8578",
    contenedor: "#F8F6F3"
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Lo siento, tuve un problema. Por favor intenta de nuevo.' 
      }]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const preguntasRapidas = [
    "Como envio dinero a Mexico?",
    "Cuanto ahorro vs Western Union?",
    "Que es una stablecoin?",
    "Como configuro pagos automaticos?"
  ];

  return (
    <div style={{
      backgroundColor: "white",
      borderRadius: "20px",
      boxShadow: "0 8px 30px rgba(41,76,116,0.08)",
      overflow: "hidden",
      border: `1px solid ${colors.apoyo}40`
    }}>
      
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.principal} 0%, #3d6a9e 100%)`,
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        gap: "16px"
      }}>
      <div style={{
        width: "56px",
        height: "56px",
        borderRadius: "16px",
        overflow: "hidden",
        border: "2px solid rgba(255,255,255,0.35)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        flexShrink: 0
      }}>
        <img src="/axo.png" alt="Axo" style={{width: "100%", height: "100%", objectFit: "cover"}} />
      </div>
        <div style={{flex: 1}}>
          <h3 style={{color: "white", margin: 0, fontSize: "20px", fontWeight: "800", letterSpacing: "-0.3px"}}>
            Axo - Asistente IA
          </h3>
          <p style={{color: "rgba(255,255,255,0.7)", margin: 0, fontSize: "13px", fontWeight: "500"}}>
            Tu ajolote financiero, disponible 24/7
          </p>
        </div>
        <div style={{
          backgroundColor: "#F17633",
          borderRadius: "20px",
          padding: "6px 14px",
          fontSize: "12px",
          color: "white",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          <div style={{width: "6px", height: "6px", backgroundColor: "white", borderRadius: "50%"}}></div>
          En linea
        </div>
      </div>

      {/* Preguntas rapidas */}
      <div style={{
        padding: "16px 28px",
        backgroundColor: colors.contenedor,
        borderBottom: `1px solid ${colors.apoyo}40`
      }}>
        <p style={{fontSize: "11px", color: colors.principal, fontWeight: "700", margin: "0 0 10px 0", letterSpacing: "0.5px", textTransform: "uppercase"}}>
          Preguntale a Axo:
        </p>
        <div style={{display: "flex", gap: "8px", flexWrap: "wrap"}}>
          {preguntasRapidas.map((pregunta, i) => (
            <button
              key={i}
              onClick={() => setInput(pregunta)}
              style={{
                backgroundColor: "white",
                border: `1px solid ${colors.apoyo}`,
                borderRadius: "20px",
                padding: "7px 16px",
                fontSize: "13px",
                color: colors.principal,
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.2s"
              }}
            >
              {pregunta}
            </button>
          ))}
        </div>
      </div>

      {/* Mensajes */}
      <div style={{
        height: "380px",
        overflowY: "auto",
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        backgroundColor: colors.contenedor
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === 'user' ? "flex-end" : "flex-start",
            gap: "10px",
            alignItems: "flex-end"
          }}>
            {msg.role === 'assistant' && (
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${colors.principal}, #3d6a9e)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(41,76,116,0.2)"
              }}>
              <img src="/axo.png" alt="Axo" style={{width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px"}} />
            </div>
            )}
            <div style={{
              maxWidth: "72%",
              padding: "14px 18px",
              borderRadius: msg.role === 'user' 
                ? "18px 18px 4px 18px" 
                : "18px 18px 18px 4px",
              backgroundColor: msg.role === 'user' ? colors.secundario : "white",
              color: msg.role === 'user' ? "white" : colors.principal,
              fontSize: "14px",
              lineHeight: "1.6",
              fontWeight: "500",
              boxShadow: msg.role === 'user' 
                ? "0 4px 12px rgba(241,118,51,0.2)" 
                : "0 2px 8px rgba(41,76,116,0.06)",
              border: msg.role === 'user' ? "none" : `1px solid ${colors.apoyo}40`
            }}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                backgroundColor: colors.secundario,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(241,118,51,0.2)"
              }}>👤</div>
            )}
          </div>
        ))}
        
        {loading && (
          <div style={{display: "flex", gap: "10px", alignItems: "flex-end"}}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "12px",
              background: `linear-gradient(135deg, ${colors.principal}, #3d6a9e)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px",
              overflow: "hidden"
              }}>
                <img src="/axoEscribe.png" alt="Axo" style={{width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px"}} />
              </div>
            <div style={{
              backgroundColor: "white",
              padding: "14px 18px",
              borderRadius: "18px 18px 18px 4px",
              boxShadow: "0 2px 8px rgba(41,76,116,0.06)",
              border: `1px solid ${colors.apoyo}40`,
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <div style={{display: "flex", gap: "4px"}}>
                <div style={{width: "8px", height: "8px", borderRadius: "50%", backgroundColor: colors.principal, opacity: 0.4, animation: "pulse 1.5s infinite"}}></div>
                <div style={{width: "8px", height: "8px", borderRadius: "50%", backgroundColor: colors.principal, opacity: 0.4, animation: "pulse 1.5s infinite 0.3s"}}></div>
                <div style={{width: "8px", height: "8px", borderRadius: "50%", backgroundColor: colors.principal, opacity: 0.4, animation: "pulse 1.5s infinite 0.6s"}}></div>
              </div>
              <span style={{color: colors.textoSec, fontSize: "13px", fontWeight: "500"}}>Axo esta pensando...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: "20px 28px",
        borderTop: `1px solid ${colors.apoyo}40`,
        display: "flex",
        gap: "12px",
        backgroundColor: "white"
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu pregunta a Axo..."
          style={{
            flex: 1,
            padding: "14px 18px",
            borderRadius: "12px",
            border: `2px solid ${colors.apoyo}60`,
            fontSize: "14px",
            outline: "none",
            fontFamily: "inherit",
            color: colors.principal,
            fontWeight: "500",
            backgroundColor: colors.contenedor
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            backgroundColor: loading || !input.trim() ? colors.apoyo : colors.secundario,
            color: "white",
            border: "none",
            padding: "14px 22px",
            borderRadius: "12px",
            fontSize: "16px",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            fontWeight: "700",
            transition: "all 0.2s",
            boxShadow: loading || !input.trim() ? "none" : "0 4px 12px rgba(241,118,51,0.3)"
          }}
        >
          {loading ? "..." : "➤"}
        </button>
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import useIsMobile from "../lib/useIsMobile";

const GUIAS = {
  inicio: {
    pasos: [
      {
        titulo: "Bienvenido a Axora!",
        mensaje: "Soy Axo, tu guia personal. Te voy a ayudar a enviar dinero a Mexico de forma segura y rapida. Aqui puedes ver cuanto ahorra tu familia vs Western Union.",
        accion: null
      },
      {
        titulo: "Compara los precios",
        mensaje: "Mueve el slider de la comparativa para ver cuanto recibiria tu familia segun el monto que quieras enviar. Axora cobra solo $1.50 vs los $8 de Western Union!",
        accion: null
      },
      {
        titulo: "Listo para enviar?",
        mensaje: "Cuando quieras enviar dinero, haz clic en 'Enviar' en el menu de arriba o en el boton 'Comenzar ahora'. Es muy sencillo, te guio paso a paso!",
        accion: "enviar"
      }
    ]
  },
  enviar: {
    pasos: [
      {
        titulo: "Paso 1: Tus datos",
        mensaje: "Primero necesito saber quien eres. Ingresa tu nombre completo, telefono y cuanto dinero quieres enviar. Minimo $10 USD, maximo $2,000 USD.",
        accion: null
      },
      {
        titulo: "Paso 2: Datos del familiar",
        mensaje: "Ingresa el nombre de quien recibe, su banco y su CLABE interbancaria de 18 digitos. La CLABE la puedes encontrar en la app del banco de tu familiar.",
        accion: null
      },
      {
        titulo: "Paso 3: Confirmar y pagar",
        mensaje: "Revisa que todo este correcto. Te mostrare un codigo para pagar en cualquier Oxxo. Una vez que pagues, tu familiar recibira el dinero en minutos!",
        accion: null
      },
      {
        titulo: "Tu envio es gratis!",
        mensaje: "Recuerda que cada 10 envios, el siguiente es GRATIS. Ademas ganas puntos por cada envio que puedes canjear por recompensas.",
        accion: "recompensas"
      }
    ]
  },
  pagos: {
    pasos: [
      {
        titulo: "Pagos Automaticos",
        mensaje: "Aqui puedes configurar pagos que se hacen solos cada mes. Perfecto para CFE, internet, agua o gas. Tu familia nunca se quedara sin servicios!",
        accion: null
      },
      {
        titulo: "Como configurar un pago",
        mensaje: "Haz clic en 'Agregar pago', selecciona el servicio (CFE, agua, gas o internet), ingresa la CLABE del banco, el monto y el dia del mes que quieres que se pague.",
        accion: null
      },
      {
        titulo: "Gana puntos extra",
        mensaje: "Por cada pago automatico que configures ganas 75 puntos de recompensa y desbloqueas el NFT 'Axo Guardian'. Ademas puedes pausar o cancelar cuando quieras.",
        accion: "recompensas"
      }
    ]
  },
  recompensas: {
    pasos: [
      {
        titulo: "Sistema de Recompensas",
        mensaje: "Ganas puntos por cada envio, por usar a Axo y por configurar pagos automaticos. Con esos puntos puedes conseguir envios gratis, cashback y mucho mas!",
        accion: null
      },
      {
        titulo: "Tus NFTs",
        mensaje: "Los NFTs son insignias digitales unicas que desbloqueas al cumplir metas. Cada uno tiene un valor en puntos que puedes canjear. Una vez canjeados, puedes volver a desbloquearlos!",
        accion: null
      },
      {
        titulo: "Como canjear recompensas",
        mensaje: "Ve a la pestana 'Canjear', elige la recompensa que quieras y haz clic en 'Canjear'. El beneficio se aplica automaticamente en tu proximo envio.",
        accion: "enviar"
      }
    ]
  },
  chat: {
    pasos: [
      {
        titulo: "Hola! Soy Axo tu asistente IA",
        mensaje: "Puedes preguntarme cualquier cosa sobre envios de dinero, tipo de cambio, como usar Axora o como protegerte de estafas. Estoy aqui 24/7!",
        accion: null
      },
      {
        titulo: "Preguntas rapidas",
        mensaje: "Usa los botones de preguntas rapidas para empezar. O escribe directamente tu pregunta. Cada consulta te da 5 puntos, hasta 30 puntos diarios!",
        accion: null
      },
      {
        titulo: "Consejo",
        mensaje: "Preguntame cuando es el mejor momento para convertir tus dolares a pesos. Analizo el tipo de cambio y te doy una recomendacion personalizada!",
        accion: null
      }
    ]
  }
};

export default function AxoGuia({ seccion, colors, onNavegar }) {
  const isMobile = useIsMobile();
  const [abierto, setAbierto] = useState(false);
  const [pasoActual, setPasoActual] = useState(0);
  const [animando, setAnimando] = useState(false);

  // Resetear paso al cambiar seccion
  useEffect(() => {
    setPasoActual(0);
  }, [seccion]);

  const guia = GUIAS[seccion] || GUIAS.inicio;
  const paso = guia.pasos[pasoActual] || guia.pasos[0];
  const totalPasos = guia.pasos.length;

  const siguiente = () => {
    if (animando) return;
    setAnimando(true);
    setTimeout(() => {
      setPasoActual(p => {
        const total = (GUIAS[seccion] || GUIAS.inicio).pasos.length;
        return p < total - 1 ? p + 1 : 0;
      });
      setAnimando(false);
    }, 200);
  };

  const anterior = () => {
    if (animando) return;
    setAnimando(true);
    setTimeout(() => {
      setPasoActual(p => p > 0 ? p - 1 : 0);
      setAnimando(false);
    }, 200);
  };

  const irASeccion = () => {
    if (paso.accion && onNavegar) {
      onNavegar(paso.accion);
      setAbierto(false);
    }
  };

  return (
    <>
      {/* Boton flotante */}
      <div
        onClick={() => setAbierto(!abierto)}
        style={{
          position: "fixed",
          bottom: isMobile ? "20px" : "32px",
          right: isMobile ? "16px" : "32px",
          zIndex: 9999,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          transition: "all 0.3s ease"
        }}
      >
        {/* Tooltip cuando esta cerrado */}
        {!abierto && (
          <div style={{
            backgroundColor: colors.principal,
            color: "white",
            padding: isMobile ? "8px 12px" : "10px 16px",
            borderRadius: "12px",
            fontSize: isMobile ? "12px" : "13px",
            fontWeight: "700",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 16px rgba(41,76,116,0.3)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            position: "relative"
          }}>
            {isMobile ? "Ayuda" : "Necesitas ayuda?"}
            <div style={{
              position: "absolute", right: "-6px", top: "50%",
              transform: "translateY(-50%) rotate(45deg)",
              width: "12px", height: "12px",
              backgroundColor: colors.principal,
            }} />
          </div>
        )}

        {/* Burbuja de Axo */}
        <div style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          backgroundColor: "white",
          boxShadow: abierto
            ? `0 8px 30px rgba(41,76,116,0.35), 0 0 0 4px ${colors.principal}`
            : `0 4px 20px rgba(41,76,116,0.25), 0 0 0 3px ${colors.secundario}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: abierto ? "scale(1.1)" : "scale(1)",
          transition: "all 0.3s ease",
          overflow: "hidden",
          border: "3px solid white"
        }}>
          <img
            src="/axo-guia.png"
            alt="Axo Guia"
            style={{width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%"}}
          />
        </div>

        {/* Punto verde online */}
        <div style={{
          position: "absolute",
          bottom: "2px",
          right: "2px",
          width: "14px",
          height: "14px",
          backgroundColor: "#22c55e",
          borderRadius: "50%",
          border: "2px solid white",
          boxShadow: "0 0 6px rgba(34,197,94,0.5)"
        }} />
      </div>

      {/* Panel de guia */}
      {abierto && (
        <div style={{
          position: "fixed",
          bottom: isMobile ? "100px" : "110px",
          right: isMobile ? "16px" : "32px",
          zIndex: 9998,
          width: isMobile ? "calc(100vw - 32px)" : "360px",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(41,76,116,0.2)",
          border: `2px solid ${colors.apoyo}40`,
          overflow: "hidden",
          animation: "slideUp 0.3s ease"
        }}>

          {/* Header */}
          <div style={{
            background: `linear-gradient(135deg, ${colors.principal}, #3d6a9e)`,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <div style={{
              width: "48px", height: "48px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid rgba(255,255,255,0.4)",
              flexShrink: 0
            }}>
              <img
                src="/axo-guia.png"
                alt="Axo"
                style={{width: "100%", height: "100%", objectFit: "cover"}}
              />
            </div>
            <div style={{flex: 1}}>
              <div style={{color: "white", fontWeight: "800", fontSize: "15px"}}>
                Axo - Tu Guia
              </div>
              <div style={{color: "rgba(255,255,255,0.7)", fontSize: "12px"}}>
                Siempre aqui para ayudarte
              </div>
            </div>
            <button
              onClick={() => setAbierto(false)}
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "none", color: "white",
                width: "28px", height: "28px",
                borderRadius: "50%", cursor: "pointer",
                fontSize: "14px", fontWeight: "800",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
            >✕</button>
          </div>

          {/* Indicador de seccion */}
          <div style={{
            backgroundColor: `${colors.secundario}15`,
            padding: "8px 20px",
            fontSize: "11px",
            fontWeight: "700",
            color: colors.secundario,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            borderBottom: `1px solid ${colors.apoyo}30`
          }}>
            📍 Estas en: {seccion === "inicio" ? "Inicio" :
                         seccion === "enviar" ? "Enviar Remesa" :
                         seccion === "pagos" ? "Pagos Automaticos" :
                         seccion === "recompensas" ? "Recompensas" :
                         "Chat con Axo"}
          </div>

          {/* Contenido del paso */}
          <div style={{
            padding: "24px 20px",
            opacity: animando ? 0 : 1,
            transition: "opacity 0.2s ease"
          }}>
            <div style={{display: "flex", gap: "16px", alignItems: "flex-start"}}>

              {/* Imagen de Axo */}
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "16px",
                overflow: "hidden",
                flexShrink: 0,
                border: `2px solid ${colors.apoyo}40`
              }}>
                <img
                  src="/axo-guia.png"
                  alt="Axo"
                  style={{width: "100%", height: "100%", objectFit: "cover"}}
                />
              </div>

              {/* Texto */}
              <div style={{flex: 1}}>
                <h3 style={{
                  fontSize: "15px", fontWeight: "800",
                  color: colors.principal, margin: "0 0 8px 0"
                }}>
                  {paso.titulo}
                </h3>
                <p style={{
                  fontSize: "13px", color: colors.textoSec,
                  margin: 0, lineHeight: "1.6"
                }}>
                  {paso.mensaje}
                </p>
              </div>
            </div>

            {/* Boton de accion si hay */}
            {paso.accion && (
              <button
                onClick={irASeccion}
                style={{
                  width: "100%",
                  marginTop: "16px",
                  backgroundColor: colors.secundario,
                  color: "white", border: "none",
                  padding: "11px", borderRadius: "10px",
                  fontSize: "13px", fontWeight: "700",
                  cursor: "pointer",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "8px"
                }}
              >
                Ir a {paso.accion === "enviar" ? "Enviar Remesa" :
                      paso.accion === "recompensas" ? "Mis Recompensas" :
                      paso.accion} →
              </button>
            )}
          </div>

          {/* Navegacion de pasos */}
          <div style={{
            padding: "14px 20px",
            borderTop: `1px solid ${colors.apoyo}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: colors.contenedor
          }}>
            {/* Puntos indicadores */}
            <div style={{display: "flex", gap: "6px"}}>
              {guia.pasos.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setPasoActual(i)}
                  style={{
                    width: i === pasoActual ? "20px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    backgroundColor: i === pasoActual ? colors.secundario : colors.apoyo,
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                />
              ))}
            </div>

            {/* Botones anterior/siguiente */}
            <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
              <span style={{fontSize: "12px", color: colors.textoSec}}>
                {pasoActual + 1}/{totalPasos}
              </span>
              <button
                onClick={anterior}
                disabled={pasoActual === 0}
                style={{
                  backgroundColor: pasoActual === 0 ? colors.apoyo + "50" : colors.contenedor,
                  border: `1px solid ${colors.apoyo}`,
                  borderRadius: "8px", padding: "6px 12px",
                  fontSize: "14px", cursor: pasoActual === 0 ? "not-allowed" : "pointer",
                  color: pasoActual === 0 ? colors.apoyo : colors.principal
                }}
              >←</button>
              <button
                onClick={siguiente}
                style={{
                  backgroundColor: colors.secundario,
                  border: "none", borderRadius: "8px",
                  padding: "6px 12px", fontSize: "14px",
                  cursor: "pointer", color: "white", fontWeight: "700"
                }}
              >
                {pasoActual === totalPasos - 1 ? "↺" : "→"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
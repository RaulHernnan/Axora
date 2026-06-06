"use client";
import { useState, useEffect, useRef } from "react";
import { getNotificaciones, marcarLeida, marcarTodasLeidas } from "../lib/notifications";
import Icon from "./Icon";
import useIsMobile from "../lib/useIsMobile";

export default function Notificaciones({ usuario, colors, onUpdate }) {
  const isMobile = useIsMobile();
  const [abierto, setAbierto] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    if (usuario) {
      setNotifs(getNotificaciones(usuario));
    }
  }, [usuario, abierto]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const noLeidas = notifs.filter(n => !n.leida).length;

  const handleMarcarLeida = (id) => {
    const actualizadas = marcarLeida(usuario, id);
    setNotifs(actualizadas);
    if (onUpdate) onUpdate();
  };

  const handleMarcarTodas = () => {
    const actualizadas = marcarTodasLeidas(usuario);
    setNotifs(actualizadas);
    if (onUpdate) onUpdate();
  };

  const iconoMap = {
    envio_exitoso: {nombre: "money-transfer", color: "16A34A"},
    tipo_cambio_favorable: {nombre: "combo-chart", color: "F17633"},
    nft_desbloqueado: {nombre: "trophy", color: "7C3AED"},
    pago_automatico: {nombre: "lightning-bolt", color: "2563EB"},
    general: {nombre: "bell", color: "294C74"}
  };

  return (
    <div ref={ref} style={{position: "relative"}}>
      {/* Botón campana */}
      <button
        onClick={() => setAbierto(!abierto)}
        style={{
          position: "relative",
          backgroundColor: abierto ? `${colors.principal}15` : "transparent",
          border: `1px solid ${abierto ? colors.principal + "40" : colors.apoyo}`,
          borderRadius: "10px", padding: "8px",
          cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
          transition: "all 0.2s"
        }}
      >
        <Icon nombre="bell" size={20} color={abierto ? "294C74" : "8E8578"} />
        {noLeidas > 0 && (
          <div style={{
            position: "absolute", top: "-4px", right: "-4px",
            backgroundColor: colors.secundario,
            color: "white", borderRadius: "50%",
            width: "18px", height: "18px",
            fontSize: "10px", fontWeight: "900",
            display: "flex", alignItems: "center",
            justifyContent: "center",
            border: "2px solid white",
            animation: "pulse 2s infinite"
          }}>
            {noLeidas > 9 ? "9+" : noLeidas}
          </div>
        )}
      </button>

      {/* Panel de notificaciones */}
      {abierto && (
        <div style={{
          position: "fixed",
          top: "70px",
          right: isMobile ? "8px" : "0",
          left: isMobile ? "8px" : "auto",
          width: isMobile ? "calc(100vw - 16px)" : "360px",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(41,76,116,0.2)",
          border: `1px solid ${colors.apoyo}40`,
          zIndex: 9999,
          animation: "slideUp 0.2s ease",
          overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${colors.apoyo}30`,
            display: "flex", justifyContent: "space-between",
            alignItems: "center",
            background: `linear-gradient(135deg, ${colors.principal}, #3d6a9e)`
          }}>
            <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
              <Icon nombre="bell" size={18} color="FFFFFF" />
              <span style={{color: "white", fontWeight: "800", fontSize: "15px"}}>
                Notificaciones
              </span>
              {noLeidas > 0 && (
                <span style={{
                  backgroundColor: colors.secundario,
                  color: "white", borderRadius: "20px",
                  padding: "2px 8px", fontSize: "11px", fontWeight: "700"
                }}>
                  {noLeidas} nuevas
                </span>
              )}
            </div>
            {noLeidas > 0 && (
              <button onClick={handleMarcarTodas} style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "none", color: "white",
                fontSize: "11px", fontWeight: "700",
                cursor: "pointer", padding: "4px 10px",
                borderRadius: "8px"
              }}>
                Marcar todas leídas
              </button>
            )}
          </div>

          {/* Lista */}
          <div style={{maxHeight: "400px", overflowY: "auto"}}>
            {notifs.length === 0 ? (
              <div style={{
                padding: "48px 24px", textAlign: "center",
                color: colors.textoSec
              }}>
                <Icon nombre="bell" size={40} color="C0B9AB" style={{marginBottom: "12px"}} />
                <p style={{margin: 0, fontSize: "14px"}}>Sin notificaciones por ahora</p>
              </div>
            ) : (
              notifs.map((notif, i) => {
                const icono = iconoMap[notif.tipo] || iconoMap.general;
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleMarcarLeida(notif.id)}
                    style={{
                      padding: "14px 20px",
                      borderBottom: i < notifs.length - 1 ? `1px solid ${colors.apoyo}20` : "none",
                      backgroundColor: notif.leida ? "white" : `${colors.principal}06`,
                      cursor: "pointer", transition: "background 0.2s",
                      display: "flex", gap: "12px", alignItems: "flex-start"
                    }}
                  >
                    {/* Ícono */}
                    <div style={{
                      width: "40px", height: "40px",
                      borderRadius: "12px",
                      backgroundColor: `#${icono.color}15`,
                      display: "flex", alignItems: "center",
                      justifyContent: "center", flexShrink: 0
                    }}>
                      <Icon nombre={icono.nombre} size={20} color={icono.color} />
                    </div>

                    {/* Contenido */}
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "flex-start", gap: "8px"
                      }}>
                        <span style={{
                          fontSize: "13px", fontWeight: notif.leida ? "600" : "800",
                          color: colors.principal, lineHeight: "1.3"
                        }}>
                          {notif.titulo}
                        </span>
                        {!notif.leida && (
                          <div style={{
                            width: "8px", height: "8px",
                            backgroundColor: colors.secundario,
                            borderRadius: "50%", flexShrink: 0,
                            marginTop: "4px"
                          }} />
                        )}
                      </div>
                      <p style={{
                        fontSize: "12px", color: colors.textoSec,
                        margin: "4px 0 4px", lineHeight: "1.5"
                      }}>
                        {notif.mensaje}
                      </p>
                      <span style={{
                        fontSize: "11px", color: colors.apoyo,
                        fontWeight: "500"
                      }}>
                        {notif.fecha}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
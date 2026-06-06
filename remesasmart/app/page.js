"use client";
import { useState, useEffect } from "react";
import ChatIA from "../Componentes/ChatIA";
import EnviarSimple from "../Componentes/EnviarSimple";
import Login from "../Componentes/Login";
import PagosAutomaticos from "../Componentes/PagosAutomaticos";
import Recompensas from "../Componentes/Recompensas";
import PopupPuntos from "../Componentes/PopupPuntos";
import { getRewards } from "../lib/rewards";
import AxoGuia from "../Componentes/AxoGuia";
import useIsMobile from "../lib/useIsMobile";
import Landing from "../Componentes/Landing";
import Icon from "../Componentes/Icon";
import Notificaciones from "../Componentes/Notificaciones";
import { agregarNotificacion, enviarEmailNotificacion, TIPOS_NOTIF } from "../lib/notifications";

function ComparativaDinamica({ colors }) {
  const [monto, setMonto] = useState(100);
  const [animado, setAnimado] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setTimeout(() => setAnimado(true), 300);
  }, []);

  useEffect(() => {
    setAnimado(false);
    setTimeout(() => setAnimado(true), 100);
  }, [monto]);

  const servicios = [
    { nombre: "Waster Onion", fee: 8.00, color: "#dc2626", bg: "#fef2f2", logo: "waster", descripcion: "La mas cara del mercado" },
    { nombre: "MoneySham", fee: 6.50, color: "#ea580c", bg: "#fff7ed", logo: "moneysham", descripcion: "Comisiones escondidas" },
    { nombre: "SlowWise", fee: 4.20, color: "#ca8a04", bg: "#fefce8", logo: "slowwise", descripcion: "Lento y caro" },
    { nombre: "Axora", fee: 1.50, color: colors.secundario, bg: "#fff7ed", logo: "axora", descripcion: "La mejor opcion", destacado: true },
  ];

  const maxRecibe = monto - 1.50;

  return (
    <div style={{
      backgroundColor: "white", borderRadius: "24px",
      padding: isMobile ? "24px 16px" : "48px",
      marginBottom: "32px",
      boxShadow: "0 8px 40px rgba(41,76,116,0.1)",
      border: `1px solid ${colors.apoyo}40`,
      overflow: "hidden", position: "relative"
    }}>
      {/* Fondo decorativo */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "300px", height: "300px",
        background: `radial-gradient(circle, ${colors.secundario}08 0%, transparent 70%)`,
        pointerEvents: "none"
      }} />

      {/* Header */}
      <div style={{marginBottom: "32px", position: "relative", zIndex: 1}}>
        <div style={{
          display: "inline-block", backgroundColor: `${colors.principal}10`,
          color: colors.principal, padding: "4px 14px", borderRadius: "20px",
          fontSize: "11px", fontWeight: "700", letterSpacing: "1px",
          marginBottom: "12px", textTransform: "uppercase"
        }}>
          📊 Comparativa en tiempo real
        </div>
        <h2 style={{
          fontSize: isMobile ? "22px" : "32px",
          fontWeight: "900", color: colors.principal,
          margin: "0 0 6px 0", lineHeight: "1.2"
        }}>
          ¿Cuánto recibe tu familia<br/>
          <span style={{color: colors.secundario}}>al enviar ${monto.toLocaleString()} USD?</span>
        </h2>
        <p style={{fontSize: "14px", color: colors.textoSec, margin: 0}}>
          Mueve el slider para ver la diferencia en tiempo real
        </p>
      </div>

      {/* Slider */}
      <div style={{
        backgroundColor: colors.contenedor,
        borderRadius: "16px", padding: "20px 24px",
        marginBottom: "32px", border: `1px solid ${colors.apoyo}40`
      }}>
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px", gap: "12px",
          flexWrap: "wrap"
        }}>
          <span style={{fontSize: "14px", fontWeight: "700", color: colors.principal}}>
            Monto a enviar:
          </span>
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            backgroundColor: "white",
            border: `2px solid ${colors.secundario}`,
            borderRadius: "12px", padding: "8px 16px",
            boxShadow: `0 4px 12px ${colors.secundario}20`
          }}>
            <span style={{fontSize: "18px", fontWeight: "900", color: colors.textoSec}}>$</span>
            <input
              type="number"
              value={monto}
              onChange={e => setMonto(Math.min(2000, Math.max(100, parseFloat(e.target.value) || 100)))}
              min="10" max="2000" step="10"
              style={{
                width: "80px", border: "none", outline: "none",
                fontSize: "22px", fontWeight: "900", color: colors.principal,
                backgroundColor: "transparent", textAlign: "right"
              }}
            />
            <span style={{fontSize: "14px", fontWeight: "700", color: colors.textoSec}}>USD</span>
          </div>
        </div>

        <input
          type="range" min="10" max="2000" step="10"
          value={monto}
          onChange={e => setMonto(parseFloat(e.target.value))}
          style={{width: "100%", height: "8px", cursor: "pointer", accentColor: colors.secundario}}
        />
        <div style={{display: "flex", justifyContent: "space-between", marginTop: "8px"}}>
          {[10, 500, 1000, 1500, 2000].map(v => (
            <span
              key={v}
              onClick={() => setMonto(v)}
              style={{
                fontSize: "11px", cursor: "pointer", fontWeight: "600",
                color: monto === v ? colors.secundario : colors.textoSec,
                transition: "color 0.2s"
              }}
            >
              ${v}
            </span>
          ))}
        </div>
      </div>

      {/* Barras de comparativa */}
      <div style={{display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px"}}>
        {servicios.map((item, i) => {
          const recibe = monto - item.fee;
          const porcentaje = animado ? (recibe / maxRecibe) * 100 : 0;
          const ahorro = item.destacado ? null : (item.fee - 1.50).toFixed(2);
          const perdidaPct = Math.round((item.fee / monto) * 100 * 10) / 10;

          return (
            <div key={i} style={{
              padding: item.destacado ? "20px" : "14px 16px",
              borderRadius: "16px",
              backgroundColor: item.destacado ? `${colors.secundario}06` : "white",
              border: item.destacado
                ? `2px solid ${colors.secundario}`
                : `1px solid ${colors.apoyo}40`,
              transition: "all 0.3s",
              boxShadow: item.destacado ? `0 4px 20px ${colors.secundario}20` : "0 2px 8px rgba(0,0,0,0.03)"
            }}>
              {/* Nombre + info */}
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px", flexWrap: "wrap", gap: "8px"
              }}>
                <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                  {item.logo === "axora" ? (
                    <img src="/axoraLogo.png" alt="Axora"
                      style={{height: "28px", objectFit: "contain"}} />
                  ) : (
                    <img
                      src={`/${item.logo === "waster" ? "Waster Onion" : item.logo === "moneysham" ? "MoneySham" : "SlowWise"}.png`}
                      alt={item.nombre}
                      style={{width: "32px", height: "32px", objectFit: "contain", borderRadius: "8px"}}
                    />
                  )}
                  <div>
                    <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                      <span style={{
                        fontSize: "15px",
                        fontWeight: item.destacado ? "900" : "700",
                        color: item.destacado ? colors.principal : "#374151"
                      }}>
                        {item.nombre}
                      </span>
                      {item.destacado && (
                        <span style={{
                          background: `linear-gradient(135deg, ${colors.secundario}, #D96524)`,
                          color: "white", padding: "2px 10px",
                          borderRadius: "20px", fontSize: "10px", fontWeight: "800"
                        }}>
                          ✓ MEJOR OPCION
                        </span>
                      )}
                    </div>
                    <div style={{fontSize: "11px", color: colors.textoSec}}>
                      {item.descripcion}
                    </div>
                  </div>
                </div>

                <div style={{textAlign: "right"}}>
                  <div style={{
                    fontSize: "18px", fontWeight: "900",
                    color: item.destacado ? colors.secundario : "#dc2626"
                  }}>
                    -{item.fee.toFixed(2)} USD
                  </div>
                  {!item.destacado && (
                    <div style={{fontSize: "11px", color: "#dc2626", fontWeight: "600"}}>
                      Pierdes {perdidaPct}% de tu envio
                    </div>
                  )}
                  {item.destacado && (
                    <div style={{fontSize: "11px", color: "#16a34a", fontWeight: "600"}}>
                      Solo $1.50 fijo
                    </div>
                  )}
                </div>
              </div>

              {/* Barra */}
              <div style={{position: "relative"}}>
                <div style={{
                  backgroundColor: item.destacado ? `${colors.secundario}15` : "#f3f4f6",
                  borderRadius: "12px", height: item.destacado ? "48px" : "38px",
                  overflow: "hidden", position: "relative"
                }}>
                  <div style={{
                    width: `${porcentaje}%`, height: "100%",
                    background: item.destacado
                      ? `linear-gradient(90deg, ${colors.secundario}, #fbbf24)`
                      : `linear-gradient(90deg, ${item.color}99, ${item.color}66)`,
                    borderRadius: "12px",
                    display: "flex", alignItems: "center",
                    paddingLeft: "16px", gap: "8px",
                    transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    boxShadow: item.destacado ? `0 4px 12px ${colors.secundario}40` : "none"
                  }}>
                    <span style={{
                      color: "white", fontSize: item.destacado ? "18px" : "14px",
                      fontWeight: "900", whiteSpace: "nowrap",
                      textShadow: "0 1px 3px rgba(0,0,0,0.2)"
                    }}>
                      ${recibe.toFixed(2)} USD
                    </span>
                    {item.destacado && (
                      <span style={{
                        fontSize: "12px", color: "rgba(255,255,255,0.9)",
                        fontWeight: "600"
                      }}>
                        recibe tu familia
                      </span>
                    )}
                  </div>
                </div>

                {/* Indicador de ahorro vs Axora */}
                {ahorro && (
                  <div style={{
                    marginTop: "6px", fontSize: "11px",
                    color: "#16a34a", fontWeight: "700",
                    display: "flex", alignItems: "center", gap: "4px"
                  }}>
                    <Icon nombre="coins" size={12} color="16A34A" />
                    Con Axora ahorras ${ahorro} USD mas
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen destacado */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: "16px"
      }}>
        {/* Ahorro total */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.principal}, #3d6a9e)`,
          borderRadius: "16px", padding: "20px",
          color: "white"
        }}>
          <div style={{fontSize: "13px", color: "rgba(255,255,255,0.7)", marginBottom: "6px"}}>
            Ahorras con Axora vs Waster Onion:
          </div>
          <div style={{fontSize: "36px", fontWeight: "900", marginBottom: "4px"}}>
            ${(8.00 - 1.50).toFixed(2)} USD
          </div>
          <div style={{fontSize: "13px", color: "rgba(255,255,255,0.7)"}}>
            En 12 envios: <strong>${((8.00 - 1.50) * 12).toFixed(2)} USD al año</strong>
          </div>
        </div>

        {/* Tu familia recibe */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.secundario}, #D96524)`,
          borderRadius: "16px", padding: "20px",
          color: "white"
        }}>
          <div style={{fontSize: "13px", color: "rgba(255,255,255,0.85)", marginBottom: "6px"}}>
            Tu familia recibe con Axora:
          </div>
          <div style={{fontSize: "36px", fontWeight: "900", marginBottom: "4px"}}>
            ${(monto - 1.50).toFixed(2)} USD
          </div>
          <div style={{fontSize: "13px", color: "rgba(255,255,255,0.85)"}}>
            de ${monto} USD enviados → <strong>{(((monto - 1.50) / monto) * 100).toFixed(1)}% llega</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [seccion, setSeccion] = useState("inicio");
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [rewards, setRewards] = useState(null);
  const [popupEvento, setPopupEvento] = useState(null);
  const [balanceAMXN, setBalanceAMXN] = useState("0");
  const isMobile = useIsMobile();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [notifUpdate, setNotifUpdate] = useState(0);

  const colors = {
    principal: "#294C74",
    secundario: "#F17633",
    apoyo: "#C0B9AB",
    fondo: "#E7E1DB",
    texto: "#294C74",
    textoSec: "#8E8578",
    boton: "#F17633",
    botonHover: "#D96524",
    contenedor: "#F8F6F3"
  };

  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      if (
        event.reason?.message?.includes("MetaMask") ||
        event.reason?.message?.includes("Failed to connect")
      ) {
        event.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    const usuarioGuardado = localStorage.getItem("axora_usuario");
    if (usuarioGuardado) {
      const u = JSON.parse(usuarioGuardado);
      if (u.tipo === "metamask" && typeof window.ethereum === "undefined") {
        localStorage.removeItem("axora_usuario");
      } else {
        setUsuario(u);
      }
    }
    setCargando(false);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    if (!usuario) return;

    if (usuario.tipo === "metamask" && window.ethereum) {
      const cargarBalance = async () => {
        try {
          const { ethers } = await import("ethers");
          const { CONTRATO_REMESAS, ABI_REMESAS } = await import("../lib/contrato");
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contrato = new ethers.Contract(CONTRATO_REMESAS, ABI_REMESAS, provider);
          const balance = await contrato.balanceAMXN(usuario.wallet);
          setBalanceAMXN(balance.toString());
        } catch (e) {
          console.log("Error cargando AMXN:", e);
        }
      };
      cargarBalance();
    } else if (usuario.tipo === "email") {
      const keyAMXN = `axora_amxn_${usuario.email}`;
      const balance = localStorage.getItem(keyAMXN) || "0";
      setBalanceAMXN(parseFloat(balance).toFixed(0));
    }
  }, [usuario]);

  useEffect(() => {
    if (usuario) {
      setRewards(getRewards(usuario));

      const ultimaAlerta = localStorage.getItem("axora_ultima_alerta_tc");
      const ahora = Date.now();
      const unaHora = 60 * 60 * 1000;

      if (!ultimaAlerta || ahora - parseInt(ultimaAlerta) > unaHora) {
        const variacion = (Math.random() * 3 + 0.5).toFixed(1);
        const tipoCambio = (17.85 + Math.random() * 0.5).toFixed(2);

        if (parseFloat(variacion) > 1.5) {
          notificar(
            "tipo_cambio_favorable",
            `📈 ¡Buen momento para enviar!`,
            `El dólar está en $${tipoCambio} MXN, ${variacion}% arriba del promedio`,
            {
              tipoCambio,
              variacion,
              consejo: `Hoy es buen momento para enviar dinero. El dólar está ${variacion}% arriba del promedio semanal.`
            }
          );
          localStorage.setItem("axora_ultima_alerta_tc", ahora.toString());
        }
      }
    }
  }, [usuario]);

  const cerrarSesion = () => {
    localStorage.removeItem("axora_usuario");
    setUsuario(null);
    setSeccion("inicio");
  };

  const mostrarPuntos = (evento) => {
    setPopupEvento(evento);
    if (usuario) setRewards(getRewards(usuario));
  };

  const notificar = async (tipo, titulo, mensaje, emailData = null) => {
    if (!usuario) return;
    agregarNotificacion(usuario, tipo, titulo, mensaje);
    setNotifUpdate(p => p + 1);
    if (usuario.email && emailData) {
      await enviarEmailNotificacion(tipo, usuario.email, emailData);
    }
  };

  if (cargando) {
    return (
      <div style={{minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: colors.fondo}}>
        <div style={{textAlign: "center"}}>
          <img src="/axoraLogo.png" alt="Axora" style={{height: "60px", marginBottom: "16px"}} />
          <p style={{color: colors.textoSec}}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!usuario && !mostrarLogin) {
    return <Landing onEntrar={() => setMostrarLogin(true)} colors={colors} />;
  }

  if (!usuario && mostrarLogin) {
    return <Login onLogin={setUsuario} colors={colors} />;
  }

  return (
    <div style={{fontFamily: "'Segoe UI', -apple-system, sans-serif", background: colors.fondo, minHeight: "100vh"}}>

      {/* NAVBAR */}
      <nav style={{
        backgroundColor: "white",
        padding: isMobile ? "0 16px" : "0 24px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        height: "70px",
        boxShadow: "0 2px 12px rgba(41,76,116,0.08)",
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: `1px solid ${colors.apoyo}40`
      }}>
        {/* Logo */}
        <div style={{display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0}}
          onClick={() => { setSeccion("inicio"); setMenuAbierto(false); }}>
          <img src="/axoraLogo.png" alt="Axora" style={{height: "40px", objectFit: "contain"}} />
        </div>

        {/* Tabs centrados - solo desktop */}
        {!isMobile && (
          <div style={{
            display: "flex", gap: "4px",
            position: "absolute", left: "50%",
            transform: "translateX(-50%)"
          }}>
            {[
              {id: "inicio", label: "Inicio", icon: <Icon nombre="home" size={18} color={seccion === "inicio" ? "FFFFFF" : "8E8578"} />},
              {id: "enviar", label: "Enviar", icon: <Icon nombre="money-transfer" size={18} color={seccion === "enviar" ? "FFFFFF" : "8E8578"} />},
              {id: "pagos", label: "Pagos", icon: <Icon nombre="recurring-appointment" size={18} color={seccion === "pagos" ? "FFFFFF" : "8E8578"} />},
              {id: "recompensas", label: "Recompensas", icon: <Icon nombre="star" size={18} color={seccion === "recompensas" ? "FFFFFF" : "8E8578"} />},
              {id: "chat", label: "Axo", icon: <img src="/axo.png" style={{width: "18px", height: "18px", borderRadius: "50%", objectFit: "cover"}} />}
            ].map(tab => (
              <button key={tab.id} onClick={() => setSeccion(tab.id)} style={{
                backgroundColor: seccion === tab.id ? colors.principal : "transparent",
                color: seccion === tab.id ? "white" : colors.textoSec,
                border: "none", padding: "10px 16px", borderRadius: "10px",
                fontSize: "13px", fontWeight: "600", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px",
                transition: "all 0.2s"
              }}>
                {tab.icon}<span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Derecha: Notificaciones + Usuario */}
        <div style={{display: "flex", alignItems: "center", gap: "8px", flexShrink: 0}}>
          {!isMobile && (
            <>
              {/* Campana */}
              <Notificaciones
                usuario={usuario}
                colors={colors}
                onUpdate={() => setNotifUpdate(p => p + 1)}
              />
              {/* Usuario */}
              <div style={{
                backgroundColor: `${colors.principal}10`,
                borderRadius: "10px", padding: "6px 12px",
                display: "flex", alignItems: "center", gap: "8px"
              }}>
                <div style={{
                  width: "30px", height: "30px", borderRadius: "50%",
                  backgroundColor: colors.secundario,
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "14px"
                }}>
                  {usuario?.tipo === "metamask" ? "🦊" : "👤"}
                </div>
                <div>
                  <div style={{fontSize: "12px", fontWeight: "700", color: colors.principal}}>
                    {usuario?.nombre?.split(" ")[0]}
                  </div>
                  {rewards && (
                    <div style={{fontSize: "11px", color: colors.secundario, fontWeight: "700"}}>
                      ⭐ {rewards.puntos} pts
                    </div>
                  )}
                </div>
              </div>
              <button onClick={cerrarSesion} style={{
                backgroundColor: "transparent", color: colors.textoSec,
                border: `1px solid ${colors.apoyo}`, padding: "8px 12px",
                borderRadius: "10px", fontSize: "12px", fontWeight: "600", cursor: "pointer"
              }}>Salir</button>
            </>
          )}

          {/* Mobile: puntos + campana + hamburguesa */}
          {isMobile && (
            <>
              {rewards && (
                <div style={{
                  backgroundColor: `${colors.secundario}15`,
                  borderRadius: "8px", padding: "4px 10px",
                  fontSize: "12px", fontWeight: "800", color: colors.secundario
                }}>
                  ⭐ {rewards.puntos}
                </div>
              )}
              {/* Campana en móvil */}
              <Notificaciones
                usuario={usuario}
                colors={colors}
                onUpdate={() => setNotifUpdate(p => p + 1)}
              />
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                style={{
                  backgroundColor: "transparent", border: "none",
                  cursor: "pointer", padding: "8px",
                  display: "flex", flexDirection: "column",
                  gap: "5px", alignItems: "center"
                }}
              >
                <div style={{width: "22px", height: "2px", backgroundColor: menuAbierto ? colors.secundario : colors.principal, transition: "all 0.3s", transform: menuAbierto ? "rotate(45deg) translateY(7px)" : "none"}} />
                <div style={{width: "22px", height: "2px", backgroundColor: menuAbierto ? "transparent" : colors.principal, transition: "all 0.3s"}} />
                <div style={{width: "22px", height: "2px", backgroundColor: menuAbierto ? colors.secundario : colors.principal, transition: "all 0.3s", transform: menuAbierto ? "rotate(-45deg) translateY(-7px)" : "none"}} />
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Menu mobile desplegable */}
      {isMobile && menuAbierto && (
        <div style={{
          position: "fixed", top: "70px", left: 0, right: 0,
          backgroundColor: "white", zIndex: 99,
          boxShadow: "0 8px 20px rgba(41,76,116,0.15)",
          borderBottom: `2px solid ${colors.apoyo}40`,
          padding: "16px"
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "12px 16px",
            backgroundColor: colors.contenedor,
            borderRadius: "12px", marginBottom: "12px"
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              backgroundColor: colors.secundario,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px"
            }}>
              {usuario?.tipo === "metamask" ? "🦊" : "👤"}
            </div>
            <div>
              <div style={{fontSize: "14px", fontWeight: "700", color: colors.principal}}>
                {usuario?.nombre}
              </div>
              <div style={{fontSize: "12px", color: colors.textoSec}}>
                {usuario?.email || `${usuario?.wallet?.slice(0,8)}...`}
              </div>
            </div>
          </div>

          {[
            {id: "inicio", label: "Inicio", icon: <Icon nombre="home" size={22} color="294C74" />},
            {id: "enviar", label: "Enviar Remesa", icon: <Icon nombre="money-transfer" size={22} color="294C74" />},
            {id: "pagos", label: "Pagos Automaticos", icon: <Icon nombre="recurring-appointment" size={22} color="294C74" />},
            {id: "recompensas", label: "Mis Recompensas", icon: <Icon nombre="star" size={22} color="294C74" />},
            {id: "chat", label: "Preguntale a Axo", icon: <img src="/axo.png" style={{width:"22px", height:"22px", borderRadius:"50%", objectFit:"cover"}} />}
          ].map(tab => (
            <button key={tab.id}
              onClick={() => { setSeccion(tab.id); setMenuAbierto(false); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "12px",
                padding: "14px 16px", marginBottom: "6px",
                backgroundColor: seccion === tab.id ? `${colors.principal}10` : "transparent",
                border: seccion === tab.id ? `2px solid ${colors.principal}20` : "2px solid transparent",
                borderRadius: "12px", cursor: "pointer",
                color: seccion === tab.id ? colors.principal : colors.textoSec,
                fontSize: "15px", fontWeight: seccion === tab.id ? "700" : "500",
                textAlign: "left"
              }}
            >
              <span style={{fontSize: "20px"}}>{tab.icon}</span>
              <span>{tab.label}</span>
              {seccion === tab.id && <span style={{marginLeft: "auto", color: colors.principal}}>✓</span>}
            </button>
          ))}

          <button onClick={cerrarSesion} style={{
            width: "100%", marginTop: "8px",
            backgroundColor: "#fef2f2", color: "#dc2626",
            border: "1px solid #fecaca", padding: "12px",
            borderRadius: "12px", fontSize: "14px",
            fontWeight: "700", cursor: "pointer"
          }}>
            Cerrar Sesion
          </button>
        </div>
      )}

      <div style={{maxWidth: "1180px", margin: "0 auto", padding: isMobile ? "20px 12px 120px" : "48px 24px"}}>

        {/* INICIO */}
        {seccion === "inicio" && (
          <div>
            <div style={{
              backgroundColor: "white", borderRadius: "24px",
              padding: isMobile ? "28px 20px" : "64px 56px",
              marginBottom: "24px",
              boxShadow: "0 8px 30px rgba(41,76,116,0.08)",
              position: "relative", overflow: "hidden",
              border: `1px solid ${colors.apoyo}40`
            }}>
              <div style={{position: "relative", zIndex: 1}}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  backgroundColor: `${colors.secundario}15`,
                  border: `1px solid ${colors.secundario}40`,
                  borderRadius: "20px", padding: "6px 14px",
                  fontSize: "11px", color: colors.secundario,
                  marginBottom: "16px", fontWeight: "700", textTransform: "uppercase"
                }}>
                  <span>⚡</span> Blockchain + IA
                </div>
                <h1 style={{
                  fontSize: isMobile ? "28px" : "44px",
                  fontWeight: "900", margin: "0 0 12px 0",
                  lineHeight: "1.2", color: colors.principal,
                  letterSpacing: "-0.5px"
                }}>
                  Hola, {usuario?.nombre?.split(" ")[0]} 👋
                </h1>
                <h2 style={{
                  fontSize: isMobile ? "22px" : "36px",
                  fontWeight: "900", margin: "0 0 16px 0",
                  lineHeight: "1.2", color: colors.secundario
                }}>
                  Listo para enviar?
                </h2>
                <p style={{
                  fontSize: isMobile ? "14px" : "17px",
                  color: colors.textoSec,
                  margin: "0 0 24px 0", lineHeight: "1.6"
                }}>
                  Envia dinero a Mexico de forma segura, rapida y sin comisiones abusivas. Tu familia recibe mas.
                </p>
                <div style={{
                  display: "flex", gap: "10px",
                  flexDirection: isMobile ? "column" : "row"
                }}>
                  <button onClick={() => setSeccion("enviar")} style={{
                    backgroundColor: colors.secundario, color: "white",
                    border: "none", padding: isMobile ? "14px" : "16px 32px",
                    borderRadius: "12px", fontSize: "15px",
                    fontWeight: "700", cursor: "pointer",
                    boxShadow: "0 8px 20px rgba(241,118,51,0.3)",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "8px"
                  }}>
                    Enviar dinero ahora <span>→</span>
                  </button>
                  <button onClick={() => setSeccion("chat")} style={{
                    backgroundColor: "transparent", color: colors.principal,
                    border: `2px solid ${colors.principal}`,
                    padding: isMobile ? "14px" : "14px 28px",
                    borderRadius: "12px", fontSize: "15px",
                    fontWeight: "700", cursor: "pointer",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "8px"
                  }}>
                    <img src="/axo.png" style={{width: "22px", height: "22px", borderRadius: "50%", objectFit: "cover"}} />
                    Preguntale a Axo
                  </button>
                </div>
              </div>
              {!isMobile && (
                <div style={{position: "absolute", right: "48px", top: "50%", transform: "translateY(-50%)"}}>
                  <img src="/axoraLogo.png" alt="" style={{height: "200px", opacity: 0.06}} />
                </div>
              )}
            </div>

            {/* Comparativa - justo después del hero */}
            <ComparativaDinamica colors={colors} />

            {/* Stats */}
            <div style={{display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: "16px", marginBottom: "40px"}}>
              {[
                {icon: <Icon nombre="coins" size={32} color="294C74" />, valor: "$1.50", label: "Comision por envio"},
                {icon: <Icon nombre="time" size={32} color="294C74" />, valor: "2 min", label: "Tiempo de llegada"},
                {icon: <Icon nombre="lock-2" size={32} color="294C74" />, valor: "100%", label: "Seguro blockchain"},
                {icon: <img src="/axo.png" style={{width:"32px", height:"32px", borderRadius:"50%", objectFit:"cover"}} />, valor: "24/7", label: "Axo te asesora"}
              ].map((stat, i) => (
                <div key={i} style={{backgroundColor: "white", borderRadius: "16px", padding: "24px", border: `1px solid ${colors.apoyo}50`, boxShadow: "0 2px 8px rgba(41,76,116,0.04)"}}>
                  <div style={{marginBottom: "12px"}}>{stat.icon}</div>
                  <div style={{fontSize: "30px", fontWeight: "800", color: colors.principal, marginBottom: "4px"}}>{stat.valor}</div>
                  <div style={{fontSize: "13px", color: colors.textoSec, fontWeight: "500"}}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div style={{display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "16px"}}>
              {[
                {icon: <Icon nombre="chain" size={28} color="F17633" />, titulo: "Blockchain seguro", desc: "Cada transaccion queda registrada permanentemente. Nadie puede modificarla."},
                {icon: <img src="/axo.png" style={{width:"28px", height:"28px", borderRadius:"50%", objectFit:"cover"}} />, titulo: "Axo te guia", desc: "Nuestro ajolote IA te asesora 24/7 sobre el mejor momento para enviar dinero."},
                {icon: <Icon nombre="recurring-appointment" size={28} color="F17633" />, titulo: "Pagos automaticos", desc: "Configura CFE, renta y servicios. Tu dinero se distribuye automaticamente."}
              ].map((f, i) => (
                <div key={i} style={{backgroundColor: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(41,76,116,0.05)", border: `1px solid ${colors.apoyo}40`, borderTop: `4px solid ${colors.secundario}`}}>
                  <div style={{width: "56px", height: "56px", backgroundColor: `${colors.secundario}15`, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px"}}>{f.icon}</div>
                  <h3 style={{fontSize: "17px", fontWeight: "800", color: colors.principal, margin: "0 0 8px 0"}}>{f.titulo}</h3>
                  <p style={{fontSize: "14px", color: colors.textoSec, margin: 0, lineHeight: "1.6"}}>{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Historial de envíos recientes */}
            {(() => {
              const key = `axora_historial_${usuario?.email || usuario?.wallet}`;
              const historial = JSON.parse(localStorage.getItem(key) || "[]");
              if (historial.length === 0) return null;
              return (
                <div style={{
                  backgroundColor: "white", borderRadius: "20px",
                  padding: "32px", marginTop: "20px",
                  boxShadow: "0 2px 12px rgba(41,76,116,0.06)",
                  border: `1px solid ${colors.apoyo}40`
                }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: "20px"
                  }}>
                    <div>
                      <h3 style={{fontSize: "18px", fontWeight: "800",
                        color: colors.principal, margin: "0 0 4px 0"}}>
                        Envíos recientes
                      </h3>
                      <p style={{fontSize: "13px", color: colors.textoSec, margin: 0}}>
                        Tus últimas transferencias
                      </p>
                    </div>
                    <button onClick={() => setSeccion("enviar")} style={{
                      backgroundColor: colors.secundario, color: "white",
                      border: "none", padding: "8px 16px", borderRadius: "10px",
                      fontSize: "13px", fontWeight: "700", cursor: "pointer"
                    }}>
                      + Nuevo envío
                    </button>
                  </div>

                  <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                    {historial.slice(0, 5).map((envio, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center",
                        gap: "14px", padding: "14px 16px",
                        backgroundColor: colors.contenedor,
                        borderRadius: "12px",
                        border: `1px solid ${colors.apoyo}30`
                      }}>
                        {/* Avatar */}
                        <div style={{
                          width: "44px", height: "44px", borderRadius: "50%",
                          background: `linear-gradient(135deg, ${colors.principal}, #3d6a9e)`,
                          display: "flex", alignItems: "center",
                          justifyContent: "center", flexShrink: 0
                        }}>
                          <Icon nombre="user" size={22} color="FFFFFF" />
                        </div>

                        {/* Info */}
                        <div style={{flex: 1}}>
                          <div style={{
                            fontSize: "14px", fontWeight: "700",
                            color: colors.principal, marginBottom: "2px"
                          }}>
                            {envio.nombre}
                          </div>
                          <div style={{fontSize: "12px", color: colors.textoSec}}>
                            {envio.banco} · ****{envio.clabe.slice(-4)} · {envio.fecha}
                          </div>
                        </div>

                        {/* Montos */}
                        <div style={{textAlign: "right", flexShrink: 0}}>
                          <div style={{
                            fontSize: "16px", fontWeight: "900",
                            color: colors.principal
                          }}>
                            ${envio.cantidadUSD} USD
                          </div>
                          <div style={{fontSize: "12px", color: "#16a34a", fontWeight: "600"}}>
                            ${envio.cantidadMXN} MXN
                          </div>
                        </div>

                        {/* Ver en Etherscan */}
                        {envio.txHash && (
                          <a
                            href={`https://sepolia.etherscan.io/tx/${envio.txHash}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{flexShrink: 0}}
                            title="Ver en Etherscan"
                          >
                            <Icon nombre="chain" size={20} color="294C74" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ENVIAR */}
        {seccion === "enviar" && (
          <div style={{minHeight: "60vh"}}>
            <div style={{textAlign: "center", marginBottom: "40px"}}>
              <h1 style={{fontSize: isMobile ? "28px" : "36px", fontWeight: "900", color: colors.principal, margin: "0 0 8px 0"}}>
                Envia dinero a Mexico
              </h1>
              <p style={{fontSize: "16px", color: colors.textoSec, margin: 0}}>
                Simple, rapido y sin comisiones abusivas
              </p>
            </div>
            <EnviarSimple colors={colors} usuario={usuario} onPuntos={mostrarPuntos} onNotificar={notificar} />
          </div>
        )}

        {/* PAGOS */}
        {seccion === "pagos" && (
          <div style={{minHeight: "60vh"}}>
            <PagosAutomaticos colors={colors} usuario={usuario} onPuntos={mostrarPuntos} />
          </div>
        )}

        {/* RECOMPENSAS */}
        {seccion === "recompensas" && (
          <Recompensas colors={colors} usuario={usuario} />
        )}

        {/* CHAT */}
        {seccion === "chat" && (
          <ChatIA usuario={usuario} onPuntos={mostrarPuntos} />
        )}

      </div>

      {popupEvento && (
        <PopupPuntos
          evento={popupEvento}
          onClose={() => setPopupEvento(null)}
          colors={colors}
        />
      )}

      {/* FOOTER */}
      <footer style={{
        backgroundColor: colors.principal,
        color: "white",
        padding: isMobile ? "20px 16px" : "32px 24px",
        marginTop: isMobile ? "32px" : "60px"
      }}>
        <div style={{
          maxWidth: "1180px", margin: "0 auto",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: isMobile ? "12px" : "0",
          textAlign: isMobile ? "center" : "left"
        }}>
          <div style={{backgroundColor: "white", borderRadius: "8px", padding: "6px 10px"}}>
            <img src="/axoraLogo.png" alt="Axora" style={{height: "28px", objectFit: "contain"}} />
          </div>
          <div style={{fontSize: "12px", color: colors.apoyo}}>
            © 2026 Axora - Impulsado por Blockchain + IA
          </div>
          <div style={{fontSize: "11px", color: colors.apoyo, opacity: 0.7}}>
            Red de prueba Ethereum Sepolia
          </div>
        </div>
      </footer>

      {/* Guia interactiva de Axo */}
      <AxoGuia
        seccion={seccion}
        colors={colors}
        onNavegar={setSeccion}
      />

    </div>
  );
}
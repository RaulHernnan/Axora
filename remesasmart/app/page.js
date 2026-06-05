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

function ComparativaDinamica({ colors }) {
  const [monto, setMonto] = useState(500);
  const isMobile = useIsMobile();

  const servicios = [
    { nombre: "Western Union", fee: 8.00, color: "#dc2626", logo: "🟡" },
    { nombre: "MoneyGram", fee: 6.50, color: "#ea580c", logo: "🟠" },
    { nombre: "Inteligente", fee: 4.20, color: "#ca8a04", logo: "🟢" },
    { nombre: "Axora", fee: 0.50, color: colors.secundario, logo: "axora", destacado: true },
  ];

  const maxRecibe = monto - 0.50;

  return (
    <div style={{
      backgroundColor: "white", borderRadius: "20px",
      padding: isMobile ? "24px 16px" : "40px",
      marginBottom: "32px",
      boxShadow: "0 4px 20px rgba(41,76,116,0.06)",
      border: `1px solid ${colors.apoyo}40`
    }}>
      {/* Header */}
      <div style={{marginBottom: "20px"}}>
        <div style={{
          display: "inline-block", backgroundColor: `${colors.principal}10`,
          color: colors.principal, padding: "4px 12px", borderRadius: "12px",
          fontSize: "11px", fontWeight: "700", letterSpacing: "1px", marginBottom: "10px"
        }}>COMPARATIVA</div>
        <h2 style={{
          fontSize: isMobile ? "18px" : "24px",
          fontWeight: "800", color: colors.principal, margin: "0 0 16px 0"
        }}>
          Cuanto recibes al enviar ${monto.toLocaleString()} USD
        </h2>

        {/* Input de monto */}
        <div style={{
          backgroundColor: colors.contenedor, borderRadius: "14px",
          padding: "16px", border: `1px solid ${colors.apoyo}40`
        }}>
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: "12px",
            gap: "8px", flexWrap: "wrap"
          }}>
            <label style={{
              fontSize: "13px", fontWeight: "700",
              color: colors.principal, whiteSpace: "nowrap"
            }}>
              Monto a enviar:
            </label>
            <div style={{
              display: "flex", alignItems: "center", gap: "4px",
              backgroundColor: "white",
              border: `2px solid ${colors.secundario}`,
              borderRadius: "10px", padding: "6px 12px"
            }}>
              <span style={{fontSize: "14px", fontWeight: "800", color: colors.textoSec}}>$</span>
              <input
                type="number"
                value={monto}
                onChange={e => setMonto(Math.min(2000, Math.max(10, parseFloat(e.target.value) || 10)))}
                min="10" max="2000" step="10"
                style={{
                  width: "60px", border: "none", outline: "none",
                  fontSize: "16px", fontWeight: "900", color: colors.principal,
                  backgroundColor: "transparent", textAlign: "right"
                }}
              />
              <span style={{fontSize: "12px", fontWeight: "700", color: colors.textoSec}}>USD</span>
            </div>
          </div>

          <input
            type="range" min="10" max="2000" step="10"
            value={monto}
            onChange={e => setMonto(parseFloat(e.target.value))}
            style={{width: "100%", height: "6px", cursor: "pointer", accentColor: colors.secundario}}
          />
          <div style={{display: "flex", justifyContent: "space-between", marginTop: "4px"}}>
            <span style={{fontSize: "11px", color: colors.textoSec}}>$10</span>
            <span style={{fontSize: "11px", color: colors.textoSec}}>$2,000 USD</span>
          </div>
        </div>
      </div>

      {/* Barras */}
      <div style={{display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px"}}>
        {servicios.map((item, i) => {
          const recibe = monto - item.fee;
          const porcentaje = (recibe / maxRecibe) * 100;

          return (
            <div key={i} style={{
              padding: item.destacado ? "12px" : "8px",
              borderRadius: "12px",
              backgroundColor: item.destacado ? `${colors.secundario}08` : "transparent",
              border: item.destacado ? `2px solid ${colors.secundario}` : "2px solid transparent"
            }}>
              {/* Nombre + fee en la misma línea */}
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: "6px"
              }}>
                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                  {item.logo === "axora" ? (
                    <img src="/axoraLogo.png" alt="Axora" style={{height: "18px", objectFit: "contain"}} />
                  ) : (
                    <span style={{fontSize: "16px"}}>{item.logo}</span>
                  )}
                  <span style={{
                    fontSize: "13px",
                    fontWeight: item.destacado ? "800" : "600",
                    color: colors.principal
                  }}>
                    {item.nombre}
                  </span>
                  {item.destacado && (
                    <span style={{
                      backgroundColor: colors.secundario, color: "white",
                      padding: "1px 6px", borderRadius: "6px",
                      fontSize: "9px", fontWeight: "700"
                    }}>NOSOTROS</span>
                  )}
                </div>
                <span style={{
                  fontSize: "12px", fontWeight: "700",
                  color: item.destacado ? colors.secundario : "#9ca3af"
                }}>
                  -{item.fee.toFixed(2)} USD
                </span>
              </div>

              {/* Barra */}
              <div style={{
                backgroundColor: colors.fondo,
                borderRadius: "8px", height: "32px", overflow: "hidden"
              }}>
                <div style={{
                  width: `${porcentaje}%`, height: "100%",
                  background: item.destacado
                    ? `linear-gradient(90deg, ${colors.secundario}, ${colors.botonHover})`
                    : `linear-gradient(90deg, ${item.color}, ${item.color}bb)`,
                  borderRadius: "8px",
                  display: "flex", alignItems: "center", paddingLeft: "12px",
                  transition: "width 0.6s ease"
                }}>
                  <span style={{color: "white", fontSize: "13px", fontWeight: "700"}}>
                    ${recibe.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.principal}, #3d6a9e)`,
        borderRadius: "14px", padding: "16px 20px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "center",
        gap: "12px"
      }}>
        <div style={{color: "white"}}>
          <div style={{fontSize: "12px", color: colors.apoyo, marginBottom: "4px"}}>
            Ahorras con Axora vs Western Union:
          </div>
          <div style={{fontSize: isMobile ? "22px" : "26px", fontWeight: "900"}}>
            ${(8.00 - 0.50).toFixed(2)} USD por envio
          </div>
          <div style={{fontSize: "12px", color: colors.apoyo, marginTop: "2px"}}>
            En 12 envios: ${((8.00 - 0.50) * 12).toFixed(2)} USD al año
          </div>
        </div>

        <div style={{
          textAlign: isMobile ? "left" : "right",
          borderTop: isMobile ? `1px solid rgba(255,255,255,0.2)` : "none",
          paddingTop: isMobile ? "12px" : "0",
          width: isMobile ? "100%" : "auto"
        }}>
          <div style={{fontSize: "12px", color: colors.apoyo, marginBottom: "4px"}}>
            Tu familia recibe:
          </div>
          <div style={{fontSize: isMobile ? "28px" : "32px", fontWeight: "900", color: "white"}}>
            ${(monto - 0.50).toFixed(2)} USD
          </div>
          <div style={{fontSize: "12px", color: colors.apoyo}}>
            de ${monto} USD enviados
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
  const isMobile = useIsMobile();
  const [menuAbierto, setMenuAbierto] = useState(false);

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
    if (usuario) setRewards(getRewards(usuario));
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
        padding: isMobile ? "0 16px" : "0 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "70px",
        boxShadow: "0 2px 12px rgba(41,76,116,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: `1px solid ${colors.apoyo}40`
      }}>
        {/* Logo */}
        <div style={{display: "flex", alignItems: "center", gap: "12px", cursor: "pointer"}}
          onClick={() => { setSeccion("inicio"); setMenuAbierto(false); }}>
          <img src="/axoraLogo.png" alt="Axora" style={{height: "40px", objectFit: "contain"}} />
        </div>

        {/* Desktop: tabs */}
        {!isMobile && (
          <div style={{display: "flex", gap: "4px"}}>
            {[
              {id: "inicio", label: "Inicio", icon: <Icon nombre="home" size={18} color="294C74" />},
              {id: "enviar", label: "Enviar", icon: <Icon nombre="money-transfer" size={18} color="294C74" />},
              {id: "pagos", label: "Pagos", icon: <Icon nombre="recurring-appointment" size={18} color="294C74" />},
              {id: "recompensas", label: "Recompensas", icon: <Icon nombre="star" size={18} color="294C74" />},
              {id: "chat", label: "Axo", icon: <img src="/axo.png" style={{width:"20px", height:"20px", borderRadius:"50%", objectFit:"cover"}} />}
            ].map(tab => (
              <button key={tab.id} onClick={() => setSeccion(tab.id)} style={{
                backgroundColor: seccion === tab.id ? colors.principal : "transparent",
                color: seccion === tab.id ? "white" : colors.textoSec,
                border: "none", padding: "10px 16px", borderRadius: "10px",
                fontSize: "13px", fontWeight: "600", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px"
              }}>
                {tab.icon}<span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Desktop: usuario */}
        {!isMobile && (
          <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
            <div style={{
              backgroundColor: `${colors.principal}10`,
              borderRadius: "10px", padding: "8px 12px",
              display: "flex", alignItems: "center", gap: "8px"
            }}>
              <div style={{
                width: "30px", height: "30px", borderRadius: "50%",
                backgroundColor: colors.secundario,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px"
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
          </div>
        )}

        {/* Mobile: puntos + hamburguesa */}
        {isMobile && (
          <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
            {rewards && (
              <div style={{
                backgroundColor: `${colors.secundario}15`,
                borderRadius: "8px", padding: "4px 10px",
                fontSize: "12px", fontWeight: "800", color: colors.secundario
              }}>
                ⭐ {rewards.puntos}
              </div>
            )}
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
          </div>
        )}
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

            {/* Stats */}
            <div style={{display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: "16px", marginBottom: "40px"}}>
              {[
                {icon: <Icon nombre="coins" size={32} color="294C74" />, valor: "$0.50", label: "Comision por envio"},
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

            {/* COMPARATIVA DINAMICA */}
            <ComparativaDinamica colors={colors} />

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
            <EnviarSimple colors={colors} usuario={usuario} onPuntos={mostrarPuntos} />
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
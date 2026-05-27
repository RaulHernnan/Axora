"use client";
import { useState, useEffect } from "react";
import ChatIA from "../Componentes/ChatIA";
import EnviarSimple from "../Componentes/EnviarSimple";
import Login from "../Componentes/Login";
import PagosAutomaticos from "../Componentes/PagosAutomaticos";

export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [seccion, setSeccion] = useState("inicio");

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
    const usuarioGuardado = localStorage.getItem("axora_usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setCargando(false);
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("axora_usuario");
    setUsuario(null);
    setSeccion("inicio");
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

  if (!usuario) {
    return <Login onLogin={setUsuario} colors={colors} />;
  }

  return (
    <div style={{fontFamily: "'Segoe UI', -apple-system, sans-serif", background: colors.fondo, minHeight: "100vh"}}>

      {/* NAVBAR */}
      <nav style={{
        backgroundColor: "white", padding: "0 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "76px", boxShadow: "0 2px 12px rgba(41,76,116,0.08)",
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: `1px solid ${colors.apoyo}40`
      }}>
        <div style={{display: "flex", alignItems: "center", gap: "12px", cursor: "pointer"}} onClick={() => setSeccion("inicio")}>
          <img src="/axoraLogo.png" alt="Axora" style={{height: "44px", objectFit: "contain"}} />
        </div>

        <div style={{display: "flex", gap: "4px"}}>
          {[
            {id: "inicio", label: "Inicio", icon: "🏠"},
            {id: "enviar", label: "Enviar", icon: "📤"},
            {id: "pagos", label: "Pagos", icon: "⚡"},
            {id: "chat", label: "Axo", icon: <img src="/axo.png" style={{width: "20px", height: "20px", borderRadius: "50%", objectFit: "cover"}} />}
          ].map(tab => (
            <button key={tab.id} onClick={() => setSeccion(tab.id)} style={{
              backgroundColor: seccion === tab.id ? colors.principal : "transparent",
              color: seccion === tab.id ? "white" : colors.textoSec,
              border: "none", padding: "10px 18px", borderRadius: "10px",
              fontSize: "14px", fontWeight: "600", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px"
            }}>
              <span>{tab.icon}</span><span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
          <div style={{
            backgroundColor: `${colors.principal}10`,
            borderRadius: "10px", padding: "8px 14px",
            display: "flex", alignItems: "center", gap: "8px"
          }}>
            <div style={{width: "32px", height: "32px", borderRadius: "50%", backgroundColor: colors.secundario, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"}}>
              {usuario.tipo === "metamask" ? "🦊" : "👤"}
            </div>
            <div>
              <div style={{fontSize: "13px", fontWeight: "700", color: colors.principal}}>{usuario.nombre}</div>
              <div style={{fontSize: "11px", color: colors.textoSec}}>
                {usuario.tipo === "metamask"
                  ? `${usuario.wallet.slice(0,6)}...${usuario.wallet.slice(-4)}`
                  : usuario.email}
              </div>
            </div>
          </div>
          <button onClick={cerrarSesion} style={{
            backgroundColor: "transparent", color: colors.textoSec,
            border: `1px solid ${colors.apoyo}`, padding: "8px 14px",
            borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer"
          }}>
            Salir
          </button>
        </div>
      </nav>

      <div style={{maxWidth: "1180px", margin: "0 auto", padding: "48px 24px"}}>

        {/* INICIO */}
        {seccion === "inicio" && (
          <div>
            {/* Bienvenida personalizada */}
            <div style={{
              backgroundColor: "white", borderRadius: "24px", padding: "48px",
              marginBottom: "32px", boxShadow: "0 8px 30px rgba(41,76,116,0.08)",
              border: `1px solid ${colors.apoyo}40`, position: "relative", overflow: "hidden"
            }}>
              <div style={{position: "relative", zIndex: 1, maxWidth: "600px"}}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  backgroundColor: `${colors.secundario}15`, border: `1px solid ${colors.secundario}40`,
                  borderRadius: "20px", padding: "6px 14px", fontSize: "12px",
                  color: colors.secundario, marginBottom: "20px", fontWeight: "700", textTransform: "uppercase"
                }}>
                  <span>⚡</span> Blockchain + IA
                </div>
                <h1 style={{fontSize: "44px", fontWeight: "900", margin: "0 0 16px 0", lineHeight: "1.1", color: colors.principal, letterSpacing: "-1px"}}>
                  Hola, {usuario.nombre.split(" ")[0]} 👋<br/>
                  <span style={{color: colors.secundario}}>Listo para enviar?</span>
                </h1>
                <p style={{fontSize: "17px", color: colors.textoSec, margin: "0 0 32px 0", lineHeight: "1.6"}}>
                  Envia dinero a Mexico de forma segura, rapida y sin comisiones abusivas. Tu familia recibe mas.
                </p>
                <div style={{display: "flex", gap: "12px"}}>
                  <button onClick={() => setSeccion("enviar")} style={{
                    backgroundColor: colors.secundario, color: "white", border: "none",
                    padding: "16px 32px", borderRadius: "12px", fontSize: "15px",
                    fontWeight: "700", cursor: "pointer", boxShadow: "0 8px 20px rgba(241,118,51,0.3)",
                    display: "flex", alignItems: "center", gap: "8px"
                  }}>
                    Enviar dinero ahora <span>→</span>
                  </button>
                  <button onClick={() => setSeccion("chat")} style={{
                    backgroundColor: "transparent", color: colors.principal,
                    border: `2px solid ${colors.principal}`, padding: "14px 28px",
                    borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer"
                  }}>
                    <img src="/axo.png" style={{width: "22px", height: "22px", borderRadius: "50%", objectFit: "cover"}} /> Preguntale a Axo
                  </button>
                </div>
              </div>
              <div style={{position: "absolute", right: "48px", top: "50%", transform: "translateY(-50%)"}}>
                <img src="/axoraLogo.png" alt="" style={{height: "200px", opacity: 0.06}} />
              </div>
            </div>

            {/* Stats */}
            <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "40px"}}>
              {[
                {icon: "💰", valor: "$0.50", label: "Comision por envio"},
                {icon: "⚡", valor: "2 min", label: "Tiempo de llegada"},
                {icon: "🔒", valor: "100%", label: "Seguro blockchain"},
                {icon: <img src="/axo.png" alt="Axo" style={{width: "24px", height: "24px", objectFit: "cover", borderRadius: "50%"}} />, valor: "24/7", label: "Axo te asesora"}
              ].map((stat, i) => (
                <div key={i} style={{backgroundColor: "white", borderRadius: "16px", padding: "24px", border: `1px solid ${colors.apoyo}50`, boxShadow: "0 2px 8px rgba(41,76,116,0.04)"}}>
                  <div style={{fontSize: "28px", marginBottom: "12px"}}>{stat.icon}</div>
                  <div style={{fontSize: "30px", fontWeight: "800", color: colors.principal, marginBottom: "4px"}}>{stat.valor}</div>
                  <div style={{fontSize: "13px", color: colors.textoSec, fontWeight: "500"}}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Comparativa */}
            <div style={{backgroundColor: "white", borderRadius: "20px", padding: "40px", marginBottom: "40px", boxShadow: "0 4px 20px rgba(41,76,116,0.06)", border: `1px solid ${colors.apoyo}40`}}>
              <div style={{marginBottom: "32px"}}>
                <div style={{display: "inline-block", backgroundColor: `${colors.principal}10`, color: colors.principal, padding: "4px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: "700", letterSpacing: "1px", marginBottom: "12px"}}>COMPARATIVA</div>
                <h2 style={{fontSize: "24px", fontWeight: "800", color: colors.principal, margin: "0 0 8px 0"}}>Cuanto recibes al enviar $500 USD</h2>
              </div>
              {[
                {nombre: "Western Union", costo: "-$8.00", llega: "$492.00", color: "#dc2626", porcentaje: "15%", logo: "🟡"},
                {nombre: "MoneyGram", costo: "-$6.50", llega: "$493.50", color: "#ea580c", porcentaje: "30%", logo: "🟠"},
                {nombre: "Wise", costo: "-$4.20", llega: "$495.80", color: "#ca8a04", porcentaje: "60%", logo: "🟢"},
                {nombre: "Axora", costo: "-$0.50", llega: "$499.50", color: colors.secundario, porcentaje: "100%", logo: "axora", destacado: true}
              ].map((item, i) => (
                <div key={i} style={{display: "flex", alignItems: "center", gap: "20px", padding: item.destacado ? "16px" : "12px", borderRadius: "12px", backgroundColor: item.destacado ? `${colors.secundario}08` : "transparent", border: item.destacado ? `2px solid ${colors.secundario}` : "2px solid transparent", marginBottom: "10px"}}>
                  <div style={{display: "flex", alignItems: "center", gap: "10px", width: "200px"}}>
                    {item.logo === "axora" ? <img src="/axoraLogo.png" alt="Axora" style={{height: "24px"}} /> : <span style={{fontSize: "20px"}}>{item.logo}</span>}
                    <span style={{fontSize: "15px", fontWeight: item.destacado ? "800" : "600", color: colors.principal}}>{item.nombre}</span>
                    {item.destacado && <span style={{backgroundColor: colors.secundario, color: "white", padding: "2px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: "700"}}>NOSOTROS</span>}
                  </div>
                  <div style={{flex: 1, backgroundColor: colors.fondo, borderRadius: "10px", height: "40px", overflow: "hidden"}}>
                    <div style={{width: item.porcentaje, height: "100%", background: item.destacado ? `linear-gradient(90deg, ${colors.secundario}, ${colors.botonHover})` : `linear-gradient(90deg, ${item.color}, ${item.color}cc)`, borderRadius: "10px", display: "flex", alignItems: "center", paddingLeft: "16px"}}>
                      <span style={{color: "white", fontSize: "14px", fontWeight: "700"}}>{item.llega}</span>
                    </div>
                  </div>
                  <div style={{width: "70px", fontSize: "14px", color: item.destacado ? colors.secundario : "#9ca3af", textAlign: "right", fontWeight: item.destacado ? "800" : "500"}}>{item.costo}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px"}}>
              {[
                {icon: "🔗", titulo: "Blockchain seguro", desc: "Cada transaccion queda registrada permanentemente. Nadie puede modificarla."},
                {icon: <img src="/axo.png" alt="Axo" style={{width: "24px", height: "24px", objectFit: "cover", borderRadius: "50%"}} />, titulo: "Axo te guia", desc: "Nuestro ajolote IA te asesora 24/7 sobre el mejor momento para enviar dinero."},
                {icon: "⚡", titulo: "Pagos automaticos", desc: "Configura CFE, renta y servicios. Tu dinero se distribuye automaticamente."}
              ].map((f, i) => (
                <div key={i} style={{backgroundColor: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(41,76,116,0.05)", border: `1px solid ${colors.apoyo}40`, borderTop: `4px solid ${colors.secundario}`}}>
                  <div style={{width: "56px", height: "56px", backgroundColor: `${colors.secundario}15`, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", marginBottom: "16px"}}>{f.icon}</div>
                  <h3 style={{fontSize: "17px", fontWeight: "800", color: colors.principal, margin: "0 0 8px 0"}}>{f.titulo}</h3>
                  <p style={{fontSize: "14px", color: colors.textoSec, margin: 0, lineHeight: "1.6"}}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ENVIAR */}
        {seccion === "enviar" && (
          <div>
            <div style={{textAlign: "center", marginBottom: "40px"}}>
              <h1 style={{fontSize: "36px", fontWeight: "900", color: colors.principal, margin: "0 0 8px 0"}}>Envia dinero a Mexico</h1>
              <p style={{fontSize: "16px", color: colors.textoSec, margin: 0}}>Simple, rapido y sin comisiones abusivas</p>
            </div>
            <EnviarSimple colors={colors} usuario={usuario} />
          </div>
        )}

        {/* PAGOS */}
        {seccion === "pagos" && (
          <PagosAutomaticos colors={colors} usuario={usuario} />
        )}

        {/* CHAT */}
        {seccion === "chat" && <ChatIA />}

      </div>

      {/* FOOTER */}
      <footer style={{backgroundColor: colors.principal, color: "white", padding: "32px 24px", marginTop: "60px"}}>
        <div style={{maxWidth: "1180px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div style={{backgroundColor: "white", borderRadius: "8px", padding: "6px 12px"}}>
            <img src="/axoraLogo.png" alt="Axora" style={{height: "32px", objectFit: "contain"}} />
          </div>
          <div style={{fontSize: "13px", color: colors.apoyo}}>© 2026 Axora - Powered by Blockchain + IA</div>
          <div style={{fontSize: "12px", color: colors.apoyo, opacity: 0.7}}>Ethereum Sepolia Testnet</div>
        </div>
      </footer>

    </div>
  );
}
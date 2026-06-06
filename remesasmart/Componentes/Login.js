"use client";
import { useState } from "react";
import { ethers } from "ethers";
import useIsMobile from "../lib/useIsMobile";
import Icon from "./Icon";

export default function Login({ onLogin, colors }) {
  const [panelActivo, setPanelActivo] = useState("login");
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const isMobile = useIsMobile();

  const generarWallet = (email, password) => {
    const seed = ethers.id(email + password + "axora2026");
    return new ethers.Wallet(seed);
  };

  const crearCuenta = async () => {
    setError("");
    if (!form.nombre || !form.email || !form.password) return setError("Llena todos los campos");
    if (form.password.length < 6) return setError("Minimo 6 caracteres en la contrasena");
    setCargando(true);
    await new Promise(r => setTimeout(r, 1500));
    try {
      const wallet = generarWallet(form.email, form.password);
      const usuario = { nombre: form.nombre, email: form.email, wallet: wallet.address, privateKey: wallet.privateKey, tipo: "email" };
      localStorage.setItem("axora_usuario", JSON.stringify(usuario));
      onLogin(usuario);
    } catch (err) { setError(err.message); }
    setCargando(false);
  };

  const iniciarSesion = async () => {
    setError("");
    if (!form.email || !form.password) return setError("Ingresa tu email y contrasena");
    setCargando(true);
    await new Promise(r => setTimeout(r, 1000));
    try {
      const wallet = generarWallet(form.email, form.password);
      const guardado = localStorage.getItem("axora_usuario");
      let usuario;
      if (guardado) {
        const u = JSON.parse(guardado);
        if (u.email === form.email && u.wallet === wallet.address) {
          usuario = u;
        } else {
          return setError("Email o contrasena incorrectos"), setCargando(false);
        }
      } else {
        usuario = { nombre: form.email.split("@")[0], email: form.email, wallet: wallet.address, privateKey: wallet.privateKey, tipo: "email" };
        localStorage.setItem("axora_usuario", JSON.stringify(usuario));
      }
      onLogin(usuario);
    } catch (err) { setError(err.message); }
    setCargando(false);
  };

  const conectarMetaMask = async () => {
    setError("");
    setCargando(true);
    try {
      if (!window.ethereum) throw new Error("MetaMask no instalado");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      try { await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0xaa36a7" }] }); } catch(e) {}
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      const usuario = { nombre: "Usuario MetaMask", email: "", wallet: accounts[0], tipo: "metamask" };
      localStorage.setItem("axora_usuario", JSON.stringify(usuario));
      onLogin(usuario);
    } catch (err) { setError(err.message); }
    setCargando(false);
  };

  const isRight = panelActivo === "registro";

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.secundario,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        position: "relative",
        overflow: "hidden",
        width: isMobile ? "100%" : "850px",
        maxWidth: "100%",
        minHeight: isMobile ? "580px" : "520px",
        display: "flex"
      }}>

        {/* Mobile tabs */}
        {isMobile && (
          <div style={{
            position: "absolute", top: "20px", left: "20px", right: "20px",
            zIndex: 200,
            display: "flex", backgroundColor: "#F8F6F3",
            borderRadius: "12px", padding: "4px"
          }}>
            {["login", "registro"].map(t => (
              <button key={t}
                onClick={() => { setPanelActivo(t); setError(""); }}
                style={{
                  flex: 1, padding: "10px", borderRadius: "10px",
                  border: "none", fontSize: "14px", fontWeight: "700",
                  cursor: "pointer",
                  backgroundColor: panelActivo === t ? "white" : "transparent",
                  color: panelActivo === t ? "#294C74" : "#8E8578"
                }}
              >
                {t === "login" ? "Entrar" : "Crear cuenta"}
              </button>
            ))}
          </div>
        )}

        {/* FORMULARIO LOGIN */}
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          width: isMobile ? "100%" : "50%", height: "100%",
          transition: isMobile ? "opacity 0.3s" : "all 0.6s ease-in-out",
          transform: isMobile ? "none" : (isRight ? "translateX(100%)" : "translateX(0)"),
          opacity: isMobile ? (panelActivo === "login" ? 1 : 0) : (isRight ? 0 : 1),
          zIndex: isMobile ? (panelActivo === "login" ? 2 : 1) : (isRight ? 1 : 2),
          pointerEvents: isMobile && panelActivo !== "login" ? "none" : "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: isMobile ? "88px 24px 40px" : "40px",
          backgroundColor: "white"
        }}>
          <img src="/axoraLogo.png" alt="Axora" style={{height: "48px", marginBottom: "20px", objectFit: "contain"}} />
          <h2 style={{fontSize: "24px", fontWeight: "800", color: colors.principal, marginBottom: "20px"}}>Bienvenido</h2>

          <input type="email" placeholder="Correo electronico"
            value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))}
            style={{width: "100%", backgroundColor: "#f4f4f4", border: "none", padding: "13px 16px", marginBottom: "10px", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box", color: "#294C74", fontFamily: "inherit"}}
          />
          <input type="password" placeholder="Contrasena"
            value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))}
            style={{width: "100%", backgroundColor: "#f4f4f4", border: "none", padding: "13px 16px", marginBottom: "16px", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box", color: "#294C74", fontFamily: "inherit"}}
          />

          {error && panelActivo === "login" && (
            <div style={{width: "100%", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px", marginBottom: "12px", fontSize: "12px", color: "#dc2626", display: "flex", alignItems: "center", gap: "6px"}}>
              <Icon nombre="error" size={14} color="dc2626" /> {error}
            </div>
          )}

          <button onClick={iniciarSesion} disabled={cargando} style={{
            width: "100%", backgroundColor: colors.secundario, color: "white",
            border: "none", padding: "13px", borderRadius: "25px",
            fontSize: "15px", fontWeight: "700", cursor: "pointer",
            marginBottom: "16px", transition: "transform 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
          }}>
            {cargando ? <><Icon nombre="time" size={16} color="FFFFFF" /> <span>Ingresando...</span></> : "Iniciar Sesion"}
          </button>

          <div style={{display: "flex", alignItems: "center", gap: "10px", width: "100%", marginBottom: "14px"}}>
            <div style={{flex: 1, height: "1px", backgroundColor: "#e5e7eb"}} />
            <span style={{fontSize: "11px", color: "#9ca3af", fontWeight: "600"}}>O</span>
            <div style={{flex: 1, height: "1px", backgroundColor: "#e5e7eb"}} />
          </div>

          <button onClick={conectarMetaMask} disabled={cargando} style={{
            width: "100%", backgroundColor: "white", color: colors.principal,
            border: `2px solid #e5e7eb`, padding: "11px", borderRadius: "25px",
            fontSize: "14px", fontWeight: "700", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
          }}>
            <Icon nombre="wallet" size={20} color="294C74" /> Conectar MetaMask
          </button>
        </div>

        {/* FORMULARIO REGISTRO */}
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          width: isMobile ? "100%" : "50%", height: "100%",
          transition: isMobile ? "opacity 0.3s" : "all 0.6s ease-in-out",
          transform: isMobile ? "none" : (isRight ? "translateX(100%)" : "translateX(0)"),
          opacity: isMobile ? (panelActivo === "registro" ? 1 : 0) : (isRight ? 1 : 0),
          zIndex: isMobile ? (panelActivo === "registro" ? 5 : 1) : (isRight ? 5 : 1),
          pointerEvents: isMobile && panelActivo !== "registro" ? "none" : "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: isMobile ? "88px 24px 40px" : "40px",
          backgroundColor: "white"
        }}>
          <img src="/axoraLogo.png" alt="Axora" style={{height: "48px", marginBottom: "16px", objectFit: "contain"}} />
          <h2 style={{fontSize: "24px", fontWeight: "800", color: colors.principal, marginBottom: "20px"}}>Crear Cuenta</h2>

          <input type="text" placeholder="Tu nombre completo"
            value={form.nombre} onChange={e => setForm(p => ({...p, nombre: e.target.value}))}
            style={{width: "100%", backgroundColor: "#f4f4f4", border: "none", padding: "13px 16px", marginBottom: "10px", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box", color: "#294C74", fontFamily: "inherit"}}
          />
          <input type="email" placeholder="Correo electronico"
            value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))}
            style={{width: "100%", backgroundColor: "#f4f4f4", border: "none", padding: "13px 16px", marginBottom: "10px", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box", color: "#294C74", fontFamily: "inherit"}}
          />
          <input type="password" placeholder="Crea tu contrasena"
            value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))}
            style={{width: "100%", backgroundColor: "#f4f4f4", border: "none", padding: "13px 16px", marginBottom: "16px", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box", color: "#294C74", fontFamily: "inherit"}}
          />

          {error && panelActivo === "registro" && (
            <div style={{width: "100%", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px", marginBottom: "12px", fontSize: "12px", color: "#dc2626", display: "flex", alignItems: "center", gap: "6px"}}>
              <Icon nombre="error" size={14} color="dc2626" /> {error}
            </div>
          )}

          <button onClick={crearCuenta} disabled={cargando} style={{
            width: "100%", backgroundColor: colors.secundario, color: "white",
            border: "none", padding: "13px", borderRadius: "25px",
            fontSize: "15px", fontWeight: "700", cursor: "pointer", transition: "transform 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
          }}>
            {cargando ? <><Icon nombre="time" size={16} color="FFFFFF" /> <span>Creando cuenta...</span></> : "Crear Cuenta Gratis"}
          </button>
        </div>

        {/* OVERLAY ANIMADO - desktop only */}
        {!isMobile && (
        <div style={{
          position: "absolute",
          top: 0,
          left: "50%",
          width: "50%",
          height: "100%",
          overflow: "hidden",
          transition: "transform 0.6s ease-in-out",
          transform: isRight ? "translateX(-100%)" : "translateX(0)",
          zIndex: 100
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${colors.principal}, #3d6a9e)`,
            color: "white",
            position: "relative",
            left: "-100%",
            height: "100%",
            width: "200%",
            transform: isRight ? "translateX(50%)" : "translateX(0)",
            transition: "transform 0.6s ease-in-out",
            display: "flex"
          }}>

            {/* Panel izquierdo del overlay - Volver a login */}
            <div style={{
              width: "50%", height: "100%",
              display: "flex", flexDirection: "column",
              justifyContent: "center", alignItems: "center",
              padding: "40px", textAlign: "center",
              transform: isRight ? "translateX(0)" : "translateX(-20%)",
              transition: "transform 0.6s ease-in-out"
            }}>
              <img src="/axo.png" alt="Axo" style={{width: "90px", height: "90px", objectFit: "cover", borderRadius: "50%", marginBottom: "16px", border: "3px solid rgba(255,255,255,0.3)"}} />
              <h2 style={{fontSize: "26px", fontWeight: "900", marginBottom: "12px"}}>Bienvenido de vuelta!</h2>
              <p style={{fontSize: "14px", opacity: 0.85, marginBottom: "28px", lineHeight: "1.6"}}>
                Inicia sesion para seguir enviando dinero a tu familia
              </p>
              <button onClick={() => { setPanelActivo("login"); setError(""); }} style={{
                backgroundColor: "transparent", color: "white",
                border: "2px solid white", padding: "12px 36px",
                borderRadius: "25px", fontSize: "14px", fontWeight: "700",
                cursor: "pointer", transition: "all 0.2s"
              }}>
                Iniciar Sesion
              </button>
            </div>

            {/* Panel derecho del overlay - Crear cuenta */}
            <div style={{
              width: "50%", height: "100%",
              display: "flex", flexDirection: "column",
              justifyContent: "center", alignItems: "center",
              padding: "40px", textAlign: "center"
            }}>
              <img src="/axo.png" alt="Axo" style={{width: "90px", height: "90px", objectFit: "cover", borderRadius: "50%", marginBottom: "16px", border: "3px solid rgba(255,255,255,0.3)"}} />
              <h2 style={{fontSize: "26px", fontWeight: "900", marginBottom: "12px"}}>Hola amigo!</h2>
              <p style={{fontSize: "14px", opacity: 0.85, marginBottom: "28px", lineHeight: "1.6"}}>
                Crea tu cuenta gratis y empieza a enviar dinero en minutos
              </p>
              <button onClick={() => { setPanelActivo("registro"); setError(""); }} style={{
                backgroundColor: "transparent", color: "white",
                border: "2px solid white", padding: "12px 36px",
                borderRadius: "25px", fontSize: "14px", fontWeight: "700",
                cursor: "pointer", transition: "all 0.2s"
              }}>
                Crear Cuenta
              </button>
            </div>
          </div>
        </div>
        )}

      </div>
    </div>
  );
}
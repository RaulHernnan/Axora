"use client";
import { useState } from "react";
import useIsMobile from "../lib/useIsMobile";
import { ethers } from "ethers";
import { CONTRATO_REMESAS, ABI_REMESAS } from "../lib/contrato";
import { jsPDF } from "jspdf";
import { agregarPuntos, getCuponActivo, usarCupon, getRewards, saveRewards } from "../lib/rewards";
import Icon from "./Icon";

export default function EnviarSimple({ colors, usuario, onPuntos }) {
  const isMobile = useIsMobile();
  const [paso, setPaso] = useState(1);
  const [form, setForm] = useState({
    nombreRemitente: "",
    telefonoRemitente: "",
    nombreDestinatario: "",
    clabe: "",
    banco: "",
    cantidad: "",
  });
  const [codigoOxxo] = useState("AXORA" + Math.floor(Math.random() * 9000000 + 1000000));
  const [procesando, setProcesando] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  const cuponActivo = usuario ? getCuponActivo(usuario) : null;
  const fee = cuponActivo?.tipo === "gratis" ? 0 :
              cuponActivo?.tipo === "descuento" ? 0.25 : 0.50;
  const tipoCambio = cuponActivo?.tipo === "vip" ? 18.20 : 17.85;
  const cantidadNum = parseFloat(form.cantidad) || 0;
  const cantidadMXN = ((cantidadNum - fee) * tipoCambio).toFixed(2);
  const ahorroVsWU = (8.00 - fee).toFixed(2);

  const bancos = [
    "BBVA", "Banamex", "Banorte", "Santander",
    "HSBC", "Scotiabank", "Inbursa", "Azteca"
  ];

  const actualizarForm = (campo, valor) => {
    setForm(prev => ({...prev, [campo]: valor}));
  };

  const registrarEnBlockchain = async () => {
    setError("");

    // Validar limite del contrato
    if (cantidadNum > 2000) {
      setError("El monto maximo por envio es $2,000 USD. Para montos mayores contacta a soporte.");
      return;
    }
    if (cantidadNum < 10) {
      setError("El monto minimo por envio es $10 USD.");
      return;
    }

    setProcesando(true);

    try {
      // FLUJO USUARIO EMAIL (sin MetaMask)
      if (!usuario || usuario.tipo === "email") {
        await new Promise(r => setTimeout(r, 2000));

        const hashSimulado = "0x" + Array.from({length: 64}, () =>
          Math.floor(Math.random() * 16).toString(16)).join("");

        setTxHash(hashSimulado);
        setProcesando(false);
        // Dar puntos al usuario
        if (usuario) {
          const resultado = agregarPuntos(usuario, "ENVIO", cantidadNum);
          if (onPuntos) onPuntos({
            mensaje: resultado.mensaje,
            totalPuntos: resultado.rewards.puntos,
            nuevosNFTs: resultado.nuevosNFTs,
            envioGratis: resultado.rewards.envioGratis
          });
          // Usar cupon si existe
          if (cuponActivo && !cuponActivo.usado) {
            usarCupon(usuario, cuponActivo.id);
            if (cuponActivo.tipo === "cashback") {
              const rwds = getRewards(usuario);
              rwds.puntos += Math.floor(cuponActivo.valor * 10);
              rwds.historial.unshift({
                accion: "CASHBACK",
                puntos: Math.floor(cuponActivo.valor * 10),
                mensaje: `Cashback de $${cuponActivo.valor} USD aplicado`,
                fecha: new Date().toLocaleDateString("es-MX"),
                timestamp: Date.now()
              });
              saveRewards(usuario, rwds);
            }
          }
        }
        setPaso(4);
        return;
      }

      // FLUJO USUARIO METAMASK
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask no detectado");
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const network = await provider.getNetwork();
      if (network.chainId !== 11155111n) {
        throw new Error("Cambia MetaMask a la red Sepolia");
      }

      const contrato = new ethers.Contract(CONTRATO_REMESAS, ABI_REMESAS, signer);
      const cantidadCentavos = Math.floor(cantidadNum * 100);

      const tx = await contrato.crearRemesa(
        form.nombreRemitente,
        form.nombreDestinatario,
        form.clabe,
        form.banco,
        cantidadCentavos,
        codigoOxxo
      );

      const receipt = await tx.wait();
      setTxHash(receipt.hash);
      setProcesando(false);
      // Dar puntos al usuario
      if (usuario) {
        const resultado = agregarPuntos(usuario, "ENVIO", cantidadNum);
        if (onPuntos) onPuntos({
          mensaje: resultado.mensaje,
          totalPuntos: resultado.rewards.puntos,
          nuevosNFTs: resultado.nuevosNFTs,
          envioGratis: resultado.rewards.envioGratis
        });
        // Usar cupon si existe
        if (cuponActivo && !cuponActivo.usado) {
          usarCupon(usuario, cuponActivo.id);
          if (cuponActivo.tipo === "cashback") {
            const rwds = getRewards(usuario);
            rwds.puntos += Math.floor(cuponActivo.valor * 10);
            rwds.historial.unshift({
              accion: "CASHBACK",
              puntos: Math.floor(cuponActivo.valor * 10),
              mensaje: `Cashback de $${cuponActivo.valor} USD aplicado`,
              fecha: new Date().toLocaleDateString("es-MX"),
              timestamp: Date.now()
            });
            saveRewards(usuario, rwds);
          }
        }
      }
      setPaso(4);

    } catch (err) {
      // Traducir errores tecnicos a mensajes amigables
      let mensajeError = "Ocurrio un error. Por favor intenta de nuevo.";

      if (err.message?.includes("Maximo $2000")) {
        mensajeError = "El monto maximo permitido es $2,000 USD por envio.";
      } else if (err.message?.includes("Minimo $10")) {
        mensajeError = "El monto minimo es $10 USD por envio.";
      } else if (err.message?.includes("CLABE")) {
        mensajeError = "La CLABE ingresada no es valida. Verifica los 18 digitos.";
      } else if (err.message?.includes("user rejected")) {
        mensajeError = "Cancelaste la transaccion en MetaMask.";
      } else if (err.message?.includes("insufficient funds")) {
        mensajeError = "No tienes suficiente saldo en tu wallet para pagar el gas.";
      } else if (err.message?.includes("network")) {
        mensajeError = "Error de red. Verifica tu conexion a internet.";
      }

      setError(mensajeError);
      setProcesando(false);
    }
  };

  const descargarComprobante = () => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleString("es-MX");

    const img = new Image();
    img.src = "/axoraLogo.png";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const logoBase64 = canvas.toDataURL("image/png");

      // Header azul
      doc.setFillColor(41, 76, 116);
      doc.rect(0, 0, 210, 50, "F");

      // Texto header (izquierda)
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("AXORA", 15, 20);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Comprobante de Remesa", 15, 32);
      doc.text(`Fecha: ${fecha}`, 15, 42);

      // Logo header con proporcion correcta
      const logoRatioH = img.width / img.height;
      const logoHH = 28;
      const logoWH = logoHH * logoRatioH;
      const logoXH = 195 - logoWH;

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(logoXH - 2, 8, logoWH + 4, logoHH + 4, 4, 4, "F");
      doc.addImage(logoBase64, "PNG", logoXH, 10, logoWH, logoHH);

      // TX Hash
      if (txHash) {
        doc.setFillColor(30, 55, 90);
        doc.rect(0, 50, 210, 14, "F");
        doc.setFontSize(7);
        doc.setTextColor(192, 185, 171);
        doc.text(`TX Hash: ${txHash}`, 15, 59);
      }

      // Titulo seccion
      doc.setTextColor(41, 76, 116);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Detalle de la transaccion", 15, 80);

      // Caja de datos
      doc.setFillColor(248, 246, 243);
      doc.roundedRect(15, 86, 180, 110, 4, 4, "F");

      const datos = [
        ["Remitente:", form.nombreRemitente],
        ["Destinatario:", form.nombreDestinatario],
        ["Banco:", form.banco],
        ["CLABE:", `****${form.clabe.slice(-4)}`],
        ["Cantidad enviada:", `$${cantidadNum.toFixed(2)} USD`],
        ["Cantidad recibida:", `$${cantidadMXN} MXN`],
        ["Comision Axora:", fee === 0 ? "GRATIS (cupon aplicado)" : `$${fee.toFixed(2)} USD`],
        ["Ahorro vs Western Union:", `$${(8.00 - fee).toFixed(2)} USD`],
        cuponActivo && !cuponActivo.usado ? ["Cupon aplicado:", cuponActivo.nombre] : null,
        ["Codigo Oxxo:", codigoOxxo],
        ["Estado:", "Registrado en blockchain"],
      ].filter(Boolean);

      datos.forEach(([label, valor], i) => {
        const y = 96 + i * 10;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(41, 76, 116);
        doc.text(label, 22, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120, 120, 120);
        doc.text(String(valor), 95, y);
      });

      // Separador
      doc.setDrawColor(192, 185, 171);
      doc.setLineWidth(0.5);
      doc.line(15, 202, 195, 202);

      // Monto destacado naranja
      doc.setFillColor(241, 118, 51);
      doc.roundedRect(15, 208, 180, 36, 6, 6, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Tu familiar recibe:", 25, 221);
      doc.setFontSize(22);
      doc.text(`$${cantidadMXN} MXN`, 25, 237);

      // Verificacion blockchain
      doc.setFillColor(248, 246, 243);
      doc.roundedRect(15, 252, 180, 20, 4, 4, "F");
      doc.setTextColor(41, 76, 116);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Verifica en:", 22, 261);
      doc.setTextColor(241, 118, 51);
      doc.text(`https://sepolia.etherscan.io/tx/${txHash ? txHash.slice(0, 30) + "..." : "N/A"}`, 50, 261);
      doc.setTextColor(120, 120, 120);
      doc.text("Contrato: 0xb1a7De81da0F8DB5b82Ef330c2858936E208A85b", 22, 268);

      // Footer con logo pequeño
      doc.setFillColor(41, 76, 116);
      doc.rect(0, 278, 210, 20, "F");
      doc.setTextColor(192, 185, 171);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Remesas inteligentes con blockchain | axora.com", 15, 286);
      doc.text("© 2026 Axora - Todos los derechos reservados", 15, 293);
      // Logo footer con proporcion correcta
      const logoRatio = img.width / img.height;
      const logoH = 10;
      const logoW = logoH * logoRatio;
      const logoX = 195 - logoW;

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(logoX - 2, 281, logoW + 4, logoH + 4, 3, 3, "F");
      doc.addImage(logoBase64, "PNG", logoX, 283, logoW, logoH);

      doc.save(`Axora-Comprobante-${codigoOxxo}.pdf`);
    };

    img.onerror = () => {
      doc.setFillColor(41, 76, 116);
      doc.rect(0, 0, 210, 50, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(26);
      doc.setFont("helvetica", "bold");
      doc.text("AXORA", 15, 30);
      doc.save(`Axora-Comprobante-${codigoOxxo}.pdf`);
    };
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: `2px solid ${colors.apoyo}60`,
    fontSize: "15px",
    outline: "none",
    color: colors.principal,
    backgroundColor: colors.contenedor,
    boxSizing: "border-box",
    fontFamily: "inherit"
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "700",
    color: colors.principal,
    marginBottom: "8px",
    letterSpacing: "0.3px"
  };

  return (
    <div style={{maxWidth: "680px", margin: "0 auto"}}>

      {/* INDICADOR DE PASOS */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "center",
        marginBottom: "32px",
        overflowX: "hidden",
        padding: "0 8px"
      }}>
        {[
          {num: 1, label: isMobile ? "Info" : "Tu info"},
          {num: 2, label: isMobile ? "Destino" : "Destinatario"},
          {num: 3, label: isMobile ? "Pagar" : "Confirmar"},
          {num: 4, label: "Listo"}
        ].map((p, i) => (
          <div key={p.num} style={{display: "flex", alignItems: "center"}}>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}>
              <div style={{
                width: isMobile ? "32px" : "40px",
                height: isMobile ? "32px" : "40px",
                borderRadius: "50%",
                backgroundColor: paso >= p.num ? colors.secundario : colors.apoyo,
                color: "white", display: "flex", alignItems: "center",
                justifyContent: "center",
                fontSize: isMobile ? "13px" : "16px",
                fontWeight: "800"
              }}>
                {paso > p.num ? "✓" : p.num}
              </div>
              <div style={{
                fontSize: isMobile ? "10px" : "11px",
                fontWeight: "600",
                color: paso >= p.num ? colors.secundario : colors.textoSec,
                whiteSpace: "nowrap"
              }}>{p.label}</div>
            </div>
            {i < 3 && (
              <div style={{
                width: isMobile ? "30px" : "80px",
                height: "3px",
                backgroundColor: paso > p.num ? colors.secundario : colors.apoyo,
                margin: "0 2px",
                marginBottom: "20px"
              }} />
            )}
          </div>
        ))}
      </div>

      {/* PASO 1: INFO DEL REMITENTE */}
      {paso === 1 && (
        <div style={{backgroundColor: "white", borderRadius: "20px", padding: isMobile ? "24px 20px" : "40px", boxShadow: "0 4px 20px rgba(41,76,116,0.06)", border: `1px solid ${colors.apoyo}40`}}>
          <div style={{textAlign: "center", marginBottom: "32px"}}>
            <div style={{fontSize: "48px", marginBottom: "12px"}}>👋</div>
            <h2 style={{fontSize: "24px", fontWeight: "800", color: colors.principal, margin: "0 0 8px 0"}}>
              Hola, quien eres?
            </h2>
            <p style={{fontSize: "14px", color: colors.textoSec, margin: 0}}>
              Solo necesitamos tus datos basicos
            </p>
          </div>

          <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
            <div>
              <label style={labelStyle}>Tu nombre completo</label>
              <input type="text" value={form.nombreRemitente}
                onChange={(e) => actualizarForm("nombreRemitente", e.target.value)}
                placeholder="Ej: Juan Garcia Lopez" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tu numero de telefono</label>
              <input type="tel" value={form.telefonoRemitente}
                onChange={(e) => actualizarForm("telefonoRemitente", e.target.value)}
                placeholder="+1 (555) 123-4567" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Cuanto quieres mandar (dolares)</label>
              <div style={{position: "relative"}}>
                <div style={{position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "20px", fontWeight: "800", color: colors.textoSec}}>$</div>
                <input type="number" value={form.cantidad}
                  onChange={(e) => actualizarForm("cantidad", e.target.value)}
                  placeholder="200" min="10" max="2000"
                  style={{...inputStyle, paddingLeft: "36px", fontSize: "22px", fontWeight: "800"}} />
                <div style={{position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", fontWeight: "700", color: colors.textoSec}}>USD</div>
              </div>
              {cantidadNum > 0 && (
                <div style={{marginTop: "10px", backgroundColor: `${colors.secundario}10`, borderRadius: "10px", padding: "12px 16px", display: "flex", justifyContent: "space-between"}}>
                  <span style={{fontSize: "13px", color: colors.textoSec}}>Tu familia recibe:</span>
                  <span style={{fontSize: "18px", fontWeight: "800", color: colors.principal}}>${cantidadMXN} MXN</span>
                </div>
              )}
              {cantidadNum > 2000 && (
                <div style={{
                  marginTop: "8px", backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca", borderRadius: "8px",
                  padding: "8px 12px", fontSize: "12px", color: "#dc2626", fontWeight: "600"
                }}>
                  ⚠️ Monto maximo: $2,000 USD por envio
                </div>
              )}
            </div>
          </div>

          <button onClick={() => setPaso(2)}
            disabled={!form.nombreRemitente || !form.telefonoRemitente || !form.cantidad || cantidadNum > 2000 || cantidadNum < 10}
            style={{width: "100%", marginTop: "28px",
              backgroundColor: !form.nombreRemitente || !form.telefonoRemitente || !form.cantidad || cantidadNum > 2000 || cantidadNum < 10 ? colors.apoyo : colors.secundario,
              color: "white", border: "none", padding: "16px", borderRadius: "12px",
              fontSize: "16px", fontWeight: "700",
              cursor: !form.nombreRemitente || !form.telefonoRemitente || !form.cantidad || cantidadNum > 2000 || cantidadNum < 10 ? "not-allowed" : "pointer"}}>
            Continuar →
          </button>
        </div>
      )}

      {/* PASO 2: DESTINATARIO */}
      {paso === 2 && (
        <div style={{backgroundColor: "white", borderRadius: "20px", padding: isMobile ? "24px 20px" : "40px", boxShadow: "0 4px 20px rgba(41,76,116,0.06)", border: `1px solid ${colors.apoyo}40`}}>
          <div style={{textAlign: "center", marginBottom: "32px"}}>
            <img src="/nft-familia.png" alt="Familia" style={{
              width: "72px", height: "72px",
              borderRadius: "50%", objectFit: "cover",
              marginBottom: "12px",
              border: `3px solid ${colors.apoyo}`
            }} />
            <h2 style={{fontSize: "24px", fontWeight: "800", color: colors.principal, margin: "0 0 8px 0"}}>
              A quien le mandas?
            </h2>
            <p style={{fontSize: "14px", color: colors.textoSec, margin: 0}}>
              Necesitamos los datos bancarios de tu familiar
            </p>
          </div>

          <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>
            <div>
              <label style={labelStyle}>Nombre completo de quien recibe</label>
              <input type="text" value={form.nombreDestinatario}
                onChange={(e) => actualizarForm("nombreDestinatario", e.target.value)}
                placeholder="Ej: Maria Lopez Garcia" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Su banco</label>
              <select value={form.banco} onChange={(e) => actualizarForm("banco", e.target.value)}
                style={{...inputStyle, cursor: "pointer"}}>
                <option value="">Selecciona el banco...</option>
                {bancos.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>CLABE interbancaria (18 digitos)</label>
              <input type="text" value={form.clabe}
                onChange={(e) => actualizarForm("clabe", e.target.value.replace(/\D/g, "").slice(0, 18))}
                placeholder="000000000000000000" maxLength={18}
                style={{...inputStyle, fontFamily: "monospace", letterSpacing: "2px"}} />
              <div style={{fontSize: "12px", color: colors.textoSec, marginTop: "6px"}}>
                {form.clabe.length}/18 digitos
                {form.clabe.length === 18 && <span style={{color: "#16a34a", fontWeight: "700"}}> ✓ Correcto</span>}
              </div>
              <div style={{backgroundColor: `${colors.principal}08`, borderRadius: "10px", padding: "12px", marginTop: "8px", fontSize: "12px", color: colors.textoSec, lineHeight: "1.6"}}>
                La CLABE la encuentras en la app del banco de tu familiar o en su estado de cuenta.
              </div>
            </div>
          </div>

          <div style={{display: "flex", gap: "12px", marginTop: "28px"}}>
            <button onClick={() => setPaso(1)} style={{flex: 1, backgroundColor: "transparent", color: colors.principal, border: `2px solid ${colors.apoyo}`, padding: "16px", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer"}}>
              ← Atras
            </button>
            <button onClick={() => setPaso(3)}
              disabled={!form.nombreDestinatario || !form.banco || form.clabe.length !== 18}
              style={{flex: 2,
                backgroundColor: !form.nombreDestinatario || !form.banco || form.clabe.length !== 18 ? colors.apoyo : colors.secundario,
                color: "white", border: "none", padding: "16px", borderRadius: "12px",
                fontSize: "15px", fontWeight: "700",
                cursor: !form.nombreDestinatario || !form.banco || form.clabe.length !== 18 ? "not-allowed" : "pointer"}}>
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* PASO 3: CONFIRMAR Y REGISTRAR EN BLOCKCHAIN */}
      {paso === 3 && (
        <div style={{backgroundColor: "white", borderRadius: "20px", padding: isMobile ? "24px 20px" : "40px", boxShadow: "0 4px 20px rgba(41,76,116,0.06)", border: `1px solid ${colors.apoyo}40`}}>
          <div style={{textAlign: "center", marginBottom: "28px"}}>
            <Icon nombre="checked" size={56} color="16A34A" style={{marginBottom: "12px"}} />
            <h2 style={{fontSize: "24px", fontWeight: "800", color: colors.principal, margin: "0 0 8px 0"}}>
              Confirma tu envio
            </h2>
            <p style={{fontSize: "14px", color: colors.textoSec, margin: 0}}>
              Tu remesa quedara registrada en blockchain
            </p>
          </div>

          {/* Resumen */}
          <div style={{backgroundColor: colors.contenedor, borderRadius: "14px", padding: "20px", marginBottom: "24px"}}>
            {[
              {label: "De:", valor: form.nombreRemitente},
              {label: "Para:", valor: form.nombreDestinatario},
              {label: "Banco:", valor: form.banco},
              {label: "CLABE:", valor: `****${form.clabe.slice(-4)}`},
              {label: "Cantidad:", valor: `$${cantidadNum.toFixed(2)} USD`},
              {label: "Tu familiar recibe:", valor: `$${cantidadMXN} MXN`, destacado: true},
              {label: "Ahorras vs Western Union:", valor: `$${ahorroVsWU} USD`, color: "#16a34a"},
            ].map((item, i) => (
              <div key={i} style={{display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 6 ? `1px solid ${colors.apoyo}30` : "none"}}>
                <span style={{fontSize: "13px", color: colors.textoSec}}>{item.label}</span>
                <span style={{fontSize: item.destacado ? "16px" : "13px", fontWeight: item.destacado ? "800" : "600", color: item.color || colors.principal}}>{item.valor}</span>
              </div>
            ))}
          </div>

          {/* Cupon activo */}
          {cuponActivo && !cuponActivo.usado && (
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "12px 14px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "10px",
              marginTop: "8px"
            }}>
              <span style={{fontSize: "20px"}}>{cuponActivo.icono}</span>
              <div>
                <div style={{fontSize: "13px", fontWeight: "700", color: "#15803d"}}>
                  Cupon aplicado: {cuponActivo.nombre}
                </div>
                <div style={{fontSize: "11px", color: "#6b7280"}}>
                  {cuponActivo.tipo === "gratis" && "Este envio es GRATIS (sin comision)"}
                  {cuponActivo.tipo === "descuento" && "50% de descuento aplicado ($0.25 USD)"}
                  {cuponActivo.tipo === "vip" && "Tipo de cambio VIP: $18.20 MXN/USD"}
                  {cuponActivo.tipo === "cashback" && `Recibiras $${cuponActivo.valor} USD de cashback`}
                </div>
              </div>
            </div>
          )}

          {/* Info blockchain */}
          <div style={{backgroundColor: `${colors.principal}08`, border: `1px solid ${colors.principal}20`, borderRadius: "12px", padding: "16px", marginBottom: "24px"}}>
            <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px"}}>
              <span style={{fontSize: "20px"}}>🔗</span>
              <span style={{fontSize: "14px", fontWeight: "700", color: colors.principal}}>Registro en Blockchain</span>
            </div>
            <p style={{fontSize: "13px", color: colors.textoSec, margin: 0, lineHeight: "1.6"}}>
              Al confirmar, tu envio quedara registrado permanentemente en la blockchain de Ethereum (Sepolia). MetaMask pedira tu confirmacion. El costo de gas es minimo (~$0.01 USD).
            </p>
          </div>

          {/* Codigo Oxxo */}
          <div style={{background: `linear-gradient(135deg, ${colors.principal}, #3d6a9e)`, borderRadius: "14px", padding: "20px", marginBottom: "24px", textAlign: "center"}}>
            <div style={{fontSize: "11px", color: colors.apoyo, fontWeight: "700", marginBottom: "8px", letterSpacing: "2px"}}>TU CODIGO DE PAGO OXXO</div>
            <div style={{fontSize: "28px", fontWeight: "900", color: "white", letterSpacing: "4px", fontFamily: "monospace"}}>{codigoOxxo}</div>
            <div style={{fontSize: "12px", color: colors.apoyo, marginTop: "8px"}}>Valido por 24 horas</div>
          </div>

          {/* Error */}
          {error && (
            <div style={{backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", fontSize: "13px", color: "#dc2626"}}>
              ⚠️ {error}
            </div>
          )}

          <div style={{display: "flex", gap: "12px"}}>
            <button onClick={() => setPaso(2)} style={{flex: 1, backgroundColor: "transparent", color: colors.principal, border: `2px solid ${colors.apoyo}`, padding: "14px", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer"}}>
              ← Atras
            </button>
            <button onClick={registrarEnBlockchain} disabled={procesando}
              style={{flex: 2, backgroundColor: procesando ? colors.apoyo : colors.secundario, color: "white", border: "none", padding: "14px", borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: procesando ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"}}>
              {procesando ? "⏳ Registrando en blockchain..." : "🔗 Confirmar y Registrar"}
            </button>
          </div>

          {procesando && (
            <div style={{marginTop: "16px", textAlign: "center", fontSize: "13px", color: colors.textoSec}}>
              <div style={{marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"}}>
                <Icon nombre="connected" size={16} color="8E8578" />
                Esperando confirmacion de MetaMask...
              </div>
              <div style={{marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"}}>
                <Icon nombre="chain" size={16} color="8E8578" />
                Registrando en Ethereum Sepolia...
              </div>
              <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"}}>
                <Icon nombre="time" size={16} color="8E8578" />
                Esto puede tomar 15-30 segundos...
              </div>
            </div>
          )}
        </div>
      )}

      {/* PASO 4: EXITO */}
      {paso === 4 && (
        <div style={{backgroundColor: "white", borderRadius: "20px", padding: isMobile ? "24px 20px" : "48px 40px", boxShadow: "0 4px 20px rgba(41,76,116,0.06)", border: `2px solid #16a34a`, textAlign: "center"}}>
          <div style={{fontSize: "72px", marginBottom: "16px"}}>🎉</div>
          <h2 style={{fontSize: "28px", fontWeight: "900", color: "#15803d", margin: "0 0 8px 0"}}>
            Remesa registrada!
          </h2>
          <p style={{fontSize: "16px", color: colors.textoSec, margin: "0 0 32px 0"}}>
            {form.nombreDestinatario} recibira su dinero pronto
          </p>

          <div style={{background: `linear-gradient(135deg, ${colors.principal}, #3d6a9e)`, borderRadius: "16px", padding: "28px", marginBottom: "24px", color: "white"}}>
            <div style={{fontSize: "13px", color: colors.apoyo, marginBottom: "8px"}}>MONTO A RECIBIR</div>
            <div style={{fontSize: "48px", fontWeight: "900", marginBottom: "4px"}}>${cantidadMXN} MXN</div>
            <div style={{fontSize: "13px", color: colors.apoyo}}>En cuenta {form.banco} de {form.nombreDestinatario}</div>
          </div>

          {/* TX Hash */}
          {txHash && (
            <div style={{backgroundColor: colors.contenedor, borderRadius: "12px", padding: "16px", marginBottom: "20px", textAlign: "left"}}>
              <div style={{fontSize: "12px", fontWeight: "700", color: colors.principal, marginBottom: "8px"}}>
                🔗 Transaccion registrada en blockchain:
              </div>
              <div style={{fontFamily: "monospace", fontSize: "11px", color: colors.textoSec, wordBreak: "break-all", marginBottom: "10px"}}>
                {txHash}
              </div>
              <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                style={{color: colors.secundario, fontSize: "13px", fontWeight: "700", textDecoration: "none"}}>
                Ver en Etherscan →
              </a>
            </div>
          )}

          <div style={{backgroundColor: colors.contenedor, borderRadius: "14px", padding: "20px", marginBottom: "28px", textAlign: "left"}}>
            {[
              {icon: "✅", label: "Estado", valor: "Registrado en blockchain"},
              {icon: "🏦", label: "Banco destino", valor: form.banco},
              {icon: "💰", label: "Ahorraste", valor: `$${ahorroVsWU} USD vs Western Union`},
              {icon: "🔒", label: "Seguridad", valor: "Inmutable en Ethereum"},
            ].map((item, i) => (
              <div key={i} style={{display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${colors.apoyo}30` : "none"}}>
                <span style={{fontSize: "20px"}}>{item.icon}</span>
                <span style={{fontSize: "13px", color: colors.textoSec, flex: 1}}>{item.label}</span>
                <span style={{fontSize: "13px", fontWeight: "700", color: colors.principal}}>{item.valor}</span>
              </div>
            ))}
          </div>

          <button onClick={descargarComprobante} style={{
            width: "100%", backgroundColor: colors.principal, color: "white",
            border: "none", padding: "14px", borderRadius: "12px",
            fontSize: "15px", fontWeight: "700", cursor: "pointer",
            marginBottom: "12px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            boxShadow: "0 4px 12px rgba(41,76,116,0.3)"
          }}>
            📄 Descargar Comprobante PDF
          </button>

          <button onClick={() => {setPaso(1); setForm({nombreRemitente: "", telefonoRemitente: "", nombreDestinatario: "", clabe: "", banco: "", cantidad: ""}); setTxHash(""); setError("");}}
            style={{width: "100%", backgroundColor: colors.secundario, color: "white", border: "none", padding: "16px", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 15px rgba(241,118,51,0.3)"}}>
            Hacer otro envio
          </button>
        </div>
      )}
    </div>
  );
}

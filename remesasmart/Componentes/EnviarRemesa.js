"use client";
import { useState } from "react";

export default function EnviarRemesa({ wallet, conectarWallet, colors }) {
  const [destino, setDestino] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [estado, setEstado] = useState("");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  const fee = 0.50;
  const tipoCambio = 17.85;
  const cantidadNum = parseFloat(cantidad) || 0;
  const totalConFee = cantidadNum + fee;
  const ahorroVsWU = cantidadNum > 0 ? (8.00 - fee).toFixed(2) : 0;
  const enPesos = (cantidadNum * tipoCambio).toFixed(2);

  const enviarRemesa = async () => {
    if (!wallet) {
      alert("Conecta tu wallet primero");
      return;
    }
    if (!destino || !cantidad) {
      alert("Completa todos los campos");
      return;
    }
    if (!destino.startsWith("0x") || destino.length !== 42) {
      setError("La direccion de wallet no es valida. Debe empezar con 0x y tener 42 caracteres.");
      return;
    }
    if (cantidadNum <= 0) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }

    setError("");
    setEstado("loading");

    try {
      const cantidadWei = "0x" + Math.floor(cantidadNum * 1e18).toString(16);

      const tx = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: wallet,
          to: destino,
          value: cantidadWei,
          gas: "0x5208",
        }]
      });

      setTxHash(tx);
      setEstado("success");
      setCantidad("");
      setDestino("");

    } catch (err) {
      setError(err.message || "Error al enviar la transaccion");
      setEstado("error");
    }
  };

  return (
    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px"}}>

      {/* FORMULARIO */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 4px 20px rgba(41,76,116,0.06)",
        border: `1px solid ${colors.apoyo}40`
      }}>
        <div style={{marginBottom: "32px"}}>
          <div style={{
            display: "inline-block",
            backgroundColor: `${colors.secundario}15`,
            color: colors.secundario,
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "1px",
            marginBottom: "12px"
          }}>ENVIAR REMESA</div>
          <h2 style={{fontSize: "26px", fontWeight: "800", color: colors.principal, margin: "0 0 8px 0"}}>
            Envia USDC a Mexico
          </h2>
          <p style={{fontSize: "14px", color: colors.textoSec, margin: 0}}>
            Transferencia instantanea en blockchain Polygon
          </p>
        </div>

        {!wallet ? (
          <div style={{
            backgroundColor: `${colors.secundario}10`,
            border: `2px dashed ${colors.secundario}`,
            borderRadius: "16px",
            padding: "24px",
            textAlign: "center",
            marginBottom: "24px"
          }}>
            <div style={{fontSize: "40px", marginBottom: "12px"}}>🦊</div>
            <p style={{color: colors.textoSec, margin: "0 0 16px 0", fontSize: "14px"}}>
              Necesitas conectar tu wallet para enviar
            </p>
            <button onClick={conectarWallet} style={{
              backgroundColor: colors.secundario,
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer"
            }}>
              Conectar MetaMask
            </button>
          </div>
        ) : (
          <div style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "12px",
            padding: "12px 16px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span style={{fontSize: "20px"}}>✅</span>
            <div>
              <div style={{fontSize: "12px", color: "#15803d", fontWeight: "700"}}>WALLET CONECTADA</div>
              <div style={{fontSize: "13px", color: colors.textoSec, fontFamily: "monospace"}}>{wallet}</div>
            </div>
          </div>
        )}

        <div style={{marginBottom: "20px"}}>
          <label style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "700",
            color: colors.principal,
            marginBottom: "8px",
            letterSpacing: "0.3px"
          }}>
            Wallet destino (0x...)
          </label>
          <input
            type="text"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            placeholder="0x742d35Cc6634C0532925a3b8..."
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: `2px solid ${colors.apoyo}60`,
              fontSize: "14px",
              outline: "none",
              fontFamily: "monospace",
              color: colors.principal,
              backgroundColor: colors.contenedor,
              boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{marginBottom: "24px"}}>
          <label style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "700",
            color: colors.principal,
            marginBottom: "8px"
          }}>
            Cantidad (MATIC)
          </label>
          <div style={{position: "relative"}}>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              style={{
                width: "100%",
                padding: "14px 70px 14px 16px",
                borderRadius: "12px",
                border: `2px solid ${colors.apoyo}60`,
                fontSize: "18px",
                fontWeight: "700",
                outline: "none",
                color: colors.principal,
                backgroundColor: colors.contenedor,
                boxSizing: "border-box"
              }}
            />
            <div style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "13px",
              fontWeight: "700",
              color: colors.textoSec
            }}>MATIC</div>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            padding: "12px 16px",
            marginBottom: "16px",
            fontSize: "13px",
            color: "#dc2626"
          }}>
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={enviarRemesa}
          disabled={estado === "loading" || !wallet}
          style={{
            width: "100%",
            backgroundColor: estado === "loading" ? colors.apoyo : colors.secundario,
            color: "white",
            border: "none",
            padding: "16px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: estado === "loading" || !wallet ? "not-allowed" : "pointer",
            boxShadow: "0 4px 15px rgba(241,118,51,0.3)",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          {estado === "loading" ? (
            <>⏳ Procesando en blockchain...</>
          ) : (
            <>📤 Enviar Remesa</>
          )}
        </button>

        {estado === "success" && (
          <div style={{
            backgroundColor: "#f0fdf4",
            border: "2px solid #16a34a",
            borderRadius: "12px",
            padding: "20px",
            marginTop: "20px",
            textAlign: "center"
          }}>
            <div style={{fontSize: "40px", marginBottom: "8px"}}>🎉</div>
            <div style={{fontSize: "16px", fontWeight: "800", color: "#15803d", marginBottom: "8px"}}>
              Remesa enviada exitosamente
            </div>
            <div style={{fontSize: "12px", color: colors.textoSec, marginBottom: "12px"}}>
              Hash de transaccion:
            </div>
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "10px",
              fontFamily: "monospace",
              fontSize: "11px",
              color: colors.principal,
              wordBreak: "break-all"
            }}>
              {txHash}
            </div>
            <a
              href={`https://amoy.polygonscan.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: "12px",
                color: colors.secundario,
                fontSize: "13px",
                fontWeight: "700",
                textDecoration: "none"
              }}
            >
              Ver en Polygonscan →
            </a>
          </div>
        )}
      </div>

      {/* PANEL DERECHO */}
      <div style={{display: "flex", flexDirection: "column", gap: "20px"}}>

        <div style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 4px 20px rgba(41,76,116,0.06)",
          border: `1px solid ${colors.apoyo}40`
        }}>
          <h3 style={{fontSize: "16px", fontWeight: "800", color: colors.principal, margin: "0 0 20px 0"}}>
            Resumen del envio
          </h3>

          <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
            {[
              {label: "Cantidad a enviar", valor: `${cantidadNum.toFixed(4)} MATIC`},
              {label: "Comision Axora", valor: `$${fee} USD`, color: colors.secundario},
              {label: "Tipo de cambio", valor: `$${tipoCambio} MXN/USD`},
              {label: "Recibes en pesos", valor: `$${enPesos} MXN`, destacado: true},
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: i < 3 ? `1px solid ${colors.apoyo}30` : "none"
              }}>
                <span style={{fontSize: "14px", color: colors.textoSec}}>{item.label}</span>
                <span style={{
                  fontSize: item.destacado ? "18px" : "14px",
                  fontWeight: item.destacado ? "800" : "600",
                  color: item.color || (item.destacado ? colors.principal : colors.texto)
                }}>{item.valor}</span>
              </div>
            ))}
          </div>
        </div>

        {cantidadNum > 0 && (
          <div style={{
            background: `linear-gradient(135deg, ${colors.principal}, #3d6a9e)`,
            borderRadius: "20px",
            padding: "28px",
            color: "white"
          }}>
            <div style={{fontSize: "13px", color: colors.apoyo, fontWeight: "700", marginBottom: "8px"}}>
              AHORRAS CON AXORA
            </div>
            <div style={{fontSize: "42px", fontWeight: "900", marginBottom: "4px"}}>
              ${ahorroVsWU} USD
            </div>
            <div style={{fontSize: "13px", color: colors.apoyo}}>
              vs Western Union en esta transaccion
            </div>
            <div style={{
              marginTop: "16px",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "12px"
            }}>
              <div style={{fontSize: "12px", color: colors.apoyo, marginBottom: "4px"}}>En un año enviando mensualmente:</div>
              <div style={{fontSize: "20px", fontWeight: "800"}}>
                ${(parseFloat(ahorroVsWU) * 12).toFixed(2)} USD ahorrados
              </div>
            </div>
          </div>
        )}

        <div style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(41,76,116,0.06)",
          border: `1px solid ${colors.apoyo}40`
        }}>
          <h3 style={{fontSize: "14px", fontWeight: "800", color: colors.principal, margin: "0 0 16px 0"}}>
            Informacion de red
          </h3>
          {[
            {icon: "🔗", label: "Red", valor: "Polygon Amoy"},
            {icon: "⚡", label: "Velocidad", valor: "~2 minutos"},
            {icon: "🔒", label: "Seguridad", valor: "Blockchain inmutable"},
            {icon: "💎", label: "Token", valor: "MATIC (POL)"},
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 0",
              borderBottom: i < 3 ? `1px solid ${colors.apoyo}20` : "none"
            }}>
              <span style={{fontSize: "18px"}}>{item.icon}</span>
              <span style={{fontSize: "13px", color: colors.textoSec, flex: 1}}>{item.label}</span>
              <span style={{fontSize: "13px", fontWeight: "700", color: colors.principal}}>{item.valor}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

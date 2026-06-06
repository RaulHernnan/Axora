"use client";
import { useState, useEffect } from "react";
import { getNFTOnchainData } from "../lib/rareMint";

// Cada tier tiene su propia recompensa distinta — fee minimo $1.00
const BADGE_TIERS = [
  {
    id: "axo_dorado",    label: "Axo Dorado",    img: "/nft-dorado.png",   color: "#f59e0b",
    fee: 1.00, tcBonus: 0.20, gratisMes: false,
    recompensa: "Comision $1.00 + tipo de cambio VIP (+$0.20 MXN/USD)",
  },
  {
    id: "leyenda_axora", label: "Leyenda Axora", img: "/nft-leyenda.png",  color: "#8b5cf6",
    fee: 1.00, tcBonus: 0,    gratisMes: false,
    recompensa: "Comision $1.00 para siempre — la tarifa mas baja del mercado",
  },
  {
    id: "heroe_familiar",label: "Axo Estelar",   img: "/nft-estelar.png",  color: "#3b82f6",
    fee: 1.50, tcBonus: 0,    gratisMes: true,
    recompensa: "1 envio gratis cada mes (se renueva automaticamente)",
  },
  {
    id: "axo_guardian",  label: "Axo Guardian",  img: "/nft-guardian.png", color: "#10b981",
    fee: 1.20, tcBonus: 0.10, gratisMes: false,
    recompensa: "Tipo de cambio +$0.10/USD + comision reducida a $1.20",
  },
  {
    id: "familia_unida", label: "Familia Unida", img: "/nft-familia.png",  color: "#06b6d4",
    fee: 1.25, tcBonus: 0.10, gratisMes: false,
    recompensa: "Tipo de cambio mejorado: +$0.10 MXN por cada dolar",
  },
];
const FEE_BASE = 1.50;
const TC_FALLBACK = 17.85;

const claveGratisMes = (w) => {
  const d = new Date();
  return `axora_gratis_${w}_${d.getFullYear()}_${d.getMonth()}`;
};

export default function EnviarRemesa({ wallet, conectarWallet, colors }) {
  const [destino, setDestino] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [estado, setEstado] = useState("");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [tierActivo, setTierActivo] = useState(null);
  const [gratisDisponible, setGratisDisponible] = useState(false);
  const [tcBase, setTcBase] = useState(TC_FALLBACK);

  useEffect(() => {
    fetch("/api/tipo-cambio")
      .then(r => r.json())
      .then(d => setTcBase(d.tc))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!wallet) { setTierActivo(null); setGratisDisponible(false); return; }
    const nfts = getNFTOnchainData(wallet);
    const mejor = BADGE_TIERS.find(t => nfts[t.id]);
    setTierActivo(mejor ?? null);
    if (mejor?.gratisMes) {
      setGratisDisponible(!localStorage.getItem(claveGratisMes(wallet)));
    } else {
      setGratisDisponible(false);
    }
  }, [wallet]);

  const tipoCambio = tcBase + (tierActivo?.tcBonus ?? 0);
  const fee = (tierActivo?.gratisMes && gratisDisponible)
    ? 0
    : (tierActivo ? tierActivo.fee : FEE_BASE);
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
      if (tierActivo?.gratisMes && gratisDisponible) {
        localStorage.setItem(claveGratisMes(wallet), "true");
        setGratisDisponible(false);
      }
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
            <div style={{marginBottom: "12px"}}><Icon nombre="wallet" size={40} color="294C74" /></div>
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
            <Icon nombre="checkmark" size={20} color="15803d" />
            <div>
              <div style={{fontSize: "12px", color: "#15803d", fontWeight: "700"}}>WALLET CONECTADA</div>
              <div style={{fontSize: "13px", color: colors.textoSec, fontFamily: "monospace"}}>{wallet}</div>
            </div>
          </div>
        )}

        {wallet && tierActivo && (
          <div style={{
            background: `linear-gradient(135deg, ${tierActivo.color}15, ${tierActivo.color}06)`,
            border: `1px solid ${tierActivo.color}50`,
            borderRadius: "14px",
            padding: "14px 16px",
            marginBottom: "20px",
          }}>
            <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px"}}>
              <img src={tierActivo.img} alt={tierActivo.label} style={{
                width: "40px", height: "40px", borderRadius: "10px",
                objectFit: "cover", flexShrink: 0,
                border: `2px solid ${tierActivo.color}60`
              }} />
              <div style={{fontSize: "11px", fontWeight: "800", color: tierActivo.color, letterSpacing: "0.5px", flex: 1}}>
                BENEFICIO NFT — {tierActivo.label.toUpperCase()}
              </div>
              {fee === 0 && (
                <div style={{
                  backgroundColor: tierActivo.color, color: "white",
                  borderRadius: "20px", padding: "3px 12px",
                  fontSize: "11px", fontWeight: "800"
                }}>GRATIS</div>
              )}
            </div>

            <div style={{fontSize: "13px", color: colors.textoSec, marginBottom: tierActivo.gratisMes || tierActivo.tcBonus ? "8px" : 0}}>
              {tierActivo.recompensa}
            </div>

            {tierActivo.gratisMes && (
              <div style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "12px", fontWeight: "700",
                color: gratisDisponible ? "#16a34a" : "rgba(0,0,0,0.4)",
                backgroundColor: gratisDisponible ? "#f0fdf4" : "#f5f5f5",
                border: `1px solid ${gratisDisponible ? "#bbf7d0" : "#e5e5e5"}`,
                borderRadius: "8px", padding: "6px 10px",
              }}>
                <span>{gratisDisponible ? "✓" : "○"}</span>
                {gratisDisponible
                  ? "Envio gratis disponible este mes — se aplica automaticamente"
                  : "Envio gratis del mes ya utilizado (se renueva el 1ro del mes)"}
              </div>
            )}

            {tierActivo.tcBonus > 0 && (
              <div style={{fontSize: "12px", color: colors.textoSec}}>
                Tipo de cambio activo:{" "}
                <strong style={{color: tierActivo.color}}>${tipoCambio.toFixed(2)} MXN/USD</strong>
                {" "}<span style={{textDecoration: "line-through", opacity: 0.4}}>${tcBase.toFixed(2)}</span>
              </div>
            )}
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
            color: "#dc2626",
            display: "flex", alignItems: "center", gap: "8px"
          }}>
            <Icon nombre="error" size={16} color="dc2626" /> {error}
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
            <><Icon nombre="time" size={16} color="FFFFFF" /> <span>Procesando en blockchain...</span></>
          ) : (
            <><Icon nombre="send" size={16} color="FFFFFF" /> <span>Enviar Remesa</span></>
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
            <div style={{marginBottom: "8px"}}><Icon nombre="confetti" size={40} color="15803d" /></div>
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
              {
                label: tierActivo ? `Comision (${tierActivo.label})` : "Comision Axora",
                valor: fee === 0 ? "GRATIS" : `$${fee.toFixed(2)} USD`,
                color: tierActivo ? tierActivo.color : colors.secundario
              },
              {
                label: "Tipo de cambio",
                valor: `$${tipoCambio.toFixed(2)} MXN/USD${tierActivo?.tcBonus ? " ✓" : ""}`,
                color: tierActivo?.tcBonus ? tierActivo.color : undefined
              },
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

            {tierActivo?.tcBonus > 0 && cantidadNum > 0 && (
              <div style={{
                backgroundColor: `${tierActivo.color}12`,
                border: `1px solid ${tierActivo.color}40`,
                borderRadius: "10px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px"
              }}>
                <span style={{fontSize: "12px", color: tierActivo.color, fontWeight: "700"}}>
                  Tu familia recibe extra por badge {tierActivo.label}:
                </span>
                <span style={{
                  fontSize: "15px", fontWeight: "900",
                  color: tierActivo.color, whiteSpace: "nowrap"
                }}>
                  +${(cantidadNum * tierActivo.tcBonus).toFixed(2)} MXN
                </span>
              </div>
            )}
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
            {icon: "chain", label: "Red", valor: "Polygon Amoy"},
            {icon: "lightning-bolt", label: "Velocidad", valor: "~2 minutos"},
            {icon: "lock-2", label: "Seguridad", valor: "Blockchain inmutable"},
            {icon: "diamond", label: "Token", valor: "MATIC (POL)"},
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 0",
              borderBottom: i < 3 ? `1px solid ${colors.apoyo}20` : "none"
            }}>
              <Icon nombre={item.icon} size={18} color="294C74" />
              <span style={{fontSize: "13px", color: colors.textoSec, flex: 1}}>{item.label}</span>
              <span style={{fontSize: "13px", fontWeight: "700", color: colors.principal}}>{item.valor}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

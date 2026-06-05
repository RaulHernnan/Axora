"use client";
import { useEffect, useState } from "react";

export default function PopupPuntos({ evento, onClose, colors }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!evento) return null;

  return (
    <div style={{
      position: "fixed",
      top: "90px",
      right: "20px",
      zIndex: 9999,
      transition: "all 0.4s ease",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateX(0)" : "translateX(120px)",
    }}>
      {/* Popup principal de puntos */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "16px 20px",
        boxShadow: "0 8px 30px rgba(41,76,116,0.2)",
        border: `2px solid ${colors.secundario}`,
        minWidth: "280px",
        marginBottom: "10px"
      }}>
        <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
          <div style={{
            width: "44px", height: "44px",
            borderRadius: "50%",
            backgroundColor: `${colors.secundario}15`,
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "22px",
            flexShrink: 0
          }}>⭐</div>
          <div>
            <div style={{fontSize: "13px", fontWeight: "800", color: colors.principal}}>
              {evento.mensaje}
            </div>
            <div style={{fontSize: "12px", color: colors.textoSec, marginTop: "2px"}}>
              Total: {evento.totalPuntos} puntos acumulados
            </div>
          </div>
        </div>
        {evento.envioGratis && (
          <div style={{
            marginTop: "10px",
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "10px",
            padding: "10px",
            fontSize: "13px",
            color: "#15803d",
            fontWeight: "700",
            textAlign: "center"
          }}>
            🎉 Tu proximo envio es GRATIS!
          </div>
        )}
      </div>

      {/* NFTs desbloqueados */}
      {evento.nuevosNFTs && evento.nuevosNFTs.map((nft, i) => (
        <div key={i} style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "16px 20px",
          boxShadow: "0 8px 30px rgba(41,76,116,0.2)",
          border: `2px solid ${nft.color}`,
          marginBottom: "10px"
        }}>
          <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
            <div style={{
              width: "44px", height: "44px",
              borderRadius: "12px",
              backgroundColor: nft.colorBg,
              display: "flex", alignItems: "center",
              justifyContent: "center",
              border: `2px solid ${nft.color}`,
              overflow: "hidden",
              flexShrink: 0
            }}>
              <img
                src={nft.imagen}
                alt="NFT"
                style={{width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px"}}
              />
            </div>
            <div>
              <div style={{fontSize: "11px", fontWeight: "700", color: nft.color, textTransform: "uppercase", letterSpacing: "1px"}}>
                🏆 NFT Desbloqueado!
              </div>
              <div style={{fontSize: "14px", fontWeight: "800", color: "#1f2937"}}>
                {nft.nombre}
              </div>
              <div style={{fontSize: "12px", color: "#6b7280"}}>
                {nft.descripcion}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
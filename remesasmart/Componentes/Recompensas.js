"use client";
import { useState, useEffect } from "react";
import { getRewards, saveRewards, NFT_BADGES, RECOMPENSAS, calcularNivel } from "../lib/rewards";
import { mintBadge, getNFTOnchainData } from "../lib/rareMint";
import useIsMobile from "../lib/useIsMobile";
import Icon from "./Icon";

export default function Recompensas({ colors, usuario }) {
  const isMobile = useIsMobile();
  const [rewards, setRewards] = useState(null);
  const [tab, setTab] = useState("resumen");
  const [canjeando, setCanjeando] = useState(null);
  const [mensajeCanje, setMensajeCanje] = useState("");
  const [canjeExitoso, setCanjeExitoso] = useState(false);
  const [minteando, setMinteando] = useState(null);
  const [nftOnchain, setNftOnchain] = useState({});
  const [confirmarMinteo, setConfirmarMinteo] = useState(null);

  useEffect(() => {
    if (usuario) {
      setRewards(getRewards(usuario));
      setNftOnchain(getNFTOnchainData(usuario.wallet));
    }
  }, [usuario]);

  if (!rewards) return null;

  const nivel = calcularNivel(rewards.puntos);
  const progreso = nivel.siguiente
    ? Math.min((rewards.puntos / nivel.siguiente) * 100, 100)
    : 100;

  const handleMintearNFT = async (badge) => {
    if (!usuario?.wallet) {
      setMensajeCanje("Conecta tu wallet para mintear el NFT en blockchain.");
      setTimeout(() => setMensajeCanje(""), 4000);
      return;
    }
    setMinteando(badge.id);
    const resultado = await mintBadge(usuario.wallet, badge.id);
    setMinteando(null);
    if (resultado.ok) {
      setNftOnchain(prev => ({
        ...prev,
        [badge.id]: { txHash: resultado.txHash, explorerUrl: resultado.explorerUrl, tokenId: resultado.tokenId },
      }));
      setCanjeExitoso(true);
      setMensajeCanje(`NFT "${badge.nombre}" minteado en Sepolia! Token #${resultado.tokenId}`);
    } else {
      setCanjeExitoso(false);
      setMensajeCanje(`Error al mintear: ${resultado.error}`);
    }
    setTimeout(() => { setMensajeCanje(""); setCanjeExitoso(false); }, 7000);
  };

  const canjearNFT = async (badge) => {
    if (!rewards.nftsDesbloqueados.includes(badge.id)) return;

    setCanjeando(badge.id);
    await new Promise(r => setTimeout(r, 1500));

    const nuevosRewards = {
      ...rewards,
      puntos: rewards.puntos + badge.puntosAlCanjear,
      puntosGanados: rewards.puntosGanados + badge.puntosAlCanjear,
      nftsDesbloqueados: rewards.nftsDesbloqueados.filter(id => id !== badge.id),
      historial: [{
        accion: "CANJE_NFT",
        puntos: badge.puntosAlCanjear,
        mensaje: `Canjeaste NFT "${badge.nombre}" por ${badge.puntosAlCanjear} puntos`,
        fecha: new Date().toLocaleDateString("es-MX"),
        timestamp: Date.now()
      }, ...rewards.historial]
    };

    saveRewards(usuario, nuevosRewards);
    setRewards(nuevosRewards);
    setCanjeando(null);
    setCanjeExitoso(true);
    setMensajeCanje(`Canjeaste "${badge.nombre}" por ${badge.puntosAlCanjear} puntos! Desbloquéalo de nuevo completando los requisitos.`);
    setTimeout(() => { setMensajeCanje(""); setCanjeExitoso(false); }, 6000);
  };

  const canjearRecompensa = async (recompensa) => {
    if (rewards.puntos < recompensa.puntos) {
      setMensajeCanje("No tienes suficientes puntos");
      setTimeout(() => setMensajeCanje(""), 3000);
      return;
    }

    setCanjeando(recompensa.id);
    await new Promise(r => setTimeout(r, 1500));

    const cupon = {
      id: `cupon_${Date.now()}`,
      recompensaId: recompensa.id,
      nombre: recompensa.nombre,
      tipo: recompensa.tipo,
      valor: recompensa.valor,
      icono: recompensa.icono,
      usado: false,
      fechaCanje: new Date().toLocaleDateString("es-MX"),
      expira: recompensa.tipo === "premium" || recompensa.tipo === "vip"
        ? Date.now() + (recompensa.valor * 24 * 60 * 60 * 1000)
        : null
    };

    const nuevosRewards = {
      ...rewards,
      puntos: rewards.puntos - recompensa.puntos,
      cuponesActivos: [...(rewards.cuponesActivos || []), cupon],
      recompensasCanjeadas: [...rewards.recompensasCanjeadas, {
        ...recompensa,
        fechaCanje: new Date().toLocaleDateString("es-MX")
      }],
      historial: [{
        accion: "CANJE",
        puntos: -recompensa.puntos,
        mensaje: `Canjeaste: ${recompensa.nombre}`,
        fecha: new Date().toLocaleDateString("es-MX"),
        timestamp: Date.now()
      }, ...rewards.historial]
    };

    saveRewards(usuario, nuevosRewards);
    setRewards(nuevosRewards);
    setCanjeando(null);
    setCanjeExitoso(true);
    setMensajeCanje(`${recompensa.nombre} activado! Se aplicara en tu proximo envio.`);
    setTimeout(() => { setMensajeCanje(""); setCanjeExitoso(false); }, 5000);
  };

  return (
    <div>
      {/* Header */}
      <div style={{marginBottom: "32px"}}>
        <h1 style={{fontSize: "32px", fontWeight: "900", color: colors.principal, margin: "0 0 8px 0"}}>
          Mis Recompensas
        </h1>
        <p style={{fontSize: "15px", color: colors.textoSec, margin: 0}}>
          Gana puntos por cada envio y canjealos por beneficios exclusivos
        </p>
      </div>

      {/* Mensaje de canje */}
      {mensajeCanje && (
        <div style={{
          backgroundColor: canjeExitoso ? "#f0fdf4" : "#fef2f2",
          border: `2px solid ${canjeExitoso ? "#16a34a" : "#fecaca"}`,
          borderRadius: "12px", padding: "14px 18px", marginBottom: "24px",
          fontSize: "14px", fontWeight: "700",
          color: canjeExitoso ? "#15803d" : "#dc2626",
          display: "flex", alignItems: "center", gap: "8px"
        }}>
          {canjeExitoso
            ? <Icon nombre="checkmark" size={18} color="15803d" />
            : <Icon nombre="error" size={18} color="dc2626" />
          }
          {mensajeCanje}
        </div>
      )}

      {/* Card principal de puntos */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.principal} 0%, #3d6a9e 100%)`,
        borderRadius: "24px", padding: "36px",
        marginBottom: "28px", color: "white",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{position: "relative", zIndex: 1}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px"}}>
            <div>
              <div style={{fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: "600", marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase"}}>
                Tu saldo de puntos
              </div>
              <div style={{fontSize: "56px", fontWeight: "900", lineHeight: "1", marginBottom: "4px"}}>
                {rewards.puntos.toLocaleString()}
              </div>
              <div style={{fontSize: "14px", color: "rgba(255,255,255,0.7)"}}>
                Axora Points
              </div>
            </div>
            <div style={{textAlign: "right"}}>
              <div style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: "16px", padding: "12px 20px",
                border: "1px solid rgba(255,255,255,0.2)"
              }}>
                <div style={{marginBottom: "4px"}}><Icon nombre={nivel.icono} size={28} color="FFFFFF" /></div>
                <div style={{fontSize: "16px", fontWeight: "800"}}>{nivel.nivel}</div>
                <div style={{fontSize: "11px", color: "rgba(255,255,255,0.7)"}}>Tu nivel</div>
              </div>
            </div>
          </div>

          {/* Barra de progreso */}
          {nivel.siguiente && (
            <div>
              <div style={{display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "12px", color: "rgba(255,255,255,0.7)"}}>
                <span>{rewards.puntos.toLocaleString()} pts</span>
                <span>{nivel.siguiente.toLocaleString()} pts para {calcularNivel(nivel.siguiente).nivel}</span>
              </div>
              <div style={{backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "10px", height: "8px", overflow: "hidden"}}>
                <div style={{
                  width: `${progreso}%`, height: "100%",
                  background: `linear-gradient(90deg, ${colors.secundario}, #fbbf24)`,
                  borderRadius: "10px", transition: "width 1s ease"
                }} />
              </div>
            </div>
          )}

          {/* Stats rápidos */}
          <div style={{display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "16px", marginTop: "24px"}}>
            {[
              {label: "Total enviado", valor: rewards.totalEnvios + " envíos"},
              {label: "Puntos ganados", valor: rewards.puntosGanados.toLocaleString()},
              {label: "NFTs", valor: rewards.nftsDesbloqueados.length + " badges"},
            ].map((stat, i) => (
              <div key={i} style={{backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px", textAlign: "center"}}>
                <div style={{fontSize: "18px", fontWeight: "800", marginBottom: "4px"}}>{stat.valor}</div>
                <div style={{fontSize: "11px", color: "rgba(255,255,255,0.7)"}}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Envío gratis disponible */}
          {rewards.envioGratis && (
            <div style={{
              marginTop: "16px",
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.4)",
              borderRadius: "12px", padding: "12px 16px",
              display: "flex", alignItems: "center", gap: "10px"
            }}>
              <Icon nombre="gift" size={28} color="FFFFFF" />
              <div>
                <div style={{fontSize: "14px", fontWeight: "800"}}>Tienes un envio GRATIS disponible!</div>
                <div style={{fontSize: "12px", color: "rgba(255,255,255,0.7)"}}>Tu proximo envio no tendra comision</div>
              </div>
            </div>
          )}
        </div>

        <div style={{position: "absolute", right: "-20px", top: "-20px", opacity: 0.05, pointerEvents: "none"}}>
          <Icon nombre="star" size={140} color="FFFFFF" />
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", backgroundColor: colors.contenedor,
        borderRadius: "14px", padding: "4px", marginBottom: "28px"
      }}>
        {[
          {id: "resumen", label: "Resumen", icono: "bar-chart"},
          {id: "nfts", label: "NFTs", icono: "trophy"},
          {id: "canjear", label: "Canjear", icono: "gift"},
          {id: "historial", label: "Historial", icono: "time"}
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: isMobile ? "8px 2px" : "11px",
            borderRadius: "11px", border: "none",
            fontSize: isMobile ? "10px" : "13px",
            fontWeight: "700", cursor: "pointer", transition: "all 0.2s",
            backgroundColor: tab === t.id ? "white" : "transparent",
            color: tab === t.id ? colors.principal : colors.textoSec,
            boxShadow: tab === t.id ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "3px" : "6px"
          }}>
            <Icon nombre={t.icono} size={isMobile ? 18 : 16} color={tab === t.id ? "294C74" : "8E8578"} />
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB: RESUMEN */}
      {tab === "resumen" && (
        <div style={{display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "20px"}}>
          {/* Como ganar puntos */}
          <div style={{backgroundColor: "white", borderRadius: "20px", padding: "28px", boxShadow: "0 2px 12px rgba(41,76,116,0.06)", border: `1px solid ${colors.apoyo}40`}}>
            <h3 style={{fontSize: "17px", fontWeight: "800", color: colors.principal, margin: "0 0 20px 0"}}>
              Como ganar puntos
            </h3>
            {[
              {accion: "Primer envio", puntos: "+50 pts", icono: "rocket", color: "F17633"},
              {accion: "Por cada $10 USD enviados", puntos: "+1 pt", icono: "money-transfer", color: "F17633"},
              {accion: "Configurar pago automatico", puntos: "+75 pts", icono: "lightning-bolt", color: "F17633"},
              {accion: "Consultar a Axo (IA)", puntos: "+5 pts", iconoImg: "/axo.png", color: "F17633"},
              {accion: "Referir un amigo", puntos: "+100 pts", icono: "conference-call", color: "F17633"},
              {accion: "Completar perfil", puntos: "+25 pts", icono: "checked", color: "F17633"},
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "10px 0",
                borderBottom: i < 5 ? `1px solid ${colors.apoyo}30` : "none"
              }}>
                {item.iconoImg ? (
                  <img src={item.iconoImg} style={{width:"20px",height:"20px",borderRadius:"50%",objectFit:"cover"}} />
                ) : (
                  <Icon nombre={item.icono} size={20} color={item.color} />
                )}
                <span style={{flex: 1, fontSize: "13px", color: colors.textoSec}}>{item.accion}</span>
                <span style={{fontSize: "13px", fontWeight: "800", color: colors.secundario}}>{item.puntos}</span>
              </div>
            ))}
          </div>

          {/* Beneficio envio #10 */}
          <div>
            <div style={{
              background: `linear-gradient(135deg, ${colors.secundario}, #D96524)`,
              borderRadius: "20px", padding: "28px", color: "white", marginBottom: "16px"
            }}>
              <div style={{marginBottom: "12px"}}><Icon nombre="gift" size={40} color="FFFFFF" /></div>
              <h3 style={{fontSize: "20px", fontWeight: "900", margin: "0 0 8px 0"}}>
                Tu envio #10 es GRATIS
              </h3>
              <p style={{fontSize: "14px", color: "rgba(255,255,255,0.85)", margin: "0 0 16px 0", lineHeight: "1.6"}}>
                Por cada 10 envios que realizas, el siguiente no tiene comision. Sin limite!
              </p>
              <div style={{backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "10px", padding: "12px"}}>
                <div style={{fontSize: "12px", color: "rgba(255,255,255,0.8)", marginBottom: "6px"}}>
                  Progreso hacia envio gratis:
                </div>
                <div style={{backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "8px", height: "8px", overflow: "hidden"}}>
                  <div style={{
                    width: `${(rewards.totalEnvios % 10) * 10}%`,
                    height: "100%", backgroundColor: "white",
                    borderRadius: "8px", transition: "width 1s ease"
                  }} />
                </div>
                <div style={{fontSize: "12px", color: "rgba(255,255,255,0.8)", marginTop: "6px", textAlign: "right"}}>
                  {rewards.totalEnvios % 10}/10 envios
                </div>
              </div>
            </div>

            <div style={{backgroundColor: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 12px rgba(41,76,116,0.06)", border: `1px solid ${colors.apoyo}40`}}>
              <h3 style={{fontSize: "15px", fontWeight: "800", color: colors.principal, margin: "0 0 12px 0"}}>
                Tu resumen
              </h3>
              {[
                {label: "Total enviado en USD", valor: `~$${rewards.totalEnviado} USD`},
                {label: "Envios realizados", valor: rewards.totalEnvios},
                {label: "Recompensas canjeadas", valor: rewards.recompensasCanjeadas.length},
                {label: "NFTs desbloqueados", valor: rewards.nftsDesbloqueados.length},
              ].map((item, i) => (
                <div key={i} style={{display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 3 ? `1px solid ${colors.apoyo}20` : "none"}}>
                  <span style={{fontSize: "13px", color: colors.textoSec}}>{item.label}</span>
                  <span style={{fontSize: "13px", fontWeight: "700", color: colors.principal}}>{item.valor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: NFTs */}
      {tab === "nfts" && (
        <div>
          <div style={{display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? "12px" : "20px"}}>
            {NFT_BADGES.map(badge => {
              const desbloqueado = rewards.nftsDesbloqueados.includes(badge.id);
              return (
                <div key={badge.id} style={{
                  backgroundColor: "white",
                  borderRadius: "16px", padding: isMobile ? "16px" : "24px",
                  textAlign: "center",
                  boxShadow: desbloqueado ? `0 4px 20px ${badge.color}30` : "0 2px 8px rgba(0,0,0,0.05)",
                  border: desbloqueado ? `2px solid ${badge.color}` : `2px solid ${colors.apoyo}40`,
                  opacity: desbloqueado ? 1 : 0.5,
                  transition: "all 0.3s",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  {desbloqueado && (
                    <div style={{
                      position: "absolute", top: "12px", right: "12px",
                      backgroundColor: badge.color, color: "white",
                      borderRadius: "20px", padding: "3px 10px",
                      fontSize: "10px", fontWeight: "700"
                    }}>
                      TUYO ✓
                    </div>
                  )}

                  <div style={{
                    width: "80px", height: "80px", borderRadius: "16px",
                    margin: "0 auto 16px",
                    backgroundColor: desbloqueado ? badge.colorBg : colors.fondo,
                    border: `3px solid ${desbloqueado ? badge.color : colors.apoyo}`,
                    overflow: "hidden", display: "flex",
                    alignItems: "center", justifyContent: "center"
                  }}>
                    {desbloqueado ? (
                      <img src={badge.imagen} alt={badge.nombre}
                        style={{width: "100%", height: "100%", objectFit: "cover"}} />
                    ) : (
                      <Icon nombre="lock-2" size={32} color="C0B9AB" />
                    )}
                  </div>

                  <Icon nombre={badge.icono} size={24} color={desbloqueado ? badge.color.replace("#","") : "C0B9AB"} />
                  <h3 style={{fontSize: "15px", fontWeight: "800",
                    color: desbloqueado ? badge.color : colors.textoSec,
                    margin: "0 0 4px 0"}}>
                    {badge.nombre}
                  </h3>
                  <p style={{fontSize: "12px", color: colors.textoSec,
                    margin: "0 0 8px 0", lineHeight: "1.5"}}>
                    {badge.descripcion}
                  </p>

                  {/* Valor en puntos */}
                  <div style={{
                    backgroundColor: `${colors.principal}10`,
                    borderRadius: "8px", padding: "4px 10px",
                    fontSize: "12px", fontWeight: "700",
                    color: colors.principal, marginBottom: "12px",
                    display: "inline-flex", alignItems: "center", gap: "4px"
                  }}>
                    <Icon nombre="star" size={13} color="294C74" />
                    Vale {badge.puntosAlCanjear} pts
                  </div>

                  {/* Requisito o botones */}
                  {desbloqueado ? (
                    <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>

                      {/* NFT ya minteado on-chain → solo Etherscan, sin canjear */}
                      {nftOnchain[badge.id] ? (
                        <>
                          <a
                            href={nftOnchain[badge.id].explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "block", width: "100%", textAlign: "center",
                              backgroundColor: "#f0fdf4", border: "2px solid #16a34a",
                              color: "#15803d", borderRadius: "10px", padding: "8px",
                              fontSize: "12px", fontWeight: "700", textDecoration: "none"
                            }}
                          >
                            <Icon nombre="checkmark" size={13} color="15803d" style={{marginRight:"4px",verticalAlign:"middle"}} />
                            On-chain · Token #{nftOnchain[badge.id].tokenId} · Ver en Etherscan ↗
                          </a>
                          <div style={{
                            backgroundColor: "#fef9ec", border: "1px solid #f59e0b",
                            borderRadius: "8px", padding: "7px 10px",
                            fontSize: "11px", color: "#92400e", textAlign: "center"
                          }}>
                            <Icon nombre="lock-2" size={13} color="92400e" /> NFT minteado — no disponible para canjear
                          </div>
                        </>
                      ) : confirmarMinteo === badge.id ? (
                        /* Pantalla de confirmación de minteo */
                        <div style={{
                          backgroundColor: "#fff7ed", border: "2px solid #f97316",
                          borderRadius: "12px", padding: "12px", textAlign: "center"
                        }}>
                          <div style={{marginBottom: "6px"}}><Icon nombre="error" size={20} color="f97316" /></div>
                          <p style={{
                            fontSize: "12px", fontWeight: "700", color: "#9a3412",
                            margin: "0 0 4px 0", lineHeight: "1.4"
                          }}>
                            Acción irreversible
                          </p>
                          <p style={{
                            fontSize: "11px", color: "#c2410c",
                            margin: "0 0 12px 0", lineHeight: "1.5"
                          }}>
                            Una vez minteado en blockchain ya no podrás canjear este NFT por {badge.puntosAlCanjear} pts. ¿Continuar?
                          </p>
                          <div style={{display: "flex", gap: "8px"}}>
                            <button
                              onClick={() => setConfirmarMinteo(null)}
                              style={{
                                flex: 1, padding: "8px", borderRadius: "8px",
                                border: `1px solid ${colors.apoyo}`, backgroundColor: "white",
                                fontSize: "12px", fontWeight: "700",
                                color: colors.textoSec, cursor: "pointer"
                              }}
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => { setConfirmarMinteo(null); handleMintearNFT(badge); }}
                              disabled={minteando === badge.id}
                              style={{
                                flex: 1, padding: "8px", borderRadius: "8px",
                                border: "none", backgroundColor: "#1a1a2e",
                                fontSize: "12px", fontWeight: "700",
                                color: "white", cursor: "pointer"
                              }}
                            >
                              <Icon nombre="chain" size={13} color="FFFFFF" /> Confirmar mint
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Estado normal: botones mintear + canjear */
                        <>
                          <button
                            onClick={() => setConfirmarMinteo(badge.id)}
                            disabled={minteando === badge.id}
                            style={{
                              width: "100%",
                              backgroundColor: minteando === badge.id ? colors.apoyo : "#1a1a2e",
                              color: "white", border: "none",
                              padding: "8px", borderRadius: "10px",
                              fontSize: "12px", fontWeight: "700",
                              cursor: minteando === badge.id ? "not-allowed" : "pointer",
                              transition: "all 0.2s"
                            }}
                          >
                            {minteando === badge.id
                              ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}><Icon nombre="time" size={15} color="FFFFFF" /> Minteando...</span>
                              : <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}><Icon nombre="chain" size={15} color="FFFFFF" /> Mintear NFT real</span>
                            }
                          </button>
                          <button
                            onClick={() => canjearNFT(badge)}
                            disabled={canjeando === badge.id}
                            style={{
                              width: "100%",
                              backgroundColor: canjeando === badge.id ? colors.apoyo : badge.color,
                              color: "white", border: "none",
                              padding: "10px", borderRadius: "10px",
                              fontSize: "13px", fontWeight: "700",
                              cursor: canjeando === badge.id ? "not-allowed" : "pointer",
                              transition: "all 0.2s"
                            }}
                          >
                            {canjeando === badge.id ? "Canjeando..." : `Canjear por ${badge.puntosAlCanjear} pts`}
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: colors.contenedor,
                      borderRadius: "10px", padding: "8px",
                      fontSize: "11px", fontWeight: "600",
                      color: colors.textoSec
                    }}>
                      <span style={{display:"flex",alignItems:"center",gap:"5px"}}>
                        <Icon nombre="lock-2" size={13} color="8E8578" />{badge.requisito}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: CANJEAR */}
      {tab === "canjear" && (
        <div>
          {/* Cupones activos */}
          {rewards.cuponesActivos && rewards.cuponesActivos.filter(c => !c.usado).length > 0 && (
            <div style={{marginBottom: "24px"}}>
              <h3 style={{fontSize: "16px", fontWeight: "800", color: colors.principal, margin: "0 0 14px 0"}}>
                <span style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <Icon nombre="ticket" size={18} color="294C74" />Tus cupones activos:
                </span>
              </h3>
              <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                {rewards.cuponesActivos.filter(c => !c.usado).map((cupon, i) => (
                  <div key={i} style={{
                    backgroundColor: "#f0fdf4",
                    border: "2px dashed #16a34a",
                    borderRadius: "14px",
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px"
                  }}>
                    <Icon nombre={cupon.icono} size={28} color="16A34A" />
                    <div style={{flex: 1}}>
                      <div style={{fontSize: "15px", fontWeight: "800", color: "#15803d"}}>{cupon.nombre}</div>
                      <div style={{fontSize: "12px", color: "#6b7280"}}>
                        Canjeado el {cupon.fechaCanje} · Se aplica automaticamente en tu proximo envio
                      </div>
                      {cupon.expira && (
                        <div style={{fontSize: "11px", color: "#dc2626", marginTop: "2px", fontWeight: "600"}}>
                          Expira: {new Date(cupon.expira).toLocaleDateString("es-MX")}
                        </div>
                      )}
                    </div>
                    <div style={{
                      backgroundColor: "#16a34a",
                      color: "white",
                      borderRadius: "10px",
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: "700"
                    }}>
                      ACTIVO ✓
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "20px"}}>
          {RECOMPENSAS.map(recompensa => {
            const puedesCanjear = rewards.puntos >= recompensa.puntos;
            return (
              <div key={recompensa.id} style={{
                backgroundColor: "white", borderRadius: "20px", padding: "24px",
                boxShadow: "0 2px 12px rgba(41,76,116,0.06)",
                border: `1px solid ${puedesCanjear ? colors.secundario + "60" : colors.apoyo + "40"}`,
                opacity: puedesCanjear ? 1 : 0.7
              }}>
                <div style={{display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "16px"}}>
                  <div style={{
                    width: "56px", height: "56px", borderRadius: "16px",
                    backgroundColor: `${colors.secundario}15`,
                    display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0
                  }}>
                    <Icon nombre={recompensa.icono} size={28} color="F17633" />
                  </div>
                  <div style={{flex: 1}}>
                    <h3 style={{fontSize: "16px", fontWeight: "800", color: colors.principal, margin: "0 0 4px 0"}}>
                      {recompensa.nombre}
                    </h3>
                    <p style={{fontSize: "13px", color: colors.textoSec, margin: 0}}>
                      {recompensa.descripcion}
                    </p>
                  </div>
                </div>

                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                  <div style={{
                    backgroundColor: `${colors.principal}10`,
                    borderRadius: "10px", padding: "6px 14px",
                    fontSize: "14px", fontWeight: "800", color: colors.principal
                  }}>
                    <span style={{display:"flex",alignItems:"center",gap:"4px"}}>
                      <Icon nombre="star" size={14} color="294C74" />{recompensa.puntos.toLocaleString()} pts
                    </span>
                  </div>
                  <button
                    onClick={() => canjearRecompensa(recompensa)}
                    disabled={!puedesCanjear || canjeando === recompensa.id}
                    style={{
                      backgroundColor: puedesCanjear ? colors.secundario : colors.apoyo,
                      color: "white", border: "none",
                      padding: "10px 20px", borderRadius: "10px",
                      fontSize: "13px", fontWeight: "700",
                      cursor: puedesCanjear ? "pointer" : "not-allowed",
                      boxShadow: puedesCanjear ? "0 4px 12px rgba(241,118,51,0.3)" : "none"
                    }}
                  >
                    {canjeando === recompensa.id ? "..." : puedesCanjear ? "Canjear" : "Puntos insuf."}
                  </button>
                </div>

                {!puedesCanjear && (
                  <div style={{marginTop: "10px", fontSize: "12px", color: colors.textoSec, textAlign: "center"}}>
                    Te faltan {(recompensa.puntos - rewards.puntos).toLocaleString()} puntos
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* TAB: HISTORIAL */}
      {tab === "historial" && (
        <div style={{backgroundColor: "white", borderRadius: "20px", padding: "28px", boxShadow: "0 2px 12px rgba(41,76,116,0.06)", border: `1px solid ${colors.apoyo}40`}}>
          <h3 style={{fontSize: "17px", fontWeight: "800", color: colors.principal, margin: "0 0 20px 0"}}>
            Historial de puntos
          </h3>
          {rewards.historial.length === 0 ? (
            <div style={{textAlign: "center", padding: "40px", color: colors.textoSec}}>
              <div style={{marginBottom: "12px"}}><Icon nombre="clipboard" size={40} color="8E8578" /></div>
              <p>Aun no tienes actividad. Realiza tu primer envio!</p>
            </div>
          ) : (
            rewards.historial.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "12px 0",
                borderBottom: i < rewards.historial.length - 1 ? `1px solid ${colors.apoyo}30` : "none"
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "12px",
                  backgroundColor: item.puntos > 0 ? "#f0fdf4" : "#fef2f2",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0
                }}>
                  {item.puntos > 0
                    ? <Icon nombre="star" size={20} color="16a34a" />
                    : <Icon nombre="refresh" size={20} color="dc2626" />
                  }
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontSize: "13px", fontWeight: "600", color: colors.principal}}>
                    {item.mensaje}
                  </div>
                  <div style={{fontSize: "11px", color: colors.textoSec, marginTop: "2px"}}>
                    {item.fecha}
                  </div>
                </div>
                <div style={{
                  fontSize: "15px", fontWeight: "800",
                  color: item.puntos > 0 ? "#16a34a" : "#dc2626"
                }}>
                  {item.puntos > 0 ? `+${item.puntos}` : item.puntos} pts
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
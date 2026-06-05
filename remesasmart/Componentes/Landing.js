"use client";
import { useState } from "react";
import useIsMobile from "../lib/useIsMobile";
import Icon from "./Icon";

export default function Landing({ onEntrar, colors }) {
  const isMobile = useIsMobile();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalVideo, setModalVideo] = useState(false);

  return (
    <div style={{
      fontFamily: "'Segoe UI', -apple-system, sans-serif",
      backgroundColor: "#0F1923",
      color: "white",
      minHeight: "100vh",
      overflowX: "hidden"
    }}>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 100,
        backgroundColor: "rgba(15, 25, 35, 0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: isMobile ? "0 16px" : "0 48px",
        height: "70px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
          <img src="/axoraLogo.png" alt="Axora" style={{
            height: "36px", objectFit: "contain",
            borderRadius: "10px", padding: "4px",
            backgroundColor: "white"
          }} />
        </div>

        {!isMobile && (
          <div style={{display: "flex", gap: "32px"}}>
            {["Inicio", "Caracteristicas", "Seguridad", "Contacto"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                color: "rgba(255,255,255,0.7)", textDecoration: "none",
                fontSize: "14px", fontWeight: "600",
                transition: "color 0.2s"
              }}>{item}</a>
            ))}
          </div>
        )}

        <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
          {!isMobile && (
            <button onClick={onEntrar} style={{
              backgroundColor: "transparent",
              color: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "8px 20px", borderRadius: "25px",
              fontSize: "14px", fontWeight: "600", cursor: "pointer"
            }}>
              Iniciar sesion
            </button>
          )}
          <button onClick={onEntrar} style={{
            background: `linear-gradient(135deg, ${colors.secundario}, #D96524)`,
            color: "white", border: "none",
            padding: "10px 22px", borderRadius: "25px",
            fontSize: "14px", fontWeight: "700", cursor: "pointer",
            boxShadow: `0 4px 20px ${colors.secundario}50`
          }}>
            Comenzar gratis
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="inicio" style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center",
        padding: isMobile ? "100px 20px 60px" : "120px 48px 80px",
        position: "relative", overflow: "hidden"
      }}>
        {/* Fondo gradiente */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(ellipse at 20% 50%, rgba(41,76,116,0.4) 0%, transparent 60%)",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", top: 0, right: 0, bottom: 0,
          width: "50%",
          background: `radial-gradient(ellipse at 80% 50%, ${colors.secundario}20 0%, transparent 60%)`,
          pointerEvents: "none"
        }} />

        <div style={{
          maxWidth: "1200px", margin: "0 auto", width: "100%",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "60px", alignItems: "center",
          position: "relative", zIndex: 1
        }}>
          {/* Texto */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              backgroundColor: `${colors.secundario}20`,
              border: `1px solid ${colors.secundario}40`,
              borderRadius: "20px", padding: "6px 16px",
              fontSize: "12px", color: colors.secundario,
              marginBottom: "24px", fontWeight: "700",
              letterSpacing: "1px", textTransform: "uppercase"
            }}>
              ⚡ Blockchain + IA + Web3
            </div>

            <h1 style={{
              fontSize: isMobile ? "40px" : "64px",
              fontWeight: "900", lineHeight: "1.05",
              margin: "0 0 24px 0", letterSpacing: "-2px"
            }}>
              Remesas<br/>
              <span style={{
                background: `linear-gradient(135deg, ${colors.secundario}, #fbbf24)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>inteligentes</span><br/>
              para Mexico
            </h1>

            <p style={{
              fontSize: isMobile ? "16px" : "18px",
              color: "rgba(255,255,255,0.65)",
              lineHeight: "1.7", margin: "0 0 36px 0",
              maxWidth: "480px"
            }}>
              Envia dinero a tu familia en Mexico con la comision mas baja del mercado. Tecnologia blockchain, IA y pagos automaticos en una sola app.
            </p>

            <div style={{display: "flex", gap: "12px", flexDirection: isMobile ? "column" : "row"}}>
              <button onClick={onEntrar} style={{
                background: `linear-gradient(135deg, ${colors.secundario}, #D96524)`,
                color: "white", border: "none",
                padding: "16px 36px", borderRadius: "14px",
                fontSize: "16px", fontWeight: "700", cursor: "pointer",
                boxShadow: `0 8px 30px ${colors.secundario}50`,
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px"
              }}>
                Crear cuenta gratis →
              </button>
              <button onClick={() => setModalVideo(true)} style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "16px 32px", borderRadius: "14px",
                fontSize: "16px", fontWeight: "700", cursor: "pointer",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "8px",
                backdropFilter: "blur(10px)"
              }}>
                ▶ Ver demo
              </button>
            </div>

            {/* Stats */}
            <div style={{
              display: "flex", gap: isMobile ? "20px" : "40px",
              marginTop: "48px", flexWrap: "wrap"
            }}>
              {[
                {valor: "$0.50", label: "Comision por envio"},
                {valor: "2 min", label: "Tiempo de llegada"},
                {valor: "90%", label: "Ahorro vs Western Union"},
              ].map((s, i) => (
                <div key={i}>
                  <div style={{
                    fontSize: isMobile ? "24px" : "32px",
                    fontWeight: "900", color: "white",
                    marginBottom: "4px"
                  }}>{s.valor}</div>
                  <div style={{
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.5)"
                  }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* App mockup */}
          {!isMobile && (
            <div style={{display: "flex", justifyContent: "center", position: "relative"}}>
              <div style={{
                width: "300px",
                background: "linear-gradient(145deg, #1a2a3a, #0d1821)",
                borderRadius: "40px",
                padding: "12px",
                boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1), 0 0 80px ${colors.secundario}30`,
                position: "relative"
              }}>
                {/* Pantalla del mockup */}
                <div style={{
                  backgroundColor: colors.fondo,
                  borderRadius: "30px",
                  overflow: "hidden",
                  padding: "24px 20px"
                }}>
                  {/* Header mockup */}
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: "24px"
                  }}>
                    <img src="/axoraLogo.png" alt="Axora"
                      style={{height: "28px", objectFit: "contain"}} />
                    <div style={{
                      backgroundColor: `${colors.secundario}20`,
                      borderRadius: "20px", padding: "4px 10px",
                      fontSize: "11px", fontWeight: "700",
                      color: colors.secundario
                    }}>⭐ 250 pts</div>
                  </div>

                  {/* Balance */}
                  <div style={{
                    background: `linear-gradient(135deg, ${colors.principal}, #3d6a9e)`,
                    borderRadius: "16px", padding: "20px",
                    marginBottom: "16px", color: "white",
                    textAlign: "center"
                  }}>
                    <div style={{fontSize: "11px", opacity: 0.7, marginBottom: "6px"}}>
                      Enviaste este mes
                    </div>
                    <div style={{fontSize: "32px", fontWeight: "900"}}>$850.00</div>
                    <div style={{fontSize: "12px", opacity: 0.7, marginTop: "4px"}}>
                      USD via Axora
                    </div>
                  </div>

                  {/* Acciones */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr",
                    gap: "10px", marginBottom: "16px"
                  }}>
                    {[
                      {icon: <Icon nombre="money-transfer" size={28} color="294C74" />, label: "Enviar"},
                      {icon: <Icon nombre="recurring-appointment" size={28} color="F17633" />, label: "Pagos"},
                    ].map((a, i) => (
                      <div key={i} style={{
                        backgroundColor: "white",
                        borderRadius: "12px", padding: "14px",
                        textAlign: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                      }}>
                        <div style={{marginBottom: "4px"}}>{a.icon}</div>
                        <div style={{fontSize: "12px", fontWeight: "700",
                          color: colors.principal}}>{a.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Historial */}
                  <div style={{backgroundColor: "white", borderRadius: "12px", padding: "14px"}}>
                    <div style={{fontSize: "11px", fontWeight: "700",
                      color: colors.textoSec, marginBottom: "10px"}}>
                      ULTIMO ENVIO
                    </div>
                    {[
                      {nombre: "Mama", monto: "$200", tiempo: "Hace 2 dias", color: "#16a34a"},
                      {nombre: "Hermana", monto: "$150", tiempo: "Hace 5 dias", color: "#2563eb"},
                    ].map((t, i) => (
                      <div key={i} style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", padding: "8px 0",
                        borderBottom: i === 0 ? `1px solid ${colors.fondo}` : "none"
                      }}>
                        <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                          <div style={{
                            width: "28px", height: "28px", borderRadius: "50%",
                            backgroundColor: t.color + "20",
                            display: "flex", alignItems: "center",
                            justifyContent: "center"
                          }}>
                            <Icon nombre="user" size={16} color={t.color.replace("#","")} />
                          </div>
                          <div>
                            <div style={{fontSize: "12px", fontWeight: "700",
                              color: colors.principal}}>{t.nombre}</div>
                            <div style={{fontSize: "10px",
                              color: colors.textoSec}}>{t.tiempo}</div>
                          </div>
                        </div>
                        <div style={{fontSize: "13px", fontWeight: "800",
                          color: t.color}}>{t.monto}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badge flotante */}
              <div style={{
                position: "absolute", top: "20px", right: "-20px",
                backgroundColor: "white",
                borderRadius: "16px", padding: "12px 16px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                display: "flex", alignItems: "center", gap: "10px"
              }}>
                <img src="/axo.png" alt="Axo"
                  style={{width: "32px", height: "32px",
                    borderRadius: "50%", objectFit: "cover"}} />
                <div>
                  <div style={{fontSize: "11px", fontWeight: "800",
                    color: colors.principal}}>Axo IA</div>
                  <div style={{fontSize: "10px", color: "#16a34a",
                    fontWeight: "600"}}>● En linea 24/7</div>
                </div>
              </div>

              {/* Badge ahorro */}
              <div style={{
                position: "absolute", bottom: "40px", left: "-30px",
                background: `linear-gradient(135deg, ${colors.secundario}, #D96524)`,
                borderRadius: "16px", padding: "12px 16px",
                boxShadow: `0 8px 30px ${colors.secundario}40`,
                color: "white"
              }}>
                <div style={{fontSize: "10px", opacity: 0.85}}>Ahorraste</div>
                <div style={{fontSize: "20px", fontWeight: "900"}}>$63.00</div>
                <div style={{fontSize: "10px", opacity: 0.85}}>vs Western Union</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FEATURES GRANDES */}
      <section id="caracteristicas" style={{
        padding: isMobile ? "60px 20px" : "100px 48px",
        maxWidth: "1200px", margin: "0 auto"
      }}>
        <div style={{textAlign: "center", marginBottom: "60px"}}>
          <h2 style={{
            fontSize: isMobile ? "32px" : "48px",
            fontWeight: "900", margin: "0 0 16px 0",
            letterSpacing: "-1px"
          }}>
            Todo lo que necesitas
          </h2>
          <p style={{
            fontSize: "18px", color: "rgba(255,255,255,0.5)",
            margin: 0
          }}>
            Axora tiene todo para enviar dinero a Mexico
          </p>
        </div>

        {/* Feature 1 - Grande */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.principal}40, #1a2a3a)`,
          borderRadius: "24px", padding: isMobile ? "32px 24px" : "56px",
          marginBottom: "20px",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "40px", alignItems: "center"
        }}>
          <div>
            <img src="/axo.png" alt="Axo" style={{
              width: "64px", height: "64px",
              borderRadius: "16px", objectFit: "cover",
              marginBottom: "20px"
            }} />
            <h3 style={{
              fontSize: isMobile ? "28px" : "36px",
              fontWeight: "900", margin: "0 0 16px 0",
              lineHeight: "1.2"
            }}>
              Axo, tu asistente<br/>
              <span style={{color: colors.secundario}}>IA financiero</span>
            </h3>
            <p style={{
              fontSize: "16px", color: "rgba(255,255,255,0.6)",
              lineHeight: "1.7", margin: "0 0 24px 0"
            }}>
              Nuestro ajolote IA te asesora 24/7. Desde cuando convertir tus dolares hasta como protegerte de estafas. Siempre en espanol y facil de entender.
            </p>
            <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
              {[
                "Analisis del tipo de cambio en tiempo real",
                "Deteccion de fraudes y estafas",
                "Guia paso a paso para nuevos usuarios",
                "Respuestas en espanol mexicano"
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  fontSize: "14px", color: "rgba(255,255,255,0.7)"
                }}>
                  <div style={{
                    width: "20px", height: "20px", borderRadius: "50%",
                    backgroundColor: `${colors.secundario}30`,
                    display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "11px",
                    color: colors.secundario, flexShrink: 0
                  }}>✓</div>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: "20px", padding: "24px",
            border: "1px solid rgba(255,255,255,0.08)"
          }}>
            {/* Chat mockup */}
            {[
              {texto: "Cuando conviene cambiar mis dolares a pesos?", tipo: "user"},
              {texto: "Hola! El dolar esta en $17.85 hoy, subio 2% esta semana. Te recomiendo esperar 2-3 dias mas para obtener mejor tasa. Te aviso cuando sea el momento ideal!", tipo: "axo"},
              {texto: "Cuanto ahorro usando Axora vs Western Union?", tipo: "user"},
              {texto: "En un envio de $500 USD ahorras $7.50 dolares. En 12 meses eso es $90 USD que se quedan en tu familia!", tipo: "axo"},
            ].map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.tipo === "user" ? "flex-end" : "flex-start",
                marginBottom: "12px", gap: "8px", alignItems: "flex-end"
              }}>
                {msg.tipo === "axo" && (
                  <img src="/axo.png" alt="Axo" style={{
                    width: "28px", height: "28px",
                    borderRadius: "50%", objectFit: "cover", flexShrink: 0
                  }} />
                )}
                <div style={{
                  maxWidth: "75%",
                  backgroundColor: msg.tipo === "user"
                    ? colors.secundario
                    : "rgba(255,255,255,0.1)",
                  borderRadius: msg.tipo === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                  padding: "10px 14px",
                  fontSize: "12px", lineHeight: "1.5",
                  color: "white"
                }}>
                  {msg.texto}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid de 2 features */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "20px", marginBottom: "20px"
        }}>
          {/* Feature 2: Blockchain */}
          <div style={{
            background: `linear-gradient(135deg, ${colors.secundario}30, #1a1a2e)`,
            borderRadius: "24px", padding: "40px 32px",
            border: "1px solid rgba(255,255,255,0.08)"
          }}>
            <div style={{marginBottom: "20px"}}><Icon nombre="chain" size={48} color="F17633" /></div>
            <h3 style={{
              fontSize: "28px", fontWeight: "900",
              margin: "0 0 14px 0", lineHeight: "1.2"
            }}>
              Cada centavo<br/>
              <span style={{color: colors.secundario}}>en blockchain</span>
            </h3>
            <p style={{
              fontSize: "15px", color: "rgba(255,255,255,0.6)",
              lineHeight: "1.7", margin: "0 0 24px 0"
            }}>
              Cada transaccion queda registrada permanentemente en Ethereum. Transparente, inmutable y verificable por cualquiera.
            </p>
            <div style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "12px", padding: "14px",
              fontFamily: "monospace", fontSize: "11px",
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <div style={{color: "#4ade80", marginBottom: "6px"}}>
                ✓ Transaccion confirmada
              </div>
              <div>TX: 0xb1a7De81da0F8D...</div>
              <div style={{color: colors.secundario, marginTop: "4px"}}>
                Ver en Etherscan →
              </div>
            </div>
          </div>

          {/* Feature 3: NFTs */}
          <div style={{
            background: "linear-gradient(135deg, #7c3aed30, #1a1a2e)",
            borderRadius: "24px", padding: "40px 32px",
            border: "1px solid rgba(255,255,255,0.08)"
          }}>
            <div style={{marginBottom: "20px"}}><Icon nombre="trophy" size={48} color="A78BFA" /></div>
            <h3 style={{
              fontSize: "28px", fontWeight: "900",
              margin: "0 0 14px 0", lineHeight: "1.2"
            }}>
              Gana NFTs<br/>
              <span style={{color: "#a78bfa"}}>y recompensas</span>
            </h3>
            <p style={{
              fontSize: "15px", color: "rgba(255,255,255,0.6)",
              lineHeight: "1.7", margin: "0 0 24px 0"
            }}>
              Por cada envio ganas puntos y desbloqueas NFTs exclusivos. El envio numero 10 siempre es gratis!
            </p>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: "10px"
            }}>
              {[
                {nombre: "Baby Axo", pts: "100 pts"},
                {nombre: "Axo Estelar", pts: "600 pts"},
                {nombre: "Axo Guardian", pts: "400 pts"},
                {nombre: "Leyenda", pts: "2000 pts"},
              ].map((nft, i) => (
                <div key={i} style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderRadius: "10px", padding: "10px",
                  display: "flex", alignItems: "center", gap: "8px",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}>
                  <img src="/axo.png" alt={nft.nombre}
                    style={{width: "28px", height: "28px",
                      borderRadius: "8px", objectFit: "cover"}} />
                  <div>
                    <div style={{fontSize: "11px", fontWeight: "700"}}>
                      {nft.nombre}
                    </div>
                    <div style={{fontSize: "10px", color: "#a78bfa"}}>
                      {nft.pts}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature 4: Pagos automaticos - ancho completo */}
        <div style={{
          background: "linear-gradient(135deg, #16a34a20, #1a1a2e)",
          borderRadius: "24px", padding: isMobile ? "32px 24px" : "48px 56px",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "40px", alignItems: "center"
        }}>
          <div>
            <div style={{marginBottom: "20px"}}><Icon nombre="lightning-bolt" size={48} color="4ADE80" /></div>
            <h3 style={{
              fontSize: isMobile ? "28px" : "36px",
              fontWeight: "900", margin: "0 0 16px 0", lineHeight: "1.2"
            }}>
              Pagos automaticos<br/>
              <span style={{color: "#4ade80"}}>sin que te olvides</span>
            </h3>
            <p style={{
              fontSize: "16px", color: "rgba(255,255,255,0.6)",
              lineHeight: "1.7", margin: 0
            }}>
              Configura una vez y listo. CFE, agua, gas e internet de tu familia se pagan solos cada mes. Tu familia nunca se queda sin servicios.
            </p>
          </div>
          <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
            {[
              {icon: <Icon nombre="light-on" size={22} color="FFFFFF" />, servicio: "CFE", monto: "$800 MXN", dia: "Dia 1", activo: true},
              {icon: <Icon nombre="internet" size={22} color="FFFFFF" />, servicio: "Telmex / Izzi", monto: "$450 MXN", dia: "Dia 15", activo: true},
              {icon: <Icon nombre="water" size={22} color="FFFFFF" />, servicio: "Agua", monto: "$200 MXN", dia: "Dia 10", activo: true},
              {icon: <Icon nombre="fire-element" size={22} color="FFFFFF" />, servicio: "Gas", monto: "$350 MXN", dia: "Dia 20", activo: false},
            ].map((p, i) => (
              <div key={i} style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                borderRadius: "12px", padding: "14px 18px",
                display: "flex", alignItems: "center", gap: "12px",
                border: "1px solid rgba(255,255,255,0.08)",
                opacity: p.activo ? 1 : 0.5
              }}>
                <span style={{fontSize: "22px"}}>{p.icon}</span>
                <div style={{flex: 1}}>
                  <div style={{fontSize: "14px", fontWeight: "700"}}>{p.servicio}</div>
                  <div style={{fontSize: "12px", color: "rgba(255,255,255,0.5)"}}>{p.dia} de cada mes</div>
                </div>
                <div style={{textAlign: "right"}}>
                  <div style={{fontSize: "14px", fontWeight: "800"}}>{p.monto}</div>
                  <div style={{
                    fontSize: "11px",
                    color: p.activo ? "#4ade80" : "rgba(255,255,255,0.4)",
                    fontWeight: "600"
                  }}>
                    {p.activo ? "● Activo" : "● Pausado"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEGURIDAD */}
      <section id="seguridad" style={{
        padding: isMobile ? "60px 20px" : "100px 48px",
        backgroundColor: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        <div style={{maxWidth: "1200px", margin: "0 auto"}}>
          <div style={{textAlign: "center", marginBottom: "60px"}}>
            <h2 style={{
              fontSize: isMobile ? "32px" : "48px",
              fontWeight: "900", margin: "0 0 16px 0"
            }}>
              Tu seguridad, nuestra prioridad
            </h2>
            <p style={{fontSize: "18px", color: "rgba(255,255,255,0.5)", margin: 0}}>
              Axora tiene todo para proteger tu dinero y datos
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: "20px"
          }}>
            {[
              {
                icon: <Icon nombre="lock-2" size={28} color="FFFFFF" />,
                titulo: "No custodial",
                desc: "Nunca tenemos acceso a tu dinero ni tus datos. Tu controla tu cuenta en todo momento."
              },
              {
                icon: <Icon nombre="chain" size={28} color="FFFFFF" />,
                titulo: "Blockchain inmutable",
                desc: "Cada transaccion queda registrada en Ethereum. Nadie puede modificar ni borrar el historial."
              },
              {
                icon: <Icon nombre="invisible" size={28} color="FFFFFF" />,
                titulo: "Privacidad total",
                desc: "No rastreamos informacion personal ni compartimos tus datos con terceros. Jamas."
              },
              {
                icon: <Icon nombre="checkmark" size={28} color="FFFFFF" />,
                titulo: "Verificacion en cadena",
                desc: "Cualquier transaccion puede ser verificada publicamente en Etherscan en tiempo real."
              }
            ].map((item, i) => (
              <div key={i} style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                borderRadius: "20px", padding: "32px",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "all 0.2s"
              }}>
                <div style={{
                  width: "56px", height: "56px",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  display: "flex", alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px"
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontSize: "20px", fontWeight: "800",
                  margin: "0 0 12px 0"
                }}>
                  {item.titulo}
                </h3>
                <p style={{
                  fontSize: "15px", color: "rgba(255,255,255,0.55)",
                  lineHeight: "1.7", margin: 0
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section style={{
        padding: isMobile ? "60px 20px" : "100px 48px"
      }}>
        <div style={{maxWidth: "1200px", margin: "0 auto"}}>
          <div style={{textAlign: "center", marginBottom: "60px"}}>
            <h2 style={{
              fontSize: isMobile ? "32px" : "48px",
              fontWeight: "900", margin: "0 0 16px 0"
            }}>
              Las familias aman Axora
            </h2>
            <p style={{fontSize: "18px", color: "rgba(255,255,255,0.5)", margin: 0}}>
              Lo que dicen nuestros usuarios
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "20px"
          }}>
            {[
              {
                nombre: "Carlos M.",
                usuario: "@carlos_mx",
                texto: "Llevo 6 meses usando Axora para mandar dinero a mi mama. Ahorro casi $90 dolares al año vs Western Union. Increible!",
                estrellas: 5
              },
              {
                nombre: "Ana Garcia",
                usuario: "@ana_garcia",
                texto: "Lo mejor es que mi mama no tiene que ir al banco. El dinero le llega directo a su cuenta BBVA en minutos. Super facil!",
                estrellas: 5
              },
              {
                nombre: "Roberto L.",
                usuario: "@roberto_usa",
                texto: "Axo la IA me aviso cuando el dolar estaba alto y pude cambiar mis pesos en el momento perfecto. Genial!",
                estrellas: 5
              }
            ].map((t, i) => (
              <div key={i} style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: "20px", padding: "28px",
                border: "1px solid rgba(255,255,255,0.08)"
              }}>
                <div style={{display: "flex", gap: "4px", marginBottom: "16px"}}>
                  {Array(t.estrellas).fill("⭐").map((s, i) => (
                    <span key={i} style={{fontSize: "14px"}}>{s}</span>
                  ))}
                </div>
                <p style={{
                  fontSize: "15px", color: "rgba(255,255,255,0.7)",
                  lineHeight: "1.7", margin: "0 0 20px 0"
                }}>
                  "{t.texto}"
                </p>
                <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: `linear-gradient(135deg, ${colors.principal}, ${colors.secundario})`,
                    display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "16px"
                  }}>👤</div>
                  <div>
                    <div style={{fontSize: "14px", fontWeight: "700"}}>{t.nombre}</div>
                    <div style={{fontSize: "12px", color: "rgba(255,255,255,0.4)"}}>{t.usuario}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{
        padding: isMobile ? "60px 20px" : "100px 48px",
        textAlign: "center"
      }}>
        <div style={{maxWidth: "700px", margin: "0 auto"}}>
          <img src="/axo.png" alt="Axo" style={{
            width: "80px", height: "80px",
            borderRadius: "50%", objectFit: "cover",
            marginBottom: "24px",
            boxShadow: `0 0 40px ${colors.secundario}50`
          }} />
          <h2 style={{
            fontSize: isMobile ? "36px" : "56px",
            fontWeight: "900", margin: "0 0 20px 0",
            lineHeight: "1.1", letterSpacing: "-1px"
          }}>
            Empieza a enviar<br/>
            <span style={{
              background: `linear-gradient(135deg, ${colors.secundario}, #fbbf24)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>dinero hoy mismo</span>
          </h2>
          <p style={{
            fontSize: "18px", color: "rgba(255,255,255,0.55)",
            margin: "0 0 40px 0", lineHeight: "1.6"
          }}>
            Registrate gratis en segundos. Sin papeleos, sin cuentas bancarias, sin complicaciones.
          </p>
          <button onClick={onEntrar} style={{
            background: `linear-gradient(135deg, ${colors.secundario}, #D96524)`,
            color: "white", border: "none",
            padding: "18px 48px", borderRadius: "16px",
            fontSize: "18px", fontWeight: "700", cursor: "pointer",
            boxShadow: `0 8px 40px ${colors.secundario}50`,
            marginBottom: "16px", display: "inline-block"
          }}>
            Crear cuenta gratis →
          </button>
          <div style={{fontSize: "13px", color: "rgba(255,255,255,0.35)"}}>
            Sin tarjeta de credito · Gratis para siempre
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{
        padding: isMobile ? "60px 20px" : "80px 48px",
        borderTop: "1px solid rgba(255,255,255,0.06)"
      }}>
        <div style={{maxWidth: "600px", margin: "0 auto", textAlign: "center"}}>
          <h2 style={{
            fontSize: isMobile ? "28px" : "40px",
            fontWeight: "900", margin: "0 0 16px 0"
          }}>
            Contactanos
          </h2>
          <p style={{
            fontSize: "16px", color: "rgba(255,255,255,0.5)",
            margin: "0 0 32px 0", lineHeight: "1.6"
          }}>
            Tienes dudas o quieres saber mas sobre Axora? Escríbenos directamente.
          </p>
          <a href="mailto:axoraa26@gmail.com" style={{
            display: "inline-flex", alignItems: "center", gap: "12px",
            background: `linear-gradient(135deg, ${colors.principal}, #3d6a9e)`,
            color: "white", textDecoration: "none",
            padding: "16px 32px", borderRadius: "14px",
            fontSize: "16px", fontWeight: "700",
            boxShadow: "0 8px 30px rgba(41,76,116,0.4)"
          }}>
            <Icon nombre="email" size={22} color="FFFFFF" />
            axoraa26@gmail.com
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: isMobile ? "40px 20px" : "60px 48px",
        backgroundColor: "rgba(255,255,255,0.02)"
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr",
          gap: "40px"
        }}>
          <div>
            <img src="/axoraLogo.png" alt="Axora" style={{
              height: "36px", objectFit: "contain",
              borderRadius: "8px", padding: "4px",
              backgroundColor: "white",
              marginBottom: "16px", display: "block"
            }} />
            <p style={{
              fontSize: "14px", color: "rgba(255,255,255,0.4)",
              lineHeight: "1.6", margin: 0
            }}>
              Remesas inteligentes con blockchain e IA para familias mexicanas.
            </p>
          </div>
          {[
            {titulo: "Producto", links: ["Caracteristicas", "Seguridad", "NFTs", "Precios"]},
            {titulo: "Recursos", links: ["Blog", "Documentacion", "Contratos", "API"]},
            {titulo: "Empresa", links: ["Acerca de", "Equipo", "Privacidad", "Terminos"]},
          ].map((col, i) => (
            <div key={i}>
              <div style={{
                fontSize: "13px", fontWeight: "700",
                color: "rgba(255,255,255,0.9)",
                marginBottom: "16px", letterSpacing: "0.5px"
              }}>
                {col.titulo}
              </div>
              {col.links.map(link => (
                <div key={link} style={{
                  fontSize: "14px", color: "rgba(255,255,255,0.4)",
                  marginBottom: "10px", cursor: "pointer"
                }}>
                  {link}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{
          maxWidth: "1200px", margin: "40px auto 0",
          paddingTop: "24px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: isMobile ? "column" : "row",
          gap: "12px"
        }}>
          <div style={{fontSize: "13px", color: "rgba(255,255,255,0.3)"}}>
            © 2026 Axora Technologies. Todos los derechos reservados.
          </div>
          <div style={{fontSize: "13px", color: "rgba(255,255,255,0.3)"}}>
            Red Ethereum Sepolia Testnet
          </div>
        </div>
      </footer>

      {/* Modal de video */}
      {modalVideo && (
        <div
          onClick={() => setModalVideo(false)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
            backdropFilter: "blur(8px)"
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: "900px",
              position: "relative",
              borderRadius: "20px", overflow: "hidden",
              boxShadow: "0 40px 100px rgba(0,0,0,0.8)"
            }}
          >
            {/* Boton cerrar */}
            <button
              onClick={() => setModalVideo(false)}
              style={{
                position: "absolute", top: "-44px", right: "0",
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white", width: "36px", height: "36px",
                borderRadius: "50%", cursor: "pointer",
                fontSize: "16px", fontWeight: "800",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 1
              }}
            >✕</button>

            {/* Video de YouTube */}
            <div style={{
              position: "relative",
              paddingBottom: "56.25%", height: 0,
              backgroundColor: "#000"
            }}>
              <iframe
                src="AQUI_VA_TU_LINK"
                title="Axora Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                allowFullScreen
                style={{
                  position: "absolute", top: 0, left: 0,
                  width: "100%", height: "100%",
                  border: "none"
                }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
"use client";
import { useState, useEffect } from "react";

const SERVICIOS = [
  { id: "cfe", nombre: "CFE", icono: "💡", descripcion: "Luz electrica", color: "#f59e0b" },
  { id: "telmex", nombre: "Telmex / Izzi", icono: "🌐", descripcion: "Internet y telefono", color: "#3b82f6" },
  { id: "agua", nombre: "Agua", icono: "💧", descripcion: "Servicio de agua", color: "#06b6d4" },
  { id: "gas", nombre: "Gas", icono: "🔥", descripcion: "Gas natural o LP", color: "#ef4444" },
];

const DIAS = Array.from({ length: 28 }, (_, i) => i + 1);

export default function PagosAutomaticos({ colors, usuario }) {
  const [pagos, setPagos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(null);
  const [form, setForm] = useState({
    servicio: "",
    nombreBeneficiario: "",
    clabe: "",
    banco: "",
    montoPesos: "",
    diaPago: "1",
    notas: ""
  });
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState("");

  const bancos = ["BBVA", "Banamex", "Banorte", "Santander", "HSBC", "Scotiabank", "Inbursa", "Azteca"];

  // Cargar pagos del localStorage
  useEffect(() => {
    const key = `axora_pagos_${usuario?.email || usuario?.wallet}`;
    const guardados = localStorage.getItem(key);
    if (guardados) setPagos(JSON.parse(guardados));
  }, [usuario]);

  const guardarPagos = (nuevosPagos) => {
    const key = `axora_pagos_${usuario?.email || usuario?.wallet}`;
    localStorage.setItem(key, JSON.stringify(nuevosPagos));
    setPagos(nuevosPagos);
  };

  const resetForm = () => {
    setForm({ servicio: "", nombreBeneficiario: "", clabe: "", banco: "", montoPesos: "", diaPago: "1", notas: "" });
    setError("");
    setEditando(null);
  };

  const abrirFormNuevo = () => {
    resetForm();
    setMostrarForm(true);
  };

  const abrirFormEditar = (pago) => {
    setForm({
      servicio: pago.servicio,
      nombreBeneficiario: pago.nombreBeneficiario,
      clabe: pago.clabe,
      banco: pago.banco,
      montoPesos: pago.montoPesos,
      diaPago: pago.diaPago,
      notas: pago.notas || ""
    });
    setEditando(pago.id);
    setMostrarForm(true);
  };

  const guardarPago = async () => {
    setError("");
    if (!form.servicio) return setError("Selecciona un servicio");
    if (!form.nombreBeneficiario) return setError("Ingresa el nombre del beneficiario");
    if (!form.clabe || form.clabe.length !== 18) return setError("La CLABE debe tener 18 digitos");
    if (!form.banco) return setError("Selecciona un banco");
    if (!form.montoPesos || parseFloat(form.montoPesos) <= 0) return setError("Ingresa un monto valido");

    setGuardando(true);
    await new Promise(r => setTimeout(r, 1200));

    const servicio = SERVICIOS.find(s => s.id === form.servicio);
    const nuevoPago = {
      id: editando || Date.now().toString(),
      servicio: form.servicio,
      nombreServicio: servicio.nombre,
      iconoServicio: servicio.icono,
      colorServicio: servicio.color,
      nombreBeneficiario: form.nombreBeneficiario,
      clabe: form.clabe,
      banco: form.banco,
      montoPesos: form.montoPesos,
      diaPago: form.diaPago,
      notas: form.notas,
      activo: true,
      fechaCreacion: editando ? pagos.find(p => p.id === editando)?.fechaCreacion : new Date().toLocaleDateString("es-MX"),
      ultimoPago: editando ? pagos.find(p => p.id === editando)?.ultimoPago : null,
      hashBlockchain: "0x" + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join("")
    };

    let nuevosPagos;
    if (editando) {
      nuevosPagos = pagos.map(p => p.id === editando ? nuevoPago : p);
      setExito("Pago actualizado correctamente");
    } else {
      nuevosPagos = [...pagos, nuevoPago];
      setExito("Pago configurado y registrado en blockchain");
    }

    guardarPagos(nuevosPagos);
    setGuardando(false);
    setMostrarForm(false);
    resetForm();
    setTimeout(() => setExito(""), 4000);
  };

  const toggleActivo = (id) => {
    const nuevosPagos = pagos.map(p =>
      p.id === id ? {...p, activo: !p.activo} : p
    );
    guardarPagos(nuevosPagos);
  };

  const eliminarPago = (id) => {
    const nuevosPagos = pagos.filter(p => p.id !== id);
    guardarPagos(nuevosPagos);
    setConfirmandoEliminar(null);
    setExito("Pago eliminado correctamente");
    setTimeout(() => setExito(""), 3000);
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: "10px",
    border: `2px solid ${colors.apoyo}60`, fontSize: "14px",
    outline: "none", color: colors.principal, backgroundColor: colors.contenedor,
    boxSizing: "border-box", fontFamily: "inherit"
  };

  const labelStyle = {
    display: "block", fontSize: "12px", fontWeight: "700",
    color: colors.principal, marginBottom: "6px", letterSpacing: "0.3px"
  };

  const totalMensual = pagos
    .filter(p => p.activo)
    .reduce((sum, p) => sum + parseFloat(p.montoPesos || 0), 0);

  const totalUSD = (totalMensual / 17.85).toFixed(2);

  return (
    <div>
      {/* Header */}
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px"}}>
        <div>
          <h1 style={{fontSize: "32px", fontWeight: "900", color: colors.principal, margin: "0 0 8px 0"}}>
            Pagos Automaticos
          </h1>
          <p style={{fontSize: "15px", color: colors.textoSec, margin: 0}}>
            Configura pagos recurrentes para tu familia en Mexico
          </p>
        </div>
        <button onClick={abrirFormNuevo} style={{
          backgroundColor: colors.secundario, color: "white", border: "none",
          padding: "12px 24px", borderRadius: "12px", fontSize: "14px",
          fontWeight: "700", cursor: "pointer", display: "flex",
          alignItems: "center", gap: "8px",
          boxShadow: "0 4px 12px rgba(241,118,51,0.3)"
        }}>
          + Agregar pago
        </button>
      </div>

      {/* Mensaje de exito */}
      {exito && (
        <div style={{
          backgroundColor: "#f0fdf4", border: "2px solid #16a34a",
          borderRadius: "12px", padding: "14px 18px", marginBottom: "24px",
          display: "flex", alignItems: "center", gap: "10px"
        }}>
          <span style={{fontSize: "20px"}}>✅</span>
          <span style={{fontSize: "14px", fontWeight: "600", color: "#15803d"}}>{exito}</span>
        </div>
      )}

      {/* Resumen */}
      {pagos.length > 0 && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px", marginBottom: "32px"
        }}>
          {[
            {icon: "⚡", label: "Pagos activos", valor: pagos.filter(p => p.activo).length, color: colors.secundario},
            {icon: "💰", label: "Total mensual MXN", valor: `$${totalMensual.toLocaleString("es-MX")} MXN`, color: colors.principal},
            {icon: "💵", label: "Equivalente USD", valor: `~$${totalUSD} USD`, color: "#16a34a"},
          ].map((stat, i) => (
            <div key={i} style={{
              backgroundColor: "white", borderRadius: "16px", padding: "20px",
              border: `1px solid ${colors.apoyo}40`,
              boxShadow: "0 2px 8px rgba(41,76,116,0.04)"
            }}>
              <div style={{fontSize: "24px", marginBottom: "8px"}}>{stat.icon}</div>
              <div style={{fontSize: "22px", fontWeight: "800", color: stat.color, marginBottom: "4px"}}>{stat.valor}</div>
              <div style={{fontSize: "12px", color: colors.textoSec, fontWeight: "500"}}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Lista de pagos */}
      {pagos.length === 0 && !mostrarForm ? (
        <div style={{
          backgroundColor: "white", borderRadius: "20px", padding: "64px 40px",
          textAlign: "center", boxShadow: "0 4px 20px rgba(41,76,116,0.06)",
          border: `1px solid ${colors.apoyo}40`
        }}>
          <div style={{fontSize: "72px", marginBottom: "16px"}}>⚡</div>
          <h2 style={{fontSize: "24px", fontWeight: "800", color: colors.principal, margin: "0 0 8px 0"}}>
            Sin pagos configurados
          </h2>
          <p style={{color: colors.textoSec, fontSize: "15px", marginBottom: "28px", maxWidth: "400px", margin: "0 auto 28px"}}>
            Configura pagos automaticos para CFE, internet, agua y gas de tu familia. Nunca mas olvides un pago.
          </p>
          <button onClick={abrirFormNuevo} style={{
            backgroundColor: colors.secundario, color: "white", border: "none",
            padding: "14px 32px", borderRadius: "12px", fontSize: "15px",
            fontWeight: "700", cursor: "pointer"
          }}>
            + Configurar primer pago
          </button>
        </div>
      ) : (
        <div style={{display: "flex", flexDirection: "column", gap: "16px", marginBottom: mostrarForm ? "32px" : "0"}}>
          {pagos.map(pago => (
            <div key={pago.id} style={{
              backgroundColor: "white", borderRadius: "16px", padding: "24px",
              boxShadow: "0 2px 12px rgba(41,76,116,0.06)",
              border: `1px solid ${pago.activo ? colors.apoyo + "60" : colors.apoyo + "30"}`,
              opacity: pago.activo ? 1 : 0.6,
              transition: "all 0.2s"
            }}>
              <div style={{display: "flex", alignItems: "center", gap: "16px"}}>

                {/* Icono servicio */}
                <div style={{
                  width: "52px", height: "52px", borderRadius: "14px",
                  backgroundColor: pago.colorServicio + "20",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "26px", flexShrink: 0,
                  border: `2px solid ${pago.colorServicio}30`
                }}>
                  {pago.iconoServicio}
                </div>

                {/* Info */}
                <div style={{flex: 1}}>
                  <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px"}}>
                    <h3 style={{fontSize: "16px", fontWeight: "800", color: colors.principal, margin: 0}}>
                      {pago.nombreServicio}
                    </h3>
                    <span style={{
                      backgroundColor: pago.activo ? "#f0fdf4" : "#f9fafb",
                      color: pago.activo ? "#16a34a" : colors.textoSec,
                      border: `1px solid ${pago.activo ? "#bbf7d0" : colors.apoyo}`,
                      padding: "2px 10px", borderRadius: "20px",
                      fontSize: "11px", fontWeight: "700"
                    }}>
                      {pago.activo ? "✓ ACTIVO" : "PAUSADO"}
                    </span>
                  </div>
                  <div style={{fontSize: "13px", color: colors.textoSec, display: "flex", gap: "16px", flexWrap: "wrap"}}>
                    <span>👤 {pago.nombreBeneficiario}</span>
                    <span>🏦 {pago.banco} ****{pago.clabe.slice(-4)}</span>
                    <span>📅 Día {pago.diaPago} de cada mes</span>
                    {pago.ultimoPago && <span>✅ Último: {pago.ultimoPago}</span>}
                  </div>
                  {pago.notas && (
                    <div style={{fontSize: "12px", color: colors.textoSec, marginTop: "4px", fontStyle: "italic"}}>
                      📝 {pago.notas}
                    </div>
                  )}
                </div>

                {/* Monto */}
                <div style={{textAlign: "right", flexShrink: 0}}>
                  <div style={{fontSize: "22px", fontWeight: "900", color: colors.principal}}>
                    ${parseFloat(pago.montoPesos).toLocaleString("es-MX")}
                  </div>
                  <div style={{fontSize: "12px", color: colors.textoSec}}>MXN/mes</div>
                  <div style={{fontSize: "11px", color: colors.textoSec, marginTop: "2px"}}>
                    ~${(parseFloat(pago.montoPesos) / 17.85).toFixed(2)} USD
                  </div>
                </div>

                {/* Acciones */}
                <div style={{display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0}}>
                  <button onClick={() => toggleActivo(pago.id)} style={{
                    backgroundColor: pago.activo ? colors.apoyo + "30" : "#f0fdf4",
                    color: pago.activo ? colors.textoSec : "#16a34a",
                    border: "none", padding: "6px 12px", borderRadius: "8px",
                    fontSize: "12px", fontWeight: "700", cursor: "pointer"
                  }}>
                    {pago.activo ? "Pausar" : "Activar"}
                  </button>
                  <button onClick={() => abrirFormEditar(pago)} style={{
                    backgroundColor: `${colors.principal}10`, color: colors.principal,
                    border: "none", padding: "6px 12px", borderRadius: "8px",
                    fontSize: "12px", fontWeight: "700", cursor: "pointer"
                  }}>
                    Editar
                  </button>
                  <button onClick={() => setConfirmandoEliminar(pago.id)} style={{
                    backgroundColor: "#fef2f2", color: "#dc2626",
                    border: "none", padding: "6px 12px", borderRadius: "8px",
                    fontSize: "12px", fontWeight: "700", cursor: "pointer"
                  }}>
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Hash blockchain */}
              <div style={{
                marginTop: "12px", paddingTop: "12px",
                borderTop: `1px solid ${colors.apoyo}30`,
                display: "flex", alignItems: "center", gap: "8px"
              }}>
                <span style={{fontSize: "12px"}}>🔗</span>
                <span style={{fontSize: "11px", color: colors.textoSec}}>Registrado en blockchain:</span>
                <span style={{fontSize: "11px", fontFamily: "monospace", color: colors.principal}}>
                  {pago.hashBlockchain.slice(0, 20)}...
                </span>
              </div>

              {/* Confirmacion eliminar */}
              {confirmandoEliminar === pago.id && (
                <div style={{
                  marginTop: "12px", backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca", borderRadius: "10px",
                  padding: "12px 16px", display: "flex",
                  alignItems: "center", justifyContent: "space-between", gap: "12px"
                }}>
                  <span style={{fontSize: "13px", color: "#dc2626", fontWeight: "600"}}>
                    ⚠️ Estas seguro que quieres eliminar este pago?
                  </span>
                  <div style={{display: "flex", gap: "8px"}}>
                    <button onClick={() => setConfirmandoEliminar(null)} style={{
                      backgroundColor: "white", color: colors.textoSec,
                      border: `1px solid ${colors.apoyo}`, padding: "6px 14px",
                      borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer"
                    }}>
                      Cancelar
                    </button>
                    <button onClick={() => eliminarPago(pago.id)} style={{
                      backgroundColor: "#dc2626", color: "white", border: "none",
                      padding: "6px 14px", borderRadius: "8px",
                      fontSize: "12px", fontWeight: "700", cursor: "pointer"
                    }}>
                      Si, eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Formulario agregar/editar */}
      {mostrarForm && (
        <div style={{
          backgroundColor: "white", borderRadius: "20px", padding: "40px",
          boxShadow: "0 8px 30px rgba(41,76,116,0.1)",
          border: `2px solid ${colors.secundario}`,
          marginTop: "24px"
        }}>
          <h2 style={{fontSize: "22px", fontWeight: "800", color: colors.principal, margin: "0 0 28px 0"}}>
            {editando ? "✏️ Editar pago" : "➕ Nuevo pago automatico"}
          </h2>

          {/* Seleccion de servicio */}
          <div style={{marginBottom: "24px"}}>
            <label style={labelStyle}>Tipo de servicio</label>
            <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px"}}>
              {SERVICIOS.map(s => (
                <button key={s.id} onClick={() => setForm(p => ({...p, servicio: s.id}))} style={{
                  padding: "14px 8px",
                  borderRadius: "12px",
                  border: `2px solid ${form.servicio === s.id ? s.color : colors.apoyo + "60"}`,
                  backgroundColor: form.servicio === s.id ? s.color + "15" : "white",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s"
                }}>
                  <div style={{fontSize: "24px", marginBottom: "4px"}}>{s.icono}</div>
                  <div style={{fontSize: "12px", fontWeight: "700", color: form.servicio === s.id ? s.color : colors.textoSec}}>
                    {s.nombre}
                  </div>
                  <div style={{fontSize: "10px", color: colors.textoSec}}>{s.descripcion}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px"}}>
            <div>
              <label style={labelStyle}>Nombre del beneficiario</label>
              <input type="text" value={form.nombreBeneficiario}
                onChange={e => setForm(p => ({...p, nombreBeneficiario: e.target.value}))}
                placeholder="Ej: Maria Garcia Lopez"
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Banco</label>
              <select value={form.banco}
                onChange={e => setForm(p => ({...p, banco: e.target.value}))}
                style={{...inputStyle, cursor: "pointer"}}>
                <option value="">Selecciona banco...</option>
                {bancos.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div style={{marginBottom: "20px"}}>
            <label style={labelStyle}>CLABE interbancaria (18 digitos)</label>
            <input type="text" value={form.clabe}
              onChange={e => setForm(p => ({...p, clabe: e.target.value.replace(/\D/g, "").slice(0, 18)}))}
              placeholder="000000000000000000" maxLength={18}
              style={{...inputStyle, fontFamily: "monospace", letterSpacing: "2px"}} />
            <div style={{fontSize: "11px", color: form.clabe.length === 18 ? "#16a34a" : colors.textoSec, marginTop: "4px", fontWeight: "600"}}>
              {form.clabe.length}/18 {form.clabe.length === 18 && "✓ Correcto"}
            </div>
          </div>

          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px"}}>
            <div>
              <label style={labelStyle}>Monto mensual (pesos MXN)</label>
              <div style={{position: "relative"}}>
                <div style={{position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontWeight: "800", color: colors.textoSec, fontSize: "16px"}}>$</div>
                <input type="number" value={form.montoPesos}
                  onChange={e => setForm(p => ({...p, montoPesos: e.target.value}))}
                  placeholder="800" min="1"
                  style={{...inputStyle, paddingLeft: "28px", fontSize: "18px", fontWeight: "700"}} />
              </div>
              {form.montoPesos && (
                <div style={{fontSize: "11px", color: colors.textoSec, marginTop: "4px"}}>
                  ≈ ${(parseFloat(form.montoPesos) / 17.85).toFixed(2)} USD
                </div>
              )}
            </div>
            <div>
              <label style={labelStyle}>Dia de pago cada mes</label>
              <select value={form.diaPago}
                onChange={e => setForm(p => ({...p, diaPago: e.target.value}))}
                style={{...inputStyle, cursor: "pointer"}}>
                {DIAS.map(d => (
                  <option key={d} value={d}>Dia {d} de cada mes</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{marginBottom: "24px"}}>
            <label style={labelStyle}>Notas (opcional)</label>
            <input type="text" value={form.notas}
              onChange={e => setForm(p => ({...p, notas: e.target.value}))}
              placeholder="Ej: Casa de mama en Guadalajara"
              style={inputStyle} />
          </div>

          {/* Resumen */}
          {form.servicio && form.montoPesos && form.diaPago && (
            <div style={{
              backgroundColor: `${colors.secundario}10`,
              border: `1px solid ${colors.secundario}30`,
              borderRadius: "12px", padding: "16px", marginBottom: "24px"
            }}>
              <div style={{fontSize: "13px", fontWeight: "700", color: colors.principal, marginBottom: "8px"}}>
                📋 Resumen del pago:
              </div>
              <div style={{fontSize: "13px", color: colors.textoSec}}>
                Cada mes el <strong>día {form.diaPago}</strong>, Axora pagará automáticamente{" "}
                <strong>${parseFloat(form.montoPesos || 0).toLocaleString("es-MX")} MXN</strong>{" "}
                de <strong>{SERVICIOS.find(s => s.id === form.servicio)?.nombre}</strong>{" "}
                a la cuenta de <strong>{form.nombreBeneficiario || "..."}</strong> en <strong>{form.banco || "..."}</strong>.
              </div>
            </div>
          )}

          {/* Info blockchain */}
          <div style={{
            backgroundColor: `${colors.principal}08`,
            border: `1px solid ${colors.principal}15`,
            borderRadius: "12px", padding: "14px",
            marginBottom: "24px",
            display: "flex", gap: "10px", alignItems: "flex-start"
          }}>
            <span style={{fontSize: "18px"}}>🔗</span>
            <p style={{fontSize: "12px", color: colors.textoSec, margin: 0, lineHeight: "1.6"}}>
              Este pago quedara registrado en blockchain de forma permanente. Axora ejecutara el pago automaticamente cada mes en la fecha indicada.
            </p>
          </div>

          {error && (
            <div style={{backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px", marginBottom: "16px", fontSize: "13px", color: "#dc2626"}}>
              ⚠️ {error}
            </div>
          )}

          <div style={{display: "flex", gap: "12px"}}>
            <button onClick={() => { setMostrarForm(false); resetForm(); }} style={{
              flex: 1, backgroundColor: "transparent", color: colors.principal,
              border: `2px solid ${colors.apoyo}`, padding: "14px",
              borderRadius: "12px", fontSize: "14px", fontWeight: "700", cursor: "pointer"
            }}>
              Cancelar
            </button>
            <button onClick={guardarPago} disabled={guardando} style={{
              flex: 2,
              backgroundColor: guardando ? colors.apoyo : colors.secundario,
              color: "white", border: "none", padding: "14px",
              borderRadius: "12px", fontSize: "14px", fontWeight: "700",
              cursor: guardando ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(241,118,51,0.3)"
            }}>
              {guardando ? "⏳ Registrando en blockchain..." : editando ? "✅ Guardar cambios" : "🔗 Configurar pago automatico"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export const TIPOS_NOTIF = {
  ENVIO_EXITOSO: "envio_exitoso",
  TIPO_CAMBIO: "tipo_cambio_favorable",
  NFT: "nft_desbloqueado",
  PAGO_AUTO: "pago_automatico"
};

export const getNotificaciones = (usuario) => {
  const key = `axora_notifs_${usuario?.email || usuario?.wallet}`;
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : [];
};

export const saveNotificaciones = (usuario, notifs) => {
  const key = `axora_notifs_${usuario?.email || usuario?.wallet}`;
  localStorage.setItem(key, JSON.stringify(notifs));
};

export const agregarNotificacion = (usuario, tipo, titulo, mensaje, icono = "bell") => {
  const notifs = getNotificaciones(usuario);
  const nueva = {
    id: Date.now().toString(),
    tipo, titulo, mensaje, icono,
    leida: false,
    fecha: new Date().toLocaleString("es-MX"),
    timestamp: Date.now()
  };
  const actualizadas = [nueva, ...notifs].slice(0, 20);
  saveNotificaciones(usuario, actualizadas);
  return nueva;
};

export const marcarLeida = (usuario, id) => {
  const notifs = getNotificaciones(usuario);
  const actualizadas = notifs.map(n => n.id === id ? {...n, leida: true} : n);
  saveNotificaciones(usuario, actualizadas);
  return actualizadas;
};

export const marcarTodasLeidas = (usuario) => {
  const notifs = getNotificaciones(usuario);
  const actualizadas = notifs.map(n => ({...n, leida: true}));
  saveNotificaciones(usuario, actualizadas);
  return actualizadas;
};

export const enviarEmailNotificacion = async (tipo, email, data) => {
  if (!email || email === "") return;
  try {
    await fetch("/api/notify", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ tipo, email, data })
    });
  } catch (err) {
    console.log("Error enviando email:", err);
  }
};
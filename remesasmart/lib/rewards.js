// Sistema de puntos y recompensas de Axora

export const PUNTOS_POR_ACCION = {
  PRIMER_ENVIO: 50,
  ENVIO_POR_10_USD: 1,
  REFERIR_AMIGO: 100,
  PAGO_AUTOMATICO: 75,
  COMPLETAR_PERFIL: 25,
  CONSULTA_AXO: 5,
};

export const NFT_BADGES = [
  {
    id: "primer_envio", nombre: "Baby Axo",
    descripcion: "Realizaste tu primer envio",
    icono: "star", imagen: "/nft-baby-axo.png",
    color: "#CD7F32", colorBg: "#FDF3E7",
    requisito: "1 envio realizado", enviosRequeridos: 1,
    tipo: "envios", puntosAlCanjear: 100
  },
  {
    id: "familia_unida", nombre: "Familia Unida",
    descripcion: "Realizaste 5 envios a tu familia",
    icono: "conference-call", imagen: "/nft-familia.png",
    color: "#0EA5E9", colorBg: "#F0F9FF",
    requisito: "5 envios realizados", enviosRequeridos: 5,
    tipo: "envios", puntosAlCanjear: 300
  },
  {
    id: "heroe_familiar", nombre: "Axo Estelar",
    descripcion: "10 envios completados. Brillas como una estrella!",
    icono: "star", imagen: "/nft-estelar.png",
    color: "#F59E0B", colorBg: "#FFFBEB",
    requisito: "10 envios realizados", enviosRequeridos: 10,
    tipo: "envios", puntosAlCanjear: 600
  },
  {
    id: "leyenda_axora", nombre: "Leyenda Axora",
    descripcion: "Realizaste 50 envios. Leyenda!",
    icono: "diamond", imagen: "/nft-leyenda.png",
    color: "#7C3AED", colorBg: "#FAF5FF",
    requisito: "50 envios realizados", enviosRequeridos: 50,
    tipo: "envios", puntosAlCanjear: 2000
  },
  {
    id: "axo_guardian", nombre: "Axo Guardian",
    descripcion: "Configuraste pagos automaticos",
    icono: "shield", imagen: "/nft-guardian.png",
    color: "#2563EB", colorBg: "#EFF6FF",
    requisito: "1 pago automatico configurado", enviosRequeridos: 0,
    tipo: "pagos", puntosAlCanjear: 400
  },
  {
    id: "axo_dorado", nombre: "Axo Dorado",
    descripcion: "Edicion especial Hackathon 2026",
    icono: "trophy", imagen: "/nft-dorado.png",
    color: "#F17633", colorBg: "#FFF7ED",
    requisito: "Usuario fundador de Axora", enviosRequeridos: 0,
    tipo: "especial", puntosAlCanjear: 1000
  }
];

export const RECOMPENSAS = [
  { id: "descuento_50", nombre: "50% de descuento", descripcion: "En tu proximo envio",
    puntos: 500, icono: "price-tag", tipo: "descuento", valor: 0.50 },
  { id: "envio_gratis", nombre: "Envio GRATIS", descripcion: "Sin comision en tu proximo envio",
    puntos: 1000, icono: "gift", tipo: "gratis", valor: 0 },
  { id: "cashback_5", nombre: "Cashback $5 USD", descripcion: "Saldo en tu wallet",
    puntos: 2000, icono: "coins", tipo: "cashback", valor: 5 },
  { id: "mes_gratis", nombre: "Mes sin comisiones", descripcion: "30 dias de envios gratis",
    puntos: 5000, icono: "star", tipo: "premium", valor: 30 },
  { id: "cashback_15", nombre: "Cashback $15 USD", descripcion: "Saldo en tu wallet",
    puntos: 5000, icono: "money-bag", tipo: "cashback", valor: 15 },
  { id: "cambio_preferencial", nombre: "Tipo de cambio VIP", descripcion: "Mejor tasa por 30 dias",
    puntos: 7500, icono: "combo-chart", tipo: "vip", valor: 30 }
];

export const getRewards = (usuario) => {
  const key = `axora_rewards_${usuario?.email || usuario?.wallet}`;
  const saved = localStorage.getItem(key);
  if (saved) {
    const data = JSON.parse(saved);

    // Verificar si tiene pagos configurados y desbloquear Guardian
    const keyPagos = `axora_pagos_${usuario?.email || usuario?.wallet}`;
    const pagos = localStorage.getItem(keyPagos);
    if (pagos && JSON.parse(pagos).length > 0) {
      if (!data.nftsDesbloqueados.includes("axo_guardian")) {
        data.nftsDesbloqueados.push("axo_guardian");
        localStorage.setItem(key, JSON.stringify(data));
      }
    }
    // Asegurar que existe el campo cuponesActivos
    if (!data.cuponesActivos) data.cuponesActivos = [];
    return data;
  }

  return {
    puntos: 0,
    puntosGanados: 0,
    totalEnvios: 0,
    totalEnviado: 0,
    nftsDesbloqueados: ["axo_dorado"],
    recompensasCanjeadas: [],
    cuponesActivos: [],
    historial: [],
    envioGratis: false,
    racha: 0,
    ultimoEnvio: null
  };
};

export const saveRewards = (usuario, data) => {
  const key = `axora_rewards_${usuario?.email || usuario?.wallet}`;
  localStorage.setItem(key, JSON.stringify(data));
};

export const calcularNivel = (puntos) => {
  if (puntos >= 10000) return { nivel: "Platino", color: "#7C3AED", icono: "💎", siguiente: null };
  if (puntos >= 5000) return { nivel: "Oro", color: "#F59E0B", icono: "🥇", siguiente: 10000 };
  if (puntos >= 2000) return { nivel: "Plata", color: "#6B7280", icono: "🥈", siguiente: 5000 };
  if (puntos >= 500) return { nivel: "Bronce", color: "#CD7F32", icono: "🥉", siguiente: 2000 };
  return { nivel: "Nuevo", color: "#294C74", icono: "🌱", siguiente: 500 };
};

export const agregarPuntos = (usuario, accion, cantidad = 0) => {
  const rewards = getRewards(usuario);
  let puntosGanados = 0;
  let mensaje = "";

  switch (accion) {
    case "ENVIO":
      puntosGanados = Math.floor(cantidad / 10);
      if (rewards.totalEnvios === 0) puntosGanados += PUNTOS_POR_ACCION.PRIMER_ENVIO;
      rewards.totalEnvios += 1;
      rewards.totalEnviado += cantidad;
      mensaje = `+${puntosGanados} puntos por tu envio`;
      
      // Verificar si el envio 10 es gratis
      if (rewards.totalEnvios % 10 === 0) {
        rewards.envioGratis = true;
        mensaje += " 🎉 Tu proximo envio es GRATIS!";
      }
      break;
    case "PAGO_AUTOMATICO":
      puntosGanados = PUNTOS_POR_ACCION.PAGO_AUTOMATICO;
      mensaje = `+${puntosGanados} puntos por configurar pago automatico`;
      break;
    case "CONSULTA_AXO": {
      const hoy = new Date().toLocaleDateString("es-MX");
      const puntosHoyAxo = rewards.historial
        .filter(h => h.accion === "CONSULTA_AXO" && h.fecha === hoy)
        .reduce((sum, h) => sum + h.puntos, 0);

      if (puntosHoyAxo >= 30) {
        mensaje = "Limite diario de puntos con Axo alcanzado (30 pts)";
        puntosGanados = 0;
      } else {
        const puntosDisponibles = 30 - puntosHoyAxo;
        puntosGanados = Math.min(PUNTOS_POR_ACCION.CONSULTA_AXO, puntosDisponibles);
        mensaje = puntosGanados > 0
          ? `+${puntosGanados} puntos por usar a Axo (${30 - puntosHoyAxo - puntosGanados} pts restantes hoy)`
          : "Limite diario de puntos con Axo alcanzado (30 pts)";
      }
      break;
    }
    default:
      break;
  }

  rewards.puntos += puntosGanados;
  rewards.puntosGanados += puntosGanados;

  // Verificar NFTs desbloqueados
  const nuevosNFTs = [];
  NFT_BADGES.forEach(badge => {
    if (!rewards.nftsDesbloqueados.includes(badge.id)) {
      if (badge.tipo === "envios" && rewards.totalEnvios >= badge.enviosRequeridos) {
        rewards.nftsDesbloqueados.push(badge.id);
        nuevosNFTs.push(badge);
      }
      if (badge.tipo === "pagos" && accion === "PAGO_AUTOMATICO") {
        rewards.nftsDesbloqueados.push(badge.id);
        nuevosNFTs.push(badge);
      }
    }
  });

  // Agregar al historial
  if (puntosGanados > 0) {
    rewards.historial.unshift({
      accion,
      puntos: puntosGanados,
      mensaje,
      fecha: new Date().toLocaleDateString("es-MX"),
      timestamp: Date.now()
    });
    if (rewards.historial.length > 20) rewards.historial.pop();
  }

  saveRewards(usuario, rewards);
  return { rewards, puntosGanados, mensaje, nuevosNFTs };
};

export const getCuponActivo = (usuario) => {
  const rewards = getRewards(usuario);
  if (!rewards.cuponesActivos || rewards.cuponesActivos.length === 0) return null;

  const ahora = Date.now();
  const cuponesVigentes = rewards.cuponesActivos.filter(c => {
    if (c.tipo === "gratis" || c.tipo === "descuento") return !c.usado;
    if (c.tipo === "premium" || c.tipo === "vip") return ahora < c.expira;
    if (c.tipo === "cashback") return !c.usado;
    return false;
  });

  if (cuponesVigentes.length !== rewards.cuponesActivos.length) {
    rewards.cuponesActivos = cuponesVigentes;
    saveRewards(usuario, rewards);
  }

  return cuponesVigentes[0] || null;
};

export const usarCupon = (usuario, cuponId) => {
  const rewards = getRewards(usuario);
  rewards.cuponesActivos = rewards.cuponesActivos.map(c =>
    c.id === cuponId ? {...c, usado: true} : c
  );
  saveRewards(usuario, rewards);
};
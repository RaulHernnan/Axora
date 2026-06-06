# 🦎 Axora — Remesas Inteligentes

Plataforma de remesas México-USA con blockchain, IA y NFTs

[![Hackathon 2026](https://img.shields.io/badge/Hackathon-2026-blue)](https://github.com/RaulHernnan/Axora)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)](https://nextjs.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?logo=ethereum)](https://sepolia.etherscan.io/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.19-363636?logo=solidity)](https://soliditylang.org/)

---

## 🎬 Demo

[▶️ Ver demo en YouTube](https://youtube.com/@axora-j1z?si=Cz_w7jnE4LezVE4N)

---

## 📑 Tabla de Contenidos

- [¿Qué es Axora?](#qué-es-axora)
- [El Problema](#el-problema)
- [Características](#características)
- [Sistema de NFTs y Token-Gating](#sistema-de-nfts-y-token-gating)
- [Cómo Funciona](#cómo-funciona)
- [Comparativa de Costos](#comparativa-de-costos)
- [Tech Stack](#tech-stack)
- [Smart Contracts](#smart-contracts)
- [Instalación](#instalación)
- [Guía de Uso](#guía-de-uso)
- [FAQ](#faq)
- [Equipo](#equipo)
- [Licencia](#licencia)

---

## ¿Qué es Axora?

**Axora** es una plataforma de remesas México-USA construida con blockchain, inteligencia artificial y un token ERC-20 propio (AMXN) que representa digitalmente el peso mexicano.

Con Axora puedes:

- Enviar remesas con comisión fija de **$1.50 USD** (desde **$1.00 USD** con badge NFT)
- Garantizar transparencia total con registro en blockchain
- Recibir asistencia 24/7 con el asistente IA **Axo** (Llama 3.3 70B)
- Automatizar pagos recurrentes de servicios (CFE, agua, gas, internet)
- Descargar comprobantes PDF con hash de blockchain
- Ganar NFTs y puntos canjeables por cada envío
- Ver el tipo de cambio en tiempo real vía Bitso API

---

## El Problema

Millones de personas envían remesas diariamente enfrentando:

- **Comisiones altas:** Western Union y MoneyGram cobran $6–8 USD por transacción
- **Tipo de cambio oculto:** Hasta $15 USD adicionales escondidos en la tasa
- **Procesos lentos:** 2–5 días hábiles de espera
- **Falta de transparencia:** Sin registro verificable
- **Limitaciones horarias:** Solo en horario comercial

**Axora resuelve todo esto.** Comisión fija + tipo de cambio real de Bitso + registro inmutable en blockchain.

---

## Características

| Característica | Descripción |
|---|---|
| Envío de remesas | Comisión fija $1.50 USD, tipo de cambio real (Bitso API) |
| Blockchain | Cada transacción registrada en Ethereum Sepolia |
| Token AMXN | ERC-20 acuñado automáticamente en cada remesa |
| Asistente Axo | IA disponible 24/7 — Llama 3.3 70B vía Groq |
| Pagos automáticos | CFE, agua, gas, internet — recurrentes con fecha fija |
| Comprobante PDF | Descarga inmediata con TX hash de blockchain |
| Login flexible | Email (wallet determinística) o MetaMask |
| NFT Token-Gating | Beneficios automáticos según tier al conectar wallet |
| Notificaciones | In-app + email (Nodemailer) |
| Responsive | Optimizado para móvil y desktop |

---

## Sistema de NFTs y Token-Gating

Axora tiene **6 badges NFT** desbloqueables por actividad. Al conectar tu wallet, los beneficios se aplican automáticamente sin ninguna acción adicional.

| Badge | Requisito | Beneficio |
|---|---|---|
| Baby Axo | 1er envío | Badge de bienvenida + acceso a Axo IA |
| Familia Unida | 5 envíos | Tipo de cambio +$0.10 MXN/USD |
| Axo Guardian | 1 pago automático configurado | TC +$0.10 MXN/USD + comisión $1.20 |
| Axo Estelar | 10 envíos | 1 envío gratis cada mes (renovación automática) |
| Leyenda Axora | 50 envíos | Comisión $1.00 para siempre |
| Axo Dorado | Usuario fundador | Comisión $1.00 + TC VIP +$0.20 MXN/USD |

Los NFTs son **ERC-721 reales** minteados on-chain en Sepolia vía RARE Protocol. Axora paga el gas.

### Sistema de puntos

- Cada envío genera puntos canjeables
- Puntos por usar el asistente Axo (límite antiabuso 30 pts/día)
- Cupones: 50% descuento, envío gratis, cashback, tipo de cambio VIP
- Envío #10 siempre gratuito (sin necesidad de NFT)

---

## Cómo Funciona

```
┌─────────────────────────────────────────────────────────────────┐
│                   FLUJO DE REMESA EN AXORA                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1  Usuario conecta wallet    →   2  Ingresa datos             │
│     (MetaMask o Email)               (monto, destinatario)     │
│           ▼                                 ▼                   │
│           └─────────────────────────────────┘                   │
│                          ▼                                      │
│  3  Contrato registra en blockchain (Ethereum Sepolia)          │
│           ▼                                                     │
│  4  Se genera código de pago para Oxxo                         │
│           ▼                                                     │
│  5  Usuario recibe comprobante PDF + badge NFT                  │
│           ▼                                                     │
│  6  Destinatario cobra en Oxxo con el código                    │
│           ▼                                                     │
│  7  Usuario gana tokens AMXN + puntos de lealtad               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Comparativa de Costos

| Servicio | Comisión visible | Costo oculto en TC | Total real perdido |
|---|---|---|---|
| Western Union | $8.00 | ~$15.00 | ~$23.00 |
| MoneyGram | $6.50 | ~$12.00 | ~$18.50 |
| Wise | $4.20 | Mínimo | ~$4.20 |
| **Axora** | **$1.50** | **$0 (TC real Bitso)** | **$1.50** |
| **Axora + NFT** | **$1.00** | **$0 (TC real Bitso)** | **$1.00** |

---

## Tech Stack

```
Frontend                    Blockchain                    IA
├─ Next.js 16.2.4          ├─ Ethereum Sepolia           ├─ Groq SDK 1.1.2
├─ React 19                ├─ Solidity 0.8.19            ├─ Llama 3.3 70B
├─ Tailwind CSS 4          ├─ Ethers.js 6.16             └─ Anthropic SDK
└─ Inline Styles           ├─ RARE Protocol (ERC-721)
                           └─ Wagmi 3.6 / Viem 2.48

Servicios externos          Utilidades
├─ Bitso API (TC real)     ├─ jsPDF 4.2.1
├─ Groq API                ├─ Nodemailer 8.0.10
└─ RainbowKit 2.2.10       └─ TanStack Query 5.100.6
```

---

## Smart Contracts

Contratos verificados en Etherscan Sepolia

| Contrato | Dirección | Etherscan |
|---|---|---|
| AxoraMXN (AMXN) ERC-20 | `0xC7a1d6ec0dD17273517d7a30d8c1a3dC284e4293` | [Ver código](https://sepolia.etherscan.io/address/0xC7a1d6ec0dD17273517d7a30d8c1a3dC284e4293#code) |
| AxoraRemesas | `0xaF502b5f2bc0209658A3DeB75ce442Fc1C9338B1` | [Ver código](https://sepolia.etherscan.io/address/0xaF502b5f2bc0209658A3DeB75ce442Fc1C9338B1#code) |

### Funciones principales — AxoraRemesas

| Función | Descripción |
|---|---|
| `crearRemesa()` | Registra nueva remesa en blockchain |
| `confirmarPagoOxxo()` | Confirma pago en Oxxo |
| `completarRemesa()` | Marca remesa como completada |
| `misRemesas()` | Ver tus remesas |
| `estadisticas()` | Ver estadísticas globales |

---

## Instalación

### Requisitos previos

- Node.js 18 o superior
- npm
- MetaMask instalado (opcional — también funciona con email)

### Pasos

```bash
# 1. Clonar repositorio
git clone https://github.com/RaulHernnan/Axora.git
cd Axora/remesasmart

# 2. Instalar dependencias
npm install --legacy-peer-deps

# 3. Ejecutar en desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3000
```

### Variables de entorno

El archivo `.env.local` está incluido en el repositorio para evaluación del Hackathon 2026. Contiene las siguientes variables:

```env
GROQ_API_KEY=
NEXT_PUBLIC_CONTRATO_REMESAS=0xaF502b5f2bc0209658A3DeB75ce442Fc1C9338B1
NEXT_PUBLIC_CONTRATO_TOKEN=0xC7a1d6ec0dD17273517d7a30d8c1a3dC284e4293
NEXT_PUBLIC_CONTRATO_BADGES=
NEXT_PUBLIC_NETWORK=sepolia
EMAIL_USER=
EMAIL_PASS=
PRIVATE_KEY=
```

### Troubleshooting

| Problema | Solución |
|---|---|
| Error de dependencias | `npm install --legacy-peer-deps --force` |
| MetaMask no conecta | Asegúrate de estar en red Sepolia |
| Sin ETH de testnet | Obtén en [Sepolia Faucet](https://sepoliafaucet.com) o [QuickNode](https://faucet.quicknode.com/ethereum/sepolia) |
| GROQ API error | Verifica tu API key en [Groq Console](https://console.groq.com) |

---

## Guía de Uso

### 1. Conectar Wallet

Abre la app y haz clic en **Iniciar sesión**. Usa tu email (wallet determinística automática) o MetaMask. Si tienes badges NFT en tu wallet, los beneficios se aplican solos.

### 2. Enviar Remesa

Ingresa monto en USD, nombre y CLABE del destinatario. Revisa el tipo de cambio en tiempo real (Bitso). Confirma — la transacción queda registrada en blockchain. Descarga tu comprobante PDF.

### 3. Pagos Automáticos

Ve a la sección **Pagos**. Configura servicio (CFE, agua, gas, internet), banco y fecha. Axora ejecuta el pago automáticamente cada mes.

### 4. Recompensas y NFTs

Acumula puntos enviando remesas y consultando a Axo. Desbloquea badges NFT según tu actividad. Canjea puntos por cupones de descuento o envíos gratis. Mintea tus NFTs on-chain gratis (Axora paga el gas).

---

## FAQ

**¿Necesito criptomonedas para usar Axora?**
No. Puedes registrarte con email y Axora crea tu wallet automáticamente. Solo necesitas ETH de testnet para registrar en blockchain (Sepolia Faucet, gratis).

**¿Cuánto tiempo tarda una remesa?**
El registro en blockchain toma 15–30 segundos. Esta es una demo en Sepolia testnet — en producción el flujo de pago Oxxo tomaría minutos.

**¿Qué comisión cobra Axora?**
$1.50 USD fijo. Con badge NFT desde $1.00 USD. Sin costos ocultos — el tipo de cambio es el real de Bitso.

**¿Es seguro?**
Cada transacción queda registrada de forma inmutable en Ethereum Sepolia. El login con email genera una wallet determinística derivada de tu contraseña.

**¿Qué son los tokens AMXN?**
ERC-20 que representa pesos mexicanos digitalmente. Se acuñan automáticamente con cada remesa registrada en blockchain.

**¿Cómo obtengo ETH de testnet?**
En [sepoliafaucet.com](https://sepoliafaucet.com) o [faucet.quicknode.com/ethereum/sepolia](https://faucet.quicknode.com/ethereum/sepolia) — es gratis.

**¿Qué métodos de pago acepta?**
En la demo: registro en blockchain + código Oxxo simulado. En producción: integración con pasarela de pagos real.

---

## Equipo

Desarrollado para **Ethereum México Hackathon 2026**

| Miembro | Rol |
|---|---|
| Raul Hernnan Ortiz Mejia | Lead Developer |
| Gerardo Alexis Antonio Velazquez | Colaborador |
| Leonardo Balbuena Bravo | Colaborador |
| Guadalupe Severiano Sanchez | Colaborador |

---

## Licencia

Este proyecto es de uso exclusivo para los miembros del equipo listados. Queda prohibido el uso comercial, copia, distribución o creación de derivados sin autorización.

Contacto: [axoraa26@gmail.com](mailto:axoraa26@gmail.com)

---

<div align="center">

**Axora — Remesas sin fronteras, con el mejor costo del mercado 🦎**

</div>

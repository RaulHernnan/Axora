# 🦎 Axora - Remesas Inteligentes

> Plataforma de remesas internacionales con blockchain, Web3 e IA

![Axora](../public/axoraLogo.png)

## ¿Qué es Axora?

Axora es una plataforma que permite enviar dinero a México de forma
segura, rápida y con las comisiones más bajas del mercado, usando
tecnología blockchain e inteligencia artificial.

## Características

- 💸 **Envío de remesas** con código de pago Oxxo
- 🔗 **Blockchain** - Cada transacción registrada en Ethereum Sepolia
- 🤖 **Axo** - Asistente IA disponible 24/7
- ⚡ **Pagos automáticos** - CFE, agua, gas, internet
- 📄 **Comprobante PDF** descargable
- 🔐 **Login** con email o MetaMask

## Comparativa de costos

| Servicio | Fee | Llega de $500 USD |
|----------|-----|-------------------|
| Western Union | $8.00 | $492.00 |
| MoneyGram | $6.50 | $493.50 |
| Wise | $4.20 | $495.80 |
| **Axora** | **$0.50** | **$499.50** |

## Smart Contracts

| Contrato | Red | Dirección |
|----------|-----|-----------|
| AxoraRemesas | Sepolia | 0xb1a7De81da0F8DB5b82Ef330c2858936E208A85b |
| AxoraPagos | Sepolia | Pendiente |

## Tech Stack

- **Frontend:** Next.js 15, React, Tailwind CSS
- **Blockchain:** Ethereum Sepolia, Solidity 0.8.19, Ethers.js
- **IA:** Groq (Llama 3.3 70B)
- **Web3:** MetaMask, Wagmi
- **PDF:** jsPDF

## Instalación

```bash
git clone https://github.com/TUUSUARIO/axora.git
cd axora
npm install --legacy-peer-deps
```

Crea `.env.local`:
```
GROQ_API_KEY=tu_api_key
NEXT_PUBLIC_CONTRATO_REMESAS=0xb1a7De81da0F8DB5b82Ef330c2858936E208A85b
```

```bash
npm run dev
```

## Equipo

Desarrollado para Hackathon 2026

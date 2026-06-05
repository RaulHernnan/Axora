# 🦎 Axora - Remesas Inteligentes

> Plataforma de remesas internacionales con blockchain, Web3 e IA

[![Hackathon 2026](https://img.shields.io/badge/Hackathon-2026-blue)](https://github.com/RaulHernnan/Axora)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?logo=ethereum)](https://sepolia.etherscan.io/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.19-363636?logo=solidity)](https://soliditylang.org/)

![Axora](remesasmart/public/axoraLogo.png)

---

## 📑 Contenido

- **[¿Qué es Axora?](#qué-es-axora)** - Conoce nuestra plataforma de remesas
- **[El Problema](#el-problema)** - Por qué existe Axora
- **[Características](#características)** - Lo que nos hace especiales
- **[Cómo Funciona](#cómo-funciona)** - Flujo de la plataforma
- **[Comparativa de costos](#comparativa-de-costos)** - Por qué somos más económicos
- **[Tech Stack](#tech-stack)** - Tecnologías utilizadas
- **[Smart Contracts](#smart-contracts)** - Contratos desplegados
- **[Instalación](#instalación)** - Cómo configurar el proyecto
- **[Guía de Uso](#guía-de-uso)** - Primeros pasos
- **[FAQ](#faq)** - Preguntas frecuentes
- **[Contribuir](#contribuir)** - Cómo colaborar
- **[Equipo](#equipo)** - Quiénes somos
- **[Licencia](#licencia)** - Términos legales

---

## ¿Qué es Axora?

**Axora** es una plataforma revolucionaria que permite enviar dinero a México de forma segura, rápida y con las **comisiones más bajas del mercado**, utilizando tecnología blockchain e inteligencia artificial.

Con Axora, puedes:
- 💸 Enviar remesas con comisiones desde **$0.50 USD**
- 🔗 Garantizar transparencia total con blockchain
- 🤖 Recibir asistencia 24/7 con nuestro asistente IA
- ⚡ Automatizar pagos de servicios
- 📄 Descargar comprobantes instantáneamente

---

## El Problema

Actualmente, **millones de personas envían remesas diariamente**:
- ❌ **Comisiones altas**: Western Union y MoneyGram cobran 6-8 USD por transacción
- ❌ **Procesos lentos**: 2-5 días hábiles de espera
- ❌ **Falta de transparencia**: Tipos de cambio ocultos
- ❌ **Limitaciones horarias**: Solo en horario comercial
- ❌ **Documentación compleja**: Trámites tediosos

**Axora resuelve todo esto con tecnología descentralizada.**

---

## Características

| Característica | Descripción |
|---|---|
| 💸 **Envío de remesas** | Transferencias con código de pago en Oxxo |
| 🔗 **Blockchain** | Cada transacción registrada en Ethereum Sepolia |
| 🤖 **Asistente Axo** | IA disponible 24/7 para soporte |
| ⚡ **Pagos automáticos** | CFE, agua, gas, internet recurrentes |
| 📄 **Comprobante PDF** | Descargar inmediatamente |
| 🔐 **Seguridad** | Login con email o MetaMask |
| 🌍 **Sin fronteras** | Disponible para cualquier usuario |
| ⚙️ **Bajo gas** | Mínimas comisiones de red |

---

## Cómo Funciona

```
┌─────────────────────────────────────────────────────────────────┐
│                     FLUJO DE REMESA EN AXORA                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1️⃣  Usuario conecta wallet → 2️⃣  Ingresa datos               │
│         (MetaMask o Email)        (monto, destinatario)         │
│           ▼                             ▼                         │
│           └──────────────────────────────┘                        │
│                        ▼                                          │
│  3️⃣  Contrato registra en blockchain (Ethereum Sepolia)         │
│           ▼                                                       │
│  4️⃣  Se genera código de pago para Oxxo                         │
│           ▼                                                       │
│  5️⃣  Usuario recibe comprobante PDF                             │
│           ▼                                                       │
│  6️⃣  Destinatario cobra en Oxxo con código ✅                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Comparativa de costos

| Servicio | Comisión | De $500 USD llega | Velocidad |
|----------|----------|-------------------|-----------|
| Western Union | $8.00 | $492.00 | 2-5 días |
| MoneyGram | $6.50 | $493.50 | 2-5 días |
| Wise | $4.20 | $495.80 | 1-2 días |
| **🦎 Axora** | **$0.50** | **$499.50** | **Inmediato** |

**¡Ahorra hasta 94% en comisiones con Axora!** 🎉

---

## Tech Stack

```
Frontend                    Backend & Blockchain          IA
├─ Next.js 15             ├─ Ethereum Sepolia           ├─ Groq
├─ React                  ├─ Solidity 0.8.19            └─ Llama 3.3 70B
├─ Tailwind CSS           ├─ Ethers.js
└─ TypeScript             └─ Web3 (MetaMask, Wagmi)
```

### Tecnologías Principales

- **Frontend:** Next.js 15, React, Tailwind CSS, TypeScript
- **Blockchain:** Ethereum Sepolia, Solidity 0.8.19, Ethers.js
- **Web3:** MetaMask, Wagmi
- **IA:** Groq (Llama 3.3 70B)
- **PDF:** jsPDF
- **Base de datos:** [Especificar si aplica]

---

## Smart Contracts

| Contrato | Red | Estado | Dirección |
|----------|-----|--------|-----------|
| AxoraRemesas | Sepolia | ✅ Activo | `0xb1a7De81da0F8DB5b82Ef330c2858936E208A85b` |
| AxoraPagos | Sepolia | 🔄 Pendiente | - |

### Funcionalidades

**AxoraRemesas:**
- `crearRemesa()` - Registra nueva remesa en blockchain
- `confirmarPagoOxxo()` - Confirma pago en Oxxo
- `misRemesas()` - Ver tus remesas
- `estadisticas()` - Ver estadísticas globales

**AxoraPagos:** (Próximamente)
- `configurarPago()` - Automatizar pagos recurrentes
- `ejecutarPago()` - Ejecutar pago mensual

📍 **Verificar contratos:** [Sepolia Etherscan](https://sepolia.etherscan.io/address/0xb1a7De81da0F8DB5b82Ef330c2858936E208A85b)

---

## Instalación

### Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- MetaMask instalado en el navegador
- Acceso a Sepolia Testnet

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/RaulHernnan/Axora.git
cd Axora
```

2. **Instalar dependencias**
```bash
npm install --legacy-peer-deps
```

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:
```env
GROQ_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_CONTRATO_REMESAS=0xb1a7De81da0F8DB5b82Ef330c2858936E208A85b
NEXT_PUBLIC_NETWORK=sepolia
```

> Obtén tu `GROQ_API_KEY` en [Groq Console](https://console.groq.com)

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

### Troubleshooting

| Problema | Solución |
|----------|----------|
| Error de dependencias | Intenta: `npm install --legacy-peer-deps --force` |
| MetaMask no conecta | Asegúrate de estar en red Sepolia |
| Sin ETH de testnet | Obtén en [Sepolia Faucet](https://www.sepoliafaucet.io/) |

---

## Guía de Uso

### 1. Conectar Wallet
- Abre la aplicación y haz clic en "Conectar Wallet"
- Selecciona MetaMask o email
- Confirma la conexión

### 2. Enviar Remesa
- Ingresa el monto en USD
- Escribe datos del destinatario
- Revisa la comisión
- Confirma la transacción

### 3. Pagar en Oxxo
- Recibe el código de referencia
- Dirígete a cualquier Oxxo
- Comunica el código
- ¡Listo! 🎉

### 4. Ver Historial
- Accede a "Mis Remesas"
- Descarga comprobantes en PDF
- Consulta estado de transacciones

---

## FAQ

<details>
<summary><b>¿Necesito tener criptomonedas para usar Axora?</b></summary>
No, utilizamos Sepolia Testnet que es gratuita. Solo necesitas una wallet como MetaMask con ETH de testnet (gratis en faucets).
</details>

<details>
<summary><b>¿Cuánto tiempo tarda una remesa?</b></summary>
La transacción blockchain es inmediata (segundos). El pago en Oxxo está disponible al instante después.
</details>

<details>
<summary><b>¿Qué comisión cobra Axora?</b></summary>
Solo $0.50 USD por remesa, más el gas de la red Ethereum (mínimo).
</details>

<details>
<summary><b>¿Es seguro enviar dinero por Axora?</b></summary>
Sí, todas las transacciones quedan registradas en blockchain de forma inmutable. Puedes verificarlas en Etherscan.
</details>

<details>
<summary><b>¿Qué métodos de pago acepta?</b></summary>
Actualmente soportamos Oxxo en México. Próximamente: transferencias bancarias y más métodos.
</details>

<details>
<summary><b>¿Cómo obtengo ETH de testnet?</b></summary>
Visita <a href="https://www.sepoliafaucet.io/">Sepolia Faucet</a> con tu dirección de MetaMask.
</details>

---

## Contribuir

¡Las contribuciones son bienvenidas! Ayúdanos a mejorar Axora.

### Proceso

1. **Fork** el repositorio
2. **Crea una rama** para tu feature
   ```bash
   git checkout -b feature/MiMejora
   ```
3. **Commit** tus cambios
   ```bash
   git commit -m "Agrega nueva funcionalidad"
   ```
4. **Push** a tu rama
   ```bash
   git push origin feature/MiMejora
   ```
5. **Abre un Pull Request** describiendo los cambios

### Estándares

- Código limpio y comentado
- Tests unitarios para nuevas funciones
- Sigue la estructura existente del proyecto
- Documenta cambios importantes

---

## Equipo

👨‍💻 **Desarrollado para Hackathon 2026**

| Miembro | Rol |
|---------|-----|
| Raul Hernnan Ortiz Mejia | Lead Developer |
| Gerardo Alexis Antonio Velazquez | Colaborador |
| Leonardo Balbuena Bravo | Colaborador |
| Guadalupe Severiano Sanchez | Colaborador |

---

## Licencia

⚠️ **Este proyecto es de uso exclusivo para:**
- Raul Hernnan Ortiz Mejia
- Gerardo Alexis Antonio Velazquez
- Leonardo Balbuena Bravo
- Guadalupe Severiano Sanchez

**Queda prohibido:**
- ❌ Usar el código comercialmente sin autorización
- ❌ Copiar o reproducir el código
- ❌ Distribuir el código sin permiso
- ❌ Crear derivados del proyecto

**Para cualquier uso o consulta:** Contacta al equipo de desarrollo.

---

## 📞 Contacto & Links

- 📧 Email: [axoraa26@gmail.com](mailto:axoraa26@gmail.com)
- 🎥 YouTube: [Axora Channel](https://youtube.com/@axora-j1z?si=Cz_w7jnE4LezVE4N)
- 🐙 GitHub: [RaulHernnan](https://github.com/RaulHernnan)

---

<div align="center">

**💳 Axora: Remesas sin fronteras, con el mejor costo del mercado 🦎**

</div>

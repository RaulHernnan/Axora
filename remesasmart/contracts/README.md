# Axora - Smart Contracts

## ✅ Contratos Verificados en Etherscan Sepolia

| Contrato | Dirección | Etherscan |
|----------|-----------|-----------|
| AxoraMXN (AMXN) | 0xC7a1d6ec0dD17273517d7a30d8c1a3dC284e4293 | [Ver código](https://sepolia.etherscan.io/address/0xC7a1d6ec0dD17273517d7a30d8c1a3dC284e4293#code) |
| AxoraRemesas | 0xaF502b5f2bc0209658A3DeB75ce442Fc1C9338B1 | [Ver código](https://sepolia.etherscan.io/address/0xaF502b5f2bc0209658A3DeB75ce442Fc1C9338B1#code) |

## Descripción

### AxoraMXN (ERC20)
Token ERC20 que representa pesos mexicanos digitales dentro del ecosistema Axora.

### AxoraRemesas
Contrato principal para registrar remesas internacionales de forma inmutable.

**Funciones principales:**
- `crearRemesa()` - Registra nueva remesa en blockchain
- `confirmarPagoOxxo()` - Confirma pago en Oxxo (solo owner)
- `completarRemesa()` - Marca remesa como completada (solo owner)
- `misRemesas()` - Ver remesas del usuario conectado
- `verRemesa(id)` - Ver detalle de una remesa
- `estadisticas()` - Ver totales globales

## Cómo compilar y deployar

1. Abrir https://remix.ethereum.org
2. Subir archivos .sol
3. Compilar con versión 0.8.19
4. Conectar MetaMask con red Sepolia
5. Deploy desde "Deploy & Run Transactions"

## Tecnologías
- Solidity 0.8.19
- Ethereum Sepolia Testnet
- OpenZeppelin ERC20
- Integrado con Next.js frontend

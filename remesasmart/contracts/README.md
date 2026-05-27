# Axora - Smart Contracts

## Contratos desplegados

### AxoraRemesas.sol
- **Red:** Ethereum Sepolia Testnet
- **Dirección:** 0xb1a7De81da0F8DB5b82Ef330c2858936E208A85b
- **Verificar:** https://sepolia.etherscan.io/address/0xb1a7De81da0F8DB5b82Ef330c2858936E208A85b

### AxoraPagos.sol
- **Red:** Ethereum Sepolia Testnet
- **Estado:** Pendiente de deploy (requiere ETH de testnet)

## Descripción

### AxoraRemesas
Contrato principal para registrar remesas internacionales de forma inmutable.

**Funciones principales:**
- `crearRemesa()` - Registra nueva remesa en blockchain
- `confirmarPagoOxxo()` - Confirma pago en Oxxo (solo owner)
- `completarRemesa()` - Marca remesa como completada (solo owner)
- `misRemesas()` - Ver remesas del usuario conectado
- `verRemesa(id)` - Ver detalle de una remesa
- `estadisticas()` - Ver totales globales

### AxoraPagos
Contrato para pagos automáticos recurrentes (CFE, agua, gas, internet).

**Funciones principales:**
- `configurarPago()` - Configurar nuevo pago automático
- `ejecutarPago()` - Ejecutar pago mensual (solo owner)
- `cancelarPago()` - Cancelar pago automático
- `togglePago()` - Pausar o reactivar pago
- `misPagos()` - Ver pagos del usuario

## Cómo compilar y deployar

1. Abrir https://remix.ethereum.org
2. Subir archivos .sol
3. Compilar con versión 0.8.19
4. Conectar MetaMask con red Sepolia
5. Deploy desde "Deploy & Run Transactions"

## Tecnologías
- Solidity 0.8.19
- Ethereum Sepolia Testnet
- OpenZeppelin patterns
- Integrado con Next.js frontend
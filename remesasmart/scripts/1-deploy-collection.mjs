/**
 * PASO 1 — Despliega la colección ERC-721 de Axora Badges en Sepolia.
 * Ejecutar UNA SOLA VEZ:
 *
 *   node --env-file=.env.local scripts/1-deploy-collection.mjs
 *
 * Copia la dirección que imprime y agrégala a .env.local:
 *   NEXT_PUBLIC_CONTRATO_BADGES=0x...
 *   CONTRATO_BADGES=0x...
 */

import { createRareClient } from "@rareprotocol/rare-cli/client";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

if (!process.env.MASTER_WALLET_PRIVATE_KEY) {
  console.error("❌ Falta MASTER_WALLET_PRIVATE_KEY en .env.local");
  process.exit(1);
}

const rawKey = process.env.MASTER_WALLET_PRIVATE_KEY;
const privateKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org";

const account = privateKeyToAccount(privateKey);

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(rpcUrl),
});

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(rpcUrl),
});

const rare = createRareClient({ publicClient, walletClient });

console.log("🚀 Desplegando colección 'Axora Badges' en Sepolia...");
console.log("   Wallet admin:", account.address);

const created = await rare.collection.deploy.erc721({
  name: "Axora Badges",
  symbol: "AXOBADGE",
  maxTokens: 10000,
});

console.log("\n✅ Colección desplegada con éxito!");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("📋 Dirección del contrato:", created.contract);
console.log("🔗 Etherscan:", `https://sepolia.etherscan.io/address/${created.contract}`);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("\n👉 Agrega esto a tu .env.local:");
console.log(`NEXT_PUBLIC_CONTRATO_BADGES=${created.contract}`);
console.log(`CONTRATO_BADGES=${created.contract}`);

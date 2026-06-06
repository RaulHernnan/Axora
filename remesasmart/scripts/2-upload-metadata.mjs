/**
 * PASO 2 — Sube las imágenes de los 6 badges a IPFS y genera los token URIs.
 * Ejecutar DESPUÉS de haber desplegado la colección (script 1):
 *
 *   node --env-file=.env.local scripts/2-upload-metadata.mjs
 *
 * Copia los URIs que imprime y agrégalos a .env.local como NFT_URI_*.
 */

import { createRareClient } from "@rareprotocol/rare-cli/client";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public");

if (!process.env.MASTER_WALLET_PRIVATE_KEY) {
  console.error("❌ Falta MASTER_WALLET_PRIVATE_KEY en .env.local");
  process.exit(1);
}

const rawKey = process.env.MASTER_WALLET_PRIVATE_KEY;
const privateKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org";

const BADGES = [
  {
    id: "primer_envio",
    envVar: "NFT_URI_PRIMER_ENVIO",
    imagen: "nft-baby-axo.png",
    nombre: "Baby Axo",
    descripcion: "Realizaste tu primer envío con Axora. ¡Bienvenido a la familia!",
    tags: ["axora", "badge", "primer-envio"],
  },
  {
    id: "familia_unida",
    envVar: "NFT_URI_FAMILIA_UNIDA",
    imagen: "nft-familia.png",
    nombre: "Familia Unida",
    descripcion: "Realizaste 5 envíos a tu familia. ¡Los mantienes conectados!",
    tags: ["axora", "badge", "familia"],
  },
  {
    id: "heroe_familiar",
    envVar: "NFT_URI_HEROE_FAMILIAR",
    imagen: "nft-estelar.png",
    nombre: "Axo Estelar",
    descripcion: "10 envíos completados. ¡Brillas como una estrella!",
    tags: ["axora", "badge", "estelar"],
  },
  {
    id: "leyenda_axora",
    envVar: "NFT_URI_LEYENDA_AXORA",
    imagen: "nft-leyenda.png",
    nombre: "Leyenda Axora",
    descripcion: "50 envíos realizados. ¡Una verdadera leyenda de Axora!",
    tags: ["axora", "badge", "leyenda"],
  },
  {
    id: "axo_guardian",
    envVar: "NFT_URI_AXO_GUARDIAN",
    imagen: "nft-guardian.png",
    nombre: "Axo Guardian",
    descripcion: "Configuraste pagos automáticos. ¡Proteges a los tuyos!",
    tags: ["axora", "badge", "guardian"],
  },
  {
    id: "axo_dorado",
    envVar: "NFT_URI_AXO_DORADO",
    imagen: "nft-dorado.png",
    nombre: "Axo Dorado",
    descripcion: "Edición especial Fundador Axora 2026. ¡Exclusivo para los primeros!",
    tags: ["axora", "badge", "fundador", "especial"],
  },
];

const account = privateKeyToAccount(privateKey);
const publicClient = createPublicClient({ chain: sepolia, transport: http(rpcUrl) });
const walletClient = createWalletClient({ account, chain: sepolia, transport: http(rpcUrl) });
const rare = createRareClient({ publicClient, walletClient });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function subirConReintento(fn, intentos = 4, delayMs = 8000) {
  for (let i = 0; i < intentos; i++) {
    try {
      return await fn();
    } catch (err) {
      if (err?.status === 429 && i < intentos - 1) {
        const espera = delayMs * (i + 1);
        process.stdout.write(` ⏳ rate limit, esperando ${espera / 1000}s...`);
        await sleep(espera);
      } else {
        throw err;
      }
    }
  }
}

console.log("📤 Subiendo imágenes y metadata de badges a IPFS...\n");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("👉 Copia cada línea a tu .env.local conforme aparezca:\n");

for (const badge of BADGES) {
  process.stdout.write(`  ⏳ ${badge.nombre}...`);

  const imagePath = path.join(PUBLIC_DIR, badge.imagen);
  const imageBytes = await readFile(imagePath);

  const imageUrl = await subirConReintento(() =>
    rare.media.upload(imageBytes, badge.imagen)
  );

  const tokenUri = await subirConReintento(() =>
    rare.media.pinMetadata({
      name: badge.nombre,
      description: badge.descripcion,
      image: imageUrl,
      tags: badge.tags,
    })
  );

  console.log(` ✅`);
  console.log(`  ${badge.envVar}=${tokenUri}`);

  // Pausa entre badges para no superar el rate limit
  await sleep(4000);
}

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("✅ Todos los badges subidos. Reinicia el servidor Next.js.");

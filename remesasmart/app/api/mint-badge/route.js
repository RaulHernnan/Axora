import { ethers } from "ethers";

// ABI mínimo de SovereignBatchMint (ERC-721 desplegado por RARE Protocol)
const ABI_MINT = [
  "function mintTo(string calldata uri, address receiver, address royaltyReceiver) external returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

const BADGE_IDS_VALIDOS = [
  "primer_envio",
  "familia_unida",
  "heroe_familiar",
  "leyenda_axora",
  "axo_guardian",
  "axo_dorado",
];

const TOKEN_URIS = {
  primer_envio:   process.env.NFT_URI_PRIMER_ENVIO,
  familia_unida:  process.env.NFT_URI_FAMILIA_UNIDA,
  heroe_familiar: process.env.NFT_URI_HEROE_FAMILIAR,
  leyenda_axora:  process.env.NFT_URI_LEYENDA_AXORA,
  axo_guardian:   process.env.NFT_URI_AXO_GUARDIAN,
  axo_dorado:     process.env.NFT_URI_AXO_DORADO,
};

export async function POST(req) {
  try {
    const { badgeId, walletDestino } = await req.json();

    console.log("[mint-badge] Solicitud recibida:", { badgeId, walletDestino });
    console.log("[mint-badge] Config:", {
      CONTRATO_BADGES:      process.env.CONTRATO_BADGES     ? "✅ OK" : "❌ VACÍO",
      NFT_URI:              TOKEN_URIS[badgeId]             ? "✅ OK" : "❌ VACÍO",
      MASTER_WALLET:        process.env.MASTER_WALLET_PRIVATE_KEY ? "✅ OK" : "❌ VACÍO",
    });

    if (!BADGE_IDS_VALIDOS.includes(badgeId)) {
      console.error("[mint-badge] ❌ Badge inválido:", badgeId);
      return Response.json({ error: "Badge inválido" }, { status: 400 });
    }
    if (!walletDestino || !ethers.isAddress(walletDestino)) {
      console.error("[mint-badge] ❌ Wallet inválida:", walletDestino);
      return Response.json({ error: "Wallet inválida" }, { status: 400 });
    }
    if (!process.env.MASTER_WALLET_PRIVATE_KEY) {
      console.error("[mint-badge] ❌ Falta MASTER_WALLET_PRIVATE_KEY");
      return Response.json({ error: "MASTER_WALLET_PRIVATE_KEY no configurado en .env.local" }, { status: 500 });
    }
    if (!process.env.CONTRATO_BADGES) {
      console.error("[mint-badge] ❌ Falta CONTRATO_BADGES — ejecuta el script 1 primero");
      return Response.json(
        { error: "CONTRATO_BADGES vacío. Ejecuta: node --env-file=.env.local scripts/1-deploy-collection.mjs" },
        { status: 500 }
      );
    }
    if (!TOKEN_URIS[badgeId]) {
      console.error("[mint-badge] ❌ Falta NFT_URI para:", badgeId, "— ejecuta el script 2 primero");
      return Response.json(
        { error: `NFT_URI de "${badgeId}" vacío. Ejecuta: node --env-file=.env.local scripts/2-upload-metadata.mjs` },
        { status: 500 }
      );
    }

    const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org";
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const adminWallet = new ethers.Wallet(
      process.env.MASTER_WALLET_PRIVATE_KEY.startsWith("0x")
        ? process.env.MASTER_WALLET_PRIVATE_KEY
        : `0x${process.env.MASTER_WALLET_PRIVATE_KEY}`,
      provider
    );
    const contrato = new ethers.Contract(process.env.CONTRATO_BADGES, ABI_MINT, adminWallet);

    const tx = await contrato.mintTo(
      TOKEN_URIS[badgeId],
      walletDestino,
      adminWallet.address
    );
    const receipt = await tx.wait();

    // Extraer tokenId del evento Transfer (topic[3])
    const iface = new ethers.Interface(ABI_MINT);
    let tokenId = null;
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed?.name === "Transfer") {
          tokenId = parsed.args.tokenId.toString();
          break;
        }
      } catch {}
    }

    return Response.json({
      ok: true,
      tokenId,
      txHash: receipt.hash,
      explorerUrl: `https://sepolia.etherscan.io/tx/${receipt.hash}`,
    });
  } catch (err) {
    console.error("[mint-badge]", err?.message ?? err);
    return Response.json({ error: err?.message ?? "Error al mintear" }, { status: 500 });
  }
}

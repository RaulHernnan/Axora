// Helpers client-side para mintear NFT badges via RARE Protocol

const STORAGE_KEY = (wallet) => `axora_nft_onchain_${wallet}`;

/**
 * Llama al API route /api/mint-badge para mintear un badge ERC-721
 * en Sepolia. Axora paga el gas; el NFT va al wallet del usuario.
 * Guarda txHash y tokenId en localStorage.
 *
 * @param {string} walletDestino - Dirección del usuario
 * @param {string} badgeId - ID del badge (ej: "primer_envio")
 * @returns {{ ok: boolean, txHash?: string, tokenId?: string|number, explorerUrl?: string, error?: string }}
 */
export async function mintBadge(walletDestino, badgeId) {
  try {
    const res = await fetch("/api/mint-badge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletDestino, badgeId }),
    });

    const data = await res.json();

    if (data.ok && data.txHash) {
      const existing = getNFTOnchainData(walletDestino);
      existing[badgeId] = {
        txHash: data.txHash,
        tokenId: data.tokenId,
        explorerUrl: data.explorerUrl,
        mintedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY(walletDestino), JSON.stringify(existing));
    }

    return data;
  } catch (err) {
    return { ok: false, error: err.message ?? "Error de red" };
  }
}

/**
 * Lee los datos on-chain (txHash, tokenId) de los badges ya minteados.
 * @param {string} walletDestino
 * @returns {Record<string, { txHash: string, tokenId: string|number, explorerUrl: string, mintedAt: number }>}
 */
export function getNFTOnchainData(walletDestino) {
  if (!walletDestino || typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY(walletDestino)) || "{}");
  } catch {
    return {};
  }
}

/**
 * Verifica si las variables de entorno de RARE están configuradas.
 * Útil para mostrar/ocultar el botón de minteo en la UI.
 */
export function rareConfigurado() {
  return Boolean(process.env.NEXT_PUBLIC_CONTRATO_BADGES);
}

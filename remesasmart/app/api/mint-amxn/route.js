import { ethers } from "ethers";

const ABI_AMXN = [
  {
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "cantidadMXN", "type": "uint256"},
      {"name": "motivo", "type": "string"}
    ],
    "name": "mintRemesa",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "cuenta", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export async function POST(request) {
  try {
    const { nombreRemitente, nombreDestinatario, cantidadMXN, idRemesa } = await request.json();

    if (!cantidadMXN || cantidadMXN <= 0) {
      return Response.json({ error: "Cantidad invalida" }, { status: 400 });
    }

    const provider = new ethers.JsonRpcProvider(
      "https://ethereum-sepolia-rpc.publicnode.com"
    );

    const wallet = new ethers.Wallet(
      process.env.MASTER_WALLET_PRIVATE_KEY,
      provider
    );

    const contrato = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRATO_AMXN,
      ABI_AMXN,
      wallet
    );

    // cantidadMXN en pesos × 10^6 decimales = × 10^4 desde centavos
    const cantidadAMXN = BigInt(Math.floor(parseFloat(cantidadMXN) * 100)) * BigInt(10000);

    const motivo = `Remesa #${idRemesa} - ${nombreRemitente} a ${nombreDestinatario}`;

    const masterWallet = process.env.NEXT_PUBLIC_MASTER_WALLET;
    const tx = await contrato.mintRemesa(masterWallet, cantidadAMXN, motivo);
    const receipt = await tx.wait();

    return Response.json({
      ok: true,
      txHash: receipt.hash,
      cantidadAMXN: cantidadAMXN.toString(),
      motivo
    });

  } catch (error) {
    console.error("Error minteando AMXN:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

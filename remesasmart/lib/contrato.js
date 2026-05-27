// Direccion del contrato en Sepolia
export const CONTRATO_REMESAS = "0xb1a7De81da0F8DB5b82Ef330c2858936E208A85b";

// ABI - Las funciones del contrato que vamos a usar
export const ABI_REMESAS = [
  {
    "inputs": [
      {"name": "_nombreRemitente", "type": "string"},
      {"name": "_nombreDestinatario", "type": "string"},
      {"name": "_clabe", "type": "string"},
      {"name": "_banco", "type": "string"},
      {"name": "_cantidadUSD", "type": "uint256"},
      {"name": "_codigoOxxo", "type": "string"}
    ],
    "name": "crearRemesa",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "misRemesas",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_id", "type": "uint256"}],
    "name": "verRemesa",
    "outputs": [
      {
        "components": [
          {"name": "id", "type": "uint256"},
          {"name": "remitente", "type": "address"},
          {"name": "nombreRemitente", "type": "string"},
          {"name": "nombreDestinatario", "type": "string"},
          {"name": "clabe", "type": "string"},
          {"name": "banco", "type": "string"},
          {"name": "cantidadUSD", "type": "uint256"},
          {"name": "cantidadMXN", "type": "uint256"},
          {"name": "timestamp", "type": "uint256"},
          {"name": "estado", "type": "string"},
          {"name": "codigoOxxo", "type": "string"}
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalRemesas",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "id", "type": "uint256"},
      {"indexed": true, "name": "remitente", "type": "address"},
      {"indexed": false, "name": "nombreDestinatario", "type": "string"},
      {"indexed": false, "name": "cantidadUSD", "type": "uint256"},
      {"indexed": false, "name": "cantidadMXN", "type": "uint256"},
      {"indexed": false, "name": "codigoOxxo", "type": "string"}
    ],
    "name": "RemesaCreada",
    "type": "event"
  }
];
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title AxoraRemesas
/// @author Axora Team
/// @notice Contrato para registro inmutable de remesas internacionales
/// @dev Deployado en Ethereum Sepolia Testnet

contract AxoraRemesas {
    
    // ============================================
    // VARIABLES DE ESTADO
    // ============================================
    
    address public owner;
    
    struct Remesa {
        uint256 id;
        address remitente;
        string nombreRemitente;
        string nombreDestinatario;
        string clabe;
        string banco;
        uint256 cantidadUSD;   // en centavos (200 USD = 20000)
        uint256 cantidadMXN;   // en centavos
        uint256 timestamp;
        string estado;          // "pendiente", "procesando", "completado"
        string codigoOxxo;
    }
    
    uint256 public totalRemesas;
    uint256 public tarifaAxora = 50;    // 50 centavos = $0.50 USD
    uint256 public tipoCambio = 1785;   // 1785 = $17.85 MXN por USD
    
    mapping(uint256 => Remesa) public remesas;
    mapping(address => uint256[]) public remesasPorUsuario;
    
    // ============================================
    // EVENTOS
    // ============================================
    
    event RemesaCreada(
        uint256 indexed id,
        address indexed remitente,
        string nombreDestinatario,
        uint256 cantidadUSD,
        uint256 cantidadMXN,
        string codigoOxxo
    );
    
    event RemesaCompletada(
        uint256 indexed id,
        string nombreDestinatario,
        string banco,
        uint256 cantidadMXN
    );
    
    event TipoCambioActualizado(
        uint256 anterior,
        uint256 nuevo
    );
    
    // ============================================
    // MODIFICADORES
    // ============================================
    
    modifier soloOwner() {
        require(msg.sender == owner, "Solo Axora puede hacer esto");
        _;
    }
    
    // ============================================
    // CONSTRUCTOR
    // ============================================
    
    constructor() {
        owner = msg.sender;
    }
    
    // ============================================
    // FUNCIONES PRINCIPALES
    // ============================================
    
    /// @notice Crear nueva remesa y registrarla en blockchain
    /// @param _nombreRemitente Nombre de quien envia
    /// @param _nombreDestinatario Nombre de quien recibe
    /// @param _clabe CLABE bancaria del destinatario (18 digitos)
    /// @param _banco Banco del destinatario
    /// @param _cantidadUSD Cantidad en centavos de USD
    /// @param _codigoOxxo Codigo para pagar en Oxxo
    function crearRemesa(
        string memory _nombreRemitente,
        string memory _nombreDestinatario,
        string memory _clabe,
        string memory _banco,
        uint256 _cantidadUSD,
        string memory _codigoOxxo
    ) public returns (uint256) {
        
        require(_cantidadUSD >= 1000, "Minimo $10 USD");
        require(_cantidadUSD <= 200000, "Maximo $2000 USD");
        require(bytes(_clabe).length == 18, "CLABE debe tener 18 digitos");
        
        // Calcular cantidad neta en MXN
        uint256 cantidadNeta = _cantidadUSD - tarifaAxora;
        uint256 cantidadMXN = (cantidadNeta * tipoCambio) / 100;
        
        totalRemesas++;
        
        remesas[totalRemesas] = Remesa({
            id: totalRemesas,
            remitente: msg.sender,
            nombreRemitente: _nombreRemitente,
            nombreDestinatario: _nombreDestinatario,
            clabe: _clabe,
            banco: _banco,
            cantidadUSD: _cantidadUSD,
            cantidadMXN: cantidadMXN,
            timestamp: block.timestamp,
            estado: "pendiente",
            codigoOxxo: _codigoOxxo
        });
        
        remesasPorUsuario[msg.sender].push(totalRemesas);
        
        emit RemesaCreada(
            totalRemesas,
            msg.sender,
            _nombreDestinatario,
            _cantidadUSD,
            cantidadMXN,
            _codigoOxxo
        );
        
        return totalRemesas;
    }
    
    /// @notice Confirmar que se recibio el pago en Oxxo
    function confirmarPagoOxxo(uint256 _idRemesa) public soloOwner {
        require(_idRemesa <= totalRemesas, "Remesa no existe");
        require(
            keccak256(bytes(remesas[_idRemesa].estado)) == keccak256(bytes("pendiente")),
            "Remesa no esta pendiente"
        );
        remesas[_idRemesa].estado = "procesando";
    }
    
    /// @notice Completar remesa cuando llega al banco
    function completarRemesa(uint256 _idRemesa) public soloOwner {
        require(_idRemesa <= totalRemesas, "Remesa no existe");
        require(
            keccak256(bytes(remesas[_idRemesa].estado)) == keccak256(bytes("procesando")),
            "Remesa no esta en proceso"
        );
        
        remesas[_idRemesa].estado = "completado";
        
        emit RemesaCompletada(
            _idRemesa,
            remesas[_idRemesa].nombreDestinatario,
            remesas[_idRemesa].banco,
            remesas[_idRemesa].cantidadMXN
        );
    }
    
    // ============================================
    // FUNCIONES DE LECTURA
    // ============================================
    
    /// @notice Ver remesas del usuario conectado
    function misRemesas() public view returns (uint256[] memory) {
        return remesasPorUsuario[msg.sender];
    }
    
    /// @notice Ver detalle de una remesa por ID
    function verRemesa(uint256 _id) public view returns (Remesa memory) {
        require(_id <= totalRemesas, "Remesa no existe");
        return remesas[_id];
    }
    
    /// @notice Ver estadisticas generales del contrato
    function estadisticas() public view returns (
        uint256 _totalRemesas,
        uint256 _tipoCambio,
        uint256 _tarifaAxora
    ) {
        return (totalRemesas, tipoCambio, tarifaAxora);
    }
    
    // ============================================
    // FUNCIONES DE ADMINISTRACION (SOLO OWNER)
    // ============================================
    
    /// @notice Actualizar tipo de cambio
    function actualizarTipoCambio(uint256 _nuevo) public soloOwner {
        emit TipoCambioActualizado(tipoCambio, _nuevo);
        tipoCambio = _nuevo;
    }
    
    /// @notice Actualizar tarifa de Axora
    function actualizarTarifa(uint256 _nuevaTarifa) public soloOwner {
        require(_nuevaTarifa <= 500, "Tarifa maxima $5 USD");
        tarifaAxora = _nuevaTarifa;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title AxoraRemesas - Contrato principal con integración AxoraMXN
/// @notice Registra remesas y acuña AMXN equivalente al MXN enviado

interface IAxoraMXN {
    function mintRemesa(address to, uint256 cantidadMXN, string memory motivo) external returns (bool);
    function balanceOf(address cuenta) external view returns (uint256);
}

contract AxoraRemesas {

    address public owner;
    address public tokenAMXN; // Contrato del token AxoraMXN

    struct Remesa {
        uint256 id;
        address remitente;
        string nombreRemitente;
        string nombreDestinatario;
        string clabe;
        string banco;
        uint256 cantidadUSD;   // en centavos
        uint256 cantidadMXN;   // en centavos
        uint256 cantidadAMXN;  // tokens acuñados (6 decimales)
        uint256 timestamp;
        string estado;
        string codigoOxxo;
        bool amxnAcunado;      // si se acuñaron AMXN
    }

    uint256 public totalRemesas;
    uint256 public tarifaAxora = 50;
    uint256 public tipoCambio = 1785; // $17.85 × 100

    mapping(uint256 => Remesa) public remesas;
    mapping(address => uint256[]) public remesasPorUsuario;

    // ============================================
    // ESTADISTICAS GLOBALES
    // ============================================

    uint256 public totalAMXNAcunado;
    uint256 public totalUSDProcesado;

    // ============================================
    // EVENTOS
    // ============================================

    event RemesaCreada(
        uint256 indexed id,
        address indexed remitente,
        string nombreDestinatario,
        uint256 cantidadUSD,
        uint256 cantidadMXN,
        uint256 cantidadAMXN,
        string codigoOxxo
    );

    event AMXNAcunado(
        uint256 indexed idRemesa,
        address indexed destinatario,
        uint256 cantidad,
        string motivo
    );

    event RemesaCompletada(uint256 indexed id, uint256 cantidadAMXN);
    event TipoCambioActualizado(uint256 anterior, uint256 nuevo);
    event TokenAMXNConfigurado(address token);

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
    // CONFIGURACION
    // ============================================

    /// @notice Vincular el token AMXN a este contrato
    function setTokenAMXN(address _token) public soloOwner {
        tokenAMXN = _token;
        emit TokenAMXNConfigurado(_token);
    }

    // ============================================
    // FUNCIONES PRINCIPALES
    // ============================================

    /// @notice Crear remesa y registrar movimiento AMXN
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
        require(bytes(_clabe).length == 18, "CLABE invalida");

        // Calcular MXN neto
        uint256 cantidadNeta = _cantidadUSD - tarifaAxora;
        uint256 cantidadMXN = (cantidadNeta * tipoCambio) / 100;

        // AMXN = MXN con 6 decimales
        uint256 cantidadAMXN = cantidadMXN * 10**4; // centavos × 10^4 = 6 decimales

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
            cantidadAMXN: cantidadAMXN,
            timestamp: block.timestamp,
            estado: "pendiente",
            codigoOxxo: _codigoOxxo,
            amxnAcunado: false
        });

        remesasPorUsuario[msg.sender].push(totalRemesas);

        // Acuñar AMXN automáticamente si el token está configurado
        if (tokenAMXN != address(0)) {
            string memory motivo = string(abi.encodePacked(
                "Remesa #", _toString(totalRemesas),
                " - ", _nombreRemitente,
                " a ", _nombreDestinatario
            ));

            try IAxoraMXN(tokenAMXN).mintRemesa(msg.sender, cantidadAMXN, motivo) {
                remesas[totalRemesas].amxnAcunado = true;
                totalAMXNAcunado += cantidadAMXN;
                emit AMXNAcunado(totalRemesas, msg.sender, cantidadAMXN, motivo);
            } catch {
                // Si falla el mint, la remesa igual se registra
            }
        }

        totalUSDProcesado += _cantidadUSD;

        emit RemesaCreada(
            totalRemesas,
            msg.sender,
            _nombreDestinatario,
            _cantidadUSD,
            cantidadMXN,
            cantidadAMXN,
            _codigoOxxo
        );

        return totalRemesas;
    }

    /// @notice Confirmar pago en Oxxo
    function confirmarPagoOxxo(uint256 _id) public soloOwner {
        require(_id <= totalRemesas, "Remesa no existe");
        remesas[_id].estado = "procesando";
    }

    /// @notice Completar remesa
    function completarRemesa(uint256 _id) public soloOwner {
        require(_id <= totalRemesas, "Remesa no existe");
        remesas[_id].estado = "completado";
        emit RemesaCompletada(_id, remesas[_id].cantidadAMXN);
    }

    // ============================================
    // LECTURA
    // ============================================

    function misRemesas() public view returns (uint256[] memory) {
        return remesasPorUsuario[msg.sender];
    }

    function verRemesa(uint256 _id) public view returns (Remesa memory) {
        require(_id <= totalRemesas, "No existe");
        return remesas[_id];
    }

    function estadisticas() public view returns (
        uint256 _totalRemesas,
        uint256 _tipoCambio,
        uint256 _tarifaAxora,
        uint256 _totalAMXNAcunado,
        uint256 _totalUSDProcesado
    ) {
        return (
            totalRemesas,
            tipoCambio,
            tarifaAxora,
            totalAMXNAcunado / 10**6,
            totalUSDProcesado / 100
        );
    }

    function balanceAMXN(address cuenta) public view returns (uint256) {
        if (tokenAMXN == address(0)) return 0;
        return IAxoraMXN(tokenAMXN).balanceOf(cuenta) / 10**6;
    }

    // ============================================
    // ADMINISTRACION
    // ============================================

    function actualizarTipoCambio(uint256 _nuevo) public soloOwner {
        emit TipoCambioActualizado(tipoCambio, _nuevo);
        tipoCambio = _nuevo;
    }

    function actualizarTarifa(uint256 _nueva) public soloOwner {
        require(_nueva <= 500, "Maximo $5 USD");
        tarifaAxora = _nueva;
    }

    // ============================================
    // UTILIDAD
    // ============================================

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
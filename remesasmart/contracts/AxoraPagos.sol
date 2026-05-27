// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title AxoraPagos
/// @author Axora Team
/// @notice Contrato para pagos automaticos recurrentes
/// @dev Permite configurar pagos mensuales de servicios (CFE, agua, gas, internet)

contract AxoraPagos {
    
    address public owner;
    
    // ============================================
    // ESTRUCTURAS
    // ============================================
    
    enum TipoServicio { CFE, TELMEX, AGUA, GAS }
    
    struct PagoAutomatico {
        uint256 id;
        address usuario;
        string nombreUsuario;
        TipoServicio tipoServicio;
        string descripcion;
        string clabe;
        string banco;
        uint256 montoPesos;     // en centavos MXN
        uint256 diaDelMes;      // 1-28
        uint256 ultimoPago;     // timestamp
        bool activo;
    }
    
    uint256 public totalPagos;
    mapping(uint256 => PagoAutomatico) public pagos;
    mapping(address => uint256[]) public pagosPorUsuario;
    
    // ============================================
    // EVENTOS
    // ============================================
    
    event PagoConfigurado(
        uint256 indexed id,
        address indexed usuario,
        string tipoServicio,
        uint256 montoPesos,
        uint256 diaDelMes
    );
    
    event PagoEjecutado(
        uint256 indexed id,
        address indexed usuario,
        uint256 montoPesos,
        uint256 timestamp
    );
    
    event PagoCancelado(
        uint256 indexed id,
        address indexed usuario
    );
    
    // ============================================
    // MODIFICADORES
    // ============================================
    
    modifier soloOwner() {
        require(msg.sender == owner, "Solo Axora puede hacer esto");
        _;
    }
    
    modifier soloUsuario(uint256 _id) {
        require(pagos[_id].usuario == msg.sender, "No es tu pago");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    // ============================================
    // FUNCIONES PRINCIPALES
    // ============================================
    
    /// @notice Configurar un nuevo pago automatico
    function configurarPago(
        string memory _nombreUsuario,
        uint8 _tipoServicio,
        string memory _descripcion,
        string memory _clabe,
        string memory _banco,
        uint256 _montoPesos,
        uint256 _diaDelMes
    ) public returns (uint256) {
        
        require(_montoPesos >= 100, "Minimo $1 peso");
        require(_montoPesos <= 10000000, "Maximo $100,000 pesos");
        require(_diaDelMes >= 1 && _diaDelMes <= 28, "Dia invalido (1-28)");
        require(bytes(_clabe).length == 18, "CLABE invalida");
        
        totalPagos++;
        
        pagos[totalPagos] = PagoAutomatico({
            id: totalPagos,
            usuario: msg.sender,
            nombreUsuario: _nombreUsuario,
            tipoServicio: TipoServicio(_tipoServicio),
            descripcion: _descripcion,
            clabe: _clabe,
            banco: _banco,
            montoPesos: _montoPesos,
            diaDelMes: _diaDelMes,
            ultimoPago: 0,
            activo: true
        });
        
        pagosPorUsuario[msg.sender].push(totalPagos);
        
        string[4] memory nombres = ["CFE", "TELMEX", "AGUA", "GAS"];
        
        emit PagoConfigurado(
            totalPagos,
            msg.sender,
            nombres[_tipoServicio],
            _montoPesos,
            _diaDelMes
        );
        
        return totalPagos;
    }
    
    /// @notice Ejecutar pago automatico (llamado por Axora)
    function ejecutarPago(uint256 _id) public soloOwner {
        require(_id <= totalPagos, "Pago no existe");
        require(pagos[_id].activo, "Pago inactivo");
        
        pagos[_id].ultimoPago = block.timestamp;
        
        emit PagoEjecutado(
            _id,
            pagos[_id].usuario,
            pagos[_id].montoPesos,
            block.timestamp
        );
    }
    
    /// @notice Cancelar pago automatico
    function cancelarPago(uint256 _id) public soloUsuario(_id) {
        require(pagos[_id].activo, "Pago ya inactivo");
        pagos[_id].activo = false;
        emit PagoCancelado(_id, msg.sender);
    }
    
    /// @notice Modificar monto de pago
    function modificarMonto(uint256 _id, uint256 _nuevo) public soloUsuario(_id) {
        require(pagos[_id].activo, "Pago inactivo");
        require(_nuevo >= 100 && _nuevo <= 10000000, "Monto invalido");
        pagos[_id].montoPesos = _nuevo;
    }
    
    /// @notice Pausar o reactivar pago
    function togglePago(uint256 _id) public soloUsuario(_id) {
        pagos[_id].activo = !pagos[_id].activo;
    }
    
    // ============================================
    // FUNCIONES DE LECTURA
    // ============================================
    
    function misPagos() public view returns (uint256[] memory) {
        return pagosPorUsuario[msg.sender];
    }
    
    function verPago(uint256 _id) public view returns (PagoAutomatico memory) {
        require(_id <= totalPagos, "Pago no existe");
        return pagos[_id];
    }
    
    function totalPagosActivos() public view returns (uint256) {
        uint256[] memory ids = pagosPorUsuario[msg.sender];
        uint256 total = 0;
        for (uint256 i = 0; i < ids.length; i++) {
            if (pagos[ids[i]].activo) total++;
        }
        return total;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title AxoraMXN - Token ERC20 que representa el Peso Mexicano
/// @author Axora Team
/// @notice Token 1:1 con el MXN, inspirado en MXNb de Bitso
/// @dev Deployado en Ethereum Sepolia Testnet

contract AxoraMXN {

    // ============================================
    // VARIABLES ERC20 ESTANDAR
    // ============================================

    string public name = "Axora Mexican Peso";
    string public symbol = "AMXN";
    uint8 public decimals = 6; // Como USDC: 1 AMXN = 1,000,000 unidades
    uint256 public totalSupply;

    address public owner;
    address public axoraRemesas; // Contrato autorizado a mintear

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // ============================================
    // EVENTOS ERC20
    // ============================================

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 amount, string motivo);
    event Burn(address indexed from, uint256 amount);
    event ContratoRemesasActualizado(address anterior, address nuevo);

    // ============================================
    // MODIFICADORES
    // ============================================

    modifier soloOwner() {
        require(msg.sender == owner, "Solo el owner puede hacer esto");
        _;
    }

    modifier soloAutorizado() {
        require(
            msg.sender == owner || msg.sender == axoraRemesas,
            "No autorizado para mintear"
        );
        _;
    }

    // ============================================
    // CONSTRUCTOR
    // ============================================

    constructor() {
        owner = msg.sender;
        // Mintear 1,000,000 AMXN iniciales para pruebas
        _mint(msg.sender, 1_000_000 * 10**6);
    }

    // ============================================
    // FUNCIONES ERC20 ESTANDAR
    // ============================================

    /// @notice Transferir tokens
    function transfer(address to, uint256 amount) public returns (bool) {
        require(to != address(0), "No puedes enviar a direccion cero");
        require(balanceOf[msg.sender] >= amount, "Saldo insuficiente");

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;

        emit Transfer(msg.sender, to, amount);
        return true;
    }

    /// @notice Aprobar gasto
    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    /// @notice Transferir desde
    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(balanceOf[from] >= amount, "Saldo insuficiente");
        require(allowance[from][msg.sender] >= amount, "Allowance insuficiente");

        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;

        emit Transfer(from, to, amount);
        return true;
    }

    // ============================================
    // FUNCIONES DE AXORA
    // ============================================

    /// @notice Mintear AMXN equivalente al MXN de una remesa
    /// @param to Direccion del destinatario
    /// @param cantidadMXN Cantidad en pesos (con 6 decimales)
    /// @param motivo Descripcion del mint (ej: "Remesa #5 - Juan a Maria")
    function mintRemesa(
        address to,
        uint256 cantidadMXN,
        string memory motivo
    ) public soloAutorizado returns (bool) {
        require(to != address(0), "Direccion invalida");
        require(cantidadMXN > 0, "Cantidad invalida");

        _mint(to, cantidadMXN);
        emit Mint(to, cantidadMXN, motivo);
        return true;
    }

    /// @notice Quemar tokens
    function burn(uint256 amount) public {
        require(balanceOf[msg.sender] >= amount, "Saldo insuficiente");
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Burn(msg.sender, amount);
        emit Transfer(msg.sender, address(0), amount);
    }

    /// @notice Mintear tokens para pruebas (faucet)
    /// @dev Cualquier usuario puede pedir hasta 10,000 AMXN para probar
    function faucet() public {
        uint256 cantidad = 10_000 * 10**6; // 10,000 AMXN
        _mint(msg.sender, cantidad);
        emit Mint(msg.sender, cantidad, "Faucet - Tokens de prueba");
    }

    // ============================================
    // ADMINISTRACION
    // ============================================

    /// @notice Establecer el contrato de remesas autorizado
    function setContratoRemesas(address _contrato) public soloOwner {
        emit ContratoRemesasActualizado(axoraRemesas, _contrato);
        axoraRemesas = _contrato;
    }

    /// @notice Mintear tokens (solo owner)
    function mint(address to, uint256 amount) public soloOwner {
        _mint(to, amount);
    }

    // ============================================
    // FUNCION INTERNA
    // ============================================

    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    // ============================================
    // VISTAS
    // ============================================

    /// @notice Ver balance formateado (sin decimales)
    function balanceFormateado(address cuenta) public view returns (uint256) {
        return balanceOf[cuenta] / 10**6;
    }

    /// @notice Ver supply total formateado
    function supplyFormateado() public view returns (uint256) {
        return totalSupply / 10**6;
    }
}
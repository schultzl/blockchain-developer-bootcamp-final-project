// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

/// @title Smart contract to enable music instrumental leasing
/// @author Larissa Schultze
/// @notice Allows a user to lease music instruments upon selection of information of rental period and shipment method
/// @notice This contract is part of the final project needed for certification of the Blockchain Developer Bootcamp 2021 (Consensys Academy)

/// @notice use Ownable to satisfy project requirement "Inherits from at least one library or interface"
import "@openzeppelin/contracts/access/Ownable.sol";

contract InstrumentRental is Ownable {
    uint256 public idCount = 0;
    /// obsolete address payable public owner;

    /// @notice Information about the music instrument listed for lease
    /// @param instrumentType can be 'guitar', 'piano', or other
    /// @param minRentPeriod and maxRentPeriod is given in days
    /// @param rentPrice (for KISS purposes) is valid for the total number of days between minRentPeriod and maxRentPeriod. This is not ideal though.
    struct Instrument {
        string instrumentType;
        string instrumentModel;
        uint256 rentPrice;
        RentingStatus status;
        uint256 minRentPeriod;
        uint256 maxRentPeriod;
        string imgUrl;
        address payable leaser;
        address payable owner;
        ShipmentMethod shipment;
    }

    enum RentingStatus {
        Available,
        Rented,
        Reserved,
        NotAvailable
    }

    enum ShipmentMethod {
        Standard,
        Premium,
        NotSelected
    }

    mapping(uint256 => Instrument) private instruments;

    /// @notice Modifiers block

    /**
    Obsolete 
    notice Check if the person calling is the owner
    modifier isOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }
    */

    /// @notice Check if instrument is available
    modifier isInstrumentAvailable(uint256 _instrumentId) {
        require(
            instruments[_instrumentId].status == RentingStatus.Available,
            "Sorry, the instrument is taken"
        );
        _;
    }

    /// @notice Check if instrument is already rented
    modifier isInstrumentRented(uint256 _instrumentId) {
        require(
            instruments[_instrumentId].status == RentingStatus.Rented,
            "This instrument is not rented"
        );
        _;
    }

    /// @notice Check if the person calling is the one expected
    modifier verifyCaller(address _address) {
        require(msg.sender == _address, "Caller is not valid");
        _;
    }

    /// @notice Check if instrument leaser has selected shipment method
    modifier shipmentMethod(ShipmentMethod _shipping) {
        require(
            _shipping == ShipmentMethod.Standard ||
                _shipping == ShipmentMethod.Premium,
            "Please select a valid shipment method"
        );
        _;
    }

    /// @notice Check if instrument leaser has selected a valid rental period
    modifier rentalPeriodIsValid(uint256 _instrumentId, uint256 rentingPeriod) {
        require(
            rentingPeriod >= instruments[_instrumentId].minRentPeriod &&
                rentingPeriod <= instruments[_instrumentId].maxRentPeriod,
            "Please select a valid rental period"
        );
        _;
    }

    /// @notice Check if the value paid is enough
    modifier paidEnough(uint256 _instrumentId) {
        require(
            msg.value >= instruments[_instrumentId].rentPrice,
            "Value paid is less than rent price"
        );
        _;
    }

    /// @notice Refund to leaser if too much was paid
    modifier checkValue(uint256 _instrumentId) {
        _;
        uint256 _rentPrice = instruments[_instrumentId].rentPrice;
        uint256 amountToRefund = msg.value - _rentPrice;
        instruments[_instrumentId].leaser.transfer(amountToRefund);
    }

    /// @notice Log Events block

    /// @notice Log when new instrument is added
    event LogInstrumentAdded(
        uint256 indexed _instrumentId,
        uint256 indexed _rentPrice,
        uint256 _minRentPeriod,
        uint256 _maxRentPeriod
    );

    /// @notice Log when instrument has been rented
    event LogRented(uint256 _instrumentId);

    /// @notice Log when instrument has been shipped
    event LogShipped(uint256 _instrumentId);

    /// @notice Log when instrument has been returned
    event LogReturned(uint256 _instrumentId);

    /// @notice Functions block

    constructor() {}

    /// @notice Adds music instrument into contract state
    /// @param _instrumentType can be 'guitar, 'piano, or other
    /// @param _minRentPeriod and _maxRentPeriod is given in days
    /// @param _rentPrice, for KISS purposes, is valid for the total number of days between minRentPeriod and maxRentPeriod. This is not ideal though.
    function addInstrument(
        string memory _instrumentType,
        string memory _instrumentModel,
        string memory _imgUrl,
        uint256 _rentPrice,
        uint256 _minRentPeriod,
        uint256 _maxRentPeriod
    ) public onlyOwner returns (bool) {
        instruments[idCount] = Instrument({
            instrumentType: _instrumentType,
            instrumentModel: _instrumentModel,
            rentPrice: _rentPrice,
            minRentPeriod: _minRentPeriod,
            maxRentPeriod: _maxRentPeriod,
            imgUrl: _imgUrl,
            leaser: payable(address(0)),
            owner: payable(owner()),
            shipment: ShipmentMethod.NotSelected,
            status: RentingStatus.Available
        });

        emit LogInstrumentAdded(
            idCount,
            _rentPrice,
            _minRentPeriod,
            _maxRentPeriod
        );

        idCount += 1;
        return true;
    }

    /// @notice Adds an account as leaser if the user has selected a valid rental period and shipment type
    /// @dev Uses modifiers isInstrumentAvailable() shipmentMethod(), paidEnough() and rentalPeriodIsValid() to avoid transaction errors
    function rentInstrument(
        uint256 _instrumentId,
        ShipmentMethod _shipping,
        uint256 _rentingPeriod
    )
        public
        payable
        isInstrumentAvailable(_instrumentId)
        rentalPeriodIsValid(_instrumentId, _rentingPeriod)
        shipmentMethod(_shipping)
        paidEnough(_instrumentId)
        checkValue(_instrumentId)
    {
        (bool success, ) = instruments[_instrumentId].owner.call{
            value: instruments[_instrumentId].rentPrice
        }("");

        require(success, "Sorry, your rental was unsuccessful.");

        instruments[_instrumentId].leaser = payable(msg.sender);
        instruments[_instrumentId].status = RentingStatus.Rented;
        instruments[_instrumentId].shipment = _shipping;

        emit LogRented(_instrumentId);
    }

    /// @notice Ships instrument
    /// @dev Uses modifiers verifyCaller(), shipmentMethod() and isInstrumentRented() as sanity checks
    function shipInstrument(uint256 _instrumentId)
        public
        verifyCaller(instruments[_instrumentId].owner)
        shipmentMethod(instruments[_instrumentId].shipment)
        isInstrumentRented(_instrumentId)
    {
        emit LogShipped(_instrumentId);
    }

    /// @notice Returns instrument
    /// @dev Uses modifiers verifyCaller() and isInstrumentRented() as sanity checks
    function returnInstrument(uint256 _instrumentId)
        public
        verifyCaller(instruments[_instrumentId].leaser)
        isInstrumentRented(_instrumentId)
    {
        instruments[_instrumentId].leaser = payable(address(0));
        instruments[_instrumentId].status = RentingStatus.Available;
        instruments[_instrumentId].shipment = ShipmentMethod.NotSelected;
        emit LogReturned(_instrumentId);
    }

    /// @notice Gets properties from item given its id
    function fetchItem(uint256 _instrumentId)
        public
        view
        returns (
            uint256 instrumentId,
            string memory instrumentType,
            uint256 rentPrice,
            uint256 minRentPeriod,
            uint256 maxRentPeriod,
            address leaser,
            address ownerFI,
            ShipmentMethod shipment,
            RentingStatus status,
            string memory imgUrl
        )
    {
        instrumentType = instruments[_instrumentId].instrumentType;
        rentPrice = instruments[_instrumentId].rentPrice;
        minRentPeriod = instruments[_instrumentId].minRentPeriod;
        maxRentPeriod = instruments[_instrumentId].maxRentPeriod;
        leaser = instruments[_instrumentId].leaser;
        ownerFI = instruments[_instrumentId].owner;
        shipment = instruments[_instrumentId].shipment;
        status = instruments[_instrumentId].status;
        imgUrl = instruments[_instrumentId].imgUrl;

        return (
            instrumentId,
            instrumentType,
            rentPrice,
            minRentPeriod,
            maxRentPeriod,
            leaser,
            ownerFI,
            shipment,
            status,
            imgUrl
        );
    }
}

// Not implemented, but actually important:
// - Confirmation that the leaser received the instrument
// - Confirmation that the owner received the instrument back after renting it
// - Methods to check if instrument has been returned in good shape or if damage occurred
// - A method to check (and if so, enforce some penalty) if the leaser exceeds the time he/she was given allowance to keep the rented instrument

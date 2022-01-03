# Measures taken to avoid common attacks

### Unchecked Call Return Value (SWC-104)
    `rentInstrument` requires that owner.call operation is successfull, otherwise a transaction rollback is activated

### Use Modifiers Only for Validation
    all modifiers in InstrumentRental.sol only validate data with `require` statements (e.g. in `isInstrumentAvailable` and `shipmentMethod`).

### Using Specific Compiler Pragma
    uses specifically `pragma solidity 0.8.0` (ok for the moment, but need to keep SWC-102, Outdated Compiler Version, in mind for the future)


const InstrumentRental = artifacts.require("InstrumentRental.sol");

module.exports = function (deployer) {
    deployer.deploy(InstrumentRental);
};

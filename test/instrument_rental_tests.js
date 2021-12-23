/**
   * Test initialization
   */

const InstrumentRental = artifacts.require("InstrumentRental");
let BN = web3.utils.BN;


const getError = (obj = {}) => {
  const txHash = Object.keys(obj)[0];
  return obj[txHash];
};


/**
   * Adds intruments to chain
   */

const addGuitar = async (instance, tx = {}) => {
  await instance.addInstrument(
    _instrumentType = "Guitar",
    _instrumentModel = "GG1",
    _imgUrl = "https://www.pngegg.com/en/png-nsaox",
    _rentPrice = web3.utils.toWei("0.000000005"),
    _minRentPeriod = "7",
    _maxRentPeriod = "14",
    tx = tx
  );
};

const addSaxophone = async (instance, tx = {}) => {
  await instance.addInstrument(
    "Saxophone",
    "SX1",
    "https://thumbs.dreamstime.com/b/funny-cute-saxophone-side-view-cartoon-style-vector-funny-cute-saxophone-side-view-cartoon-style-gold-185881672.jpg",
    web3.utils.toWei("0.000000001"),
    "30",
    "40",
    tx
  );
};

/**
   * Start testing ---------------------------------------------------------------------
   */

contract("InstrumentRental", function (accounts) {

  const [_owner, eminelf, performingprince] = accounts;

  let instance;

  beforeEach(async () => {
    instance = await InstrumentRental.new();
    await addGuitar(instance, { from: _owner });
    await addSaxophone(instance, { from: _owner });
  });

  /**
   * Checks if contract is deployed
   */
  it("should assert true if deployed", async function () {
    await InstrumentRental.deployed();
    return assert.isTrue(true);
  });

  describe("Variables", () => {
    /**
  * Checks if contract has owner
  */
    it("should have an owner", async () => {
      assert.equal(typeof instance.owner, 'function', "the contract has no owner");
    });

    /**
   * Checks if initial state of idCount is zero
   */
    it("has an initial idCount of 0", async () => {
      // get the contract that's been deployed
      const ssInstance = await InstrumentRental.deployed();
      // verify that it has an initial value of 0
      const storedData = await ssInstance.idCount.call();
      assert.equal(storedData, 0, 'Initial state of idCount should be zero');
    });
  });

  describe("Log-Expressions", () => {
    /**
   * Emits LogRented when instrument is rented
   */
    it("should emit LogRented when instrument is rented", async () => {
      const rentTX = await instance.rentInstrument(1, 0, 35, { from: eminelf, value: web3.utils.toWei("0.000000001") });

      let eventEmitted;

      if (rentTX.logs[0].event == "LogRented") {
        eventEmitted = true;
      } else {
        eventEmitted = false;
      }

      assert.equal(eventEmitted, true,
        "renting an instrument should emit a LogRented event",
      );
    });

    /**
   * Emits LogReturned when instrument is returned
   */
    it("should emit LogReturned when instrument is returned", async () => {
      await instance.rentInstrument(1, 0, 35, { from: eminelf, value: web3.utils.toWei("0.000000001") });
      const returnTX = await instance.returnInstrument(1, { from: eminelf });

      let eventEmitted;

      if (returnTX.logs[0].event == "LogReturned") {
        eventEmitted = true;
      } else {
        eventEmitted = false;
      }

      assert.equal(eventEmitted, true,
        "returning an instrument should emit a LogReturned event",
      );

    });
  });

  describe("Functionality", () => {
    /**
   * Checks if assigned instrument id is the one expected
   */
    it("Instrument with id = 0 should be of type Guitar", async () => {
      const result = await instance.fetchItem.call(0);
      assert.equal(result[1].toString(), "Guitar", `Instrument with id = 0 has type ${result[1].toString()}`);
    });

    /**
   * Checks if transaction fails if rental period falls outside boundaries
   */
    it("should fail if rental period is not within the boundaries", async () => {
      try {
        await instance.rentInstrument(1, 0, 100, { from: eminelf, value: web3.utils.toWei("0.000000001") });
      } catch (e) {
        var { error, reason } = getError(e.data);
        assert.equal(error, "revert");
        assert.equal(reason, "Please select a valid rental period");
      }
    });

    /**
   * Checks if renting status of instrument updates properly upon lease transaction
   */
    it("eminelf should rent guitar and renting status should change to 'Rented'", async () => {
      await instance.rentInstrument(0, 0, 10, { from: eminelf, value: web3.utils.toWei("0.000000005") });

      const rentedInstrument = await instance.fetchItem.call(0);

      assert.equal(rentedInstrument.leaser, eminelf, "Eminelf is not the leaser.");
      assert.equal(rentedInstrument.status.toNumber(), "1", "Renting status unequal 'Rented'.");
    });

    /**
   * Checks if transaction fails if value paid is not enough
   */
    it("Should fail if value paid is not enough", async () => {
      try {
        await instance.rentInstrument(0, 1, 10, { from: performingprince, value: web3.utils.toWei("0.00000000000000001") });
      } catch (e) {
        var { error, reason } = getError(e.data);
        assert.equal(error, "revert");
        assert.equal(reason, "Value paid is less than rent price");
      }
    });

    /**
   * Checks Owner's and Leaser's balance  change accordingly upon rent 
   */
    it("Owner's and Leaser's balance should change upon rent accordingly", async () => {
      const balancePreRent_owner = await web3.eth.getBalance(_owner);
      const balancePreRent_pprince = await web3.eth.getBalance(performingprince);

      await instance.rentInstrument(0, 0, 10, { from: performingprince, value: web3.utils.toWei("0.000000005") });

      const balancePosRent_owner = await web3.eth.getBalance(_owner);
      const balancePosRent_pprince = await web3.eth.getBalance(performingprince);

      assert.equal(
        new BN(balancePosRent_owner).toString(),
        new BN(balancePreRent_owner).add(new BN(web3.utils.toWei("0.000000005"))).toString(),
        "Owner's balance increase does not match rent price",
      );

      assert.isBelow(
        Number(balancePosRent_pprince),
        Number(new BN(balancePreRent_pprince).sub(new BN(web3.utils.toWei("0.000000005")))),
        "Leaser's balance decrease is less than expected",
      );

    });

  });

});


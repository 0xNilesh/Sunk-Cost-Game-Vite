// import { describe } from "mocha";
import { expect } from "chai";
const vuilder = require("@vite/vuilder");
import config from "./vite.config.json";

let provider: any;
let deployer: any;
let contract: any;
let john: any;
let jane: any;
let mnemonicCounter = 1;

describe("test SunkCostGame", () => {
  beforeEach(async function() {
    provider = vuilder.newProvider(config.networks.local.http);
    console.log(await provider.request("ledger_getSnapshotChainHeight"));
    deployer = vuilder.newAccount(config.networks.local.mnemonic, 0, provider);
    console.log('deployer', deployer.address);
      
    john = vuilder.newAccount(config.networks.local.mnemonic, mnemonicCounter++);
    jane = vuilder.newAccount(config.networks.local.mnemonic, mnemonicCounter++);
    await deployer.sendToken(john.address, '10');
    await john.receiveAll();
    await deployer.sendToken(jane.address, '10');
    await jane.receiveAll();
  });

    it("test deploy game", async () => {
        // compile
        const compiledContracts = await vuilder.compile("SunkCostGame.solpp");
        expect(compiledContracts).to.have.property("SunkCostGame");

        // deploy
        contract = compiledContracts.SunkCostGame;
        contract.setDeployer(deployer).setProvider(provider);
        await contract.deploy({params: [10], responseLatency: 1, amount: '1000'});
        expect(contract.address).to.be.a("string");
        console.log(contract.address);
    });

//     // check default balance
//     expect(await cafe.balance()).to.be.equal('0');
//     // check default value of data
//     let result = await cafe.query("price", []);
//     console.log("return", result);
//     expect(result)
//       .to.be.an("array")
//       .with.lengthOf(1);
//     expect(result![0]).to.be.equal("1000000000000000000");

//     // call Cafe.buyCoffee(to, numOfCups);
//     const block = await cafe.call(
//       "buyCoffee",
//       ["vite_3345524abf6bbe1809449224b5972c41790b6cf2e22fcb5caf", 2],
//       { amount: "2000000000000000000" }
//     );

//     // console.log(block);
//     const events = await cafe.getPastEvents('Buy', {fromHeight: block.height, toHeight: block.height});
//     expect(events)
//       .to.be.an("array")
//       .with.lengthOf(1);
//     expect(events[0]?.returnValues?.from).to.be.equal(deployer.address);
//     expect(events[0]?.returnValues?.to).to.be.equal(
//       "vite_3345524abf6bbe1809449224b5972c41790b6cf2e22fcb5caf"
//     );
//     expect(events[0]?.returnValues?.num).to.be.equal("2");

//     expect(await cafe.balance()).to.be.equal('0');
//   });
});

describe('Owner', function () {
    it('Owner Query Failed', async function () {
        await expect(
            contract.call('owner', [1])
        ).to.eventually.be.rejectedWith('revert');
    });
});
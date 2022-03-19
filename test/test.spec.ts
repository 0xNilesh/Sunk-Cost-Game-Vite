const vuilder = require("@vite/vuilder");
import config from "./vite.config.json";
import { describe } from "mocha";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);
const expect = chai.expect;

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

    it('Test Deploy Contract', async function () {
    // compile
    const compiledContracts = await vuilder.compile("SunkCostGame.solpp");
    expect(compiledContracts).to.have.property("SunkCostGame");

    // deploy
    contract = compiledContracts.SunkCostGame;
    contract.setDeployer(deployer).setProvider(provider);
    await contract.deploy({params: [10], responseLatency: 6, amount: '0'});
    expect(contract.address).to.be.a("string");
    console.log(contract.address);
    const owner = await contract.query('owner',[]);
            console.log(owner)
    });

    // describe('Test Owner', function () {
    //     it('Owner Query Failed', async function () {
    //         ;
    //     });
    // });
});
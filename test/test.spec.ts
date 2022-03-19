const vuilder = require("@vite/vuilder");
import config from "./vite.config.json";
const assert = require('chai').assert;
const expect = require('chai').expect;


describe("SunkCostGame Tests", () => {
    let provider: any;
    let deployer: any;
    let contract: any;
    let john: any;
    let jane: any;
    let mnemonicCounter = 1;

    before(async () => {
        provider = vuilder.newProvider(config.networks.local.http);
        deployer = vuilder.newAccount(config.networks.local.mnemonic, 0, provider);
        john = vuilder.newAccount(config.networks.local.mnemonic, mnemonicCounter++);
        jane = vuilder.newAccount(config.networks.local.mnemonic, mnemonicCounter++);
        await deployer.sendToken(john.address, '300');
        await john.receiveAll();
        await deployer.sendToken(jane.address, '300');
        await jane.receiveAll();
      });

    it('Contract Deployment', async () => {
        // compile
        const compiledContracts = await vuilder.compile("SunkCostGame.solpp");
        expect(compiledContracts).to.have.property("SunkCostGame");
        // deploy
        contract = compiledContracts.SunkCostGame;
        contract.setDeployer(deployer).setProvider(provider);
        await contract.deploy({params: [10], responseLatency: 1});
        assert.typeOf(contract.address , 'string');
    });

    describe("Inital Contract Data", () => {

        it('Owner', async () => {
            const [owner] = await contract.query('owner',[]);
            assert.equal(owner , deployer.address);
        });

        it('PotCreationFee', async () => {
            const [potCreationFee] = await contract.query('potCreationFee',[]);
            assert.equal(potCreationFee , '10');
        });

        it('TotalPots', async () => {
            const [otalPotsCreated] = await contract.query('totalPotsCreated',[]);
            assert.equal(otalPotsCreated , '0');
        });

        it('TotalFeeAccumulated', async () => {
            const [totalFeeAccumulated] = await contract.query('totalFeeAccumulated',[]);
            assert.equal(totalFeeAccumulated , '0');
        });
    });

    it('Change Owner', async () => {
        // set
        const [newOwner] = await contract.call('setOwner' , [jane.address] , {caller : deployer});
        assert.equal(newOwner , jane.address);
        // reset
        const [owner] = await contract.call('setOwner' , [deployer.address] , {caller : jane});
        assert.equal(owner , deployer.address);
    });
});
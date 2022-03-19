const vuilder = require("@vite/vuilder");
import config from "./vite.config.json";
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised);
const { expect , assert} = chai;

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
        await deployer.sendToken(john.address, '30000');
        await john.receiveAll();
        await deployer.sendToken(jane.address, '30000');
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

    describe("Owner Restrictied Functions", () => {

        it('SetOwner Restriction Check' , async () => {
            await expect(contract.call('setOwner' , [jane.address] , {caller : john})).to.eventually.be.rejectedWith('revert');
        });

        it('SetOwner', async () => {
            // set
            await contract.call('setOwner' , [jane.address] , {caller : deployer});
            const [newOwner] = await contract.query('owner',[]);
            assert.equal(newOwner , jane.address);
            // reset
            await contract.call('setOwner' , [deployer.address] , {caller : jane});
            const [owner] = await contract.query('owner',[]);
            assert.equal(owner , deployer.address);
        });

        it('SetFee Restriction Check' , async () => {
            await expect(contract.call('setFee' , ['30'] , {caller : john})).to.eventually.be.rejectedWith('revert');
        });
        
        it('SetFee', async () => {
            // set
            await contract.call('setFee' , ['30'] , {caller : deployer});
            const [newPotCreationFee] = await contract.query('potCreationFee',[]);
            assert.equal(newPotCreationFee , '30');
            // reset
            await contract.call('setFee' , ['10'] , {caller : deployer});
            const [potCreationFee] = await contract.query('potCreationFee',[]);
            assert.equal(potCreationFee , '10');
        });

        it('ClaimFee Restriction Check' , async () => {
            await expect(contract.call('claimFee' , [] , {caller : john})).to.eventually.be.rejectedWith('revert');
        });
        
        it('ClaimFee', async () => {
            await contract.call('claimFee' , [] , {caller : deployer});
            const [totalFeeAccumulated] = await contract.query('totalFeeAccumulated',[]);
            assert.equal(totalFeeAccumulated , '0');
        });
    })

    describe("Pot Creation", () => {
        
        // Dont Know
        // it('Fail on Amount Paid in Another Token than Vite' , async () => {
        //     await expect(contract.call('createPot' , ['300000' , '200000' , '10' , '5' , '20000' , 'tti_5649544520544f4b454e6e40'] , {caller : john , amount : '10' , token: 'tti_564954455820434f494e69b5'})).to.eventually.be.rejectedWith('revert');
        // });

        it('Fail on Amount < PotCreation Fee' , async () => {
            await expect(contract.call('createPot' , ['300000' , '200000' , '10' , '5' , '20000' , 'tti_5649544520544f4b454e6e40'] , {caller : john , amount : '1'})).to.eventually.be.rejectedWith('revert');
        });

        it('Fail on Initial_Timer < Max_Timer' , async () => {
            await expect(contract.call('createPot' , ['200000' , '300000' , '10' , '5' , '20000' , 'tti_5649544520544f4b454e6e40'] , {caller : john , amount : '10'})).to.eventually.be.rejectedWith('revert');
        });

        it('Fail on Burn Amount >=  BuyInAmount' , async () => {
            await expect(contract.call('createPot' , ['300000' , '200000' , '5' , '10' , '20000' , 'tti_5649544520544f4b454e6e40'] , {caller : john , amount : '10'})).to.eventually.be.rejectedWith('revert');
        });

        it('Pass on Valid Parameters - VITE Pot' , async () => {
            await contract.call('createPot' , ['300000' , '200000' , '10' , '5' , '20000' , 'tti_5649544520544f4b454e6e40'] , {caller : john , amount : '10'});
            //check event
            const events = await contract.getPastEvents('allEvents', {fromHeight: 0, toHeight: 50});
            expect(events[0].returnValues._from).to.be.deep.equal(john.address);
            expect(events[0].returnValues._potIndex).to.be.deep.equal('0');
        });
        
        it('Pot Data' , async () => {
            const potData = await contract.query('Pots',['0']);
            expect(potData).to.be.deep.equal(
                [
                    john.address,
                    '200000',
                    '10',
                    '5',
                    '20000',
                    john.address,
                    '0',
                    '10',
                    'tti_5649544520544f4b454e6e40',
                    potData[9], //skip start_timestamp
                    potData[10], //skip end_timestamp
                    '0'
                  ]
            );
        });

        it('Send Back Extra Amount' , async () => {
            await contract.call('createPot' , ['300000' , '200000' , '10' , '5' , '20000' , 'tti_5649544520544f4b454e6e40'] , {caller : jane , amount : '100'});
            await jane.receiveAll();
            const final_balance = await jane.balance();
            expect(final_balance).to.be.deep.equal('29990'); //30000 - 10
        });

    });
});
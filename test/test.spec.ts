// NOTE: Queries are authomatically retried and don't fail (while calls do), so some query tests have been written as call tests.

import { describe } from "mocha";
import chai from "chai";
const vite = require('@vite/vuilder');
import chaiAsPromised from "chai-as-promised";
import config from "./vite.config.json";

chai.use(chaiAsPromised);
const expect = chai.expect;

let provider: any;
let deployer: any;
let alice: any;
let bob: any;
let contract: any;
let mnemonicCounter = 1;

describe('test SunkCost', function () {
    beforeEach(async function () {
        provider = vite.localProvider();
        deployer = vite.newAccount(config.networks.local.mnemonic, 0);
        // init users
        alice = vite.newAccount(config.networks.local.mnemonic, mnemonicCounter++);
        bob = vite.newAccount(config.networks.local.mnemonic, mnemonicCounter++);
        await deployer.sendToken(alice.address, '0');
        await alice.receiveAll();
        await deployer.sendToken(bob.address, '0');
        await bob.receiveAll();
        // compile
        const compiledContracts = await vite.compile('SunkCostGame.solpp',);
        expect(compiledContracts).to.have.property('SunkCostGame');
        contract = compiledContracts.SunkCost;
        // deploy
        contract.setDeployer(deployer).setProvider(provider);
        await contract.deploy({params: [1000000000000000000], responseLatency: 1});
        expect(contract.address).to.be.a('string');
    });

    describe('Owner', function () {
        it('Onwer Query Failed', async function () {
            await expect(
                contract.call('owner', [1], {caller: alice})
            ).to.eventually.be.rejectedWith('revert');
        });
    });
});
var TECDSAKeepVendor = artifacts.require('TECDSAKeepVendorStub')
var TECDSAKeepFactoryStub = artifacts.require('TECDSAKeepFactoryStub')

contract("TECDSAKeepVendor", async accounts => {
    const address0 = "0x0000000000000000000000000000000000000000"
    const address1 = "0xF2D3Af2495E286C7820643B963FB9D34418c871d"
    const address2 = "0x4566716c07617c5854fe7dA9aE5a1219B19CCd27"

    let keepVendor

    describe("registerFactory", async () => {
        beforeEach(async () => {
            keepVendor = await TECDSAKeepVendor.new()
        })

        it("registers one factory address", async () => {
            let expectedResult = [address1]

            await keepVendor.registerFactory(address1)

            assertFactories(expectedResult)
        })

        it("registers factory with zero address", async () => {
            let expectedResult = [address0]

            await keepVendor.registerFactory(address0)

            assertFactories(expectedResult)
        })

        it("registers two factory addresses", async () => {
            let expectedResult = [address1, address2]

            await keepVendor.registerFactory(address1)
            await keepVendor.registerFactory(address2)

            assertFactories(expectedResult)
        })

        it("fails if address already exists", async () => {
            let expectedResult = []

            await keepVendor.registerFactory(address1)

            try {
                await keepVendor.registerFactory(address1)
                assert(false, 'Test call did not error as expected')
            } catch (e) {
                assert.include(e.message, 'Factory address already registered')
            }

            assertFactories(expectedResult)
        })

        it("cannot be called by non owner", async () => {
            let expectedResult = []

            try {
                await keepVendor.registerFactory.call(address1, { from: accounts[1] })
                assert(false, 'Test call did not error as expected')
            } catch (e) {
                assert.include(e.message, 'Ownable: caller is not the owner')
            }

            assertFactories(expectedResult)
        })

        async function assertFactories(expectedFactories) {
            let result = await keepVendor.getFactories.call()
            assert.deepEqual(result, expectedFactories, "unexpected registered factories list")
        }
    })

    describe("selectFactory", async () => {
        before(async () => {
            keepVendor = await TECDSAKeepVendor.new()

            await keepVendor.registerFactory(address1)
            await keepVendor.registerFactory(address2)
        })

        it("returns last factory from the list", async () => {
            let expectedResult = address2

            let result = await keepVendor.selectFactoryPublic.call()

            assert.equal(result, expectedResult, "unexpected factory selected")
        })
    })

    describe("openKeep", async () => {
        before(async () => {
            keepVendor = await TECDSAKeepVendor.new()
            let factoryStub = await TECDSAKeepFactoryStub.new()

            await keepVendor.registerFactory(factoryStub.address)
        })

        it("calls selected factory", async () => {
            let selectedFactory = await TECDSAKeepFactoryStub.at(
                await keepVendor.selectFactoryPublic.call()
            )

            let expectedResult = await selectedFactory.calculateKeepAddress.call()

            let result = await keepVendor.openKeep.call(
                10, // _groupSize
                5, // _honestThreshold
                "0xbc4862697a1099074168d54A555c4A60169c18BD" // _owner
            )

            assert.equal(result, expectedResult, "unexpected opened keep address")
        })
    })
})

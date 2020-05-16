const Insurance = artifacts.require('./Insurance.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Insurance', ([deployer, seller, buyer, police, repair]) => {
  let insurance

  before(async () => {
    insurance = await Insurance.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await insurance.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })

  describe('product', async () => {
    let result, productCount
    before(async () => {
      result = await insurance.createProduct('iPhone X', web3.utils.toWei('1', 'Ether'), web3.utils.toWei('5', 'Ether'), { from: seller })
      productCount = await insurance.productCount()
    })
    it('creates product', async () => {
      assert.equal(productCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'iPhone X', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.insurancePrice, '5000000000000000000', 'insurance price is correct')
      assert.equal(event.owner, seller, 'owner is correct')
      assert.equal(event.purchased, false, 'purchased is correct')
      assert.equal(event.insurancePurchased, false, 'insurancePurchased is correct')
      // FAILURE: Product must have a name
      await insurance.createProduct('', web3.utils.toWei('1', 'Ether'), web3.utils.toWei('5', 'Ether'), { from: seller }).should.be.rejected
      // FAILURE: Product must have a price
      await insurance.createProduct('iPhone X', 0, 0, { from: seller }).should.be.rejected
      // FAILURE: Product must have a insurance price
      await insurance.createProduct('iPhone X', 0, 0, { from: seller }).should.be.rejected
    })
    it('lists product', async () => {
      const product = await insurance.products(productCount)
      assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(product.name, 'iPhone X', 'name is correct')
      assert.equal(product.price, '1000000000000000000', 'price is correct')
      assert.equal(product.insurancePrice, '5000000000000000000', 'insurance price is correct')
      assert.equal(product.owner, seller, 'owner is correct')
      assert.equal(product.purchased, false, 'purchased is correct')
      assert.equal(product.insurancePurchased, false, 'insurance purchased is correct')
    })
    it('sells product', async () => {
      let oldSellerBalance
      oldSellerBalance = await web3.eth.getBalance(seller)
      oldSellerBalance = new web3.utils.BN(oldSellerBalance)
      // SUCCESS: Buyer makes purchase
      result = await insurance.purchaseProduct(productCount, repair, police, { from: buyer, value: web3.utils.toWei('1', 'Ether') })
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'iPhone X', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, buyer, 'owner is correct')
      assert.equal(event.purchased, true, 'purchased is correct')
      let newSellerBalance
      newSellerBalance = await web3.eth.getBalance(seller)
      newSellerBalance = new web3.utils.BN(newSellerBalance)
      let price
      price = web3.utils.toWei('1', 'Ether')
      price = new web3.utils.BN(price)
      const exepectedBalance = oldSellerBalance.add(price)
      assert.equal(newSellerBalance.toString(), exepectedBalance.toString())
      // FAILURE: Tries to buy a product that does not exist, i.e., product must have valid id
      await insurance.purchaseProduct(99, repair, police, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected
      // FAILURE: Buyer tries to buy without enough ether
      await insurance.purchaseProduct(productCount, repair, police, { from: buyer, value: web3.utils.toWei('0.1', 'Ether') }).should.be.rejected
      // FAILURE: Deployer tries to buy the product, i.e., product can't be purchased twice
      await insurance.purchaseProduct(productCount, repair, police, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected
      // FAILURE: Buyer tries to buy again, i.e., buyer can't be the seller
      await insurance.purchaseProduct(productCount, repair, police, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected
    })
  })

  describe('product insurance', async () => {
    let result, productCount
    before(async () => {
      result = await insurance.createProduct('iPhone X', web3.utils.toWei('1', 'Ether'), web3.utils.toWei('5', 'Ether'), { from: seller })
      productCount = await insurance.productCount()
      result = await insurance.purchaseProduct(productCount, repair, police, { from: buyer, value: web3.utils.toWei('1', 'Ether') })
      productCount = await insurance.productCount()
    })
    it('sells insurance', async () => {
      let oldSellerBalance
      oldSellerBalance = await web3.eth.getBalance(seller)
      oldSellerBalance = new web3.utils.BN(oldSellerBalance)
      result = await insurance.purchaseInsurance(productCount, repair, police, { from: buyer, value: web3.utils.toWei('5', 'Ether') })
      let newSellerBalance
      newSellerBalance = await web3.eth.getBalance(seller)
      newSellerBalance = new web3.utils.BN(newSellerBalance)
      let insuranceprice
      insuranceprice = await web3.utils.toWei('5', 'Ether')
      insuranceprice = new web3.utils.BN(insuranceprice)
      const exepectedBalance = oldSellerBalance.add(insuranceprice)
      assert.equal(newSellerBalance.toString(), exepectedBalance.toString())
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'iPhone X', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.insurancePrice, '5000000000000000000', 'insurance price is correct')
      assert.equal(event.owner, buyer, 'owner is correct')
      assert.equal(event.purchased, true, 'purchased is correct')
      assert.equal(event.insurancePurchased, true, 'insurance purchased is correct')
      // FAILURE: Tries to buy product's insurance that does not exist, i.e., product must have valid id
      await insurance.purchaseInsurance(99, repair, police, { from: buyer, value: web3.utils.toWei('5', 'Ether') }).should.be.rejected
      // FAILURE: Buyer tries to buy insurance without enough ether
      await insurance.purchaseInsurance(productCount, repair, police, { from: buyer, value: web3.utils.toWei('0.1', 'Ether') }).should.be.rejected
      // FAILURE: Deployer tries to buy the product's insurance, i.e., product can't be purchased twice
      await insurance.purchaseInsurance(productCount, repair, police, { from: deployer, value: web3.utils.toWei('5', 'Ether') }).should.be.rejected
      // FAILURE: Buyer tries to buy insurance again
      await insurance.purchaseInsurance(productCount, repair, police, { from: buyer, value: web3.utils.toWei('5', 'Ether') }).should.be.rejected
      // FAILURE: Seller tries to buy his own insurance
      await insurance.purchaseInsurance(productCount, repair, police, { from: seller, value: web3.utils.toWei('5', 'Ether') }).should.be.rejected
    })
  })

  describe('can claim?', async () => {
    it('police can be claimed', async () => {
      let result, productCount
      result = await insurance.createProduct('iPhone X', web3.utils.toWei('1', 'Ether'), web3.utils.toWei('5', 'Ether'), { from: seller })
      productCount = await insurance.productCount()
      result = await insurance.purchaseProduct(productCount, repair, police, { from: buyer, value: web3.utils.toWei('1', 'Ether') })
      productCount = await insurance.productCount()
      result = await insurance.purchaseInsurance(productCount, repair, police, { from: buyer, value: web3.utils.toWei('5', 'Ether') })
      productCount = await insurance.productCount()
      if (!result.purchased && !result.insurancePurchased && result.claimedRepair && result.claimedPolice) {
        await insurance.claimPolice(productCount, repair, police, { from: buyer }).should.be.rejected()
      } else {
        result = await insurance.claimPolice(productCount, repair, police, { from: buyer })
        const event = result.logs[0].args
        assert.equal(event.claimedPolice, true)
      }
    })
    it('repair can be claimed', async () => {
      let result, productCount
      result = await insurance.createProduct('iPhone X', web3.utils.toWei('1', 'Ether'), web3.utils.toWei('5', 'Ether'), { from: seller })
      productCount = await insurance.productCount()
      result = await insurance.purchaseProduct(productCount, repair, police, { from: buyer, value: web3.utils.toWei('1', 'Ether') })
      productCount = await insurance.productCount()
      result = await insurance.purchaseInsurance(productCount, repair, police, { from: buyer, value: web3.utils.toWei('5', 'Ether') })
      productCount = await insurance.productCount()
      if (!result.purchased && !result.insurancePurchased && result.claimedPolice && result.claimedRepair) {
        await insurance.claimRepair(productCount, repair, police, { from: buyer }).should.be.rejected()
      } else {
        result = await insurance.claimRepair(productCount, repair, police, { from: buyer })
        const event = result.logs[0].args
        assert.equal(event.claimedRepair, true)
      }
    })
  })

  describe('stolen', async () => {
    it('product is stolen', async () => {
      let result, productCount
      result = await insurance.createProduct('iPhone X', web3.utils.toWei('1', 'Ether'), web3.utils.toWei('5', 'Ether'), { from: seller })
      productCount = await insurance.productCount()
      result = await insurance.purchaseProduct(productCount, repair, police, { from: buyer, value: web3.utils.toWei('1', 'Ether') })
      productCount = await insurance.productCount()
      result = await insurance.purchaseInsurance(productCount, repair, police, { from: buyer, value: web3.utils.toWei('5', 'Ether') })
      productCount = await insurance.productCount()
      result = await insurance.claimPolice(productCount, repair, police, { from: buyer })
      productCount = await insurance.productCount()
      if (!result.purchased && !result.insurancePurchased && !result.claimedPolice && result.claimRepair) {
        await insurance.stolen(productCount, repair, police, { from: police }).should.be.rejected()
      } else {
        result = await insurance.stolen(productCount, repair, police, { from: police })
        const event = result.logs[0].args
        assert.equal(event.isStolen, true)
      }
    })
  })

  describe('repaired', async () => {
    it('product is repaired', async () => {
      let result, productCount
      result = await insurance.createProduct('iPhone X', web3.utils.toWei('1', 'Ether'), web3.utils.toWei('5', 'Ether'), { from: seller })
      productCount = await insurance.productCount()
      result = await insurance.purchaseProduct(productCount, repair, police, { from: buyer, value: web3.utils.toWei('1', 'Ether') })
      productCount = await insurance.productCount()
      result = await insurance.purchaseInsurance(productCount, repair, police, { from: buyer, value: web3.utils.toWei('5', 'Ether') })
      productCount = await insurance.productCount()
      result = await insurance.claimRepair(productCount, repair, police, { from: buyer })
      productCount = await insurance.productCount()
      if (!result.purchased && !result.insurancePurchased && !result.claimedRepair && result.claimedPolice) {
        await insurance.repaired(productCount, repair, police, { from: repair }).should.be.rejected()
      } else {
        result = await insurance.repaired(productCount, repair, police, { from: repair })
        const event = result.logs[0].args
        assert.equal(event.isRepaired, true)
      }
    })
  })

  describe('reimburesment', async () => {
    it('reimbursement successfull', async () => {
      let result, productCount
      result = await insurance.createProduct('iPhone X', web3.utils.toWei('1', 'Ether'), web3.utils.toWei('5', 'Ether'), { from: seller })
      productCount = await insurance.productCount()
      result = await insurance.purchaseProduct(productCount, repair, police, { from: buyer, value: web3.utils.toWei('1', 'Ether') })
      productCount = await insurance.productCount()
      result = await insurance.purchaseInsurance(productCount, repair, police, { from: buyer, value: web3.utils.toWei('5', 'Ether') })
      productCount = await insurance.productCount()
      result = await insurance.claimPolice(productCount, repair, police, { from: buyer })
      productCount = await insurance.productCount()
      result = await insurance.stolen(productCount, repair, police, { from: police })
      productCount = await insurance.productCount()
      let oldBuyerBalance
      oldBuyerBalance = await web3.eth.getBalance(buyer)
      oldBuyerBalance = new web3.utils.BN(oldBuyerBalance)
      result = await insurance.reimburse(productCount, repair, police, { from: seller, value: web3.utils.toWei('1', 'Ether') })
      let newBuyerBalance
      newBuyerBalance = await web3.eth.getBalance(buyer)
      newBuyerBalance = new web3.utils.BN(newBuyerBalance)
      let productPrice
      productPrice = await web3.utils.toWei('1', 'Ether')
      productPrice = new web3.utils.BN(productPrice)
      const exepectedBalance = oldBuyerBalance.add(productPrice)
      assert.equal(newBuyerBalance.toString(), exepectedBalance.toString())
      const event = result.logs[0].args
      assert.equal(event.isReimbursed, true)
    })
  })

  describe('pay repair shop', async () => {
    it('repair shop is paid successfully', async () => {
      let result, productCount
      result = await insurance.createProduct('iPhone X', web3.utils.toWei('1', 'Ether'), web3.utils.toWei('5', 'Ether'), { from: seller })
      productCount = await insurance.productCount()
      result = await insurance.purchaseProduct(productCount, repair, police, { from: buyer, value: web3.utils.toWei('1', 'Ether') })
      productCount = await insurance.productCount()
      result = await insurance.purchaseInsurance(productCount, repair, police, { from: buyer, value: web3.utils.toWei('5', 'Ether') })
      productCount = await insurance.productCount()
      result = await insurance.claimRepair(productCount, repair, police, { from: buyer })
      productCount = await insurance.productCount()
      result = await insurance.repaired(productCount, repair, police, { from: repair })
      productCount = await insurance.productCount()
      let oldRepairBalance
      oldRepairBalance = await web3.eth.getBalance(repair)
      oldRepairBalance = new web3.utils.BN(oldRepairBalance)
      result = await insurance.payRepairShop(productCount, repair, police, { from: seller, value: web3.utils.toWei('0.5', 'Ether') })
      let newRepairBalance
      newRepairBalance = await web3.eth.getBalance(repair)
      newRepairBalance = new web3.utils.BN(newRepairBalance)
      let repairCharge
      repairCharge = await web3.utils.toWei('0.5', 'Ether')
      repairCharge = new web3.utils.BN(repairCharge)
      const exepectedBalance = oldRepairBalance.add(repairCharge)
      assert.equal(newRepairBalance.toString(), exepectedBalance.toString())
      const event = result.logs[0].args
      assert.equal(event.paidRepairShop, true)
    })
  })
})
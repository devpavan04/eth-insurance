import React, { Component } from 'react'
import isoLogo from '../images/isometric.png'
import './App.css'

class Main extends Component {

  constructor() {
    super();
  }

  formSubmit = (event) => {
    event.preventDefault()
    const name = this.productName.value
    const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
    const insurancePrice = window.web3.utils.toWei(this.insurancePrice.value.toString(), 'Ether')
    this.props.createProduct(name, price, insurancePrice)
  }

  productBuy = (event) => {
    this.props.purchaseProduct(event.target.name, event.target.value)
  }

  insuranceBuy = (event) => {
    this.props.purchaseInsurance(event.target.name, event.target.value, event.target.owner)
  }

  claimPolice = (event) => {
    this.props.policeClaim(event.target.name)
  }

  claimRepair = (event) => {
    this.props.repairClaim(event.target.name)
  }

  stolen = (event) => {
    this.props.stolen(event.target.name)
  }

  notStolen = (event) => {
    this.props.notStolen(event.target.name)
  }

  repaired = (event) => {
    this.props.repaired(event.target.name)
  }

  reimburse = (event) => {
    this.props.reimburse(event.target.name, event.target.value)
  }

  payRepairShop = (event) => {
    this.props.payRepairShop(event.target.name, event.target.value)
  }

  render() {
    console.log(this.props.products)
    return (

      <div>

        {
          this.props.account == this.props.sellerAccount
            ?
            <div className='div-style'>
              <div className='mr-5 text-justify'>
                <h1 class="display-4">Hello, Product Shop!</h1>
              </div>
            </div>
            :
            null
        }

        {
          this.props.account == this.props.policeAccount
            ?
            <div className='div-style'>
              <div className='mr-5 text-justify'>
                <h1 class="display-4">Hello, Police Department!</h1>
              </div>
            </div>
            :
            null
        }

        {
          this.props.account == this.props.repairAccount
            ?
            <div className='div-style'>
              <div className='mr-5 text-justify'>
                <h1 class="display-4">Hello, Repair Shop!</h1>
              </div>
            </div>
            :
            null
        }

        {
          this.props.account !== this.props.sellerAccount && this.props.account !== this.props.policeAccount && this.props.account !== this.props.repairAccount
            ?
            <div className='div-style'>
              <div className='mr-5 text-justify'>
                <h1 class="display-4">Hello, Buyer!</h1>
              </div>
            </div>
            :
            null
        }

        <div id="content" className="div-style">
          <h4><b>Account Details</b></h4>
          <h6><i>Account Address :</i></h6>
          <h5>{this.props.account}</h5>
          <h6><i>Account Balance :</i></h6>
          <h5>{this.props.accountBalance} ETH</h5>
        </div>

        {
          this.props.account == this.props.sellerAccount
            ?
            <div id="content" className="div-style">
              <h4><b>Add Product</b></h4>
              <form onSubmit={this.formSubmit} className=''>
                <div className="form-group mr-sm-2">
                  <input
                    id="productName"
                    type="text"
                    ref={(input) => { this.productName = input }}
                    className="form-control"
                    placeholder="Product Name"
                    required />
                </div>
                <div className="form-group mr-sm-2">
                  <input
                    id="productPrice"
                    type="text"
                    ref={(input) => { this.productPrice = input }}
                    className="form-control"
                    placeholder="Product Price"
                    required />
                </div>
                <div className="form-group mr-sm-2">
                  <input
                    id="insurancePrice"
                    type="text"
                    ref={(input) => { this.insurancePrice = input }}
                    className="form-control"
                    placeholder="Insurance Price"
                    required />
                </div>
                <button type="submit" className="btn btn-primary">Add Product</button>
              </form>
            </div>
            :
            null
        }

        {
          this.props.account !== this.props.policeAccount && this.props.account !== this.props.repairAccount
            ?
            <div id="content" className="div-style">
              <h4><b>Buy Product with Insurance</b></h4>
              <table className="table table-bordered table-striped text-center">
                <thead id='table-head'>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Product Owner</th>
                    <th scope="col">Product Price</th>
                    <th scope="col">Buy Product</th>
                    <th scope="col">Insurance Price</th>
                    <th scope="col">Buy Insurance</th>
                    <th scope="col">Police</th>
                    <th scope="col">Repair</th>
                    <th scope="col">Claim update</th>
                  </tr>
                </thead>
                <tbody id="productList">
                  {this.props.products.map((product, key) => {
                    console.log(product)
                    return (
                      <tr key={key}>
                        <th scope="row">{product.id.toString()}</th>
                        <td>{product.name}</td>
                        <td>{product.owner}</td>
                        <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                        <td>
                          {!product.purchased
                            ?
                            <button className='btn btn-primary btn-block' type="submit" name={product.id} value={product.price} onClick={this.productBuy}>Buy</button>
                            : <i>Purchased &#10004;</i>
                          }
                        </td>
                        <td>{window.web3.utils.fromWei(product.insurancePrice.toString(), 'Ether')} Eth</td>
                        <td>
                          {product.purchased && !product.insurancePurchased
                            ?
                            <button className='btn btn-primary btn-block' type="submit" name={product.id} value={product.insurancePrice} onClick={this.insuranceBuy}>Buy</button>
                            : product.insurancePurchased ? <i>Purchased &#10004;</i> : <i>Buy Product</i>
                          }
                        </td>
                        <td>
                          {
                            !product.claimedPolice && !product.claimedRepair && product.purchased && product.insurancePurchased
                              ?
                              <button className='btn btn-primary btn-block' type="submit" name={product.id} onClick={this.claimPolice}>Claim Police</button>
                              :
                              product.claimedPolice
                                ?
                                <i>Police claimed</i>
                                :
                                product.claimedRepair
                                  ?
                                  <i>Claimed repair already!</i>
                                  :
                                  !product.purchased
                                    ?
                                    <i>Buy Product</i>
                                    :
                                    !product.insurancePurchased
                                      ?
                                      <i>Buy Insurance</i>
                                      :
                                      null
                          }
                        </td>
                        <td>
                          {
                            !product.claimedRepair && !product.claimedPolice && product.purchased && product.insurancePurchased
                              ?
                              <button className='btn btn-primary btn-block' type="submit" name={product.id} onClick={this.claimRepair}>Claim Repair</button>
                              :
                              product.claimedRepair
                                ?
                                <i>Repair claimed</i>
                                :
                                product.claimedPolice
                                  ?
                                  <i>Claimed police already!</i>
                                  :
                                  !product.purchased
                                    ?
                                    <i>Buy Product</i>
                                    :
                                    !product.insurancePurchased
                                      ?
                                      <i>Buy Insurance</i>
                                      :
                                      null
                          }
                        </td>
                        <td>
                          {
                            product.isRepaired && !product.paidRepairShop
                              ?
                              <div>
                                <i className='mr-2'><b>Repaired!</b></i>
                                <br></br>
                                <button className='btn btn-primary btn-block' type="submit" name={product.id} value={product.price / 2} onClick={this.payRepairShop}>Pay Repair</button>
                              </div>
                              :
                              product.isStolen && !product.isReimbursed
                                ?
                                <div>
                                  <i><b>Stolen!</b></i>
                                  <button className='btn btn-primary btn-block' type="submit" name={product.id} value={product.price} onClick={this.reimburse}>Reimburse</button>
                                </div>
                                :
                                !product.purchased
                                  ?
                                  <i>Buy Product</i>
                                  :
                                  !product.insurancePurchased
                                    ?
                                    <i>Buy Insurance</i>
                                    :
                                    !product.claimedRepair && !product.claimedPolice && product.insurancePurchased
                                      ?
                                      <i>Not Claimed</i>
                                      :
                                      product.claimedPolice && !product.isReimbursed
                                        ?
                                        <i>Claimed</i>
                                        :
                                        product.claimedRepair && !product.isRepaired
                                          ?
                                          <i>Claimed</i>
                                          :
                                          product.isReimbursed && product.isStolen
                                            ?
                                            <i>Reimbursed</i>
                                            :
                                            product.claimedRepair && !product.isRepaired
                                              ?
                                              <i>Claimed</i>
                                              :
                                              product.claimedPolice && !product.isRepaired
                                                ?
                                                <i>Claimed</i>
                                                :
                                                product.paidRepairShop && product.isRepaired
                                                  ?
                                                  <i>Paid Repair Shop</i>
                                                  :
                                                  null

                          }
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            :
            null
        }

        {
          this.props.account == this.props.policeAccount
            ?
            <div id="content" className="div-style">
              <h4><b>Notifications and Feed</b></h4>
              <h6><i>Police Verifications :</i></h6>
              {
                this.props.products.map((product, key) => {
                  console.log(product)
                  return (
                    product.claimedPolice && !product.isStolen
                      ?
                      <div className='mb-3 mt-3'>
                        <h5><b><i>{`${product.name} owned by : ${product.owner}`}</i></b></h5>
                        <button className='mr-2 btn btn-primary' name={product.id} onClick={this.stolen}>Stolen</button>
                      </div>
                      :
                      product.isStolen
                        ?
                        <h6 className='mt-3'><b><i>{`${product.name} owned by ${product.owner} is stolen.`}</i></b></h6>
                        :
                        null
                  )
                })
              }
            </div>
            :
            null
        }

        {
          this.props.account == this.props.repairAccount
            ?
            <div id="content" className="div-style">
              <h4><b>Notifications and Feed</b></h4>
              <h6><i>Repair Orders :</i></h6>
              {
                this.props.products.map((product, key) => {
                  console.log(product)
                  return (
                    product.claimedRepair && !product.isRepaired
                      ?
                      <div className='mb-3 mt-3'>
                        <h5><b><i>{`${product.name}`}</i></b></h5>
                        <button className='mr-2 btn btn-primary' name={product.id} onClick={this.repaired}>Repair</button>
                      </div>
                      :
                      product.isRepaired
                        ?
                        <h6 className='mt-3'><b><i>{`${product.name} owned by ${product.owner} has been repaired.`}</i></b></h6>
                        :
                        null
                  )
                })
              }
            </div>
            :
            null
        }

      </div>
    );
  }
}

export default Main;
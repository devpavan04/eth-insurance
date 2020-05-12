import React, { Component } from 'react'
import isoLogo from '../images/isometric.png'
import './App.css'

class Main extends Component {

  constructor() {
    super();
  }

  searchFilter = (e) => {
    document.getElementById('table-head').style.display = 'none';
    var text = e.target.value.toLowerCase();
    var tableItems = document.getElementById('productList');
    var tableRows = tableItems.getElementsByTagName('tr');
    Array.from(tableRows).forEach((item) => {
      var itemName = item.children[2].textContent;
      if (itemName.toLowerCase().indexOf(text) != -2) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    })
  }

  formSubmit = (event) => {
    event.preventDefault()
    const name = this.productName.value
    const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
    const insurancePrice = window.web3.utils.toWei(this.insurancePrice.value.toString(), 'Ether')
    console.log(name)
    console.log(price)
    console.log(insurancePrice)
    this.props.createProduct(name, price, insurancePrice)
  }

  productBuy = (event) => {
    console.log(event.target.name)
    console.log(event.target.value)
    this.props.purchaseProduct(event.target.name, event.target.value)
  }

  insuranceBuy = (event) => {
    this.props.purchaseInsurance(event.target.name, event.target.value, event.target.owner)
  }

  render() {
    console.log(this.props.products)
    return (

      <div>

        <div className='div-style'>
          <div id="content" className="d-flex">
            <div className='mr-5 text-justify'>
              <h1 class="display-4">Hello, world!</h1>
              <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information. It uses utility classes for typography and spacing to space content out within the larger container. This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information. It uses utility classes for typography and spacing to space content out within the larger container. This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information. It uses utility classes for typography and spacing to space content out within the larger container. space content out within the larger container. This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information. It uses utility classes for typography and spacing to space content out within the larger container.</p>
              <a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
            </div>
            <div className='ml-5'>
              <img src={isoLogo} height='400' width='400' className='float-right'></img>
            </div>
          </div>
        </div>

        <div id="content" className="div-style">
          <h4><b>Account Details</b></h4>
          <h5><b>Account Address</b></h5>
          <h5>{this.props.account}</h5>
          <h5><b>Account Balance</b></h5>
          <h5>{this.props.accountBalance} ETH</h5>
        </div>

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

        <div id="content" className="div-style">
          <h4><b>Search Product</b></h4>
          <input type="text" class="form-control" id="filter" placeholder="Search items..." onKeyUp={this.searchFilter}></input>
        </div>

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
                <th scope="col">Claims</th>
                <th scope="col">Claims</th>
                <th scope="col">Claims</th>
                <th scope="col">Claims</th>
              </tr>
            </thead>
            <tbody id="productList">
              {this.props.products.map((product, key) => {
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
                        : product.insurancePurchased ? <i>Purchased &#10004;</i> : <i>Buy product</i>
                      }
                    </td>
                    <td>{window.web3.utils.fromWei(product.insurancePrice.toString(), 'Ether')} Eth</td>
                    <td>{window.web3.utils.fromWei(product.insurancePrice.toString(), 'Ether')} Eth</td>
                    <td>{window.web3.utils.fromWei(product.insurancePrice.toString(), 'Ether')} Eth</td>
                    <td>{window.web3.utils.fromWei(product.insurancePrice.toString(), 'Ether')} Eth</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

      </div>
    );
  }
}

export default Main;

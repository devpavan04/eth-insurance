import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Insurance from '../abis/Insurance.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    this.setState({ account: accounts[0] })
    console.log(this.state.account)

    const networkId = await web3.eth.net.getId()
    console.log(networkId)

    const networkData = Insurance.networks[networkId]
    console.log(networkData)

    if (networkData) {
      const insurance = web3.eth.Contract(Insurance.abi, networkData.address)
      console.log(await insurance.methods.productCount().call())
      this.setState({ insurance })
      const productCount = await insurance.methods.productCount().call()
      console.log(productCount)
      this.setState({ productCount: productCount })

      // Load products
      for (var i = 1; i <= productCount; i++) {
        const product = await insurance.methods.products(i).call()
        this.setState({
          products: [...this.state.products, product]
        })
      }
      this.setState({ loading: false })
    } else {
      window.alert('Insurance contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true,
    }
    this.createProduct = this.createProduct.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)
    this.purchaseInsurance = this.purchaseInsurance.bind(this)
  }

  createProduct = (name, price, insurancePrice) => {
    console.log(name)
    console.log(price)
    console.log(insurancePrice)
    this.setState({ loading: true })
    this.state.insurance.methods.createProduct(name, price, insurancePrice).send({ from: this.state.account })
      .on('receipt', (receipt) => {
        console.log(receipt);
        this.setState({ loading: false })
      })
  }

  purchaseProduct = (id, price) => {
    console.log(id)
    console.log(price)
    this.setState({ loading: true })
    this.state.insurance.methods.purchaseProduct(id).send({ from: this.state.account, value: price })
      .on('receipt', (receipt) => {
        console.log(receipt);
      })
  }

  purchaseInsurance = (id, insurancePrice) => {
    this.setState({ loading: true })
    this.state.insurance.methods.purchaseInsurance(id).send({ from: this.state.account, value: insurancePrice })
      .on('receipt', (receipt) => {
        console.log(receipt);
      })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="m-5">
          <div className="row">
            <main role="main" className="col-lg-6 d-flex">
              {this.state.loading
                ?
                <div id="loader"
                  className="text-center mt-5"><p className="text-center"></p></div>
                :
                <Main
                  products={this.state.products}
                  createProduct={this.createProduct}
                  purchaseProduct={this.purchaseProduct}
                  purchaseInsurance={this.purchaseInsurance} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
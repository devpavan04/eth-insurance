import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Insurance from '../abis/Insurance.json'
import Main from './Main'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true,
      accountBalance: 0,
      sellerAccount: '',
      policeAccount: '',
      repairAccount: ''
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.getAllAccounts()
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

  async getAllAccounts() {
    var Web3 = require('web3');
    let web3 = new Web3('HTTP://127.0.0.1:7545')
    const accounts = await web3.eth.getAccounts()
    this.setState({ sellerAccount: accounts[9], policeAccount: accounts[8], repairAccount: accounts[7] })
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    let accountBalance = await web3.eth.getBalance(accounts[0]);
    accountBalance = web3.utils.fromWei(accountBalance, 'ether')
    this.setState({ accountBalance: accountBalance })

    const networkId = await web3.eth.net.getId()

    const networkData = Insurance.networks[networkId]

    if (networkData) {
      const insurance = web3.eth.Contract(Insurance.abi, networkData.address)
      this.setState({ insurance })
      const productCount = await insurance.methods.productCount().call()
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

  createProduct = (name, price, insurancePrice) => {
    this.setState({ loading: true })
    this.state.insurance.methods.createProduct(name, price, insurancePrice).send({ from: this.state.account })
      .on('receipt', (receipt) => {
        console.log(receipt);
        this.setState({ loading: false })
      })
  }

  purchaseProduct = (id, price) => {
    this.setState({ loading: true })
    this.state.insurance.methods.purchaseProduct(id, this.state.repairAccount, this.state.policeAccount).send({ from: this.state.account, value: price })
      .on('receipt', (receipt) => {
        console.log(receipt);
      })
  }

  purchaseInsurance = (id, insurancePrice) => {
    this.setState({ loading: true })
    this.state.insurance.methods.purchaseInsurance(id, this.state.repairAccount, this.state.policeAccount).send({ from: this.state.account, value: insurancePrice })
      .on('receipt', (receipt) => {
        console.log(receipt);
        this.setState({ loading: false })
      })
  }

  policeClaim = (id) => {
    this.setState({ loading: true })
    this.state.insurance.methods.claimPolice(id, this.state.repairAccount, this.state.policeAccount).send({ from: this.state.account })
      .on('receipt', (receipt) => {
        console.log(receipt);
        this.setState({ loading: false })
      })
  }

  repairClaim = (id) => {
    this.setState({ loading: true })
    this.state.insurance.methods.claimRepair(id, this.state.repairAccount, this.state.policeAccount).send({ from: this.state.account })
      .on('receipt', (receipt) => {
        console.log(receipt);
        this.setState({ loading: false })
      })
  }

  stolen = (id) => {
    this.setState({ loading: true })
    this.state.insurance.methods.stolen(id, this.state.repairAccount, this.state.policeAccount).send({ from: this.state.account })
      .on('receipt', (receipt) => {
        console.log(receipt);
        this.setState({ loading: false })
      })
  }

  repaired = (id) => {
    this.setState({ loading: true })
    this.state.insurance.methods.repaired(id, this.state.repairAccount, this.state.policeAccount).send({ from: this.state.account })
      .on('receipt', (receipt) => {
        console.log(receipt);
        this.setState({ loading: false })
      })
  }

  reimburse = (id, productPrice) => {
    this.setState({ loading: true })
    this.state.insurance.methods.reimburse(id, this.state.repairAccount, this.state.policeAccount).send({ from: this.state.account, value: productPrice })
      .on('receipt', (receipt) => {
        console.log(receipt);
        this.setState({ loading: false })
      })
  }

  payRepairShop = (id, repairFee) => {
    this.setState({ loading: true })
    this.state.insurance.methods.payRepairShop(id, this.state.repairAccount, this.state.policeAccount).send({ from: this.state.account, value: repairFee })
      .once('receipt', (receipt) => {
        console.log(receipt);
        this.setState({ loading: false })
      })
  }

  render() {
    return (
      <div>
        <main role="main">
          {this.state.loading
            ?
            <div id="loader"
              className="text-center mt-5"><p className="text-center">Loading....</p></div>
            :
            <Main
              products={this.state.products}
              account={this.state.account}
              accountBalance={this.state.accountBalance}
              createProduct={this.createProduct}
              purchaseProduct={this.purchaseProduct}
              purchaseInsurance={this.purchaseInsurance}
              policeClaim={this.policeClaim}
              repairClaim={this.repairClaim}
              stolen={this.stolen}
              repaired={this.repaired}
              reimburse={this.reimburse}
              payRepairShop={this.payRepairShop}
              repairAccount={this.state.repairAccount}
              policeAccount={this.state.policeAccount}
              sellerAccount={this.state.sellerAccount} />
          }
        </main>
      </div>
    );
  }
}

export default App;
import React, { Component } from 'react';

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar fixed-top bg-dark text-white flex-md-nowrap shadow-lg mb-5 text-size-nav">
        <a><b><i>Blockchain</i></b></a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <hsmall className=""><span id="account"><b>{this.props.account}</b></span></hsmall>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;

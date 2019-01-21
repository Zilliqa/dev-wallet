import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Navbar, NavbarBrand } from 'reactstrap';
import * as H from 'history';
import './style.css';

interface IProps {
  history: H.History;
  location: H.Location;
  network: string;
}

class Header extends React.Component<IProps, {}> {
  public render() {
    return (
      <div>
        <Navbar fixed={'top'} dark={true} expand="md" color="faded">
          <NavbarBrand href="/">{'Nucleus Wallet'}</NavbarBrand>
          <div className="network">{this.props.network} network</div>
        </Navbar>
      </div>
    );
  }
}

// @ts-ignore
const HeaderWithRouter = withRouter(Header);

const mapStateToProps = (state) => ({
  network: state.zil.network
});

export default connect(mapStateToProps)(HeaderWithRouter);

import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Navbar, NavItem, NavLink, NavbarBrand } from 'reactstrap';
import * as H from 'history';
import './style.css';
import Nav from 'reactstrap/lib/Nav';
import * as zilActions from '../../redux/zil/actions';
import { requestStatus } from '../../constants';

interface IProps {
  history: H.History;
  location: H.Location;
  network: string;
  authStatus?: string;
  clear: () => void;
}

class Header extends React.Component<IProps, {}> {
  public render() {
    const { authStatus } = this.props;
    return (
      <div>
        <Navbar fixed={'top'} dark={true} expand="md" color="faded">
          <NavbarBrand href="/">{'Nucleus Wallet'}</NavbarBrand>
          <div className="network">{this.props.network} network</div>
          {authStatus === requestStatus.SUCCEED ? (
            <Nav className="ml-auto" navbar={true} style={{ marginRight: 150 }}>
              <NavItem>
                <NavLink style={{ cursor: 'pointer' }} onClick={this.signOut}>
                  {'Sign Out'}
                </NavLink>
              </NavItem>
            </Nav>
          ) : null}
        </Navbar>
      </div>
    );
  }

  private signOut = () => {
    this.props.clear();
  };
}

// @ts-ignore
const HeaderWithRouter = withRouter(Header);

const mapStateToProps = (state) => ({
  network: state.zil.network,
  authStatus: state.zil.authStatus
});

const mapDispatchToProps = (dispatch) => ({
  clear: () => dispatch(zilActions.clear())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderWithRouter);

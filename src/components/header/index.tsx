import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, NavLink, NavbarBrand, Collapse, NavbarToggler } from 'reactstrap';
import * as H from 'history';
import './style.css';
import * as zilActions from '../../redux/zil/actions';
import { requestStatus } from '../../constants';
import { Link } from 'react-router-dom';
import { paths } from '../../routes';

interface IProps {
  history: H.History;
  location: H.Location;
  network: string;
  authStatus?: string;
  clear: () => void;
}

class Header extends React.Component<IProps, {}> {
  public readonly state = {
    isOpen: false
  };
  public render() {
    const { authStatus } = this.props;
    const isAuth = authStatus === requestStatus.SUCCEED;

    return (
      <div>
        <Navbar fixed={'top'} dark={true} color="faded" expand="sm">
          <NavbarBrand href="/">
            {'Nucleus Wallet'}
            <small className="release-text">{'beta'}</small>
          </NavbarBrand>

          <NavbarToggler
            onClick={() => this.setState({ isOpen: !this.state.isOpen })}
            aria-label="toggler"
          />

          <Collapse isOpen={this.state.isOpen} navbar={true}>
            <Nav className="ml-auto" navbar={true}>
              <NavItem className="sidebar-link">
                <Link to={paths.home} className={`nav-link`}>
                  {'Home'}
                </Link>
              </NavItem>
              <NavItem className="sidebar-link">
                <Link to={paths.generate} className={`nav-link`}>
                  {'Create New Wallet'}
                </Link>
              </NavItem>
              <NavItem className="sidebar-link">
                <Link to={paths.send} className={`nav-link`}>
                  {'Send ZIL'}
                </Link>
              </NavItem>
              <NavItem className="sidebar-link">
                <Link to={paths.faucet} className={`nav-link`}>
                  {'ZIL Faucet'}
                </Link>
              </NavItem>
              {isAuth ? (
                <NavLink style={{ cursor: 'pointer' }} onClick={this.signOut}>
                  {'Sign Out'}
                </NavLink>
              ) : null}
              <span className="nav-link">
                <span className="network">{this.props.network}</span>
              </span>
            </Nav>
          </Collapse>
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

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Navbar, NavbarBrand } from 'reactstrap';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FaUserCircle } from 'react-icons/fa';
import * as zilActions from '../../redux/zil/actions';
import * as H from 'history';
import Nav from 'reactstrap/lib/Nav';
import { paths } from '../../routes';
import './style.css';
import { requestStatus } from '../../constants';
import NavItem from 'reactstrap/lib/NavItem';
import NavLink from 'reactstrap/lib/NavLink';

interface IProps {
  authStatus?: string;
  history: H.History;
  location: H.Location;
  clear: () => void;
}

class Header extends React.Component<IProps, {}> {
  public render() {
    const { authStatus } = this.props;
    return (
      <div>
        <Navbar fixed={'top'} dark={true} expand="md" color="faded">
          <NavbarBrand href="/">{'Nucleus Wallet'}</NavbarBrand>

          {authStatus === requestStatus.SUCCEED ? (
            <Nav className="ml-auto" navbar={true} style={{ marginRight: 150 }}>
              <NavItem>
                <NavLink style={{ cursor: 'pointer' }} onClick={this.signOut}>
                  {'Sign Out'}
                </NavLink>
              </NavItem>
            </Nav>
          ) : null}
          <div className="network">{'test network'}</div>
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
// @ts-check

const mapStateToProps = (state) => ({
  authStatus: state.zil.authStatus
});

const mapDispatchToProps = (dispatch) => ({
  clear: () => dispatch(zilActions.clear())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderWithRouter);

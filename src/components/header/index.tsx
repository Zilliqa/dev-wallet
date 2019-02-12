/**
 * This file is part of nucleus-wallet.
 * Copyright (c) 2018 - present Zilliqa Research Pte. Ltd.
 *
 * nucleus-wallet is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * nucleus-wallet is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * nucleus-wallet.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useState } from 'react';
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

const Header: React.FunctionComponent<IProps> = (props) => {
  const [isOpen, setOpen] = useState(false);

  const { authStatus } = props;
  const isAuth = authStatus === requestStatus.SUCCEED;

  return (
    <div>
      <Navbar fixed={'top'} dark={true} color="faded" expand="sm">
        <NavbarBrand href="/">
          {'Nucleus Wallet'}
          <small className="release-text">{'beta'}</small>
        </NavbarBrand>

        <NavbarToggler onClick={() => setOpen(!isOpen)} aria-label="toggler" />

        <Collapse isOpen={isOpen} navbar={true}>
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
              <NavLink className="cursor-pointer" onClick={props.clear}>
                {'Sign Out'}
              </NavLink>
            ) : null}
            <span className="nav-link">
              <span className="network">{props.network}</span>
            </span>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

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

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
import { Navbar, Nav, NavItem, NavLink, NavbarBrand, Collapse, NavbarToggler } from 'reactstrap';
import './style.css';
import { Link } from 'react-router-dom';
import { paths } from '../../routes';

interface IProps {
  isAuth: boolean;
  clearAuth: () => void;
}

const Header: React.FunctionComponent<IProps> = ({ isAuth, clearAuth }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div>
      <Navbar fixed={'top'} dark={true} color="dark" expand="sm">
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
              <NavLink className="cursor-pointer" onClick={clearAuth}>
                {'Sign Out'}
              </NavLink>
            ) : null}
            <span className="nav-link">
              <span className="network">{'Dev Testnet'}</span>
            </span>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;

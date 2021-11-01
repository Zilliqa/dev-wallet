/**
 * Copyright (c) 2018 - present Zilliqa Research Pte. Ltd.
 *
 * This program is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useState } from 'react';
import { Navbar, Nav, NavItem, NavLink, NavbarBrand, Collapse, NavbarToggler } from 'reactstrap';
import './style.css';
import { Link } from 'react-router-dom';
import { paths } from '../../routes';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { NETWORK } from '../../contexts/zil-context';

const Header = ({ curNetwork, isAuth, clearAuth, switchNetwork }) => {
  const [isOpen, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <div>
      <Navbar fixed={'top'} dark={true} color="dark" expand="sm">
        <NavbarBrand href="/">{'Dev Wallet'}</NavbarBrand>

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
              <NavLink className="pr-4 cursor-pointer" onClick={clearAuth}>
                {'Sign Out'}
              </NavLink>
            ) : null}

            <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle className="network-button" color="secondary">
                <span className="network">
                  {curNetwork.name
                    .split('_')
                    .map((cur) => cur.slice(0, 1).toUpperCase() + cur.slice(1))
                    .join(' ')}
                </span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => switchNetwork(NETWORK.TestNet)}>Testnet</DropdownItem>
                <DropdownItem onClick={() => switchNetwork(NETWORK.IsolatedServer)}>
                  Isolated Server
                </DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;

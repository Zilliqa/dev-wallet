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

import React from 'react';
import { withRouter } from 'react-router';
import { NavItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import * as H from 'history';
import { paths } from '../../routes';
import './style.css';
import { FaHome, FaPlusSquare, FaTint, FaPaperPlane, FaCalculator } from 'react-icons/fa';
import { faucetHostnameList } from '../../constants';

interface IProps {
  history: H.History;
  location: H.Location;
}

const Sidebar: React.SFC<IProps> = (props) => {
  const { pathname } = props.location;
  const { hostname } = location;

  const renderLink = (path, name, icon) => (
    <Link to={path} className={`nav-link ${pathname === path ? 'active' : ''}`}>
      <span className="sidebar-icon pr-2">{icon}</span>
      {name}
    </Link>
  );

  return (
    <div className="sidebar">
      <div className="sidebar-background">
        <div className="sidebar-wrapper">
          <ul className="sidebar-nav">
            <NavItem>{renderLink(paths.home, 'Home', <FaHome />)}</NavItem>
            <NavItem>{renderLink(paths.generate, 'Create New Wallet', <FaPlusSquare />)}</NavItem>
            <NavItem>{renderLink(paths.send, 'Send ZIL', <FaPaperPlane />)}</NavItem>
            {faucetHostnameList.includes(hostname) ? (
              <NavItem>{renderLink(paths.faucet, 'ZIL Faucet', <FaTint />)}</NavItem>
            ) : null}
            <NavItem>{renderLink(paths.calculate, 'Tx Calculator', <FaCalculator />)}</NavItem>
          </ul>
        </div>
      </div>
    </div>
  );
};

// @ts-ignore
export default withRouter(Sidebar);

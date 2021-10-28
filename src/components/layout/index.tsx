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

import Sidebar from '../sidebar';
import Header from '../header';
import Footer from '../footer';
import './style.css';

const Layout = ({ zilContext, children }) => {
  const { isAuth, clearAuth, curNetwork, switchNetwork } = zilContext;
  return (
    <div>
      <Header
        isAuth={isAuth}
        clearAuth={clearAuth}
        curNetwork={curNetwork}
        switchNetwork={switchNetwork}
      />
      <div className="layout">
        <Sidebar curNetwork={curNetwork} />
        <div className="content-section">
          {children}
          <Footer year={new Date().getFullYear()} />
        </div>
      </div>
    </div>
  );
};

export default Layout;

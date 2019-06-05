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
import { FaGithub, FaGitter, FaTwitter } from 'react-icons/fa';
import './style.css';
const copyright: string = 'Copyright © 2019 Zilliqa Research Pte. Ltd.';

const Footer: React.SFC = () => (
  <footer data-testid="footer" className={'footer'}>
    <div className="text-center py-2">
      <ul className="nav justify-content-center">
        <li className="nav-item">
          <a
            className="text-secondary nav-link"
            href="https://github.com/Zilliqa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={'Zilliqa GitHub'}
          >
            <FaGithub />
          </a>
        </li>
        <li className="nav-item">
          <a
            className="text-secondary nav-link"
            href="https://gitter.im/Zilliqa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={'Zilliqa Gitter'}
          >
            <FaGitter />
          </a>
        </li>
        <li className="nav-item">
          <a
            className="text-secondary nav-link"
            href="https://twitter.com/zilliqa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={'Zilliqa Twitter'}
          >
            <FaTwitter />
          </a>
        </li>
      </ul>
      <span className="text-secondary copyright">{copyright}</span>
    </div>
  </footer>
);

export default Footer;

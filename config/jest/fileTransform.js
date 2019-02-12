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

'use strict';

const path = require('path');

// This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/en/webpack.html

module.exports = {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename));

    if (filename.match(/\.svg$/)) {
      return `module.exports = {
        __esModule: true,
        default: ${assetFilename},
        ReactComponent: (props) => ({
          $$typeof: Symbol.for('react.element'),
          type: 'svg',
          ref: null,
          key: null,
          props: Object.assign({}, props, {
            children: ${assetFilename}
          })
        }),
      };`;
    }

    return `module.exports = ${assetFilename};`;
  }
};

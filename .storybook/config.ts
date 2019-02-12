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

import 'bootstrap/dist/css/bootstrap.css';
import { withOptions } from '@storybook/addon-options';
import { configure, addDecorator } from '@storybook/react';
import './storybook.css';
import '../src/index.css';

// automatically import all files ending in *.stories.tsx
const req = require.context('../src', true, /.stories.tsx$/);

// Option defaults:
addDecorator(
  withOptions({
    /**
     * name to display in the top left corner
     * @type {String}
     */
    name: 'NUCLEUS-WALLET',
    /**
     * URL for name in top left corner to link to
     * @type {String}
     */
    url: 'https://github.com/zilliqa/nucleus-wallet'
  })
);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);

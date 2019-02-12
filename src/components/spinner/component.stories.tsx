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

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import Spinner from '.';

const options = {
  showSource: false,
  showPropTables: false,
  allowPropTablesToggling: false
};
storiesOf('component.Spinner', module)
  // @ts-ignore
  .addWithChapters('Spinner', {
    chapters: [
      {
        title: 'Sizes of Spinner',
        info: '3 Sizes: small, medium, and large.',
        sections: [
          {
            options,
            sectionFn: () => (
              <div className="d-flex text-center">
                <div className="m-4 px-4">
                  <div>small</div>
                  <br />
                  <Spinner size="small" />
                </div>
                <div className="m-4 px-4">
                  <div>medium</div>
                  <br />
                  <Spinner size="medium" />
                </div>
                <div className="m-4 px-4">
                  <div>large</div>
                  <br />
                  <Spinner size="large" />
                </div>
              </div>
            )
          }
        ]
      }
    ]
  });

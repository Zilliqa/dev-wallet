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
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { FaCheck } from 'react-icons/fa';
import Button from '.';

describe('Button tests', () => {
  const baseComponent = (props) => (
    <Button
      type={props.type}
      text={'ButtonText'}
      disabled={false}
      onClick={() => console.log('click')}
      ariaLabel={'Test Button'}
      before={<FaCheck />}
      size={'md'}
    />
  );

  describe('basic tests', () => {
    it('matches the snapshot', () => {
      const tree = renderer.create(baseComponent({ type: 'secondary' })).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders primary button without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(baseComponent({ type: 'primary' }), div);
      ReactDOM.unmountComponentAtNode(div);
    });

    it('renders secondary button without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(baseComponent({ type: 'secondary' }), div);
      ReactDOM.unmountComponentAtNode(div);
    });
  });
});

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import Spinner from '.';

const options = {
  showSource: false,
  showPropTables: false,
  allowPropTablesToggling: false
};

storiesOf('component.SpinnerWithCheckMark', module)
  // @ts-ignore
  .addWithChapters('Loading', {
    chapters: [
      {
        title: 'Spinner With Check Mark',
        sections: [
          {
            options,
            sectionFn: () => (
              <div className="d-flex">
                <div className="text-center mx-2">
                  <div>loading</div>
                  <Spinner loading={true} />
                </div>
              </div>
            )
          }
        ]
      }
    ]
  })
  .addWithChapters('Loaded', {
    chapters: [
      {
        title: 'Spinner With Check Mark',
        sections: [
          {
            options,
            sectionFn: () => (
              <div className="d-flex">
                <div className="text-center mx-2">
                  <div>loaded</div>
                  <Spinner loading={false} />
                </div>
              </div>
            )
          }
        ]
      }
    ]
  });

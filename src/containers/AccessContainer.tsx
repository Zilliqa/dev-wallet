import React from 'react';
import Layout from '../components/layout';
import AccessForm from '../components/access-form';
import * as H from 'history';

interface IProps {
  history: H.History;
  location: H.Location;
}

class AccessContainer extends React.Component<IProps, {}> {
  public render() {
    return (
      <div>
        <Layout>
          <AccessForm history={this.props.history} />
        </Layout>
      </div>
    );
  }
}

export default AccessContainer;

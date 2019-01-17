import React from 'react';
import Layout from '../components/layout';
import GenerateForm from '../components/generate-form';
import * as H from 'history';

interface IProps {
  history: H.History;
  location: H.Location;
}

class CreateContainer extends React.Component<IProps, {}> {
  public render() {
    return (
      <div>
        <Layout>
          <GenerateForm />
        </Layout>
      </div>
    );
  }
}

export default CreateContainer;

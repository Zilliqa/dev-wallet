import React from 'react';
import Sidebar from '../sidebar';
import Header from '../header';
import './style.css';

interface IProps {
  children: React.ReactNode;
}

const Layout: React.SFC<IProps> = (props) => {
  return (
    <div>
      <Header />
      <div className="layout">
        <Sidebar />
        <div className="content-section">{props.children}</div>
      </div>
    </div>
  );
};

export default Layout;

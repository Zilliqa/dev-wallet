import React from 'react';
import { withRouter } from 'react-router';
import { NavItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import * as H from 'history';
import { paths } from '../../routes';
import './style.css';
import { FaHome } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';

interface IProps {
  history: H.History;
  location: H.Location;
}

class Sidebar extends React.Component<IProps, {}> {
  public render(): React.ReactNode {
    const { pathname } = this.props.location;
    const renderLink = (path, name, icon) => (
      <Link to={path} className={`nav-link ${pathname === path ? 'active' : ''}`}>
        <span className="sidebar-icon pr-2">{icon}</span>
        {name}
      </Link>
    );
    return (
      <div className="sidebar-background">
        <div className="sidebar-wrapper">
          <ul className="sidebar-nav">
            <NavItem>{renderLink(paths.home, 'Home', <FaHome />)}</NavItem>
            <NavItem>{renderLink(paths.signIn, 'Send Zil', <IoMdSend />)}</NavItem>
          </ul>
        </div>
      </div>
    );
  }
}

// @ts-ignore
export default withRouter(Sidebar);

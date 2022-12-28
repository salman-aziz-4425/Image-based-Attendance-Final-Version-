import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import appActions from '@iso/redux/app/actions';
import TopbarUser from './TopbarUser';
import TopbarWrapper from './Topbar.styles';
import { TopbarMenuIcon } from '@iso/config/icon.config';

const { Header } = Layout;
const { toggleCollapsed } = appActions;

class Topbar extends Component {
  render() {
    // const { toggleCollapsed, url, customizedTheme, locale } = this.props;
    const { toggleCollapsed, url, customizedTheme } = this.props;

    const collapsed = this.props.collapsed && !this.props.openDrawer;
    const styling = {
      background: customizedTheme.backgroundColor,
      position: 'fixed',
      width: '100%',
      height: 70,
    };
    return (
      <TopbarWrapper>
        <Header
          style={styling}
          className={
            collapsed ? 'isomorphicTopbar collapsed' : 'isomorphicTopbar'
          }
        >
          <div className="isoLeft">
            <button
              className={
                collapsed ? 'triggerBtn menuCollapsed' : 'triggerBtn menuOpen'
              }
              style={{ color: customizedTheme.textColor }}
              onClick={toggleCollapsed}
            >
              <TopbarMenuIcon size={24} color={customizedTheme.textColor} />
            </button>
          </div>

          <ul className="isoRight">
            <li
              onClick={() => this.setState({ selectedItem: 'user' })}
              className="isoUser"
            >
              {/* <TopbarUser locale={locale} /> */}
            </li>
          </ul>
        </Header>
      </TopbarWrapper>
    );
  }
}

export default connect(
  (state) => ({
    ...state.App,
    customizedTheme: state.ThemeSwitcher.topbarTheme,
  }),
  { toggleCollapsed }
)(Topbar);

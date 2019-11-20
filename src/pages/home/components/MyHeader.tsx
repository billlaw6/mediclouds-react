import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from "react-router-dom";
import { history } from '../../../configureStore';

const { SubMenu } = Menu;

class MyHeader extends React.Component {
    state = {
      current: 'mail',
    };
  
    handleClick = (e: any) => {
      console.log('click ', e);
      this.setState({
        current: e.key,
      });
      history.push('/login');
    };
  
    render() {
      return (
        <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
          <SubMenu
            title={
              <span className="submenu-title-wrapper">
                <Icon type="setting" />
                Navigation Three - Submenu
              </span>
            }
          >
            <Menu.ItemGroup title="Item 1">
              <Menu.Item key="setting:1">
                <Link to="/login">GO LOGIN</Link>
              </Menu.Item>
              <Menu.Item key="setting:2">Option 2</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="Item 2">
              <Menu.Item key="setting:3">Option 3</Menu.Item>
              <Menu.Item key="setting:4">Option 4</Menu.Item>
            </Menu.ItemGroup>
          </SubMenu>
          <Menu.Item key="alipay">
            <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
              Navigation Four - Link
            </a>
          </Menu.Item>
        </Menu>
      );
    }
  }

  export default MyHeader;
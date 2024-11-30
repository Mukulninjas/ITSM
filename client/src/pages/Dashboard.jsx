import React, { useState } from 'react';
import { Avatar, Button, Dropdown, Layout, Menu, message, Space } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import {
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PlusOutlined,
    UnorderedListOutlined,
    UserOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const onClick = ({ key }) => {
    message.info(`Click on item ${key}`);
};

const items = [
    {
        label: 'Profile',
        key: '1',
    },
    {
        label: 'Logout',
        key: '2',
    }
];

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout className="layout-container">
            <Sider trigger={null} breakpoint="lg" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1" icon={<HomeOutlined />}>
                        <Link to="/">Dashboard Home</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<PlusOutlined />}>
                        <Link to="/create-ticket">Create Ticket</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UnorderedListOutlined />}>
                        <Link to="/list-tickets">List Tickets</Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<UnorderedListOutlined />}>
                        <Link to="/create-users">Create Users</Link>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<UnorderedListOutlined />}>
                        <Link to="/list-users">User List</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header className="header">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    Dashboard
                    <Dropdown
                        menu={{
                            items,
                            onClick,
                        }}
                    >
                        <Avatar><UserOutlined/></Avatar>
                    </Dropdown>
                </Header>
                <Content className="content">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;

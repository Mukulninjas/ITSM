import React, { useState } from 'react';
import { Avatar, Button, Dropdown, Layout, Menu, message, Space } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const { Header, Sider, Content } = Layout;

const items = [{ label: 'Profile', key: '/profile' }, { label: 'Logout', key: '2' }];

const menuItems = [
    {
        key: '1',
        icon: <HomeOutlined />,
        label: <Link to="/">Dashboard</Link>,
    },
    {
        key: '2',
        icon: <PlusOutlined />,
        label: <Link to="/create-ticket">Create Ticket</Link>,
    },
    {
        key: '3',
        icon: <UnorderedListOutlined />,
        label: <Link to="/list-tickets">List Tickets</Link>,
    },
    {
        key: '4',
        icon: <UnorderedListOutlined />,
        label: <Link to="/create-users">Create Users</Link>,
    },
    {
        key: '5',
        icon: <UnorderedListOutlined />,
        label: <Link to="/list-users">User List</Link>,
    },
];


const Dashboard = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const menuClick = ({key}) => {
        if (key === '2') {
            dispatch(logout());
            navigate('/login');
            return;
        }
        navigate(key);
    };

    return (
        <Layout className="layout-container">
            <Sider trigger={null} breakpoint="lg" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={menuItems} />
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
                            onClick: menuClick,
                        }}
                    >
                        <Avatar><UserOutlined /></Avatar>
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

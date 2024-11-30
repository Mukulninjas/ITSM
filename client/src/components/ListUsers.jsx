import { message, Table, Tooltip, Modal, Button, Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { FetchUsers, EditUser, DeleteUser } from '../api/admin'; // Ensure these API functions exist

const { confirm } = Modal;

const ListUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [editForm] = Form.useForm();

    const roleOptions = [
        { value: 'admin', label: 'Admin' },
        { value: 'it', label: 'IT' },
        { value: 'user', label: 'User' },
    ];

    const permissionOptions = [
        { value: 'manage_users', label: 'Manage Users' },
        { value: 'create_tickets', label: 'Create Tickets' },
    ];

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await FetchUsers();
            setUsers(response.users.map(user => ({ ...user, key: user._id })));
        } catch (error) {
            message.error('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (values) => {
        try {
            setLoading(true);
            await EditUser(values);
            message.success('User updated successfully.');
            setEditModalVisible(false);
            fetchUsers();
        } catch (error) {
            message.error('Failed to update user.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (email) => {
        try {
            setLoading(true);
            await DeleteUser({email});
            message.success('User deleted successfully.');
            fetchUsers();
        } catch (error) {
            message.error('Failed to delete user.');
        } finally {
            setLoading(false);
        }
    };

    const showDeleteConfirm = (user) => {
        confirm({
            title: 'Are you sure you want to delete this user?',
            content: `User: ${user.name}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                handleDelete(user.email);
            },
        });
    };

    const showEditModal = (user) => {
        setCurrentUser(user);
        editForm.setFieldsValue(user);
        setEditModalVisible(true);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Employee ID',
            dataIndex: 'employeeID',
            key: 'employeeID',
        },
        {
            title: 'Permissions',
            dataIndex: 'permissions',
            key: 'permissions',
            ellipsis: {
                showTitle: false,
            },
            render: (permissions) => (
                <Tooltip placement="topLeft" title={permissions.join(', ')}>
                    {permissions.join(', ')}
                </Tooltip>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (user) => (
                <>
                    <Button type="link" onClick={() => showEditModal(user)}>Edit</Button>
                    <Button type="link" danger onClick={() => showDeleteConfirm(user)}>Delete</Button>
                </>
            ),
        },
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <>
            <Table
                columns={columns}
                dataSource={users}
                loading={loading}
                pagination={{ position: ['topRight'] }}
            />
            <Modal
                title="Edit User"
                visible={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleEdit}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter the name' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select a role' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a role"
                            options={roleOptions}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        label="Employee ID"
                        name="employeeID"
                        rules={[{ required: true, message: 'Please enter employee ID' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Permissions"
                        name="permissions"
                        rules={[{ required: true, message: 'Please select user permissions' }]}
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            style={{
                                width: '100%',
                            }}
                            placeholder="Select user permissions"
                            options={permissionOptions}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ListUsers;

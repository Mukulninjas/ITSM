import { Button, Form, Input, message, Select } from 'antd';
import React from 'react';
import { CreateUser } from '../api/admin';

const CreateUsers = () => {
    const roleOptions = [
        { value: 'admin', label: 'Admin' },
        { value: 'it', label: 'IT' },
        { value: 'user', label: 'User' },
    ];

    const permissionOptions = [
        { value: 'manage_users', label: 'Manage Users' },
        { value: 'create_tickets', label: 'Create Tickets' },
    ];

    const onFinish = async (values) => {
        try {
            console.log('Form Submitted:', values);
            const response = await CreateUser(values);
            console.log("Create user  Response : ", response);
            message.success('User created successfully!');
        } catch (error) {
            message.error(error.message || 'Failed to create user!');
        }
    };

    return (
        <div>
            <Form
                name="createUserForm"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter user name' }]}
                >
                    <Input placeholder="Enter User Name" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' },
                    ]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password' }]}
                >
                    <Input.Password placeholder="Enter your password" />
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
                    <Input placeholder="Enter Employee ID" />
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
                    <Button type="primary" htmlType="submit" className="auth-button">
                        Create User
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateUsers;

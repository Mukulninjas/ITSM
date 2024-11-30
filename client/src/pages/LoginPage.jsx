import React from 'react';
import { Anchor, Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LoginUser } from '../api/users';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import AuthLayout from '../layouts/AuthLayout';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onFinish = async (values) => {
        try {
            const response = await LoginUser(values);
            console.log("Login Response : ", response);
            dispatch(login(response.token));
            navigate("/");
        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <AuthLayout title="Welcome Back !!!">            
            <Form
                name="loginForm"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="on"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please enter your Email" },
                        { type: "email", message: "Please enter a valid email" },
                    ]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please enter your password" }]}
                >
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>

                <Anchor items={[{key: 'forgot-password',href: '/forgot-password',title: 'Forgot Password ?'}]} />

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="auth-button">
                        Log In
                    </Button>
                </Form.Item>
            </Form>
        </AuthLayout>
    );
};

export default LoginPage;

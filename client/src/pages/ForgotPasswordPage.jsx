import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ForgotPassword } from '../api/users';
import { Button, Form, Input } from 'antd';
import AuthLayout from '../layouts/AuthLayout';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await ForgotPassword(values);
            console.log("Forgot Password Response : ", response);
            navigate("/login");
        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <AuthLayout title="Forgot Password">
        <Form
            name="forgotPasswordForm"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="on"
            layout="vertical"
        >
            <Form.Item
                label="Email"
                htmlFor="email"
                name="email"
                rules={[
                    { required: true, message: "Please enter your Email" },
                    { type: "email", message: "Please enter a valid email" }
                ]}
            >
                <Input id="email" type="text" placeholder="Enter your email" />
            </Form.Item>

            <Form.Item label={null}>
                <Button type="primary" htmlType="submit" style={{ fontSize: "1rem", fontWeight: "600" }}>
                    Submit
                </Button>
            </Form.Item>
        </Form>
        </AuthLayout>
    )
}

export default ForgotPasswordPage;
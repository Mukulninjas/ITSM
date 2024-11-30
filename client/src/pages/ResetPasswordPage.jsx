import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ResetPassword } from '../api/users';
import { Button, Form, Input, message } from 'antd';
import AuthLayout from '../layouts/AuthLayout';

const ResetPasswordPage = () => {
    const { email, token } = useParams();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();


    const onFinish = async (values) => {
        try {
            const payload = { ...values, email, token };
            const response = await ResetPassword(payload);
            console.log("Reset Password Response : ", response);
            navigate("/login");
        } catch (error) {
            console.log(error);
            messageApi.open({
                type: 'error',
                content: 'Invalid token or username',
              });
        }
    };

    return (
        <AuthLayout title="Reset Password">
            {contextHolder}
            <Form
                name="resetPasswordForm"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="on"
            >
                <Form.Item
                    label="Password"
                    htmlFor="password"
                    name="password"
                    rules={[
                        { required: true, message: "Please enter your password" },
                    ]}
                >
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                    />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    htmlFor="confirmPassword"
                    name="confirmPassword"
                    className="d-block"
                    rules={[
                        { required: true, message: "Please enter your confirm password" },
                    ]}
                >
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Enter your confirm password"
                    />
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

export default ResetPasswordPage;
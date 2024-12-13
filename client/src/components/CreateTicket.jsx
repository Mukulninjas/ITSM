import { Button, Form, Input, message } from 'antd';
import { Ticket } from '../api/users';
import Dragger from 'antd/es/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import TextEditor from './TextEditor';
import { useState } from 'react';

const CreateTicket = () => {

    const [form] = Form.useForm();
    const [description, setDescription] = useState([{ type: 'paragraph', children: [{ text: '' }] }]);
    const [fileList, setFileList] = useState([]);

    const uploadProps = {
        name: 'file',
        multiple: true,
        beforeUpload: (file) => {
            setFileList((prev) => [...prev, file]);
            return false;
        },
        onRemove: (file) => {
            setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
        },
    };

    const onFinish = async (values) => {
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', JSON.stringify(description));

            fileList.forEach((file) => {
                formData.append('files', file);
            });

            const response = await Ticket(formData);
            form.resetFields();
            setDescription([{ type: 'paragraph', children: [{ text: '' }] }]);
            message.success(response.message);
        } catch (err) {
            message.error('Failed to create ticket');
            console.error(err);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ description }}
        >
            <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: 'Please enter the title' }]}
            >
                <Input placeholder="Enter your Title" />
            </Form.Item>

            <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter the description' }]}
            >
                <TextEditor description={description} setDescription={setDescription} />
            </Form.Item>

            <Form.Item
                label="Attachments"
                valuePropName="fileList"
            >
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for single or bulk upload. Strictly prohibited from uploading
                        company data or other banned files.
                    </p>
                </Dragger>
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    block
                    htmlType="submit"
                    style={{ fontSize: '1rem', fontWeight: 600 }}
                >
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateTicket;
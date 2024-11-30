import { Button, Form, Input } from 'antd';
import { Ticket } from '../api/users';
import Dragger from 'antd/es/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import TextEditor from './TextEditor';
import { useState } from 'react';

const CreateTicket = () => {
    const [description, setDescription] = useState('');

    const props = {
        name: 'file',
        multiple: true,
        action: '',
        onChange(info) {
          const { status } = info.file;
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
          } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
        onDrop(e) {
          console.log('Dropped files', e.dataTransfer.files);
        },
      };

    const onFinish = async (values) => {
        try {
            const response = await Ticket(values);
            console.log("Ticket Creation Response : ", response);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Title"
                    htmlFor="title"
                    name="title"
                    rules={[{ required: true, message: "Please enter the title" }]}
                >
                    <Input id="title" type="text" placeholder="Enter your Title" />
                </Form.Item>
                <Form.Item
                    label="Description"
                    htmlFor="description"
                    name="description"
                >
                    <TextEditor value={description} onChange={setDescription} />
                </Form.Item>
                <Dragger {...props} style={{ margin: "10px 0px" }}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files.
                    </p>
                </Dragger>
                <Form.Item>
                    <Button
                        type="primary"
                        block
                        htmlType="submit"
                        style={{ fontSize: "1rem", fontWeight: "600" }}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default CreateTicket;
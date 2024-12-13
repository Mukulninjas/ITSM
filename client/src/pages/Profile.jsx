import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Avatar, Typography, Row, Col, Modal, Button } from 'antd';
import { UploadProfileImage } from '../api/users';

const { Title, Text } = Typography;

const Profile = () => {

    const { email, name, role, profileImage, employeeID } = useSelector((state) => state.auth);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleAvatarClick = () => {
        if (profileImage) {
            setIsModalVisible(true);
        } else {
            handleUploadClick();
        }
    };

    const handleUploadClick = () => {
        document.getElementById('profile-upload-input').click();
    };

    const handleUpload = async ({ file }) => {
        console.log('Upload clicked', file);
        const formData = new FormData();
        formData.append('image', file);

        const response = await UploadProfileImage(formData);
        console.log('Upload response', response);
    };

    return (
        <Row justify="center" align="middle" style={{ height: '100%', background: '#f0f2f5' }}>
            <Col xs={22} sm={16} md={12} lg={10} xl={8}>
                <Card
                    bordered={false}
                    style={{
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        borderRadius: '10px',
                        background: 'linear-gradient(to right, #ffffff, #f8f9fa)',
                        textAlign: 'center',
                    }}
                >
                    <Avatar
                        onClick={handleAvatarClick}
                        src={profileImage || null}
                        size={100}
                        style={{
                            backgroundColor: profileImage ? undefined : '#87d068',
                            fontSize: 36,
                        }}
                    >
                        {!profileImage && name.split(' ').map((part) => part[0]).join('').toUpperCase()}
                    </Avatar>

                    <input
                        id="profile-upload-input"
                        type="file"
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={(e) => handleUpload({ file: e.target.files[0] })}
                    />

                    <Title level={3} style={{ marginBottom: 0 }}>
                        {name}
                    </Title>

                    <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <Text>
                                    <strong>Email:</strong>
                                </Text>
                            </Col>
                            <Col span={16}>
                                <Text>{email}</Text>
                            </Col>
                            <Col span={8}>
                                <Text>
                                    <strong>Role:</strong>
                                </Text>
                            </Col>
                            <Col span={16}>
                                <Text>{role}</Text>
                            </Col>
                            <Col span={8}>
                                <Text>
                                    <strong>Employee Id:</strong>
                                </Text>
                            </Col>
                            <Col span={16}>
                                <Text>{employeeID}</Text>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Col>

            <Modal
                title="Profile Image"
                open={isModalVisible}
                onOk={() => setIsModalVisible(false)}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="upload" onClick={handleUploadClick}>
                        Change Image
                    </Button>,
                    <Button key="close" type="primary" onClick={() => setIsModalVisible(false)}>
                        Close
                    </Button>
                ]}
            >
                <img
                    src={profileImage}
                    alt="Profile"
                    style={{ width: '100%', borderRadius: '10px' }}
                />
            </Modal>
        </Row>
    );
};

export default Profile;
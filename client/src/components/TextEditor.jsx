import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EmojiPicker from 'emoji-picker-react';
import { Button, Dropdown, Space } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

const TextEditor = ({ value, onChange }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleEmojiClick = (emojiObject) => {
        const quill = document.querySelector('.ql-editor');
        const cursorPosition = quill.selectionStart || quill.innerText.length;
        const text = quill.innerText.substring(0, cursorPosition) + emojiObject.emoji + quill.innerText.substring(cursorPosition);
        quill.innerText = text;
        setShowEmojiPicker(false);
    };

    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['blockquote', 'code-block'],
                ['link', 'image'],
                ['clean'], // Clear formatting
                ['emoji'], // Emoji button
            ],
            handlers: {
                emoji: () => setShowEmojiPicker((prev) => !prev),
            },
        },
    };

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'bullet',
        'blockquote',
        'link',
        'image',
        'emoji',
    ];

    return (
        <div className="custom-editor">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder="Start writing your description here..."
                style={{ height: '300px', marginBottom: '1rem' }}
            />
            {showEmojiPicker && (
                <Dropdown
                    overlay={
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    }
                    trigger={['click']}
                >
                    <Button icon={<SmileOutlined />} />
                </Dropdown>
            )}
        </div>
    );
};

export default TextEditor;

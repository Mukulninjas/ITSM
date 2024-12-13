import React, { useState } from 'react';
import { useSlate } from 'slate-react';
import { Popover, Tooltip } from 'antd';
import {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    StrikethroughOutlined,
    CodeOutlined,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    BgColorsOutlined,
    FontColorsOutlined,
    UnorderedListOutlined,
    OrderedListOutlined,
    ReadOutlined,
} from '@ant-design/icons';
import { Editor, Transforms, Element as SlateElement } from 'slate';

export const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

export const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: (n) => n.type === format,
    });
    return !!match;
};
export const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format);
    const isList = ['unordered-list', 'ordered-list'].includes(format);

    Transforms.unwrapNodes(editor, {
        match: (n) =>
            SlateElement.isElement(n) &&
            ['unordered-list', 'ordered-list'].includes(n.type),
        split: true,
    });

    const newType = isActive ? 'paragraph' : isList ? 'list-item' : format;

    Transforms.setNodes(editor, { type: newType });

    if (!isActive && isList) {
        const block = { type: format, children: [] };
        Transforms.wrapNodes(editor, block);
    }
};

export const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
};

const Toolbar = () => {
    const editor = useSlate();
    const [fontColor, setFontColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');

    const applyColor = (type, color) => {
        Editor.addMark(editor, type, color);
    };

    const createButton = (format, IconComponent, tooltipText, isMark = true) => {
        const isActive = isMark
            ? isMarkActive(editor, format)
            : isBlockActive(editor, format);

        return (
            <Tooltip placement="top" title={tooltipText}>
                <button
                    style={{
                        background: isActive ? '#ddd' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                    }}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        isMark ? toggleMark(editor, format) : toggleBlock(editor, format);
                    }}
                >
                    <IconComponent style={{ fontSize: '18px', color: isActive ? '#1890ff' : 'black' }} />
                </button>
            </Tooltip>
        );
    };

    const renderColorPicker = (type, IconComponent, tooltipText, color, setColor) => (
        <Popover
            content={
                <div>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => {
                            const newColor = e.target.value;
                            setColor(newColor);
                            applyColor(type, newColor);
                        }}
                        style={{ border: 'none', padding: '5px', cursor: 'pointer' }}
                    />
                    <p>{tooltipText}</p>
                </div>
            }
            trigger="hover"
        >
            <button
                style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                }}
            >
                <IconComponent style={{ fontSize: '18px', color: color }} />
            </button>
        </Popover>
    );

    return (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            {/* Mark buttons */}
            {createButton('bold', BoldOutlined, 'Bold')}
            {createButton('italic', ItalicOutlined, 'Italic')}
            {createButton('underline', UnderlineOutlined, 'Underline')}
            {createButton('stroke', StrikethroughOutlined, 'Strikethrough')}
            {createButton('code', CodeOutlined, 'Code')}

            {/* Color pickers */}
            {renderColorPicker('color', FontColorsOutlined, 'Font Color', fontColor, setFontColor)}
            {renderColorPicker('backgroundColor', BgColorsOutlined, 'Background Color', bgColor, setBgColor)}


            {/* Alignment buttons */}
            {createButton('left-align', AlignLeftOutlined, 'Left Align', false)}
            {createButton('center-align', AlignCenterOutlined, 'Center Align', false)}
            {createButton('right-align', AlignRightOutlined, 'Right Align', false)}

            {/* Block buttons */}
            {createButton('quote', ReadOutlined, 'Quote', false)}
            {createButton('unordered-list', UnorderedListOutlined, 'Unordered List', false)}
            {createButton('ordered-list', OrderedListOutlined, 'Ordered List', false)}
        </div>
    );
};

export default Toolbar;

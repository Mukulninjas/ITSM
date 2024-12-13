import React, { useMemo, useCallback, useRef, useEffect, useState, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Editor, Transforms, Range, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, Editable, ReactEditor, withReact, useSelected, useFocused } from 'slate-react';
import { IS_MAC } from '../utils/environment';
import Toolbar, { toggleMark, toggleBlock } from './Toolbar';

const TextEditor = ({description, setDescription}) => {

  const ref = useRef();
  const [target, setTarget] = useState();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  const Portal = ({ children }) => {
    return typeof document === 'object'
      ? ReactDOM.createPortal(children, document.body)
      : null
  }

  const editor = useMemo(
    () => withMentions(withReact(withHistory(createEditor()))),
    []
  );

  const chars = CHARACTERS.filter(c =>
    c.toLowerCase().startsWith(search.toLowerCase())
  ).slice(0, 10)

  const onKeyDown = useCallback(
    (event) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case 'b':
            event.preventDefault();
            toggleMark(editor, 'bold');
            break;
          case 'i':
            event.preventDefault();
            toggleMark(editor, 'italic');
            break;
          case 'u':
            event.preventDefault();
            toggleMark(editor, 'underline');
            break;
        }
      }

      if (target && chars.length > 0) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            const prevIndex = index >= chars.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case 'ArrowUp':
            event.preventDefault();
            const nextIndex = index <= 0 ? chars.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case 'Tab':
          case 'Enter':
            event.preventDefault();
            Transforms.select(editor, target);
            insertMention(editor, chars[index]);
            setTarget(null);
            break;
          case 'Escape':
            event.preventDefault();
            setTarget(null);
            break;
        }
      }
    },
    [chars, editor, index, target]
  );

  useEffect(() => {
    if (target && chars.length > 0) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.pageYOffset + 24}px`;
      el.style.left = `${rect.left + window.pageXOffset}px`;
    }
  }, [chars.length, editor, index, search, target]);

  return (
    <Slate
      editor={editor}
      initialValue={description}
      onChange={(data) => {
        setDescription(data);
        const { selection } = editor;
        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection);
          const wordBefore = Editor.before(editor, start, { unit: 'word' });
          const before = wordBefore && Editor.before(editor, wordBefore);
          const beforeRange = before && Editor.range(editor, before, start);
          const beforeText = beforeRange && Editor.string(editor, beforeRange);
          const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
          const after = Editor.after(editor, start);
          const afterRange = Editor.range(editor, start, after);
          const afterText = Editor.string(editor, afterRange);
          const afterMatch = afterText.match(/^(\s|$)/);
          if (beforeMatch && afterMatch) {
            setTarget(beforeRange);
            setSearch(beforeMatch[1]);
            setIndex(0);
            return;
          }
        }
        setTarget(null);
      }}
    >
      <div>
        <Toolbar />
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDown}
          placeholder="Enter some text..."
        />
      </div>
      {target && chars.length > 0 && (
        <Portal>
          <div
            ref={ref}
            style={{
              top: '-9999px',
              left: '-9999px',
              position: 'absolute',
              zIndex: 1,
              padding: '3px',
              background: 'white',
              borderRadius: '4px',
              boxShadow: '0 1px 5px rgba(0,0,0,.2)',
            }}
            data-cy="mentions-portal"
          >
            {chars.map((char, i) => (
              <div
                key={char}
                onClick={() => {
                  Transforms.select(editor, target);
                  insertMention(editor, char);
                  setTarget(null);
                }}
                style={{
                  padding: '1px 3px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  background: i === index ? '#B4D5FF' : 'transparent',
                }}
              >
                {char}
              </div>
            ))}
          </div>
        </Portal>
      )}
    </Slate>
  );
};

const withMentions = editor => {
  const { isInline, isVoid, markableVoid } = editor
  editor.isInline = element => {
    return element.type === 'mention' ? true : isInline(element)
  }
  editor.isVoid = element => {
    return element.type === 'mention' ? true : isVoid(element)
  }
  editor.markableVoid = element => {
    return element.type === 'mention' || markableVoid(element)
  }
  return editor
}

const insertMention = (editor, character) => {
  const mention = {
    type: 'mention',
    character,
    children: [{ text: '' }],
  }
  Transforms.insertNodes(editor, mention)
  Transforms.move(editor)
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }
  if (leaf.italic) {
    children = <em>{children}</em>
  }
  if (leaf.underline) {
    children = <u>{children}</u>
  }
  if (leaf.stroke) {
    children = <span style={{ textDecoration: 'line-through' }}>{children}</span>;
  }
  if (leaf.code) {
    children = <code>{children}</code>;
  }
  if (leaf.fontFamily) {
    children = <span style={{ fontFamily: leaf.fontFamily }}>{children}</span>;
  }
  if (leaf.color) {
    children = <span style={{ color: leaf.color }}>{children}</span>;
  }
  if (leaf.backgroundColor) {
    children = <span style={{ backgroundColor: leaf.backgroundColor }}>{children}</span>;
  }
  return <span {...attributes}>{children}</span>
}

const Element = props => {
  const { attributes, children, element } = props
  switch (element.type) {
    case 'mention':
      return <Mention {...props} />
    case 'quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'unordered-list':
      return <ul {...attributes}>{children}</ul>;
    case 'ordered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'left-align':
      return <p style={{ textAlign: 'left' }} {...attributes}>{children}</p>;
    case 'center-align':
      return <p style={{ textAlign: 'center' }} {...attributes}>{children}</p>;
    case 'right-align':
      return <p style={{ textAlign: 'right' }} {...attributes}>{children}</p>;
    case 'justify-align':
      return <p style={{ textAlign: 'justify' }} {...attributes}>{children}</p>;
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Mention = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  const style = {
    padding: '3px 3px 2px',
    margin: '0 1px',
    verticalAlign: 'baseline',
    display: 'inline-block',
    borderRadius: '4px',
    backgroundColor: '#eee',
    fontSize: '0.9em',
    boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
  }
  if (element.children[0].bold) {
    style.fontWeight = 'bold'
  }
  if (element.children[0].italic) {
    style.fontStyle = 'italic'
  }
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.character.replace(' ', '-')}`}
      style={style}
    >
      <div contentEditable={false}>
        {IS_MAC ? (
          <Fragment>
            {children}@{element.character}
          </Fragment>
        ) : (
          <Fragment>
            @{element.character}
            {children}
          </Fragment>
        )}
      </div>
    </span>
  )
}

const CHARACTERS = [
  'Aayla Secura',
  'Adi Gallia',
  'Admiral Dodd Rancit',
  'Admiral Firmus Piett',
  'Admiral Gial Ackbar',
  'Admiral Ozzel',
  'Admiral Raddus'
]
export default TextEditor;
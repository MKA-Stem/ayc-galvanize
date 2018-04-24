import React from 'react';
import {Input} from 'antd';

const TextArea = ({value, onChange}) => (
  <Input.TextArea
    rows={9}
    value={value.text}
    onChange={e => onChange({_type: 'text', text: e.target.value})}
  />
);

export default TextArea;

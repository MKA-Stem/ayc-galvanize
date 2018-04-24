import React from 'react';
import {Input} from 'antd';

const TextArea = ({value, onChange, ...rest}) => (
  <Input.TextArea
    rows={9}
    value={value.text}
    onChange={e => onChange({_type: 'text', text: e.target.value})}
    {...rest}
  />
);

export default TextArea;

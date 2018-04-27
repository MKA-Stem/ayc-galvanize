import React from 'react';
import {Input, Icon} from 'antd';
import {phoneFormat, deFormat} from 'lib/formats.js';

const PhoneNumber = ({value, onChange, ...rest}) => (
  <Input
    prefix={<Icon type="mobile" style={{color: 'rgba(0,0,0,.25)'}} />}
    maxLength={14}
    pattern={"[0-9]*"} inputmode={"numeric"}
    onChange={e => onChange(deFormat(e.target.value))}
    value={phoneFormat(value)}
    {...rest}
  />
);

export default PhoneNumber;

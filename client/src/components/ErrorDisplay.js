import React from 'react';
import {Icon} from 'antd';
import Center from 'components/Center.js';
import './ErrorDisplay.css';

const ErrorDisplay = ({err}) => (
  <div className="ErrorDisplay">
    <Center>
      <Icon type="warning" style={{fontSize: 75}} />
    </Center>
    <h3>{err.display}</h3>
  </div>
);

export default ErrorDisplay;

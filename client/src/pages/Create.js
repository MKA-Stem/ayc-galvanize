import React from 'react';
import {withRouter} from 'react-router-dom';
import Stepper from 'components/Stepper.js'
import 'antd/dist/antd.css';
import { Steps, Button, message } from 'antd';
const Step = Steps.Step;


const MainPage = ({history}) => (
  <div className="MainPage">
    <Stepper/>
  </div>
);
export default withRouter(MainPage);

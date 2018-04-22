import React, {Component} from 'react';
import {Tabs, Input} from 'antd';

import './App.css';

import { Steps, Button, message } from 'antd';

const Step = Steps.Step;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;

function callback(key){
  console.log(key);
}

const steps = [{
  title: 'First',
  content: <Tabs defaultActiveKey="1" onChange={callback}>
    <TabPane tab="Message" key="1">
      <TextArea rows={4} />
    </TabPane>
    <TabPane tab="Credit Card" key="2">

    </TabPane>
  </Tabs>,
}, {
  title: 'Second',
  content: <Input placeholder="#" />,
}, {
  title: 'Last',
  content: 'Send this link to the recipient',
}];

class Stepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  render() {
    const { current } = this.state;
    return (
      <div>
        <Steps current={current}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">{steps[this.state.current].content}</div>
        <div className="steps-action">
          {
            this.state.current < steps.length - 1
            &&
            <Button type="primary" onClick={() => this.next()}>Next</Button>
          }
          {
            this.state.current === steps.length - 1
            &&
            <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
          }
          {
            this.state.current > 0
            &&
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              Previous
            </Button>
          }
        </div>
      </div>
    );
  }
}

export default Stepper;

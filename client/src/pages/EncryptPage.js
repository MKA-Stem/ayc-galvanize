import React, {Component} from 'react';
import {Tabs, Input} from 'antd';
import './EncryptPage.css';
import request from 'lib/http.js';

import { Steps, Button, message } from 'antd';

const Step = Steps.Step;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;

function callback(key){
  console.log(key);
}

function copy(){
  var copyText = document.getElementById("link");

  copyText.select();

  document.execCommand("Copy");

  message.success('Copied to clipboard!')
}

const steps = [{
  title: 'First',
  content: <div className="stepitem"><Tabs defaultActiveKey="1" onChange={callback}>
    <TabPane tab="Message" key="1">
      <TextArea rows={4} />
    </TabPane>
    <TabPane tab="Credit Card" key="2">

    </TabPane>
  </Tabs></div>,
}, {
  title: 'Second',
  content: <div className="stepitem"><Input placeholder="#" ref={el => (this.codeInput = el)}/></div>,
}, {
  title: 'Last',
  content: <div className="stepitem"><Input id="link" defaultValue="123" ref={el => (this.codeInput = el)}/></div>,
}];

class EncryptPage extends React.Component {
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
  async send() {
    console.log("hi");
    console.log(this.codeInput.input.value);
    // const resp = await request('newMessage', {phone: this.state.value()});
    this.next()
  }
  render() {
    const { current } = this.state;
    return (
      <div>
        <h1>Encrypt something</h1>
        <Steps current={current} size="small">
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">{steps[this.state.current].content}</div>
        <div className="steps-action">
          {
            this.state.current === 0
            &&
            <Button type="primary" onClick={() => this.next()}>Next</Button>
          }
          {
            this.state.current === 1
            &&
            <Button type="primary" onClick={() => this.send(this)}>Next</Button>
          }
          {
            this.state.current === steps.length - 1
            &&
            <Button type="primary" onClick={() => this.copy()}>Done</Button>
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

export default EncryptPage;

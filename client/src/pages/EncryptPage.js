import React from 'react';
import LoadingSpinner from 'components/LoadingSpinner.js';
import {Button, Icon, Input, message, Steps, Tabs} from 'antd';
import Center from 'components/Center.js';
import request from 'lib/http.js';
import './FlowPage.css';
import {encrypt, genKey, hash} from 'lib/cryptography.js';
import CreditCard from 'components/CreditCard.js';
import PhoneNumber from 'components/PhoneNumber.js';
import TextArea from 'components/TextArea.js';

const TabPane = Tabs.TabPane;

class EncryptPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'write', // one of 'loading', 'write', 'phone', 'link'
      msg: {_type: 'text'}, // Message to encrypt
      hash: '', // Hash of encryption key
      cyphertext: '' // Encrypted text.
    };
  }

  doneWriting() {
    this.setState({status: 'phone'});
    if (this.state._type === 'cc') {
      this.setState({text: JSON.stringify(this.state.card)});
    }
    console.log(this.state);
  }

  async encrypt() {
    const {msg, phone} = this.state;
    const text = JSON.stringify(msg);
    this.setState({status: 'loading'});
    const key = genKey(); // Generate a key
    const keyHash = hash(key); // hash it
    const cyphertext = encrypt(text, key); // Encrypt things
    await request('newMessage', {phone, key});
    this.setState({status: 'link', hash: keyHash, cyphertext});

    console.log('Encrypted message:', {
      msg,
      phone,
      text,
      key,
      keyHash,
      cyphertext
    });
  }

  render() {
    const {status, msg, phone, cyphertext, hash} = this.state;
    let [body, foot] = [null, null];

    if (status === 'loading') {
      body = (
        <div className="FlowPage_spinner">
          <LoadingSpinner />
        </div>
      );
    } else if (status === 'write') {
      const next = this.doneWriting.bind(this);

      body = (
        <div>
          <Tabs
            defaultActiveKey={this.state.msg._type}
            size="small"
            onChange={key => {
              this.setState({msg: {_type: key}});
            }}
          >
            <TabPane tab="Message" key="text">
              <TextArea
                value={msg}
                onChange={msg => this.setState({msg})}
                onPressEnter={next}
                autoFocus
              />
            </TabPane>
            <TabPane tab="Credit Card" key="cc">
              <CreditCard onChange={e => this.setState({msg: e})} value={msg} />
            </TabPane>
          </Tabs>
        </div>
      );
      foot = (
        <Button type="primary" onClick={next}>
          Next
        </Button>
      );
    } else if (status === 'phone') {
      const next = this.encrypt.bind(this);
      body = (
        <div>
          <p>Enter the recipient's phone number for security:</p>
          <PhoneNumber
            value={phone}
            onChange={phone => this.setState({phone})}
            onPressEnter={next}
            autoFocus
          />
        </div>
      );
      foot = (
        <Button type="primary" onClick={next}>
          Encrypt Message
        </Button>
      );
    } else if (status === 'link') {
      const link = `http://${document.location.host}/d/${cyphertext}.${hash}`;
      body = (
        <div>
          <p>Send this link:</p>
          <Input onChange={e => null} value={link} id="linkCopyInput" />
          <Center className="FlowPage_mtop">
            <Button
              type="primary"
              size="large"
              onClick={() => {
                const el = document.querySelector('#linkCopyInput');
                el.select();
                document.execCommand('copy');
                message.success('Copied to clipboard!');
              }}
            >
              Copy
            </Button>
          </Center>
        </div>
      );
    }

    let current = {
      write: 0,
      phone: 1,
      link: 2
    }[status];

    return (
      <div className="FlowPage">
        <h2>Encrypt a Message</h2>
        <Steps current={current} size="small">
          <Steps.Step title="Write Message" icon={<Icon type="form" />} />
          <Steps.Step title="Enter Phone #" icon={<Icon type="mobile" />} />
          <Steps.Step title="Send Link" icon={<Icon type="link" />} />
        </Steps>
        <div className="FlowPage_body">{body}</div>
        <div className="FlowPage_foot">{foot}</div>
      </div>
    );
  }
}

export default EncryptPage;

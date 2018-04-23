import React from 'react';
import LoadingSpinner from 'components/LoadingSpinner.js';
import {Steps, Button, message, Input, Icon, Tabs, Form} from 'antd';
import request from 'lib/http.js';
import './EncryptPage.css';
import {encrypt, decrypt, genKey, hash} from 'lib/cryptography.js';
import {deFormat, phoneFormat, cardFormat} from 'lib/formats.js';

const TabPane = Tabs.TabPane;

class EncryptPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'write', // one of 'loading', 'write', 'phone', 'link'
      text: '', // text to encrypt
      hash: '', // Hash of encryption key
      cyphertext: '' // Encrypted text.
    };
  }

  doneWriting() {
    this.setState({status: 'phone'});
    console.log(this.state.text);
  }

  async encrypt() {
    const {text, phone} = this.state;
    console.log(phone);
    this.setState({status: 'loading'});
    const key = genKey(); // Generate a key
    const keyHash = hash(key); // hash it
    const cyphertext = encrypt(text, key); // Encrypt things
    const resp = await request('newMessage', {phone, key});
    this.setState({status: 'link', hash: keyHash, cyphertext});
    console.log(this.state);
  }


  render() {
    const {status, phone, code, key} = this.state;
    let body = null;


    const Center = ({children}) => <div className="DecryptPage_center">{children}</div>;

    if (status === 'loading') {
      body = (
        <div className="DecryptPage_spinner">
          <LoadingSpinner />
        </div>
      );
    } else if (status === 'write') {
      body = (

        <div>
          <Tabs defaultActiveKey="1" onChange={e => {this.setState({text: ''});
          }}>
            <TabPane tab="Message" key="1"><Input.TextArea rows={10} onChange={e => this.setState({text: e.target.value})}
            value={this.state.text}
            /></TabPane>
            <TabPane tab="Credit Card" disabled key="2">
              <Form>
                <Form.Item>
                  <Input prefix={<Icon type="credit-card" style={{ color: 'rgba(0,0,0,.25)' }} />}
                         placeholder={'0000 0000 0000 0000'} maxLength={19}
                         onChange={e => this.setState({text: deFormat(e.target.value)})} value={cardFormat(this.state.text)}
                  />
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
          <div className="EncryptPage_vpad">
            <Button onClick={this.doneWriting.bind(this)}>Next</Button>
          </div>
        </div>
      );
    } else if (status === 'phone') {
      body = (
        <div>
          <p>Enter the recipient's phone number for security:</p>
          <Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                 maxLength={14}
                 onChange={e => this.setState({phone: deFormat(e.target.value)})} value={phoneFormat(this.state.phone)}
          />
          <div className="EncryptPage_vpad">
            <Button onClick={this.encrypt.bind(this)}>Encrypt Message</Button>
          </div>
        </div>
      );
    } else if (status === 'link') {
      const {cyphertext, hash} = this.state;
      const link = `http://${document.location.host}/d/${cyphertext}.${hash}`;
      body = (
        <div>
          <p>Send this link:</p>
          <Input onChange={e => null} value={link} id="linkCopyInput" />
          <div className="EncryptPage_vpad">
            <Button
              onClick={() => {
                const el = document.querySelector('#linkCopyInput');
                el.select();
                document.execCommand('copy');
                message.success('Copied to clipboard!');
              }}
            >
              Copy
            </Button>
          </div>
        </div>
      );
    }

    let current = null;
    if (status === 'write') {
      current = 0;
    }
    if (status === 'phone') {
      current = 1;
    }
    if (status === 'link') {
      current = 2;
    }

    return (
      <div className="DecryptPage">
        <h2>Encrypt a Message</h2>
        <Steps current={current} size="small">
          <Steps.Step title="Write Message" icon={<Icon type="form" />}/>
          <Steps.Step title="Enter Phone #" icon={<Icon type="mobile" />}/>
          <Steps.Step title="Send Link" icon={<Icon type="link" />}/>
        </Steps>
        <div className="DecryptPage_body">{body}</div>
      </div>
    );
  }
}

export default EncryptPage;

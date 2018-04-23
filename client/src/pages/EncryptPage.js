import React from 'react';
import LoadingSpinner from 'components/LoadingSpinner.js';
import {Button, DatePicker, Icon, Input, message, Steps, Tabs, Form, Col} from 'antd';
import request from 'lib/http.js';
import './EncryptPage.css';
import {decrypt, encrypt, genKey, hash} from 'lib/cryptography.js';
import {cardFormat, deFormat, phoneFormat} from 'lib/formats.js';
import moment from 'moment';

const TabPane = Tabs.TabPane;

class EncryptPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      status: 'write', // one of 'loading', 'write', 'phone', 'link'
      text: '', // text to encrypt
      card: { // card to encrypt
        name: '',
        number: '',
        cv: '',
        expire: ''
      },
      hash: '', // Hash of encryption key
      cyphertext: '' // Encrypted text.
    };
  }

  doneWriting(){
    this.setState({status: 'phone'});
    console.log(this.state);
  }

  async encrypt(){
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


  render(){
    const {status, phone, code, key} = this.state;
    let body = null;

    function disabledDate(current){
      return current && current < moment().endOf('month');
    }

    const Center = ({children}) => <div className="DecryptPage_center">{children}</div>;

    if(status === 'loading'){
      body = (
        <div className="DecryptPage_spinner">
          <LoadingSpinner/>
        </div>
      );
    } else if(status === 'write'){
      body = (
        <div>
          <Tabs defaultActiveKey="1" onChange={e =>{
            this.setState({text: '', card: {name: '', number: '', cv: '', expire: ''}});
          }}>
            <TabPane tab="Message" key="1">
              <Input.TextArea rows={10}
                              onChange={e => this.setState({text: e.target.value})}
                              value={this.state.text}
              />
            </TabPane>
            <TabPane disabled tab="Credit Card" key="2">
              <Form>
                <Form.Item>
              <Input size={"large"} prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                     placeholder={'John Doe'}
                     onChange={e => this.setState({
                       card: {
                         number: this.state.card.number,
                         name: e.target.value,
                         expire: this.state.card.expire,
                         cv: this.state.card.cv
                       }
                     })}
                     value={this.state.card.name}
              />
                </Form.Item>
                <Form.Item>
              <Input size={"large"} prefix={<Icon type="credit-card" style={{color: 'rgba(0,0,0,.25)'}}/>}
                     placeholder={'0000 0000 0000 0000'} maxLength={19}
                     onChange={e => this.setState({
                       card: {
                         number: deFormat(e.target.value),
                         name: this.state.card.name,
                         expire: this.state.card.expire,
                         cv: this.state.card.cv
                       }
                     })}
                     value={cardFormat(this.state.card.number)}
              />
                </Form.Item>
                <Col span={14}>
                <Form.Item>
              <DatePicker.MonthPicker size={"large"} disabledDate={disabledDate} format={'MM/YY'} placeholder={'Expiration Date'}
                                      onChange={e => this.setState({
                                        card: {
                                          number: this.state.card.number,
                                          name: this.state.card.name,
                                          expire: e.format("MM/YY"),
                                          cv: this.state.card.cv
                                        }
                                      })}
                                      value={this.state.card.expire !== '' ? moment(this.state.card.expire) : ''}
              />
                </Form.Item>
                </Col>
                <Col span={10}>
              <Form.Item>
              <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder={'CVC'} maxLength={4} size={"large"}
                     onChange={e => this.setState({
                       card: {
                         number: this.state.card.name,
                         name: this.state.card.name,
                         expire: this.state.card.expire,
                         cv: e.target.value
                       }
                     })}
                     value={this.state.card.cv}/>
              </Form.Item>
                </Col>
              </Form>
            </TabPane>
          </Tabs>
          <div className="EncryptPage_vpad">
            <Button onClick={this.doneWriting.bind(this)}>Next</Button>
          </div>
        </div>
      );
    } else if(status === 'phone'){
      body = (
        <div>
          <p>Enter the recipient's phone number for security:</p>
          <Input prefix={<Icon type="mobile" style={{color: 'rgba(0,0,0,.25)'}}/>}
                 maxLength={14}
                 onChange={e => this.setState({phone: deFormat(e.target.value)})} value={phoneFormat(this.state.phone)}
          />
          <div className="EncryptPage_vpad">
            <Button onClick={this.encrypt.bind(this)}>Encrypt Message</Button>
          </div>
        </div>
      );
    } else if(status === 'link'){
      const {cyphertext, hash} = this.state;
      const link = `http://${document.location.host}/d/${cyphertext}.${hash}`;
      body = (
        <div>
          <p>Send this link:</p>
          <Input onChange={e => null} value={link} id="linkCopyInput"/>
          <div className="EncryptPage_vpad">
            <Button
              onClick={() =>{
                const el = document.querySelector('#linkCopyInput');
                el.select();
                document.execCommand('copy');
                message.success('Copied to clipboard!');
              }}>
              Copy
            </Button>
          </div>
        </div>
      );
    }

    let current = null;
    if(status === 'write'){
      current = 0;
    }
    if(status === 'phone'){
      current = 1;
    }
    if(status === 'link'){
      current = 2;
    }

    return (
      <div className="DecryptPage">
        <h2>Encrypt a Message</h2>
        <Steps current={current} size="small">
          <Steps.Step title="Write Message" icon={<Icon type="form"/>}/>
          <Steps.Step title="Enter Phone #" icon={<Icon type="mobile"/>}/>
          <Steps.Step title="Send Link" icon={<Icon type="link"/>}/>
        </Steps>
        <div className="DecryptPage_body">{body}</div>
      </div>
    );
  }
}

export default EncryptPage;

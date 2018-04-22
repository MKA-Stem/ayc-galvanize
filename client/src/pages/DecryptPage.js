import React from 'react';
import LoadingSpinner from 'components/LoadingSpinner.js';
import {Steps, Button, Input, Form} from 'antd';
import request from 'lib/http.js';
import {decrypt} from 'lib/cryptography.js';
import './DecryptPage.css';

class DecryptPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'loading', // one of 'loading', 'presend', 'sent', 'decrypt'
      phone: null, // Phone number.
      code: '', // 2fa auth code.
      key: '' // Encryption key for data
    };

    window.parseSlug = this.parseSlug.bind(this);
  }

  parseSlug() {
    const slug = this.props.match.params.slug;
    const [cyphertext, keyHash] = slug.split('.');

    return {cyphertext, keyHash};
  }

  componentDidMount() {
    this.getPhone();
  }

  async getPhone() {
    const resp = await request('getPhone', {hash: this.parseSlug().keyHash});
    this.setState({status: 'presend', phone: resp.phone});
  }

  async sendCode() {
    this.setState({status: 'loading'});
    const resp = await request('send2FA', {
      hash: this.parseSlug().keyHash
    });
    this.setState({status: 'sent'});
  }

  async decrypt() {
    this.setState({status: 'loading'});
    const resp = await request('verify2FA', {
      hash: this.parseSlug().keyHash,
      code: this.codeInput.input.value
    });

    this.setState({status: 'decrypt', key: resp.key});
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
    } else if (status === 'presend') {
      body = (
        <div>
          <Center>
            <p>{phone}</p>
          </Center>
          <Center>
            <Button size="large" type="primary" onClick={this.sendCode.bind(this)}>
              Send Code
            </Button>
          </Center>
        </div>
      );
    } else if (status === 'sent') {
      body = (
        <div>
          <Center>
            <Input
              size="large"
              placeholder="000000"
              onPressEnter={this.decrypt.bind(this)}
              ref={el => (this.codeInput = el)}
            />
            <Button size="large" onClick={this.decrypt.bind(this)}>
              Unlock
            </Button>
          </Center>
        </div>
      );
    } else if (status === 'decrypt') {
      body = (
        <div>
          <pre>{decrypt(this.parseSlug().cyphertext, key)}</pre>
        </div>
      );
    }

    let current = null;
    if (status === 'presend') {
      current = 0;
    }
    if (status === 'sent') {
      current = 1;
    }
    if (status === 'decrypt') {
      current = 2;
    }

    return (
      <div className="DecryptPage">
        <h1>Decrypt a Message</h1>
        <Steps current={current} size="small">
          <Steps.Step title="Send Code" />
          <Steps.Step title="Authenticate" />
          <Steps.Step title="View Message" />
        </Steps>
        <div className="DecryptPage_body">{body}</div>
      </div>
    );
  }
}

export default DecryptPage;

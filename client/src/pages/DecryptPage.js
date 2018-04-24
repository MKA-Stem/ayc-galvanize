import React from 'react';
import LoadingSpinner from 'components/LoadingSpinner.js';
import {Steps, Button, Input, Icon} from 'antd';
import CreditCard from 'components/CreditCard.js';
import PhoneNumber from 'components/PhoneNumber.js';
import TextArea from 'components/TextArea.js';
import request from 'lib/http.js';
import {decrypt} from 'lib/cryptography.js';
import './FlowPage.css';

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
    await request('send2FA', {
      hash: this.parseSlug().keyHash
    });
    this.setState({status: 'sent'});
  }

  async decrypt() {
    this.setState({status: 'loading'});
    const resp = await request('verify2FA', {
      hash: this.parseSlug().keyHash,
      code: this.state.code
    });

    this.setState({status: 'decrypt', key: resp.key});
  }

  render() {
    const {status, phone, key, code} = this.state;

    let [body, foot] = [null, null];

    if (status === 'loading') {
      body = (
        <div className="FlowPage_spinner">
          <LoadingSpinner />
        </div>
      );
      foot = null;
    } else if (status === 'presend') {
      body = (
        <div>
          <p>
            Someone has sent you a secure message through SafeSend. It requires 2-factor
            authentication through your phone number to access. To continue, click the button below,
            and a code will be sent to your phone.
          </p>
          <PhoneNumber value={phone} onChange={() => {}} />
        </div>
      );

      foot = (
        <Button type="primary" onClick={this.sendCode.bind(this)}>
          Send Code
        </Button>
      );
    } else if (status === 'sent') {
      const next = this.decrypt.bind(this);
      body = (
        <div>
          <p>We just texted you a code. Enter it below to unlock the message:</p>
          <Input
            size="large"
            placeholder="000000"
            onPressEnter={next}
            onChange={e => this.setState({code: e.target.value})}
            value={code}
            autoFocus
          />
        </div>
      );

      foot = (
        <Button type="primary" size="large" onClick={next}>
          Unlock
        </Button>
      );
    } else if (status === 'decrypt') {
      const text = decrypt(this.parseSlug().cyphertext, key);
      console.log('Decrypted: ', text);
      const msg = JSON.parse(text);

      if (msg._type === 'cc') {
        body = (
          <div>
            <CreditCard value={msg} onChange={() => {}} />
          </div>
        );
      } else {
        body = (
          <div>
            <TextArea value={msg} onChange={() => {}} />
          </div>
        );
      }

      foot = null;
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
      <div className="FlowPage">
        <h2>Decrypt a Message</h2>
        <Steps current={current} size="small">
          <Steps.Step title="Send Code" icon={<Icon type="message" />} />
          <Steps.Step title="Authenticate" icon={<Icon type="unlock" />} />
          <Steps.Step title="View Message" icon={<Icon type="file-text" />} />
        </Steps>
        <div className="FlowPage_body">{body}</div>
        <div className="FlowPage_foot">{foot}</div>
      </div>
    );
  }
}

export default DecryptPage;

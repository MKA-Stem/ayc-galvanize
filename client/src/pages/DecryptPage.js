import React from 'react';
import LoadingSpinner from 'components/LoadingSpinner.js';
import {Steps, Button} from 'antd';
import request from 'lib/http.js';
import './DecryptPage.css';

class DecryptPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'loading', // one of 'loading', 'presend', 'sent', 'decrypt'
      phone: null // Phone number.
    };
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
    const resp = await request('send2FA', {hash: this.parseSlug().keyHash});
    this.setState({status: 'sent'});
  }

  render() {
    const {status, phone} = this.state;

    let body = null;

    if (status === 'loading') {
      body = (
        <div className="DecryptPage_spinner">
          <LoadingSpinner />
        </div>
      );
    } else if (status === 'presend') {
      body = (
        <div>
          <p>{phone}</p>
          <Button size="large" type="primary" onClick={this.sendCode.bind(this)}>
            Send Code
          </Button>
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
        <h1>Decrypt something</h1>
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

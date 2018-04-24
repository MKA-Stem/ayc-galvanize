import {cardFormat, deFormat} from 'lib/formats.js';
import React from 'react';
import {Form, Input, Icon, Col, DatePicker} from 'antd';
import moment from 'moment';

function disabledDate(current) {
  return current && current < moment().endOf('month');
}

const CreditCard = ({onChange, value}) => {
  const expire = typeof value.expire === 'string' ? moment(value.expire) : value.expire;
  return (
    <Form>
      <Form.Item>
        <Input
          size="large"
          prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />}
          placeholder="John Doe"
          onChange={e => onChange({...value, name: e.target.value})}
          value={value.name}
        />
      </Form.Item>
      <Form.Item>
        <Input
          size="large"
          prefix={<Icon type="credit-card" style={{color: 'rgba(0,0,0,.25)'}} />}
          placeholder={'0000 0000 0000 0000'}
          maxLength={19}
          onChange={e => onChange({...value, number: deFormat(e.target.value)})}
          value={cardFormat(value.number)}
        />
      </Form.Item>
      <Col span={14}>
        <Form.Item>
          <DatePicker.MonthPicker
            size={'large'}
            disabledDate={disabledDate}
            format={'MM/YY'}
            placeholder={'Expiration Date'}
            onChange={e => onChange({...value, expire: e})}
            value={expire}
          />
        </Form.Item>
      </Col>
      <Col span={10}>
        <Form.Item>
          <Input
            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
            placeholder={'CVC'}
            maxLength={4}
            size={'large'}
            onChange={e => onChange({...value, cv: e.target.value})}
            value={value.cv}
          />
        </Form.Item>
      </Col>
    </Form>
  );
};

export default CreditCard;

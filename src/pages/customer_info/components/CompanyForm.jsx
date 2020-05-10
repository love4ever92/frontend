import React, { useState } from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import SelectItem from './SelectItem';


const AdvancedSearchForm = (props) => {
  const [expand, setExpand] = useState(false);
  const [form] = Form.useForm();

  
  const onFinish = values => {
    // eslint-disable-next-line no-console
    console.log('Received values of form: ', values);

    props.bindSerch({
      values,
      type: 'search'
    });
  };

  return (
    <>
    <div>
     <h1>{props.title}</h1>
    </div>
    <div>
    <Form
      form={form}
      name="advanced_search"
      className="ant-advanced-search-form"
      onFinish={onFinish}
    > 
      <Row gutter={24}>
      <Col span={6} >
          <Form.Item
            name="company"
            label="公司名称"
          >
            <Input name="company"  />
          </Form.Item>
      </Col>
      <Col span={6} >
          <Form.Item
            name="companyCode"
            label="统一信用编码"
          >
            <Input name="companyCode"  />
          </Form.Item>
      </Col>
      <Col span={4} >
          <Form.Item
            name="setTime"
            label="成立时间"
          >
            <Input name="setTime"  />
          </Form.Item>
      </Col>
      <Col span={3} >
          <Form.Item
            name="trade"
            label="行业"
          >
            <Input name="trade"  />
          </Form.Item>
      </Col>
      <Col span={4} >
          <Form.Item
            name="rate"
            label="法人占股"
          >
            <Input name="rate"  />
          </Form.Item>
      </Col>
      </Row>
      <Row gutter={24}>
      <Col span={4} >
          <Form.Item
            name="name"
            label="法人姓名"
          >
            <Input name='name' />
          </Form.Item>
      </Col>
      <Col span={8} >
          <Form.Item
            name="idNum"
            label="身份证号码"
          >
            <Input name='idNum' />
          </Form.Item>
      </Col>
      
      <Col span={5} >
          <Form.Item
            name="mobilePhone"
            label="手机号码"
          >
            <Input name='mobilePhone' />
          </Form.Item>
      </Col>
      <Col span={4} >
          <Form.Item
            name="ismarried"
            label="婚姻状况"
          >
            <Input name='ismarried' />
          </Form.Item>
      </Col>
      </Row>
      <Row gutter={24}>
    
      <Col span={10} >
          <Form.Item
            name="address"
            label="联系地址"
          >
            <Input name='address' />
          </Form.Item>
      </Col>
      </Row>
    </Form>
    </div>
    </>
  );
};

export default  AdvancedSearchForm
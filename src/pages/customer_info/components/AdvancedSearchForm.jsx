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
      <Col span={4} >
          <Form.Item
          style={{
            marginLeft: 10,
          }}
            name="name"
            label="姓名"
          >
            <Input placeholder="请输入要查看的客户姓名" />
          </Form.Item>
      </Col>
      <Col span={5} >
          <Form.Item
            name="mobilePhone"
            label="手机号码"
            rules={[
              {
                message: '请输入正确的手机号码',
              },
            ]}
          >
            <Input placeholder="请输入要查看的客户手机号码" />
          </Form.Item>
      </Col>
      <Col span={8} >
          <Form.Item
            name="idNum"
            label="身份证号码"
            rules={[
              {
                message: '请输入正确的身份证号码',
              },
            ]}
          >
            <Input placeholder="请输入要查看的客户身份证号码" />
          </Form.Item>
      </Col>
      <Col span={5} >
        <Button type="primary" htmlType="submit" >
            查询
          </Button>
      </Col>
      </Row>
      <Row>
        <Col
          span={24}
          style={{
          
            textAlign: 'right',
          }}
        >
          <Button type="primary">
            <a href="#t1" >1.个人信息</a>
          </Button>
           <Button type="primary" style={{
              marginLeft: 8,
            }}>
            <a href="#t2" >2.企业信息</a>
          </Button>
          <Button
            style={{
              marginLeft: 8,
            }}
            type="primary" 
          >
            <a href="#t3" >3.个人信用报告</a>
          </Button>
          <Button
            style={{
              marginLeft: 8,
            }}
            type="primary" 
          >
            <a href="#t4" >4.企业信用报告</a>
          </Button>
          <Button
            style={{
              marginLeft: 8,
            }}
            type="primary" 
          >
            <a href="#t5" >5.企查查  </a>
          </Button>
          </Col>
      </Row>
    </Form>
    </div>
    </>
  );
};

export default  AdvancedSearchForm
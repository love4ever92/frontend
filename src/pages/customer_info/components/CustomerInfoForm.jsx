import React, { useState,useEffect } from 'react';
import { Form, Row, Col, Input, Button,DatePicker } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import moment from 'moment'
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

  useEffect(() => {
    form.setFieldsValue(props.personInfo);
    
  }, [props.personInfo])

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
      <Col span={8} >
          <Form.Item
            name="name"
            label="客户姓名"
          >
            <Input name='name' />
          </Form.Item>
      </Col>
      <Col span={8} >
          <Form.Item
            name="idNum"
            label="身份证号"
          >
            <Input name='idNum' />
          </Form.Item>
      </Col>
      </Row>
      <Row gutter={24}>
      <Col span={8} >
          <Form.Item
            name="mobilePhone"
            label="手机号"
          >
            <Input name='mobilePhone' />
          </Form.Item>
      </Col>
      <Col span={4} >
          <Form.Item
            name="birthday"
            label="生日"
          >
             <Input name='birthday' />
          </Form.Item>
      </Col>
      <Col span={5} >
          <Form.Item
            name="ismarried"
            label="婚姻状况"
          >
            <SelectItem placeholder="请选择" optionDisabled='false'  url='/api/ismarried' defaultValue={form.getFieldValue("ismarried")}/>
          </Form.Item>
      </Col>
      </Row>
      <Row gutter={24}>
      <Col span={8} >
          <Form.Item
            name="bankName"
            label="银行名称"
          >
            <Input name='bankName' />
          </Form.Item>
      </Col>
      <Col span={10} >
          <Form.Item
            name="bankCardNum"
            label="银行卡号码"
          >
            <Input name='bankCardNum' />
          </Form.Item>
      </Col>
      </Row>
      <Row gutter={24}>
      <Col span={10} >
          <Form.Item
            name="msgAddress"
            label="联系地址"
          >
            <Input name='msgAddress' />
          </Form.Item>
      </Col>
      </Row>
      <Row gutter={24}>
      <Col span={10} >
          <Form.Item
            name="idAddress"
            label="户籍地址"
          >
            <Input name='idAddress' />
          </Form.Item>
      </Col>
      </Row>  
      <Row gutter={24}>
      <Col span={8} >
          <Form.Item
            name="mateName"
            label="配偶姓名"
          >
            <Input name='mateName' />
          </Form.Item>
      </Col>
      <Col span={8} >
          <Form.Item
            name="mateIdNum"
            label="配偶身份证号"
          >
            <Input name='mateIdNum' />
          </Form.Item>
      </Col>
      </Row>  
      <Row gutter={24}>
      <Col span={8} >
          <Form.Item
            name="mateMobilePhone"
            label="配偶手机号"
          >
            <Input name='matePhone' />
          </Form.Item>
      </Col>
      <Col span={8} >
          <Form.Item
            name="mateCompany"
            label="配偶工作单位"
          >
            <Input name='mateCompany' />
          </Form.Item>
      </Col>
      </Row>
      <Row gutter={24}>
      <Col span={8} >
          <Form.Item
            name="mateWorkPlace"
            label="配偶单位地址"
          >
            <Input name='mateWorkPlace' />
          </Form.Item>
      </Col>
      </Row>
      
      <Row>
        <Col
          span={24}
          style={{
            textAlign: 'right',
          }}
        >
          <a
            style={{
              marginLeft: 8,
              fontSize: 12,
            }}
            onClick={() => {
              setExpand(!expand);
            }}
          >
            {expand ? <UpOutlined /> : <DownOutlined />} 拉起
          </a>
        </Col>
      </Row>
    </Form>
    </div>
    </>
  );
};

export default  AdvancedSearchForm
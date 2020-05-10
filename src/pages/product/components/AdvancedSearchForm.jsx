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
      <Col span={8} >
          <Form.Item
            name="userName"
            label="姓名"
          >
            <Input placeholder="请输入要查看的员工姓名" />
          </Form.Item>
      </Col>
      <Col span={8} >
          <Form.Item
            name="mobilePhone"
            label="手机号码"
          >
            <Input placeholder="请输入要查看的员工手机号码" />
          </Form.Item>
      </Col>
      <Col span={8} >
          <Form.Item
            name="role"
            label="角色"
          >
            <SelectItem placeholder="请选择角色" url='/api/base/role/list' />
          </Form.Item>
      </Col>
      </Row>
      <Row gutter={24}>
      <Col span={8} >
          <Form.Item
            name="department"
            label="部门"
          >
            <SelectItem placeholder="请选择部门" url='/api/base/department/list' />
          </Form.Item>
      </Col>
      <Col span={8} >
          <Form.Item
            name="job"
            label="职位"
          >
            <SelectItem placeholder="请选择职位" url='/api/base/job/list' />
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
           <Button type="primary" htmlType="add">
            添加
          </Button>
          <Button style={{
              marginLeft: 8,
            }}
             type="primary" 
             htmlType="submit">
            查找
          </Button>
          <Button
            style={{
              marginLeft: 8,
            }}
            onClick={() => {
              form.resetFields();
            }}
          >
            取消
          </Button>
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
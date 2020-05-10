import React, { useState } from 'react';
import { Form, Row, Col, Input, DatePicker ,Button } from 'antd';
import moment from 'moment';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import SelectItem from './SelectItem';



const AdvancedSearchForm = (props) => {
  const [expand, setExpand] = useState(false);
  const [customerVisible, setCustomerVisible ] = useState(false);
  const [companyVisible, setCompanyVisible ] = useState(false);
  const [customerReportVisible, setCustomerReportVisible ] = useState(false);
  const [companyReportVisible, setCompanyReportVisible ] = useState(false);
  const [qichachaVisible, setQichachaVisible ] = useState(false);



  const [form] = Form.useForm();
  // 打开添加客户对话框
  const showCustomer = () =>{
    props.showAdd();
  }
  



  const onFinish = values => {
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
            name="departmentId"
            label="部门"
          >
            <SelectItem placeholder="请选择客户所属部门" url='/api/base/department/listAll' />
          </Form.Item>
      </Col>
      
      <Col span={6} >
          <Form.Item
            name="status"
            label="客户状态"
          >
            <SelectItem placeholder="请选择客户状态" url='/api/base/customer/status' />
          </Form.Item>
      </Col>
      <Col span={10} >
          <Form.Item
            name="mobilePhone"
            label="手机号码"
          >
            <Input placeholder="请输入要查看的客户手机号码" />
          </Form.Item>
      </Col>
      </Row>
      <Row gutter={24}>
      <Col span={6} >
          <Form.Item
            name="customerName"
            label="姓名"
          >
            <Input placeholder="请输入要查看的客户姓名" />
          </Form.Item>
      </Col>
      <Col span={6} >
          <Form.Item
            name="isMarried"
            label="是否已婚"
          >
            <SelectItem placeholder="请选择职位" url='/api/base/customer/isMarried' />
          </Form.Item>
      </Col>
      <Col span={10} >
          <Form.Item
            name="idNum"
            label="身份证号码"
          >
            <Input placeholder="请输入要查看的客户的身份证号码" />
          </Form.Item>
      </Col>
      </Row>
      <Row gutter={24}>
      <Col span={7} >
          <Form.Item
            name="companyId"
            label="公司名称"
          >
            <SelectItem placeholder="请选择客户的公司名称" url='/api/base/company/list'  />
          </Form.Item>
      </Col>
      <Col span={8} >
          <Form.Item
            name="companyCode"
            label="统一信用编码"
          >
            <Input placeholder="请输入要查看的客户的公司统一信用编码"  />
          </Form.Item>
      </Col>
        <Col span={8}>
            <Form.Item
                name="timeRange"
                label="添加时间"
              >
              <DatePicker.RangePicker
                format='YYYY-MM-DD'
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                }}
            />
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
           <Button type='primary' onClick={showCustomer}>
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
              // eslint-disable-next-line no-unused-expressions
              onClick={ ()=>{form.resetFields} } 
          >
              取消
          </Button>
          <a
            style={{
              fontSize: 12,
            }}
            onClick={() => {
              setExpand(!expand);
            }}
          >
            {expand ? <UpOutlined /> : <DownOutlined />} 折叠
          </a>
          
        </Col>
      </Row>
    </Form>
    </div>
    </>
  );
};

export default  AdvancedSearchForm
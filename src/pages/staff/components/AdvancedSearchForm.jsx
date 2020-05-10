/* eslint-disable react/jsx-no-bind */
import React, { useState,useEffect } from 'react';
import { Form, Row, Col, Input, Button, Modal } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import SelectItem from './SelectItem';
import AddModal from './AddModal';



 

const AdvancedSearchForm = (props) => {
  const [form] = Form.useForm();
  const [addVisible, setAddVisible] = useState(false);
  const [ searchObj, setSearchObj ] = useState({});
  const [ reload, setReload ] = useState(false);
  let resetCondition = false;

  const showAdd = () =>{
    setAddVisible(true);
  }

  const onFinish = values => {
    setSearchObj(values);
    props.bindSerch({
      values,
      type: 'search'
    });
  }



  const setVisible = () =>{
    if(addVisible){
      props.bindSerch({
        searchObj,
        type: 'search'
      });
    }
    setAddVisible(false);
    
  }
  


  const handleFromChild1 = value =>{
    console.log('departmentId',value);
    form.setFieldsValue({departmentId:value});
}
const handleFromChild2 = value =>{
    console.log('jobId',value);
    form.setFieldsValue({ jobId : value});
    
}
const handleFromChild3 = value =>{
    console.log('roleId',value);
    form.setFieldsValue({ roleId : value});

}
const handleFromChild4 = value =>{
  console.log('status',value);
  form.setFieldsValue({ status : value});
}

const toParent =() =>{
  props.toParent(form);
}


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
            name="roleId"
            label="角色"
          >
            <SelectItem placeholder="请选择角色" toParent = { handleFromChild3.bind(this) } url='/api/base/role/list' />
          </Form.Item>
      </Col>
      </Row>
      <Row gutter={24}>
      <Col span={8} >
          <Form.Item
            name="departmentId"
            label="部门"
          >
            <SelectItem placeholder="请选择部门" toParent = { handleFromChild1.bind(this) } url='/api/base/department/listAll' />
          </Form.Item>
      </Col>
      <Col span={8} >
          <Form.Item
            name="jobId"
            label="职位"
          >
            <SelectItem placeholder="请选择职位" toParent = { handleFromChild2.bind(this) } url='/api/base/job/list' />
          </Form.Item>
      </Col>
      <Col span={8} >
        <Form.Item
            name="status"
            label="状态"
          >
            <SelectItem placeholder="请选择状态" toParent = { handleFromChild4.bind(this) } url='/api/base/staff/status' />
          </Form.Item>
        </Col>
      </Row>
      <Row>
      <Button 
        type='primary' 
        onClick={showAdd}>
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
            marginLeft: 16,
            }}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={ () => { form.resetFields() }} 
        >
            取消
        </Button>
      </Row>
    </Form>
    <AddModal
              setVisible={setVisible}
              visible={ addVisible }
              title='新增员工'
            // eslint-disable-next-line react/jsx-no-bind
            /> 
    </div>
    </>
  );
};

export default  AdvancedSearchForm
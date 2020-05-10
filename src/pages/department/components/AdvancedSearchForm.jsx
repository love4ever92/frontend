/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import SelectItem from './SelectItem';
import AddModal from './AddModal';


const AdvancedSearchForm = (props) => {
  const [form] = Form.useForm();
  const [searchObj, setSearchObj] = useState({});
  const [addVisible, setAddVisible] = useState(false);

  const showAdd = () => {
    setAddVisible(true);
  }

  const setVisible = () => {

    if (addVisible) {
      props.bindSerch({
        searchObj,
        type: 'search'
      });
    }
    setAddVisible(false);
  }

  const onFinish = values => {
    setSearchObj(values);
    props.bindSerch({
      values,
      type: 'search'
    });
  }

  const handleFromChild1 = value => {
    console.log('departmentId', value);
    form.setFieldsValue({ departmentId: value });
  }

  const handleFromChild2 = value => {
    form.setFieldsValue({ parentId: value });
  }

  const handleFromChild4 = value => {
    console.log('status', value);
    form.setFieldsValue({ status: value });
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
                name="staffName"
                label="部门负责人"
              >
                <Input placeholder="请输入要查看的部门的负责人" />
              </Form.Item>
            </Col>
            <Col span={8} >
              <Form.Item
                name="mobilePhone"
                label="部门负责人电话"
              >
                <Input placeholder="请输入要查看的部门的负责人电话" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8} >
              <Form.Item
                name="parentId"
                label="上级部门"
              >
                <SelectItem placeholder="请选择上级部门" toParent={handleFromChild2.bind(this)} url='/api/base/department/listAll' />
              </Form.Item>
            </Col>
            <Col span={8} >
              <Form.Item
                name="departmentId"
                label="部门名称"
              >
                <SelectItem placeholder="请选择部门名称" toParent={handleFromChild1.bind(this)} url='/api/base/department/listAll' />
              </Form.Item>
            </Col>
            <Col span={8} >
              <Form.Item
                name="status"
                label="状态"
              >
                <SelectItem placeholder="请选择状态" toParent={handleFromChild4.bind(this)} url='/api/base/department/status' />
              </Form.Item>
            </Col>
          </Row>
          <Button type='primary' onClick={showAdd}>
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
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => { form.resetFields() }}
          >
            取消
                </Button>
        </Form>
        <AddModal
          title='新增部门'
          visible={addVisible}
          setVisible={setVisible}
        // eslint-disable-next-line react/jsx-no-bind

        />
      </div>
    </>
  );
};

export default AdvancedSearchForm
import React, { useState } from 'react';
import { Form, Row, Col, DatePicker, Button, Select, Input } from 'antd';
import moment from 'moment';
import AddModal from './AddModal';




const AdvancedSearchForm = (props) => {
  const [form] = Form.useForm();
  const [addVisible, setAddVisible] = useState(false);
  const [searchObj, setSearchObj] = useState({});
  const [type, setType] = useState("");

  const showAdd = () => {
    setType("add");
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
  };

  function onChange(value) {
    console.log(`selected ${value}`);
  }

  function onBlur() {
    console.log('blur');
  }

  function onFocus() {
    console.log('focus');
  }

  function onSearch(val) {
    console.log('search:', val);
  }

  const layoutcol_4 = {

    md: {
        span: 4
    },
    sm: {
      span: 8
    },
    xs: {
        span: 12
    }
}
const layoutcol_6 = {

  md: {
      span: 6
  },
  sm: {
    span: 12
  },
  xs: {
      span: 24
  }
}

  return (
    <>
      <h1>{props.title}</h1>
      <div>
        <Form
          form={form}
          className="ant-advanced-search-form"
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col {...layoutcol_4} >
              <Form.Item
                name="departmentId"
                label="部门"
              >
                <Select
                  showSearch
                  placeholder="请选择"
                  optionFilterProp="children"
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Select.Option key='0' value='0'>请选择</Select.Option>
                  {props.departmentOptions.map(v => {
                    return (<Select.Option key={v.id} value={v.id}>{v.name}</Select.Option>);
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col {...layoutcol_4} >
              <Form.Item
                name="serviceStaffId"
                label="主办"
              >
                <Select
                  showSearch
                  placeholder="请选择"
                  optionFilterProp="children"
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Select.Option key='0' value='0'>请选择</Select.Option>
                  {props.staffOptions.map(v => {
                    return (<Select.Option key={v.id} value={v.id}>{v.name}</Select.Option>);
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col {...layoutcol_4} >
              <Form.Item
                name="helpStaffId"
                label="辅助"
              >
                <Select
                  showSearch
                  placeholder="请选择"
                  optionFilterProp="children"
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Select.Option key='0' value='0'>请选择</Select.Option>
                  {props.staffOptions.map(v => {
                    return (<Select.Option key={v.id} value={v.id}>{v.name}</Select.Option>);
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col {...layoutcol_4} >
              <Form.Item
                name="phoneStaffId"
                label="电销"
              >
                <Select
                  showSearch
                  placeholder="请选择"
                  optionFilterProp="children"
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Select.Option key='0' value='0'>请选择</Select.Option>
                  {props.staffOptions.map(v => {
                    return (<Select.Option key={v.id} value={v.id}>{v.name}</Select.Option>);
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col {...layoutcol_6} >
              <Form.Item
                name="companyId"
                label="企业"
              >
                <Select
                  showSearch
                  placeholder="请选择"
                  optionFilterProp="children"
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Select.Option key='0' value='0'>请选择</Select.Option>
                  {props.companyOptions.map(v => {
                    return (<Select.Option key={v.id} value={v.id}>{v.name}</Select.Option>);
                  })}
                </Select>
              </Form.Item>
            </Col>
            
          </Row>
          <Row gutter={24}>
            
            <Col {...layoutcol_4}>
              <Form.Item
                name="startMoney"
                label="下款大于"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col {...layoutcol_4}>
              <Form.Item
                name="endMoney"
                label="下款小于"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col {...layoutcol_4}>
              <Form.Item
                name="serviceRate"
                label="下款点位"
              >
                <Input suffix="%" />
              </Form.Item>
            </Col>
            <Col {...layoutcol_4} >
              <Form.Item
                name="isGet"
                label="小款是否已收"
              >
                <Select
                  showSearch
                  placeholder="请选择"
                  optionFilterProp="children"
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Select.Option key={0} value={0}>请选择</Select.Option>
                  <Select.Option key={1} value="全部已收">全部已收</Select.Option>
                  <Select.Option key={2} value="全部未收">全部未收</Select.Option>
                  <Select.Option key={3} value="部分未收">部分未收</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col {...layoutcol_6} >
              <Form.Item
                name="bankName"
                label="银行"
              >
                <Select
                  showSearch
                  placeholder="请选择"
                  optionFilterProp="children"
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Select.Option key='0' value='0'>请选择</Select.Option>
                  {props.bankOptions.map(v => {
                    return (<Select.Option key={v.id} value={v.name}>{v.name}</Select.Option>);
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col {...layoutcol_6}>
              <Form.Item
                name="createTimeRange"
                label="开单时间"
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
            <Col {...layoutcol_6}>
              <Form.Item
                name="operatTimeRange"
                label="操作时间"
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
            <Col {...layoutcol_4} >
              <Form.Item
                name="status"
                label="状态"
              >
                <Select
                  showSearch
                  placeholder="请选择"
                  optionFilterProp="children"
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Select.Option key={0} value={0}>请选择</Select.Option>
                  <Select.Option key={1} value={1}>初始状态</Select.Option>
                  <Select.Option key={2} value={9}>待产品总监确认</Select.Option>
                  <Select.Option key={2} value={2}>待总经理确认</Select.Option>
                  <Select.Option key={3} value={3}>待会计确认</Select.Option>
                  <Select.Option key={3} value={5}>待出纳确认</Select.Option>
                  <Select.Option key={3} value={6}>待财务经理确认</Select.Option>
                  <Select.Option key={5} value={7}>财务经理已确认</Select.Option>
                  {/* <Select.Option key={6} value={8}>订单已结算</Select.Option> */}
                </Select>
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
              <Button 
                type="primary" 
                onClick={showAdd} 
                disabled={localStorage.getItem('roleId') == 4 || localStorage.getItem('roleId') == 5 || localStorage.getItem('roleId') == 6  } >
                创建订单
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
            </Col>
          </Row>
          <AddModal
            title='新增订单'
            visible={addVisible}
            setVisible={setVisible}
            type={type}
            departmentOptions={props.departmentOptions}
            staffOptions={props.staffOptions}
            companyOptions={props.companyOptions}
            bankOptions={props.bankOptions}
            customerOptions={props.customerOptions}
            destroyOnClose={1 == 1}
          />
        </Form>
      </div>
    </>
  );
};

export default AdvancedSearchForm
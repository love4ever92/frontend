/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Row, Col, DatePicker, Divider, Select, Button } from 'antd'
import moment from 'moment'
import CustomerModal  from './CustomerModal'
import CompanyModal  from './CompanyModal'
import request from '@/utils/request';

const LookModal = (props) => {


    const [form] = Form.useForm();
    const [maskClosable,] = useState(false);
    const [customerVisible, setCustomerVisible] = useState(false);
    const [companyVisible, setCompanyVisible] = useState(false);
    const [customerObj, setCustomerObj] = useState({});
    const [companyObj, setCompanyObj] = useState({});
    
    useEffect(() => {
        if (props.visible) {
            console.log(12, props.customerOptions);
            console.log(13, props.companyOptions);
            const departmentId = `${props.editObj.departmentId}:${props.editObj.departmentName}`;
            const companyId = `${props.editObj.companyId}:${props.editObj.companyName}`;
            const serviceStaffId = `${props.editObj.serviceStaffId}:${props.editObj.serviceStaff}`;
            const phoneStaffId = `${props.editObj.phoneStaffId}:${props.editObj.phoneStaff}`;
            const helpStaffId = `${props.editObj.helpStaffId}:${props.editObj.helpStaff}`;
            const customerId = `${props.editObj.customerId}:${props.editObj.customerName}`;

            form.setFieldsValue({
                ...props.editObj,
                operatTime: moment(props.editObj.operatTime, 'YYYY-MM-DD'),
                id: props.editObj.key,
                departmentId,
                companyId,
                serviceStaffId,
                phoneStaffId,
                helpStaffId,
                customerId,
                createUserName2: props.editObj.createUserName,
            })
        }
    }, [props.visible])

    useEffect(
        () => {
          console.log(customerObj); 
        },
        [customerObj]
      );

    const handleCancel = () => {
        Modal.confirm({
            title: '关闭订单详情',
            content: '确定取消添加订单',
            onOk() {
                props.setVisible(false);
            },
            onCancel() {

            }
        })
    }



    const onFinish = () => {

    }



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

    function getCustomer() {
        request.get("/api/base/customer/getOne", {
            params: { id: form.getFieldValue("customerId").toString().split(":")[0], userId: localStorage.getItem('userId') },
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }).then(res => {
            if (res.code === '0000') {
              setCustomerObj(res.data);
              setCustomerVisible(true);
            } else {
              Modal.confirm({
                title: '获取客户失败',
                content: `失败原因： ${res.data}`,
                onOk() { },
              })
            }
          })
        

    }

     function getCompany() {
        request.get("/api/base/company/getOne", {
            params: { id: form.getFieldValue("companyId").toString().split(":")[0], userId: localStorage.getItem('userId') },
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }).then(res => {
            if (res.code === '0000') {
              setCompanyObj(res.data);
              setCompanyVisible(true);
            } else {
              Modal.confirm({
                title: '获取企业失败',
                content: `失败原因： ${res.data}`,
                onOk() { },
              })
            }
        })
    }

    function setVisible4CustomerModal(){
        
        setCustomerVisible(false);
        
    }
    function setVisible4CompanyModal(){
        setCompanyVisible(false);
    }
    const layoutcol_6 = {

        md: {
            span: 6
        },
        xs: {
            span: 12
        }
    }

    const layoutcol_12 = {

        md: {
            span: 12
        },
        xs: {
            span: 24
        }
    }

    return (
        <div>
            <Modal
                id='addModal'
                title={props.title}
                visible={props.visible}
                onCancel={handleCancel}
                maskClosable={maskClosable}
                destroyOnClose
                getContainer={false}
                width={1000}
                footer={
                    [] // 设置footer为空，去掉 取消 确定默认按钮
                }
            >
                <Form
                    form={form}
                    // name=""
                    // className=""
                    onFinish={onFinish}
                >
                    <Row gutter={24}>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="key"
                                label="编号"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="createUserName"
                                label="填表人"
                            >
                                <Input defaultValue={localStorage.getItem('userName')} disabled />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                format='YYYY-MM-DD'
                                name="operatTime"
                                label="操作时间"
                            >
                                <DatePicker disabled />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="departmentId"
                                label="部门"
                            >
                                <Select
                                    showSearch

                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.departmentOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="customerId"
                                label="客户"
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.customerOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="serviceStaffId"
                                label="主办人"
                            >
                                <Select
                                    showSearch

                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.staffOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="helpStaffId"
                                label="辅助人"
                            >
                                <Select
                                    showSearch

                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.staffOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="phoneStaffId"
                                label="电销"
                            >
                                <Select
                                    showSearch

                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.staffOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col {...layoutcol_12} >
                            <Form.Item
                                name="companyId"
                                label="贷款企业"
                            >
                                <Select
                                    showSearch

                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.companyOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_12} >
                            <Form.Item
                                name="bankName"
                                label="下款银行"
                            >
                                <Select
                                    showSearch

                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.bankOptions.map(v => {
                                        return (<Select.Option key={v.id} value={v.id}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col {...layoutcol_6} >
                            <Form.Item
                                name="loan"
                                label="下款金额(￥)"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6} >
                            <Form.Item
                                name="serviceRate"
                                label="小款点位(%)"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6} >
                            <Form.Item
                                name="serviceMoney"
                                label="小款金额(￥)"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6} >
                            <Form.Item
                                name="isGet"
                                label="收款情况"
                            >
                                <Select
                                    showSearch

                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled
                                >
                                    <Select.Option key={0} value="0">请选择</Select.Option>
                                    <Select.Option key={1} value="全部已收">全部已收</Select.Option>
                                    <Select.Option key={2} value="全部未收">全部未收</Select.Option>
                                    <Select.Option key={3} value="部分未收">部分未收</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        
                        <Col {...layoutcol_6} >
                            <Form.Item
                                name="otherCost"
                                label="其他费用(￥)"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="getMoney"
                                label="已收金额(￥)"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6} >
                            <Form.Item
                                name="needInvoice"
                                label="是否开票"

                            >
                                <Select
                                    showSearch

                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled
                                >
                                    <Select.Option disabled key={0} value="0">请选择</Select.Option>
                                    <Select.Option key={1} value="是">是</Select.Option>
                                    <Select.Option key={2} value="否">否</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="remark"
                                label="备注"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={24}>
                        <Col {...layoutcol_6} >
                            <Form.Item
                                name="createUserName2"
                                label="填表人"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Button
                                style={{
                                    marginLeft: 8,
                                }}
                                // eslint-disable-next-line react/jsx-no-bind
                                onClick={getCustomer}
                            >
                                查看客户
                            </Button>
                            <Button
                                style={{
                                    marginLeft: 8,
                                }}
                                // eslint-disable-next-line react/jsx-no-bind
                                onClick={getCompany}
                            >
                                查看企业
                            </Button>
                        </Col>
                    </Row>
                    <Row gutter={24}  >
                        <Col {...layoutcol_6} >
                            <Form.Item
                                name="productDirectorStaff"
                                label="业务负责人确认"

                            >
                                <Input disabled={props.type !== "productDirector"} />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6} >
                            <Form.Item
                                name="productDirectorOpinion"
                                label="确认结果"

                            >
                                <Select
                                    showSearch

                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled={props.type !== "productDirector"}
                                >
                                    <Select.Option disabled key={0} value="0">请选择</Select.Option>
                                    <Select.Option key={1} value="同意">同意</Select.Option>
                                    <Select.Option key={2} value="不同意">不同意</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col  {...layoutcol_12} >
                            <Form.Item
                                name="productDirectorReason"
                                label="处理意见"
                            >
                                <Input
                                    disabled={props.type !== "productDirector"} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col  {...layoutcol_6} >
                            <Form.Item
                                name="confirmStaff"
                                label={`财 务 确 认`}
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col  {...layoutcol_6} >
                            <Form.Item
                                name="confirmOpinion"
                                label="确认结果"
                            >
                                <Select
                                    showSearch

                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled
                                >
                                    <Select.Option key={0} value="0">请选择</Select.Option>
                                    <Select.Option key={1} value="同意">同意</Select.Option>
                                    <Select.Option key={2} value="不同意">不同意</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col  {...layoutcol_12} >
                            <Form.Item
                                name="confirmReason"
                                label="处理意见"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item
                                name="financeStaff"
                                label="会计确认"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="financeOpinion"
                                label="确认结果"
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled
                                >
                                    <Select.Option key={0} value="0">请选择</Select.Option>
                                    <Select.Option key={1} value="同意">同意</Select.Option>
                                    <Select.Option key={2} value="不同意">不同意</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="financeReason"
                                label="处理意见"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row> */}
                    {/* <Row gutter={24} >
                        <Col span={6}>
                            <Form.Item
                                name="tellerStaff"
                                label="出纳确认"
                            >
                                <Input disabled={props.type !== "teller"} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="tellerOpinion"
                                label="确认结果"
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled={props.type !== "teller"}
                                >
                                    <Select.Option key={1} value="同意">同意</Select.Option>
                                    <Select.Option key={2} value="不同意">不同意</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="tellerReason"
                                label="处理意见"
                            >
                                <Input disabled={props.type !== "teller"} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item
                                name="financeManagerStaff"
                                label="财务经理确认"

                            >
                                <Input disabled={props.type !== "financeManager"} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="financeManagerOpinion"
                                label="确认结果"
                            >
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled={props.type !== "financeManager"}
                                >
                                    <Select.Option key={1} value="同意">同意</Select.Option>
                                    <Select.Option key={2} value="不同意">不同意</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="financeManagerReason"
                                label="处理意见"
                            >
                                <Input disabled={props.type !== "financeManager"} />
                            </Form.Item>
                        </Col> 
                    </Row>*/}

                </Form>
            </Modal>

            <CustomerModal
                title= "客户资料"       
                visible={customerVisible}
                setVisible={setVisible4CustomerModal}
                editObj={customerObj}
                modalType="look"
            />
            
            <CompanyModal
                title='企业资料'
                visible={companyVisible}
                setVisible={setVisible4CompanyModal}
                modalType="look"
                editObj={companyObj}
                // eslint-disable-next-line react/jsx-no-bind
            />
        </div>
    );
}

export default LookModal;


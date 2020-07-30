/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Input, Row, Col, DatePicker, Divider, Select, message } from 'antd'
import moment from 'moment'
import request from '@/utils/request';
import CustomerModal  from './CustomerModal'
import CompanyModal  from './CompanyModal'


const EditModal = (props) => {


    const [form] = Form.useForm();
    const [maskClosable,] = useState(false);
    const [isSubmit, setIsSubmit] = useState(true);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [customerVisible, setCustomerVisible] = useState(false);
    const [companyVisible, setCompanyVisible] = useState(false);
    const [customerObj, setCustomerObj] = useState({});
    const [companyObj, setCompanyObj] = useState({});
    const [customerButton, setCustomerButton] = useState(false);
    const [companyButton, setCompanyButton] = useState(false);

    const timeOut = (m) => {
        setTimeout(() => {
            setIsSubmit(false);
        },
            m);
    }


    useEffect(() => {
        
        if (props.visible) {
            const departmentId = `${props.editObj.departmentId}:${props.editObj.departmentName}`;
            const companyId = `${props.editObj.companyId}:${props.editObj.companyName}`;
            const serviceStaffId = `${props.editObj.serviceStaffId}:${props.editObj.serviceStaff}`;
            const phoneStaffId = `${props.editObj.phoneStaffId}:${props.editObj.phoneStaff}`;
            const helpStaffId = `${props.editObj.helpStaffId}:${props.editObj.helpStaff}`;
            const customerId = `${props.editObj.customerId}:${props.editObj.customerName}`;
            onChange4Customer(customerId);
            form.setFieldsValue({
                ...props.editObj,
                operatTime: moment(props.editObj.operatTime, 'YYYY-MM-DD'),
                id: props.editObj.key,
                departmentId,
                companyId,
                serviceStaffId,
                phoneStaffId,
                helpStaffId,
                customerId
            })
            setCompanyButton(false);
        }
    }, [props.visible])
    

    const handleCancel = () => {
        Modal.confirm({
            title: '添加订单',
            content: '确定取消添加订单',
            onOk() {
                props.setVisible(false);
            },
            onCancel() {
            }
        })
    }

    const update = (data) =>{
        request.post('/api/base/order/update', {
            data,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then(res => {
            if (res.code && res.code === '0000') {
                message.info('修改成功');
                timeOut(20000);
                props.setVisible(false);
            }else{
                setIsSubmit(true);
                message.error(res.data?res.data:"修改失败，原因不明，请联系维护人员");
            }
        })
    }

    /**
     * 校验字符串是小数还是整数
     * 如果是小数或者整数就返回true
     * @param {*} str 
     */
    const checkeNum1 = (str) => {
        str = str.toString();
        const reg = new RegExp(/^[0-9]*$/);
        if (str.indexOf(".") === -1) {
            if (str.length > 1) {
                if (str.charAt(0) == 0) {
                    return false;
                }
            }
            if (str.length > 0 && reg.test(str)) {
                return true;
            } else {
                return false;
            }
        } else {
            const s = str.split(".");
            if (s.length !== 2) {
                return false;
            } else {
                if (s[0].length > 1) {
                    if (s[0].charAt(0) == 0) {
                        return false;
                    }
                }
                if (s[0].length > 0 && reg.test(s[0])) {
                    if (s[1].length > 0 && reg.test(s[1])) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
    }

    /**
    * 校验字符串是小数还是整数
    * 如果是整数就返回true
    * @param {*} str 
    */
    const checkeNum2 = (str) => {

        str = str.toString();

        console.log("str", str)
        const reg = new RegExp(/^[0-9]*$/);
        if (str.indexOf(".") === -1) {
            if (str.length > 1) {

                if (str.charAt(0) == 0) {
                    return false;
                }
            }

            console.log(reg.test(str));
            console.log("str.length", str.length);
            if (str.length > 0 && reg.test(str)) {

                return true;
            } else {

                return false;
            }
        } else {

            return false;
        }
    }

    const onFinish = () => {
        if(isSubmit){
            if (localStorage.getItem('userName').trim() === form.getFieldValue('createUserName2').trim()) {
                // 填表人与登录用户是否一致
                // if(moment().isBefore(moment().locale('zh-cn').format('YYYY-MM-DD'),
                //     form.getFieldValue('operatTime').format('YYYY-MM-DD'))){
                     // eslint-disable-next-line eqeqeq
                if (checkeNum2(form.getFieldValue('loan'))) {
                    // eslint-disable-next-line eqeqeq
                    if (checkeNum1(form.getFieldValue('serviceRate'))) {
                        // eslint-disable-next-line eqeqeq
                        if (checkeNum2(form.getFieldValue('serviceMoney'))) {
                            // eslint-disable-next-line eqeqeq
                            if (checkeNum2(form.getFieldValue('otherCost'))) {
                                // eslint-disable-next-line eqeqeq
                                if (checkeNum2(form.getFieldValue('getMoney'))) {
                                    if (Math.floor(form.getFieldValue('getMoney')) <= form.getFieldValue('serviceMoney')) {
                                        // 校验完成
                                        const data = {
                                            ...form.getFieldsValue(),
                                            id: form.getFieldValue("key"),
                                            userId: localStorage.getItem("userId"),
                                            createUserName: localStorage.getItem('userName').trim(),
                                            operatTime: form.getFieldValue('operatTime').format('YYYY-MM-DD'),
                                            departmentId: form.getFieldValue('departmentId').split(":")[0],
                                            departmentName: form.getFieldValue('departmentId').split(":")[1],
                                            companyId: form.getFieldValue('companyId').split(":")[0],
                                            companyName: form.getFieldValue('companyId').split(":")[1],
                                            serviceStaffId: form.getFieldValue('serviceStaffId').split(":")[0],
                                            serviceStaff: form.getFieldValue('serviceStaffId').split(":")[1],
                                            phoneStaffId: form.getFieldValue('phoneStaffId').split(":")[0],
                                            phoneStaff: form.getFieldValue('phoneStaffId').split(":")[1],
                                            helpStaffId: form.getFieldValue('helpStaffId').split(":")[0],
                                            helpStaff: form.getFieldValue('helpStaffId').split(":")[1],
                                            customerId: form.getFieldValue('customerId').split(":")[0],
                                            customerName: form.getFieldValue('customerId').split(":")[1],
                                        }
                                        // 修改
                                        Modal.confirm({
                                            title: '修改订单',
                                            content: '确定提交修改订单！',
                                            onOk () {
                                                update(data);
                                                setIsSubmit(true);
                                            }
                                        })
                                        
                                    }else{
                                        setIsSubmit(true);
                                        Modal.confirm({
                                            title: '修改订单',
                                            content: '已收金额大于小款金额，输入有误，请重新输入！',
                                        })
                                        return
                                    }
                                    
                                } else {
                                    setIsSubmit(true);
                                    Modal.confirm({
                                        title: '修改订单',
                                        content: '已收金额输入有误（只能是数字或小数），请重新输入！',
                                    })
                                    return
                                }
                            } else {
                                setIsSubmit(true);
                                Modal.confirm({
                                    title: '修改订单',
                                    content: '其他费用输入有误（只能是数字或小数），请重新输入！',
                                })
                                return
                            }
                        } else {
                            setIsSubmit(true);
                            Modal.confirm({
                                title: '修改订单',
                                content: '小款金额输入有误（只能是数字或小数），请重新输入！',
                            })
                            return
                        }
                    } else {
                        setIsSubmit(true);
                        Modal.confirm({
                            title: '修改订单',
                            content: '小款点位输入有误（只能是数字或小数），请重新输入！',
                        })
                        return
                    }
                } else {
                    setIsSubmit(true);
                    Modal.confirm({
                        title: '修改订单',
                        content: '下款金额输入有误（只能是数字或小数），请重新输入！',
                    })
                    return
                }
            } else {
                setIsSubmit(true);
                Modal.confirm({
                    title: '修改订单',
                    content: '填表人与登录用户不一致！！请重新确认（填表人与登录用户必须一致）！',
                })
                return
            }
            setIsSubmit(true);
        }else{
            message.error("操作太频繁，请稍后20秒再试！！")
        }
        
    }



    function onChange(value) {
        console.log(`selected ${value}`);
    }



    async function  onChange4Customer (value) {
        setCompanyOptions([]);
        setCustomerButton(false);
        
        form.setFieldsValue({
            ...form.getFieldsValue(),
            "companyId": "0"
        });
        try {
            const res = await request.get('/api/base/company/getByCustomerId', {
              params: {
                userId: localStorage.getItem('userId'),
                customerId: value.split(":")[0],
              },
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            })
            if (res.code === '0000') {
                setCompanyOptions(res.data);
            }
          } catch (error) {
            console.log(111, error);
          }     
        
    }

    function getCustomer() {
        console.log("aa",form.getFieldValue("customerId"));
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

    function onBlur() {
        console.log('blur');
    }

    function onFocus() {
        console.log('focus');
    }

    function onSearch(val) {
        console.log('search:', val);
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
                                <Input placeholder="编号" disabled />
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
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择操作时间',
                                    },
                                ]}
                            >
                                <DatePicker />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="departmentId"
                                label="部门"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择部门',
                                    },
                                ]}
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
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择客户',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange4Customer}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
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
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择主办人',
                                    },
                                ]}
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
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择辅助人',
                                    },
                                ]}
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
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择电销',
                                    },
                                ]}
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
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择贷款企业',
                                    },
                                ]}
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
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {companyOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col  {...layoutcol_12} >
                            <Form.Item
                                name="bankName"
                                label="下款银行"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择银行',
                                    },
                                ]}
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
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入下款金额',
                                    },
                                ]}
                            >
                                <Input placeholder="下款金额" />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6} >
                            <Form.Item
                                name="serviceRate"
                                label="小款点位(%)"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入小款点位',
                                    },
                                ]}
                            >
                                <Input placeholder="小款点位" />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6} >
                            <Form.Item
                                name="serviceMoney"
                                label="小款金额(￥)"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入小款金额',
                                    },
                                ]}
                            >
                                <Input placeholder="小款金额" />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6} >
                            <Form.Item
                                name="isGet"
                                label="收款情况"
                                rules={[
                                    {
                                        required: true,
                                        message: '填是或否',
                                    },
                                ]}
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
                                    <Select.Option key={0} value="0">请选择</Select.Option>
                                    <Select.Option key={1} value="全部已收">全部已收</Select.Option>
                                    <Select.Option key={2} value="全部未收">全部未收</Select.Option>
                                    <Select.Option key={3} value="部分未收">部分未收</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6} >
                            <Form.Item
                                name="otherCost"
                                label="其他费用(￥)"
                            >
                                <Input placeholder="其他费用(￥)" />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="getMoney"
                                label="已收金额(￥)"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入已收金额',
                                    }
                                ]}
                            >
                                <Input placeholder="已收金额" />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6} >
                            <Form.Item
                                name="needInvoice"
                                label="是否开票"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择',
                                    },
                                ]}
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
                                <Input placeholder="备注" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={24}>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="createUserName2"
                                label="填表人"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入填表人',
                                    },
                                ]}
                            >
                                <Input placeholder="填表人签名" />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Button style={{
                                marginLeft: 8,
                            }}
                                type="primary"
                                htmlType="submit"
                                disable={ props.type !== 'add' || props.type !== 'edit' }
                            >
                                提交
                            </Button>
                            <Button
                                style={{
                                    marginLeft: 8,
                                }}
                                // eslint-disable-next-line react/jsx-no-bind
                                onClick={handleCancel}
                            >
                                取消
                            </Button>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Button
                                style={{
                                    marginLeft: 8,
                                }}
                                // eslint-disable-next-line react/jsx-no-bind
                                onClick={getCustomer}
                                disabled={customerButton}
                            >
                                查看客户
                            </Button>
                            <Button
                                style={{
                                    marginLeft: 8,
                                }}
                                // eslint-disable-next-line react/jsx-no-bind
                                onClick={getCompany}
                                disabled={companyButton}
                            >
                                查看企业
                            </Button>
                        </Col>
                    </Row>
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

export default EditModal;


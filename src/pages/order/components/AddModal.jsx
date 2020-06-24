/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react'
import { Modal, Button, Form, Input, Row, Col, DatePicker, Divider, Select, message } from 'antd'
import request from '@/utils/request';
import moment from 'moment';


const AddModal = (props) => {


    const [form] = Form.useForm();
    const [maskClosable,] = useState(false);
    const [isSubmit, setIsSubmit] = useState(true);
    const [companyOptions, setCompanyOptions] = useState([]);
    


    const timeOut = (m) => {
        setTimeout(() => {
            setIsSubmit(false);
        },
            m);
    }

    const handleCancel = () => {
        Modal.confirm({
            title: '添加订单',
            content: '确定取消添加订单',
            onOk() {
                props.setVisible(false);
                form.resetFields();
            },
            onCancel() {

            }
        })
    }

    const add = (data) => {
        request.post('/api/base/order/add', {
            data,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then(res => {
            if (res.code && res.code === '0000') {
                message.info('创建订单成功！');
                timeOut(20000);
                props.setVisible(false);
                form.resetFields();
                setIsSubmit(true);
            } else {
                message.error(res.data ? res.data : "添加失败，原因不明，请联系维护人员");
                setIsSubmit(true);
            }
        })
    }

    /**
     * 校验字符串是小数还是整数
     * 如果是小数或者整数就返回true
     * @param {*} str 
     */
    const checkeNum1 = (str) =>{
        str = str.toString();
        const reg = new RegExp(/^[0-9]*$/);
        if(str.indexOf(".") === -1){
            if(str.length>1){
                if(str.charAt(0) == 0){
                    return false;
                }
            }
            if(str.length > 0 && reg.test(str)){
                return true;
            }else{
                return false;
            }
        }else{
            const s = str.split(".");
            if(s.length !== 2){
                return false;
            }else{
                if(s[0].length > 1){
                    if(s[0].charAt(0) == 0){
                        return false;
                    }
                }
                if(s[0].length > 0 && reg.test(s[0])){
                    if(s[1].length > 0 && reg.test(s[1])){
                        return true;
                    }else{
                        return false;
                    }
                }else{
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
    const checkeNum2 = (str) =>{

        str = str.toString();
        
        console.log("str",str)
        const reg = new RegExp(/^[0-9]*$/);
        if(str.indexOf(".") === -1){
            if(str.length>1){

                if(str.charAt(0) == 0){
                    return false;
                }
            }

            console.log(reg.test(str));
            console.log("str.length",str.length);
            if(str.length > 0 && reg.test(str)){

                return true;
            }else{

                return false;
            }
        }else{

            return false;
        }
    }


    const onFinish = () => {
        if (isSubmit) {
            setIsSubmit(false);
            if (localStorage.getItem('userName').trim() === form.getFieldValue('createUserName2').trim()) {
                // 填表人与登录用户是否一致
                // if(moment().isBefore(moment().locale('zh-cn').format('YYYY-MM-DD'),
                //     form.getFieldValue('operatTime').format('YYYY-MM-DD'))){
                //     // eslint-disable-next-line eqeqeq
                if (checkeNum2(form.getFieldValue('loan').trim())) {
                    // eslint-disable-next-line eqeqeq
                    if (checkeNum1(form.getFieldValue('serviceRate').trim())) {
                        // eslint-disable-next-line eqeqeq
                        if (checkeNum2(form.getFieldValue('serviceMoney').trim())) {
                            // eslint-disable-next-line eqeqeq
                            if (checkeNum2(form.getFieldValue('otherCost').trim())) {
                                // eslint-disable-next-line eqeqeq
                                if (checkeNum2(form.getFieldValue('getMoney').trim())) {
                                    if (Math.floor(form.getFieldValue('getMoney').trim()) <= form.getFieldValue('serviceMoney').trim()) {
                                        // 校验完成
                                        const data = {
                                            ...form.getFieldsValue(),
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
                                        // 添加
                                        Modal.confirm({
                                            title: '新增订单',
                                            content: '确定添加订单',
                                            onOk () {
                                                add(data);
                                                setIsSubmit(true);
                                            }
                                        })
                                        setIsSubmit(true);
                                    } else {
                                        setIsSubmit(true);
                                        Modal.confirm({
                                            title: '新增订单',
                                            content: '已收金额大于小款金额，输入有误，请重新输入！',
                                        })
                                        
                                    }

                                } else {
                                    setIsSubmit(true);
                                    Modal.confirm({
                                        title: '新增订单',
                                        content: '已收金额输入有误（只能是数字），请重新输入！',
                                    })
                                }
                            } else {
                                setIsSubmit(true);
                                Modal.confirm({
                                    title: '新增订单',
                                    content: '其他费用输入有误（只能是数字），请重新输入！',
                                })
                            }
                        } else {
                            setIsSubmit(true);
                            Modal.confirm({
                                title: '新增订单',
                                content: '小款金额输入有误（只能是数字），请重新输入！',
                            })
                        }
                    } else {
                        setIsSubmit(true);
                        Modal.confirm({
                            title: '新增订单',
                            content: '小款点位输入有误（只能是数字），请重新输入！',
                        })
                    }
                } else {
                    setIsSubmit(true);
                    Modal.confirm({
                        title: '新增订单',
                        content: '下款金额输入有误（只能是数字），请重新输入！',
                    })
                }
                // }else{
                //     Modal.confirm({
                //         title: '新增订单',
                //         content: '操作时间在开单时间必须在开单时间之前',   
                //     })
                // }
            } else {
                setIsSubmit(true);
                Modal.confirm({
                    title: '新增订单',
                    content: '填表人与登录用户不一致！！请重新确认（填表人与登录用户必须一致）！',
                })
            }
            setIsSubmit(true);
        } else {
            message.error("操作太频繁，请稍后20秒再试！！")
        }
    }
    
    

    function onChange(value) {
        console.log(`selected ${value}`);
        console.log(form.getFieldValue('isGet'));
    }

    async function  onChange4Customer (value) {
        setCompanyOptions([]); 
        form.setFieldsValue({...form.getFieldsValue(),
            "companyId" : "0"
        });
        try {
            const res = await request.get('/api/base/company/getByCustomerId', {
              params: {
                userId: localStorage.getItem('userId'),
                customerId: form.getFieldValue("customerId").toString().split(":")[0],
              },
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            })
            if (res.code === '0000') {
                setCompanyOptions(res.data); 
                console.log(companyOptions);
            }
          } catch (error) {
            console.log(111, error);
          }     
    }

    function onBlur() {
        console.log('blur');
    }

    async function onFocus4Company() {

        try {
            const res = await request.get('/api/base/company/getByCustomerId', {
              params: {
                userId: localStorage.getItem('userId'),
                customerId: form.getFieldValue("customerId").toString().split(":")[0],
              },
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            })
            if (res.code === '0000') {
                setCompanyOptions(res.data); 
                console.log(companyOptions);
            }
          } catch (error) {
            console.log(111, error);
          }     
    }

    function onSearch(val) {
        console.log('search:', val);
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
                width={800}
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
                        <Col span={4}>
                            <Form.Item
                                name="id "
                                label="编号"
                            >
                                <Input placeholder="编号" disabled />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item
                                name="createUserName"
                                label="填表人"
                            >
                                <Input defaultValue={localStorage.getItem('userName')} disabled />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                format='YYYY-MM-DD'
                                name="operatTime"
                                label="操作时间"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择部门成立日期',
                                    },
                                ]}
                            >
                                <DatePicker />
                            </Form.Item>
                        </Col>
                        <Col span={7}>
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
                                    // onFocus={onFocus}
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
                        <Col span={6}>
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
                                    // onFocus={onFocus}
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
                        <Col span={6}>
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
                                    // onFocus={onFocus}
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
                        <Col span={6}>
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
                                    // onFocus={onFocus}
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
                        <Col span={6}>
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
                                    // onFocus={onFocus}
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
                        <Col span={12} >
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
                                    // onFocus={onFocus4Company}
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
                        <Col span={12} >
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
                                    // onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.bankOptions.map(v => {
                                        return (<Select.Option key={v.id} value={v.name}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8} >
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
                        <Col span={8} >
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
                        <Col span={8} >
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
                    </Row>
                    <Row gutter={24}>
                        <Col span={8} >
                            <Form.Item
                                name="isGet"
                                label="收款情况"
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
                                    // onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    <Select.Option disabled key={0} value="0">请选择</Select.Option>
                                    <Select.Option key={1} value="全部已收">全部已收</Select.Option>
                                    <Select.Option key={2} value="全部未收">全部未收</Select.Option>
                                    <Select.Option key={3} value="部分未收">部分未收</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8} >
                            <Form.Item
                                name="otherCost"
                                label="其他费用(￥)"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入其他费用',
                                    },
                                ]}
                            >
                                <Input placeholder="其他费用(￥)" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
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
                    </Row>
                    <Row gutter={24}>
                        <Col span={8} >
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
                                    // onFocus={onFocus}
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
                        <Col span={16}>
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
                        <Col span={8}>
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
                        <Col span={8}>
                            <Button style={{
                                marginLeft: 8,
                            }}
                                type="primary"
                                htmlType="submit"
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
                    </Row>
                </Form>
            </Modal>
        </div>
    );
}

export default AddModal;


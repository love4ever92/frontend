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
            
            form.setFieldsValue({
                ...props.editObj,
                operatTime: moment(props.editObj.operatTime, 'YYYY-MM-DD'),
                id: props.editObj.key,
                departmentId,
                companyId,
                serviceStaffId,
                phoneStaffId,
                helpStaffId,
                createUserName2: props.editObj.createUserName,
                customerId,
            })
            if(props.type == 'confirm'){
                document.getElementById("confirm").style.display="block";
            }else if(props.type == 'finance'){
                document.getElementById("finance").style.display="block";
            }else if(props.type == 'teller'){
                document.getElementById("teller").style.display="block";
            }else if(props.type == 'financeManager'){
                document.getElementById("financeManager").style.display="block";
            }else if(props.type == 'productDirector'){
                document.getElementById("productDirector").style.display="block";
            }
            

        }
    }, [props.visible])
    

    const handleCancel = () => {
        Modal.confirm({
            title: '关闭订单详情',
            content: '确定关闭订单',
            onOk() {
                props.setVisible(false);
            },
            onCancel() {

            }
        })
    }

    
     /**
     * 业务负责人确认
     * @param {} params 
     */
    const productDirector = (params) =>{
        request.get('/api/base/order/productDirector', {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then(res => {
            if (res.code && res.code === '0000') {
                Modal.success({
                    title: '业务负责人确认订单成功',
                })
                props.setVisible(false);
            }else{
                setIsSubmit(true);
                message.error(res.data ? res.data:"确认提交失败，原因不明，请联系维护人员");
                Modal.error({
                    title: '产品经理确认订单失败',
                    content: "失败原因： " +  res.data ? res.data:"确认提交失败，原因不明，请联系维护人员",
                })
            }
        })
    }


    /**
     * 财务经理确认
     * @param {} params 
     */
    const financeManager = (params) =>{
        request.get('/api/base/order/financeManager', {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then(res => {
            if (res.code && res.code === '0000') {
                Modal.success({
                    title: '财务经理确认订单成功',
                })
                props.setVisible(false);
            }else{
                setIsSubmit(true);
                message.error(res.data ? res.data:"确认提交失败，原因不明，请联系维护人员");
                Modal.error({
                    title: '财务经理确认订单失败',
                    content: "失败原因： " +  res.data ? res.data:"确认提交失败，原因不明，请联系维护人员",
                })
            }
        })
    }


     /**
     * 出纳确认
     * @param {} params 
     */
    const teller = (params) =>{
        request.get('/api/base/order/teller', {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then(res => {
            if (res.code && res.code === '0000') {
                Modal.success({
                    title: '出纳确认订单成功',
                })
                props.setVisible(false);
            }else{
                setIsSubmit(true);
                message.error(res.data ? res.data:"确认提交失败，原因不明，请联系维护人员");
                Modal.error({
                    title: '出纳确认订单失败',
                    content: "失败原因： " +  res.data ? res.data:"确认提交失败，原因不明，请联系维护人员",
                })
            }
        })
    }

    /**
     * 会计确认
     * @param {} params 
     */
    const finance = (params) =>{
        request.get('/api/base/order/finance', {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then(res => {
            if (res.code && res.code === '0000') {
                Modal.success({
                    title: '会计确认订单成功',
                })
                props.setVisible(false);
            }else{
                setIsSubmit(true);
                message.error(res.data ? res.data:"确认提交失败，原因不明，请联系维护人员");
                Modal.error({
                    title: '会计确认订单失败',
                    content: "失败原因： " +  res.data ? res.data:"确认提交失败，原因不明，请联系维护人员",
                })
            }
        })
    }

    /**
     * 财务确认
     * @param {} params 
     */
    const confirm = (params) =>{
        request.get('/api/base/order/confirm', {
            params,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then(res => {
            if (res.code && res.code === '0000') {
                Modal.success({
                    title: '财务确认单成功',
                })
                props.setVisible(false);
            }else{
                setIsSubmit(true);
                message.error(res.data ? res.data : "确认提交失败，原因不明，请联系维护人员");
                Modal.error({
                    title: '财务确认订单失败',
                    content: "失败原因： " +  res.data ? res.data:"确认提交失败，原因不明，请联系维护人员",
                })
            }
        })
    }

    const onFinish = () => {
        if(isSubmit){
            setIsSubmit(false);
            if(props.type == "confirm"){
                // 业务确认
                const params={
                    orderId: form.getFieldValue('key'),
                    userId: localStorage.getItem('userId'),
                    confirmOpinion: form.getFieldValue('confirmOpinion'),
                    confirmStaff: form.getFieldValue('confirmStaff'),
                    confirmReason: form.getFieldValue('confirmReason'),
                }
                if(form.getFieldValue('confirmOpinion')=="不同意"){
                    if(form.getFieldValue('confirmReason')){
                        Modal.confirm({
                            title: '财务确认订单',
                            content: '确认提交确认！',
                            onOk () {
                                confirm(params);
                                setIsSubmit(true);
                            }
                        })
                        
                    }else{
                        setIsSubmit(true);
                        message.error("审核结果不同意，应该输入审核意见！");
                    }
                }else{
                    Modal.confirm({
                        title: '财务确认订单',
                        content: '确认提交确认！',
                        onOk () {
                            confirm(params);
                            setIsSubmit(true);
                        }
                    })
                }
                setIsSubmit(true);
            }else if(props.type == "finance"){
                // 财务助理确认
                const params={
                    orderId: form.getFieldValue('key'),
                    userId: localStorage.getItem('userId'),
                    financeOpinion: form.getFieldValue('financeOpinion'),
                    financeStaff: form.getFieldValue('financeStaff'),
                    financeReason: form.getFieldValue('financeReason'),
                }
                if(form.getFieldValue('financeOpinion')=="不同意"){
                    if(form.getFieldValue('financeReason')){
                        Modal.confirm({
                            title: '会计确认订单',
                            content: '确认提交确认！',
                            onOk () {
                                finance(params);
                                setIsSubmit(true);
                            }
                        })
                    }else{
                        setIsSubmit(true);
                        message.error("审核结果不同意，应该输入审核意见！");
                    }
                }else{
                    Modal.confirm({
                        title: '会计确认订单',
                        content: '确认提交确认！',
                        onOk () {
                            finance(params);
                            setIsSubmit(true);
                        }
                    })
                    setIsSubmit(true);
                }
            }else if(props.type == "teller"){
                // 出纳确认
                const params={
                    orderId: form.getFieldValue('key'),
                    userId: localStorage.getItem('userId'),
                    tellerOpinion: form.getFieldValue('tellerOpinion'),
                    tellerStaff: form.getFieldValue('tellerStaff'),
                    tellerReason: form.getFieldValue('tellerReason'),
                }
                if(form.getFieldValue('tellerOpinion')=="不同意"){
                    if(form.getFieldValue('tellerReason')){
                        Modal.confirm({
                            title: '出纳确认订单',
                            content: '确认提交确认！',
                            onOk () {
                                teller(params);
                                setIsSubmit(true);
                            }
                        })
                    }else{
                        setIsSubmit(true);
                        message.error("审核结果不同意，应该输入审核意见！");
                    }
                }else{
                    Modal.confirm({
                        title: '出纳确认订单',
                        content: '确认提交确认！',
                        onOk () {
                            teller(params);
                            setIsSubmit(true);
                        }
                    })
                }
                setIsSubmit(true);
            }else if(props.type == "financeManager"){
                // 财务经理确认
                const params={
                    orderId: form.getFieldValue('key'),
                    userId: localStorage.getItem('userId'),
                    financeManagerOpinion: form.getFieldValue('financeManagerOpinion'),
                    financeManagerStaff: form.getFieldValue('financeManagerStaff'),
                    financeManagerReason: form.getFieldValue('financeManagerReason'),
                }
                if(form.getFieldValue('financeManagerOpinion')=="不同意"){
                    if(form.getFieldValue('financeManagerReason')){
                        Modal.confirm({
                            title: '财务经理确认订单',
                            content: '确认提交确认！',
                            onOk () {
                                financeManager(params);
                                setIsSubmit(true);
                            }
                        })
                    }else{
                        setIsSubmit(true);
                        message.error("审核结果不同意，应该输入审核意见！");
                    }
                }else{
                    Modal.confirm({
                        title: '财务经理确认订单',
                        content: '确认提交确认！',
                        onOk () {
                            financeManager(params);
                            setIsSubmit(true);
                        }
                    })
                }
                setIsSubmit(true);
            }else if(props.type == "productDirector"){
                // 业务负责人确认
                const params={
                    orderId: form.getFieldValue('key'),
                    userId: localStorage.getItem('userId'),
                    productDirectorOpinion: form.getFieldValue('productDirectorOpinion'),
                    productDirectorStaff: form.getFieldValue('productDirectorStaff'),
                    productDirectorReason: form.getFieldValue('productDirectorReason'),
                }
                if(form.getFieldValue('productDirectorOpinion')=="不同意"){
                    if(form.getFieldValue('productDirectorReason')){
                        Modal.confirm({
                            title: '业务负责人会签订单',
                            content: '确认提交确认！',
                            onOk () {
                                productDirector(params);
                                setIsSubmit(true);
                            }
                        })
                    }else{
                        setIsSubmit(true);
                        message.error("审核结果不同意，应该输入审核意见！");
                    }
                }else{
                    Modal.confirm({
                        title: '业务负责人确认订单',
                        content: '确认提交确认！',
                        onOk () {
                            productDirector(params);
                            setIsSubmit(true);
                        }
                    })
                }
                setIsSubmit(true);
            }else{
                message.error("操作太频繁，请稍后20秒再试！！");
            }
        }
    }

    // const productDirector = () => {
    //     // 业务负责人发起会签
    //     let productDirectorStaffPlan
    //     if(localStorage.getItem("userName") === "孙克辉"){
    //         productDirectorStaffPlan = "吴剑萍"
    //     }else{
    //         productDirectorStaffPlan = "孙克辉" 
    //     }
    //     const params={
    //         orderId: form.getFieldValue('key'),
    //         productDirectorStaffPlan: productDirectorStaffPlan,
    //         userId: localStorage.getItem('userId'),
    //     }
    //     Modal.confirm({
    //         title: '发起订单会签',
    //         content: `是否邀请${productDirectorStaffPlan}会签？`,
    //         onOk () {
    //             request.get('/api/base/order/productDirector', {
    //                 params,
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Accept': 'application/json',
    //                 },
    //             }).then(res => {
    //                 if (res.code && res.code === '0000') {
    //                     message.info('确认提交成功');
    //                     timeOut(20000);
    //                     props.setVisible(false);
    //                 }else{
    //                     setIsSubmit(true);
    //                     message.error(res.data ? res.data:"确认提交失败，原因不明，请联系维护人员");
    //                 }
    //             })
    //             setIsSubmit(true);
    //         }     
    //     })
    // }
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
                    onFinish={onFinish}
                >
                    <Row gutter={24}>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="key"
                                label="编号"
                            >
                                <Input  disabled />
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
                                <DatePicker disabled/>
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
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择客户',
                                    },
                                ]}
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
                                <Input  disabled/>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6} >
                            <Form.Item
                                name="serviceMoney"
                                label="小款金额(￥)"
                            >
                                <Input  disabled/>
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
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="getMoney"
                                label="已收金额(￥)"
                            >
                                <Input  disabled/>
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
                                <Input  disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={24}>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="createUserName2"
                                label="填表人"
                                
                            >
                                <Input  disabled/>
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
                    <Divider  />
                    <Row gutter={24}  >
                        <Col  {...layoutcol_6}>
                            <Form.Item
                                name="productDirectorStaff"
                                label="业务负责人确认"
                                rules={[
                                    {
                                        required: props.type==="productDirector",
                                        message: '签名',
                                    },
                                ]}
                            >
                                <Input   placeholder={props.type==="productDirector"? "签名":""}     disabled={ props.type!=="productDirector" } />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="productDirectorOpinion"
                                label="确认结果"
                                rules={[
                                    {
                                        required: props.type==="productDirector",
                                        message: '请选择',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder={props.type==="productDirector"? "请选择":""} 
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled={ props.type!=="productDirector" }
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
                                <Input placeholder={props.type==="productDirector"? "处理意见":""} 
                                    disabled={ props.type!=="productDirector" } />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}  style={ { display:"none" }  } id = 'productDirector' >
                        <Col  {...layoutcol_12}>
                            <Button  
                                style={{
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
                    <Divider />
                    <Row gutter={24}>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="confirmStaff"
                                label="财务确认"
                                rules={[
                                    {
                                        required: props.type==="confirm",
                                        message: '财务签名',
                                    },
                                ]}
                            >
                                <Input placeholder={props.type==="confirm"? "签名":""} 
                                     disabled={props.type!=="confirm" } />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="confirmOpinion"
                                label="确认结果"
                                rules={[
                                    {
                                        required: props.type==="confirm",
                                        message: '请选择',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder={props.type==="confirm"? "请选择":""}
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled={props.type!=="confirm" }
                                >
                                    <Select.Option key={1} value="同意">同意</Select.Option>
                                    <Select.Option key={2} value="不同意">不同意</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_12}>
                            <Form.Item
                                name="confirmReason"
                                label="处理意见"
                            >
                                <Input placeholder={props.type==="confirm"? "处理意见":""} disabled={props.type!=="confirm" } />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24} style={ { display:"none" }  } id = 'confirm' >
                        <Col {...layoutcol_12}>
                            <Button 
                                style={{
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
                    <Divider />
                    {/* <Row gutter={24}>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="financeStaff"
                                label="会计确认"
                                rules={[
                                    {
                                        required: props.type==="finance",
                                        message: '会计确认签名',
                                    },
                                ]}
                            >
                                <Input  placeholder={props.type==="finance"? "签名":""} disabled={ props.type!=="finance" } />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="financeOpinion"
                                label="确认结果"
                                rules={[
                                    {
                                        required: props.type==="finance",
                                        message: '请选择',
                                    },
                                ]}
                                
                            >
                                <Select
                                    showSearch
                                    placeholder={props.type==="finance"? "请选择":""}
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled={ props.type!=="finance" }
                                >
                                    <Select.Option key={1} value="同意">同意</Select.Option>
                                    <Select.Option key={2} value="不同意">不同意</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_12}>
                            <Form.Item
                                name="financeReason"
                                label="处理意见"
                            >
                                <Input placeholder={props.type==="finance"? "处理意见":""}  disabled={ props.type!=="finance" }/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={ { display:"none" }  } id = 'finance' >
                        <Col span={8}>
                            <Button 
                                style={{
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
                    <Divider />
                    <Row gutter={24} >
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="tellerStaff"
                                label="出纳确认"
                                rules={[
                                    {
                                        required: props.type==="teller",
                                        message: '出纳确认签名',
                                    },
                                ]}
                            >
                                <Input  placeholder={props.type==="teller"? "签名":""} disabled={ props.type!=="teller"  } />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="tellerOpinion"
                                label="确认结果"
                                rules={[
                                    {
                                        required: props.type==="teller",
                                        message: '请选择',
                                    },
                                ]}
                                
                            >
                                <Select
                                    showSearch
                                    placeholder={props.type==="teller"? "请选择":""} 
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled={props.type!=="teller" }
                                >
                                    <Select.Option key={1} value="同意">同意</Select.Option>
                                    <Select.Option key={2} value="不同意">不同意</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_12}>
                            <Form.Item
                                name="tellerReason"
                                label="处理意见"
                            >
                                <Input placeholder={props.type==="teller"? "处理意见" :""}  disabled={props.type !== "teller" }/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={ { display:"none" }  } id = 'teller'> 
                        <Col span={8}>
                            <Button 
                                style={{
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
                    <Divider />
                    <Row gutter={24}>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="financeManagerStaff"
                                label="财务经理确认"
                                rules={[
                                    {
                                        required: props.type==="financeManager",
                                        message: '财务经理签名',
                                    },
                                ]}
                            >
                                <Input  placeholder={props.type==="financeManager"? "签名" :""} disabled={ props.type!=="financeManager" } />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="financeManagerOpinion"
                                label="确认结果"
                                rules={[
                                    {
                                        required: props.type==="financeManager",
                                        message: '请选择',
                                    },
                                ]}
                                
                            >
                                <Select
                                    showSearch
                                    placeholder={props.type==="financeManager"? "请选择" :""}
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled={props.type!=="financeManager" }
                                >
                                    
                                    <Select.Option key={1} value="同意">同意</Select.Option>
                                    <Select.Option key={2} value="不同意">不同意</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_12}>
                            <Form.Item
                                name="financeManagerReason"
                                label="处理意见"
                            >
                                <Input placeholder={props.type==="financeManager"? "处理意见" :""}  disabled={props.type !== "financeManager" }/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={ { display:"none" }  }  id = 'financeManager'>    
                        <Col span={8}>
                            <Button 
                                style={{
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
                    </Row> */}
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


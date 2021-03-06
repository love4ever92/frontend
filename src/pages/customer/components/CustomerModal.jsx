/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Input, Row, Col, Select, DatePicker, message } from 'antd'
import request from '@/utils/request';
import moment from 'moment';


const CustomerModal = (props) => {


    const [form] = Form.useForm()
    const [maskClosable,] = useState(false);
    const [mateInfoVisible, setMateInfoVisible] = useState(false);
    const [visitDateDisable, setVisitDateDisable] = useState(true);
    const [msgCityOptions, setMsgCityOptions] = useState([]);
    const [msgAreaOptions, setMsgAreaOptions] = useState([]);
    const [msgProvinceOptions, setMsgProvinceOptions] = useState([]);
    const [idProvinceOptions, setIdProvinceOptions] = useState([]);
    const [idCityOptions, setIdCityOptions] = useState([]);
    const [idAreaOptions, setIdAreaOptions] = useState([]);
    const [ isSubmit, setIsSubmit ] = useState(true);



    useEffect(() => {
        form.setFieldsValue({ ...props.editObj, 
            birthdayPicker: props.editObj.birthday?moment(props.editObj.birthday, 'YYYY-MM-DD'):null,
            visitDatePicker: props.editObj.visitDate?moment(props.editObj.visitDate, 'YYYY-MM-DD') :null,
        });
    }, [props.editObj])

    useEffect(() => {
        if (props.visible) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            getProvince();
            if(props.modalType == "add"){
                form.resetFields();
            }else if(props.modalType == "edit"){
                if(props.editObj && props.editObj.isOrder == 1){
                    setVisitDateDisable(false);
                }
            }
        }
    }, [props.visible])

    const handleCancel = () => {
        Modal.confirm({
            title: '客户信息',
            content: '确定停止操作客户信息、企业信息、客户信用报告、企业信用报告',
            onOk() {
                props.setVisible(false);
                form.resetFields();
            },
            onCancel() {
            }
        })
    }

    const addData = () => {
        
        if (form.getFieldValue('birthdayPicker')) {
            let visitDate;
            // eslint-disable-next-line eqeqeq
            if(form.getFieldValue('isOrder') == 1){
                if(!form.getFieldValue('visitDatePicker')){
                    message.error('如果预约了面谈，预约面谈日期不能为空');
                    return;
                }
                visitDate = form.getFieldValue('visitDatePicker').format('YYYY-MM-DD');
            }else{
                visitDate = '';
            }
            request.post("/api/base/customer/add", {
                data: {
                    ...form.getFieldsValue(),
                    userId: localStorage.getItem('userId'),
                    birthday: form.getFieldValue('birthdayPicker').format('YYYY-MM-DD'),
                    visitDate,
                    idCity: form.getFieldValue('idCity'),
                },
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
            }).then(res => {
                if (res.code === '0000') {
                    Modal.confirm({
                        title: '添加客户',
                        content: '添加客户成功,如继续添加企业信息请到企业管理添加',
                        onOk() {
                            
                            props.setVisible(true,
                                form.getFieldValue('customerName'),
                                form.getFieldValue('mobilePhone'), 
                                form.getFieldValue('idNum'),
                                res.data,
                                );
                            form.resetFields();
                        },
                    })
                } else {
                    Modal.confirm({
                        title: '添加客户',
                        content: res.data ? res.data : '添加失败',
                        onOk() {
                        },
                    })
                }
            })
        } else {
            message.error('客户生日不能为空');
        }
    }

    const editData = () => {
        
        if (form.getFieldValue('birthdayPicker')) {
            let visitDate;
            // eslint-disable-next-line eqeqeq
            if(form.getFieldValue('isOrder') == 1){
                if(!form.getFieldValue('visitDatePicker')){
                    message.error('如果预约了面谈，预约面谈日期不能为空');
                    return;
                }
                visitDate = form.getFieldValue('visitDatePicker').format('YYYY-MM-DD');
            }else{
                visitDate = '';
            }
            request.post("/api/base/customer/update", {
                data: {
                    ...form.getFieldsValue(),
                    userId: localStorage.getItem('userId'),
                    birthday: form.getFieldValue('birthdayPicker').format('YYYY-MM-DD'),
                    visitDate,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }).then(res => {
                if (res.code === '0000') {
                    Modal.confirm({
                        title: '编辑客户',
                        content: '客户修改信息成功,如需修改企业信息，请到管理操作',
                        onOk() {
                            props.setVisible(true,
                                form.getFieldValue('customerName'),
                                form.getFieldValue('mobilePhone'), 
                                form.getFieldValue('idNum'),
                                form.getFieldValue('id')
                            );
                            // form.resetFields();
                        },
                    })
                } else {
                    Modal.confirm({
                        title: '编辑客户',
                        content: res.data ? res.data : '修改客户信息失败',
                        onOk() {
                        },
                    })
                }
            })
        }else{
            message.error('客户生日不能为空');
        }
    }     
    
    const onFinish = () => {
        if (!form.getFieldValue('birthdayPicker')) {
            message.error('客户生日不能为空');
            Modal.error({
                title: '添加/编辑客户',
                content: '客户生日不能为空，请选择客户生日',          
            })
            return;   
        }
        if(form.getFieldValue('isOrder') == 1){
            if(!form.getFieldValue('visitDatePicker')){
                message.error('如果预约了面谈，预约面谈日期不能为空');
                Modal.error({
                    title: '添加/编辑客户',
                    content: '如果预约了面谈，预约面谈日期不能为空',          
                })
                return;
            }
        }
        if(isSubmit){
            try{
                setIsSubmit(false);
                if(props.modalType === 'add'){
                    Modal.confirm({
                        title: '添加客户',
                        content: '确定添加客户信息',
                        onOk() {
                            addData();
                            setIsSubmit(true);
                        },                
                    })
                }else if(props.modalType === 'edit'){
                    Modal.confirm({
                        title: '编辑客户',
                        content: '确定修改客户信息',
                        onOk() {
                            editData();
                            setIsSubmit(true);
                        },                
                    })

                }else if(props.modalType === 'look'){
                    props.setVisible(true,
                        form.getFieldValue('customerName'),
                        form.getFieldValue('mobilePhone'), 
                        form.getFieldValue('idNum'),
                        form.getFieldValue('id')
                    );
                    setIsSubmit(true);
                }
                setIsSubmit(true);
            }catch(e){
                console.error(e);
                setIsSubmit(true);
            }
            
            
        }else{
            message.error("操作过于频繁，稍后再试")
        }
    }

    // 选择性别处理
    const genderHandleChange = value => {
        form.setFieldsValue({ gender: value });
    }
    // 选择学历处理
    const educationHandleChange = value => {
        form.setFieldsValue({ education: value });
    }
    const rankHandleChange = value => {
        form.setFieldsValue({ rank: value });
    }

    
    // 选择婚姻状况处理
    const isMarriedHandleChange = value => {

        form.setFieldsValue({ isMarried: value });
        // eslint-disable-next-line eqeqeq
        if (value == 2) {
            setMateInfoVisible(true);
        } else {
            setMateInfoVisible(false);
        }
    }

    const isOrderHandleChange = value => {

        form.setFieldsValue({ isOrder: value });
        // eslint-disable-next-line eqeqeq
        if (value == 1) {
            setVisitDateDisable(false);
        } else {
            setVisitDateDisable(true);
        }
    }


    const handleBirthdayCHange = (date, dateString) => {
        form.setFieldsValue({ birthday: dateString.toString() });
    }

    const handleVisitDateCHange = (date, dateString) => {
        form.setFieldsValue({ visitDate: dateString.toString() });
    }

    /**
     * 下拉框获取城市
     */
    const getProvince = async () => {
        try {
            const res = await request.get('/api/base/address/province/',{
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
            if (res.code === '0000') {
                setIdProvinceOptions(res.data);
                setMsgProvinceOptions(res.data);
            }
        } catch (error) {
            console.log(111, error);
        }
    }
    /**
     * 下拉框获取城市
     */
    const getCity = (value) => {
        return new Promise((resolve) => {
            request.get('/api/base/address/city/', {
                params: {
                    provinceCode: value,
                },
                // eslint-disable-next-line consistent-return
            }).then(res => {
                resolve(res.data)
                if (res.code === '0000') {
                    return
                }
                message.error('获取数据失败！');
            })
        })

    }
    /**
     * 下拉获取区/县
     */
    const getArea = (value, key) => {
        return new Promise((resolve) => {
            request.get('/api/base/address/area/', {
                params: {
                    cityCode: value,
                    code: key,
                },
                // eslint-disable-next-line consistent-return
            }).then(res => {
                resolve(res.data)
                if (res.code === '0000') {
                    return
                }
                message.error('获取数据失败！');
            })
        })
    }
    const msgProvinceHandleChange = (value, key) => {
        setMsgCityOptions([]);
        setMsgAreaOptions([]);
        form.setFieldsValue({...form.getFieldsValue(),
            "msgCity" : "0",
            "msgArea" : "0",
        });
        getCity(value, key).then(res => {
            setMsgCityOptions(res);
        });
    }
    const idProvinceHandleChange = value => {
        setIdCityOptions([]);
        setIdAreaOptions([]);
        form.setFieldsValue({...form.getFieldsValue(),
            "idCity" : "0",
            "idArea" : "0",
        });
        getCity(value).then(res => {
            setIdCityOptions(res);
        });
    }
    const msgCityHandleChange = value => {
        setMsgAreaOptions([]);
        form.setFieldsValue({...form.getFieldsValue(),
            "msgArea" : "0",
        });
        getArea(value).then(res => {
            setMsgAreaOptions(res);
        });
    }
    const idCityHandleChange = value => {
        setIdAreaOptions([]);
        form.setFieldsValue({...form.getFieldsValue(),
            "idArea" : "0",
        });
        getArea(value).then(res => {
            setIdAreaOptions(res);
        });
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
                setVisible={props.setVisible}
                // onOk = {handleOk}
                onCancel={handleCancel}
                maskClosable={maskClosable}
                getContainer={false}
                destroyOnClose
                width="1000px"
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
                                name="id"
                                label="编号"
                            >
                                <Input placeholder="" disabled />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="customerName"
                                label="客户姓名"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入员客户姓名',
                                    },
                                    {
                                        max: 50, message: '客户姓名不得超过50个字符'
                                    }
                                ]}
                            >
                                <Input placeholder="客户姓名" disabled={props.modalType==='edit' || props.modalType==='look'} />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="mobilePhone"
                                label="手机号码"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入手机号码',
                                    },
                                    {
                                        pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码'
                                    }
                                ]}
                            >
                                <Input placeholder="请输入客户手机号码" disabled={props.modalType==='edit' || props.modalType==='look'} />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="gender"
                                label="性别"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择',
                                    },
                                ]}
                            >
                                <Select defaultValue="0" onChange={genderHandleChange}
                                    // eslint-disable-next-line react/jsx-no-duplicate-props
                                    defaultValue={form.getFieldValue('gender')} 
                                    placeholder="请选择"
                                    disabled={props.modalType==='edit' || props.modalType==='look'}>
                                    <Select.Option value="0" disabled>请选择</Select.Option>
                                    <Select.Option value={1}>男</Select.Option>
                                    <Select.Option value={2}>女</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="idNum"
                                label="身份证"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入客户身份证号码',
                                    },
                                    {
                                        max: 18, message: '客户姓名不得多于18个字符'
                                    },
                                    {
                                        mix: 15, message: '客户姓名不得少于15个字符'
                                    }
                                ]}
                            >
                                <Input placeholder="请输入客户身份证号码" disabled={props.modalType==='edit' || props.modalType==='look'} />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="birthdayPicker"
                                label="生日"
                                rules={[
                                    {
                                        required: false,
                                        message: '请选择客户生日',
                                    },
                                ]}
                            >
                                <DatePicker
                                    disabled={props.modalType==='edit' || props.modalType==='look'}
                                    onChange={handleBirthdayCHange} format='YYYY-MM-DD'
                                />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="education"
                                label="学历"
                            >
                                <Select defaultValue="0" disabled ={props.modalType==='look'} 
                                    onChange={educationHandleChange}
                                    placeholder="请选择"
                                    // eslint-disable-next-line react/jsx-no-duplicate-props
                                    defaultValue={form.getFieldValue('education')}>
                                    <Select.Option value={0} disabled>请选择</Select.Option>
                                    <Select.Option value={1}>小学</Select.Option>
                                    <Select.Option value={2}>初中</Select.Option>
                                    <Select.Option value={3}>高中/中专</Select.Option>
                                    <Select.Option value={4}>大专</Select.Option>
                                    <Select.Option value={5}>本科</Select.Option>
                                    <Select.Option value={6}>研究生</Select.Option>
                                    <Select.Option value={7}>硕士</Select.Option>
                                    <Select.Option value={8}>博士</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col {...layoutcol_12}>
                            <Form.Item
                                name="bankName"
                                label="银行名称"
                            >
                                <Input placeholder={props.modalType==='look'?"":"请输入银行名称"} disabled = {props.modalType==='look'}/>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_12}>
                            <Form.Item
                                name="bankCardNum"
                                label="银行卡号码"
                            >
                                <Input placeholder={props.modalType==='look'?"":"请输入银行卡号码"} disabled ={props.modalType==='look'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="isMarried"
                                label="婚姻状况"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择婚姻情况',
                                    },
                                ]}
                            >
                                <Select defaultValue="0" onChange={isMarriedHandleChange}
                                    // eslint-disable-next-line react/jsx-no-duplicate-props
                                    defaultValue={form.getFieldValue('isMarried')} 
                                    placeholder="请选择"
                                    disabled ={props.modalType==='look'}>
                                    <Select.Option value={0} disabled>请选择</Select.Option>
                                    <Select.Option value={1}>未婚</Select.Option>
                                    <Select.Option value={2}>已婚</Select.Option>
                                    <Select.Option value={3}>离异</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="mateName"
                                label="配偶姓名"
                            >
                                <Input
                                    placeholder={props.modalType == "look" ||  form.getFieldValue('isMarried') != 2  ? "":"请输入配偶姓名"}
                                    disabled={!mateInfoVisible} />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_12}>
                            <Form.Item
                                name="mateIdNum"
                                label="配偶身份证号码"
                                rule={[
                                    {
                                        max: 18, message: '客户姓名不得多于18个字符'
                                    },
                                    {
                                        mix: 15, message: '客户姓名不得少于15个字符'
                                    }
                                ]}
                            >
                                <Input
                                    placeholder={props.modalType == "look" ||  form.getFieldValue('isMarried') != 2  ? "":"请输入配偶身份证号码"}
                                    disabled={!mateInfoVisible} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col {...layoutcol_12}>
                            <Form.Item
                                name="mateMobilePhone"
                                label="客户配偶的手机号码"
                                rules={[
                                    {
                                        required: false,
                                        message: '请输入客户配偶的手机号码',
                                    },
                                    {
                                        pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码'
                                    }
                                ]}
                            >
                                <Input  placeholder={props.modalType == "look" ||  form.getFieldValue('isMarried') != 2  ? "":"请输入客户配偶的手机号码"}
                                disabled={!mateInfoVisible} />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_12}>
                            <Form.Item
                                name="mateCompany"
                                label="配偶工作单位"
                            >
                                <Input  placeholder={props.modalType == "look" ||  form.getFieldValue('isMarried') != 2  ? "":"请输入配偶工作单位"} disabled={!mateInfoVisible} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="msgProvince"
                                label="通讯地址"
                                
                            >
                                <Select
                                    showSearch
                                    placeholder="省"
                                    optionFilterProp="children"
                                    onChange={msgProvinceHandleChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    defaultValue={form.getFieldValue('msgProvince')}
                                    key={form.getFieldValue('msgProvince')}
                                    disabled ={props.modalType==='look'}
                                >
                                    <Select.Option disabled key='0' value='0' >省</Select.Option>
                                    {msgProvinceOptions.map(v => {
                                        return (<Select.Option key={v.code} value={v.code ? `${v.code}:${v.name}` : v.id}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="msgCity"
                                label=""
                                
                            >
                                <Select
                                    showSearch
                                    placeholder="市"
                                    optionFilterProp="children"
                                    onChange={msgCityHandleChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    key={form.getFieldValue('msgCity')}
                                    defaultValue={form.getFieldValue('msgCity')}
                                    disabled ={props.modalType==='look'}
                                >
                                    <Select.Option disabled key='0' value='0'>市</Select.Option>
                                    {msgCityOptions.map(v => {
                                        return (<Select.Option key={v.code} value={v.code ? `${v.code}:${v.name}` : v.id}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="msgArea"
                                label=""
                            >
                                <Select
                                    showSearch
                                    placeholder="区"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    key={form.getFieldValue('msgArea')}
                                    defaultValue={form.getFieldValue('msgArea')}
                                    disabled ={props.modalType==='look'}
                                >
                                    <Select.Option disabled key='0' value='0'>区</Select.Option>
                                    {msgAreaOptions.map(v => {
                                        return (<Select.Option key={v.code} value={v.code ? `${v.name}` : v.id}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="msgAddress"
                                label=""
                                
                            >
                                <Input placeholder = {props.modalType=="look"?"":"请输入详细地址"}  disabled = {props.modalType==='look'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="idProvince"
                                label="户籍地址"
                            >
                                <Select
                                    showSearch
                                    placeholder="省"
                                    optionFilterProp="children"
                                    onChange={idProvinceHandleChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    key={form.getFieldValue('idProvince')}
                                    defaultValue={form.getFieldValue('idProvince')}
                                    disabled ={props.modalType==='look'}
                                >
                                    <Select.Option disabled key='0' value='0'>省</Select.Option>
                                    {idProvinceOptions.map(v => {
                                        return (<Select.Option key={v.code} value={v.code ? `${v.code}:${v.name}` : v.id}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="idCity"
                                label=""
                            >
                                <Select
                                    showSearch
                                    placeholder="市"
                                    optionFilterProp="children"
                                    onChange={idCityHandleChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    key = {form.getFieldValue('idCity')}
                                    defaultValue={form.getFieldValue('idCity')}
                                    disabled ={props.modalType==='look'}
                                >
                                    <Select.Option disabled key='0' value='0'>市</Select.Option>
                                    {idCityOptions.map(v => {
                                        return (<Select.Option key={v.code} value={v.code ? `${v.code}:${v.name}` : v.id}>{v.name}</Select.Option>);
                                    })}
                                </Select>                               
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="idArea"
                                label=""
                            >
                                <Select
                                    showSearch
                                    placeholder="区"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    key={form.getFieldValue('idArea')}
                                    defaultValue={form.getFieldValue('idArea')}
                                    disabled ={props.modalType==='look'}
                                >
                                    <Select.Option disabled key='0' value='0'>区</Select.Option>
                                    {idAreaOptions.map(v => {
                                        return (<Select.Option key={v.code} value={v.code ? `${v.name}` : v.id}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="idAddress"
                                label=""
                            >
                                <Input placeholder = {props.modalType=="look"?"":"请输入详细地址"} disabled ={props.modalType==='look'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="isOrder"
                                label="是否预约面谈"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择是否预约面谈',
                                    },
                                ]}
                            >
                                <Select
                                    onChange={isOrderHandleChange}
                                    defaultValue={form.getFieldValue('visitDate') ? form.getFieldValue('visitDate') : 0}
                                    disabled ={props.modalType==='look'}>
                                    <Select.Option value={0} disabled>请选择</Select.Option>
                                    <Select.Option value={1}>是</Select.Option>
                                    <Select.Option value={2}>否</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="visitDatePicker"
                                label="预约面谈日期"
                                rules={[
                                    {
                                        required: false,
                                        message: '请选择预约日期',
                                    },
                                ]}
                            >
                                <DatePicker onChange={handleVisitDateCHange}
                                    format='YYYY-MM-DD' disabled={ visitDateDisable||props.modalType==='look' } />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="visitTimes"
                                label="已拜访次数"
                            >
                                <Input placeholder='拜访次数' disabled ={props.modalType==='look'}/>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="remark"
                                label="备注"
                            >
                                <Input placeholder={props.modalType==='look'?"":"请输入备注"} disabled ={props.modalType==='look'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button style={{
                        marginLeft: 8,
                    }}
                        type="primary"
                        htmlType="submit"
                    >                        
                        {props.modalType=="look"?"下一步 - 查看公司信息":"提交"}
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
                </Form>
            </Modal>
        </div>
    );
}

export default CustomerModal;
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
        }
    }, [props.visible])

    const handleCancel = () => {
        Modal.confirm({
            title: '添加客户',
            content: '确定取消添加客户',
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
                        content: '添加客户成功,如继续添加企业信息请点击确定',
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
                        content: '客户修改信息成功,如继续修改企业信息请点击确定',
                        onOk() {
                            props.setVisible(true,
                                form.getFieldValue('customerName'),
                                form.getFieldValue('mobilePhone'), 
                                form.getFieldValue('idNum'),
                                form.getFieldValue('id')
                            );
                            form.resetFields();
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
        if(isSubmit){
            setIsSubmit(false);
            if(props.modalType === 'add'){
                addData();
            }else if(props.modalType === 'edit'){
                Modal.confirm({
                    title: '编辑客户',
                    content: '确定修改客户信息',
                    onOk() {
                        editData();
                    },                
                })
            }else if(props.modalType === 'look'){
                props.setVisible(true,
                    form.getFieldValue('customerName'),
                    form.getFieldValue('mobilePhone'), 
                    form.getFieldValue('idNum'),
                    form.getFieldValue('id')
                );
            }
            setIsSubmit(true);
            
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
        getCity(value, key).then(res => {
            setMsgCityOptions(res);
        });
    }
    const idProvinceHandleChange = value => {
        getCity(value).then(res => {
            setIdCityOptions(res);
        });
    }
    const msgCityHandleChange = value => {
        getArea(value).then(res => {
            setMsgAreaOptions(res);
        });
    }
    const idCityHandleChange = value => {
        getArea(value).then(res => {
            setIdAreaOptions(res);
        });
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
                width="800px"
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
                                name="id"
                                label="编号"
                            >
                                <Input placeholder="" disabled />
                            </Form.Item>
                        </Col>
                        <Col span={7}>
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
                        <Col span={8}>
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
                        <Col span={5}>
                            <Form.Item
                                name="gender"
                                label="性别"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择客户性别',
                                    },
                                ]}
                            >
                                <Select defaultValue="0" onChange={genderHandleChange}
                                    // eslint-disable-next-line react/jsx-no-duplicate-props
                                    defaultValue={form.getFieldValue('gender')} disabled={props.modalType==='edit' || props.modalType==='look'}>
                                    <Select.Option value="0" disabled>请选择</Select.Option>
                                    <Select.Option value={1}>男</Select.Option>
                                    <Select.Option value={2}>女</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={10}>
                            <Form.Item
                                name="idNum"
                                label="身份证号码"
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
                        <Col span={6}>
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
                                    disabled ={props.modalType==='look'}
                                    onChange={handleBirthdayCHange} format='YYYY-MM-DD'
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="education"
                                label="学历"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择学历',
                                    },
                                ]}
                            >
                                <Select defaultValue="0" disabled ={props.modalType==='look'} onChange={educationHandleChange}
                                    // eslint-disable-next-line react/jsx-no-duplicate-props
                                    defaultValue={form.getFieldValue('education')}>
                                    <Select.Option value={0} disabled>请选择</Select.Option>
                                    <Select.Option value={1}>小学</Select.Option>
                                    <Select.Option value={2}>初中</Select.Option>
                                    <Select.Option value={3}>高中</Select.Option>
                                    <Select.Option value={4}>大学专科</Select.Option>
                                    <Select.Option value={5}>大学本科</Select.Option>
                                    <Select.Option value={6}>研究生</Select.Option>
                                    <Select.Option value={7}>硕士</Select.Option>
                                    <Select.Option value={8}>博士</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="bankName"
                                label="银行名称"
                            >
                                <Input placeholder="请输入银行名称" disabled ={props.modalType==='look'}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="bankCardNum"
                                label="银行卡号码"
                            >
                                <Input placeholder="请输入银行卡号码" disabled ={props.modalType==='look'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={6}>
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
                                    defaultValue={form.getFieldValue('isMarried')} disabled ={props.modalType==='look'}>
                                    <Select.Option value={0} disabled>请选择</Select.Option>
                                    <Select.Option value={1}>未婚</Select.Option>
                                    <Select.Option value={2}>已婚</Select.Option>
                                    <Select.Option value={3}>离异</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={7}>
                            <Form.Item
                                name="mateName"
                                label="配偶姓名"
                            >
                                <Input
                                    placeholder="请输入配偶姓名"
                                    disabled={!mateInfoVisible} />
                            </Form.Item>
                        </Col>
                        <Col span={11}>
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
                                    placeholder="请输入配偶身份证号码"
                                    disabled={!mateInfoVisible} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
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
                                <Input placeholder="请输入客户配偶的手机号码" disabled={!mateInfoVisible} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="mateCompany"
                                label="配偶工作单位"
                            >
                                <Input placeholder="请输入配偶工作单位" disabled={!mateInfoVisible} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={3}>
                            <Form.Item
                                name="ccc "
                                label="通讯地址"
                            />
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="msgProvince"
                                label=""
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择',
                                    },
                                ]}
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
                        <Col span={4}>
                            <Form.Item
                                name="msgCity"
                                label=""
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择',
                                    },
                                ]}
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
                        <Col span={4}>
                            <Form.Item
                                name="msgArea"
                                label=""
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择',
                                    },
                                ]}
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
                        <Col span={9}>
                            <Form.Item
                                name="msgAddress"
                                label=""
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入详细地址',
                                    },
                                ]}
                            >
                                <Input placeholder="请输入详细地址" disabled ={props.modalType==='look'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={3}>
                            <Form.Item
                                name="cc"
                                label="户籍地址"
                            />
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="idProvince"
                                label=""
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
                        <Col span={4}>
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
                        <Col span={4}>
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
                        <Col span={9}>
                            <Form.Item
                                name="idAddress"
                                label=""
                            >
                                <Input placeholder="请输入详细地址" disabled ={props.modalType==='look'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
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
                        <Col span={8}>
                            <Form.Item
                                name="visitDatePicker"
                                label="下次拜访日期"
                                rules={[
                                    {
                                        required: false,
                                        message: '请选择拜访日期',
                                    },
                                ]}
                            >
                                <DatePicker onChange={handleVisitDateCHange}
                                    format='YYYY-MM-DD' disabled={ visitDateDisable||props.modalType==='look' } />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="visitTimes"
                                label="已拜访次数"
                            >
                                <Input placeholder='拜访次数' disabled ={props.modalType==='look'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="remark"
                                label="备注"
                            >
                                <Input placeholder="请输入备注" disabled ={props.modalType==='look'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button style={{
                        marginLeft: 8,
                    }}
                        type="primary"
                        htmlType="submit"
                    >
                        下一步 - 公司信息
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
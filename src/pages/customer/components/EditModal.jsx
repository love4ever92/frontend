import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Input, Row, Col, Select, DatePicker, message } from 'antd'
import request from '@/utils/request';
import moment from 'moment';
import SelectItem from './SelectItem'

const EditModal = (props) => {

    const [form] = Form.useForm()
    const [maskClosable] = useState(false);
    const [mateInfoVisible, setMateInfoVisible] = useState(false);
    const [companyCityOptions, setCompanyCityOptions] = useState([]);
    const [companyAreaOptions, setCompanyAreaOptions] = useState([]);
    const [msgCityOptions, setMsgCityOptions] = useState([]);
    const [msgAreaOptions, setMsgAreaOptions] = useState([]);
    const [idCityOptions, setIdCityOptions] = useState([]);
    const [idAreaOptions, setIdAreaOptions] = useState([]);


    useEffect(() => {
        form.setFieldsValue(props.editObj)
    }, [props.editObj])


    const handleCancel = e => {
        Modal.confirm({
            title: '修改客户信息',
            content: '确定取消修改客户信息',
            onOk() {
                props.setVisible(false);
            },
            onCancel() {

            }
        })
    }


    const onFinish = () => {
        request.post("/api/base/customer/update", {
            data: { ...form.getFieldsValue(), userId: localStorage.getItem('userId') },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(res => {
            if (res.code === '0000') {
                Modal.confirm({
                    title: '修改客户信息',
                    content: '修改客户信息成功',
                    onOk() {
                        props.setVisible(false);
                    },
                })
                
            } else {
                Modal.confirm({
                    title: '修改客户信息',
                    content: '系统添加客户失败，请重新添加！',
                    onOk() {
                    },
                })
            }
        })
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
        if (value == 2) {
            setMateInfoVisible(true);
        } else {
            setMateInfoVisible(false);
        }
    }
    // 选择生日处理
    const birthdayOnChange = (date, dateString) => {
        form.setFieldsValue({ birthday: dateString.toString() });
    }

    
    // 选择公司类型
    const typeHandleChange = value => {
        form.setFieldsValue({ companyType: value });
    }
    const invoiceMoneyHandleChange = value => {
        form.setFieldsValue({ invoiceMoney: value });
    }


    /**
     * 下拉框获取城市
     */
    const getCity = (value) => {
        return new Promise((resolve, reject) => {
            request.get('/api/base/address/city/', {
                params: {
                    provinceCode: value,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
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
        return new Promise((resolve, reject) => {
            request.get('/api/base/address/area/', {
                params: {
                    cityCode: value,
                    code: key,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
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

    const companyProvinceHandleChange = value => {
        getCity(value).then(res => {
            setCompanyCityOptions(res);
        });
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
    const companyCityHandleChange = value => {
        getArea(value).then(res => {
            setCompanyAreaOptions(res);
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
        form.setFieldsValue({ ...form.getFieldsValue, idCity: value });
    }
    const companyAreaHandleChange = value => {
    }
    const msgAreaHandleChange = value => {
    }
    const idAreaHandleChange = value => {
    }


    return (
        <div>
            <Modal
                id='editModal'
                title={props.title}
                visible={props.visible}
                // onOk = {handleOk}
                onCancel={handleCancel}
                maskClosable={maskClosable}
                destroyOnClose
                getContainer={false}
                width="800px"
                footer={
                    []
                }// 设置footer为空，去掉 取消 确定默认按钮
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
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
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
                                <Input placeholder="请输入员客户姓名" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="mobilePhone"
                                label="手机号码"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入客户手机号码',
                                    },
                                    {
                                        pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码'
                                    }
                                ]}
                            >
                                <Input placeholder="请输入客户手机号码" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
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
                                <Select onChange={genderHandleChange} defaultValue={form.getFieldValue('gender')} >
                                    <Select.Option key='1' value={1}>男</Select.Option>
                                    <Select.Option key='2' value={2}>女</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={6}>
                            <Form.Item
                                name="birthdayPicker"
                                label="生日"
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: '请选择客户生日',
                                //     },
                                // ]}
                            >
                                <DatePicker
                                    format='YYYY-MM-DD'
                                    onChange={birthdayOnChange}
                                    defaultValue={moment(form.getFieldValue('birthday'), 'YYYY-MM-DD')} />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item
                                name="idNum"
                                label="身份证号码"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入客户身份证号码',
                                    },
                                ]}
                            >
                                <Input placeholder="请输入客户身份证号码" />
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
                                <Select onChange={educationHandleChange} defaultValue={form.getFieldValue('education')} >
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
                                <Input placeholder="请输入银行名称" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="bankCardNum"
                                label="银行卡号码"
                            >
                                <Input placeholder="请输入银行卡号码" />
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
                                defaultValue={form.getFieldValue('isMarried')}>
                                    <Select.Option value="0">请选择</Select.Option>
                                    <Select.Option value="1">未婚</Select.Option>
                                    <Select.Option value="2">已婚</Select.Option>
                                    <Select.Option value="3">离异</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={7}>
                            <Form.Item
                                name="mateName"
                                label="配偶姓名"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入配偶姓名',
                                    },
                                ]}
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
                                        required: true,
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
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: '请选择',
                                //     },
                                // ]}
                            >
                                <SelectItem placeholder="省" url='/api/base/address/province/' disabledOption="true" onChange={msgProvinceHandleChange} />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="msgCity"
                                label=""
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: '请选择',
                                //     },
                                // ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="市"
                                    optionFilterProp="children"
                                    onChange={msgCityHandleChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

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
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: '请选择',
                                //     },
                                // ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="区"
                                    optionFilterProp="children"
                                    onChange={msgAreaHandleChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
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
                                <Input placeholder="请输入详细地址" />
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
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: '请选择',
                                //     },
                                // ]}
                            >
                                <SelectItem placeholder="省" url='/api/base/address/province/' onChange={idProvinceHandleChange} disabledOption="true" />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="idCity"
                                label=""
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: '请选择',
                                //     },
                                // ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="市"
                                    optionFilterProp="children"
                                    onChange={idCityHandleChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option disabled key='0' value='0'>市</Select.Option>
                                    {idCityOptions.map(v => {
                                        return (<Select.Option key={v.code} value={v.code ? `${v.code}:${v.name}` : v.id}>{v.name}</Select.Option>);
                                    })}
                                </Select>                                </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="idArea"
                                label=""
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: '请选择',
                                //     },
                                // ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="区"
                                    optionFilterProp="children"
                                    onChange={idAreaHandleChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
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
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入详细地址',
                                    },
                                ]}
                            >
                                <Input placeholder="请输入详细地址" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12} >
                            <Form.Item
                                name="companyName"
                                label="公司名称"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入公司名称',
                                    },
                                ]}
                            >
                                <Input placeholder="请输入公司名称" />
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item
                                name="companyCode"
                                label="统一信用编码"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入公司统一信用编码',
                                    },
                                ]}
                            >
                                <Input placeholder="请输入公司统一信用编码" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12} >
                            <Form.Item
                                name="registerMoney"
                                label="公司注册资金"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入公司注册资金',
                                    },
                                ]}
                            >
                                <Input placeholder="请输入公司注册资金" prefix="￥" suffix="万元"  />
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item
                                name="companyType"
                                label="公司类型"
                                rules={[
                                    {
                                        required: true,
                                        message: '公司类型',
                                    },
                                ]}
                            >
                                <Select  onChange={typeHandleChange} defaultValue={ form.getFieldValue('companyType')} >
                                    <Select.Option key="1" value={1}>有限责任公司</Select.Option>
                                    <Select.Option key="2" value={2}>股份有限公司</Select.Option>
                                    <Select.Option key="3" value={3}>个人独资企业</Select.Option>
                                    <Select.Option key="4" value={4}>个体工商户</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={3}>
                            <Form.Item
                                name="ccc "
                                label="公司地址"
                            />
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="companyProvince"
                                label=""
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: '请选择',
                                //     },
                                // ]}
                            >
                                <SelectItem placeholder="省" url='/api/base/address/province/' onChange={companyProvinceHandleChange} />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="companyCity"
                                label=""
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: '请选择',
                                //     },
                                // ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="市"
                                    optionFilterProp="children"
                                    onChange={companyCityHandleChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option disabled key='0' value='0'>市</Select.Option>
                                    {companyCityOptions.map(v => {
                                        return (<Select.Option key={v.code} value={v.code ? `${v.code}:${v.name}` : v.id}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="companyArea"
                                label=""
                                // rules={[
                                //     {
                                //         required: true,
                                //         message: '请选择',
                                //     },
                                // ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="区"
                                    optionFilterProp="children"
                                    onChange={companyAreaHandleChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option disabled key='0' value='0'>区</Select.Option>
                                    {companyAreaOptions.map(v => {
                                        return (<Select.Option key={v.code} value={v.code ? `${v.name}` : v.id}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={9}>
                            <Form.Item
                                name="companyAddress"
                                label=""
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入详细地址',
                                    },
                                ]}
                            >
                                <Input placeholder="请输入详细地址" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12} >
                            <Form.Item
                                name="invoiceMoney"
                                label="年开票金额"
                                rules={[
                                    {
                                        required: true,
                                        message: '年开票金额',
                                    },
                                ]}
                            >
                                <Select defaultValue={form.getFieldValue('invoiceMoney')} onChange={invoiceMoneyHandleChange}>
                                    <Select.Option key='1' value={1}>0-50万</Select.Option>
                                    <Select.Option key='2' value={2}>50-100万</Select.Option>
                                    <Select.Option key='3' value={3}>100-300万</Select.Option>
                                    <Select.Option key='4' value={4}>300-500万</Select.Option>
                                    <Select.Option key='5' value={5}>500万以上</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button style={{
                        marginLeft: 8,
                    }}
                        type="primary"
                        htmlType="submit"
                    >
                        修改
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

export default EditModal;


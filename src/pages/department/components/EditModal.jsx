/* eslint-disable react/jsx-no-bind */
import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Input, Row, Col, Select, DatePicker, message } from 'antd'
import SelectItem from './SelectItem';
import moment from 'moment'
import request from '@/utils/request';

const EditModal = (props) => {

    const [form] = Form.useForm();
    const [maskClosable ] = useState(false);
    const [selectDisabled, setSelectDisabled,] = useState(true);
    const [ isSubmit, setIsSubmit ] = useState(true);


    const timeOut = () => {
        setTimeout(()=>{
            setIsSubmit(true);
        },
        20000);
    }

    useEffect(() => {
        
        form.setFieldsValue({...props.editObj, 
            isTop: form.getFieldValue('parentId') && form.getFieldValue('parentId') != 0 ? "1":"2"
        })
    }, [props.editObj])

    const handleOk = e => {

    }

    const handleCancel = e => {
        Modal.confirm({
            title: '修改部门信息',
            content: '确定取消修改部门信息',
            onOk() {
                props.setVisible(false);
            },
            onCancel() {

            }
        })
    }

    const onFinish = () => {
        if(isSubmit){
            setIsSubmit(false);
            if (form.getFieldValue('parentId') === form.getFieldValue('id')) {
                Modal.confirm({
                    title: '修改部门信息',
                    content: '上级部门和本部门不能为同一个',
                    onOk() {
    
                    },
                })
                setIsSubmit(true);
                return;
            }
            // eslint-disable-next-line no-empty
            if (!form.getFieldValue('setTime')) {
                message.error('成立时间没有选择')
                setIsSubmit(true);
                return;
            }
            request.post("/api/base/department/update", {
                data: { ...form.getFieldsValue(), userId: localStorage.getItem('userId') },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).then(res => {
                if (res.code === '0000' && res.data) {
                    Modal.confirm({
                        title: '修改部门信息',
                        content: '修改部门信息成功',
                        onOk() {
                            props.setVisible(false);
                        },
                    })
                    setIsSubmit(true);
                } else {
                    Modal.confirm({
                        title: '修改部门信息',
                        content: '修改部门信息失败，请重新添加！',
                        onOk() {
                        },
                    })
                    setIsSubmit(true);
                }
            })
            setIsSubmit(true);
        }else{
            message.info("您操作太频繁，请20秒后后再试");
        }
        
    }

    const handleFromChild1 = value => {
        console.log('parentId', value);
        form.setFieldsValue({ parentId: value });
    }
    const handleFromChild2 = value => {
        console.log('staffId', value);
        form.setFieldsValue({ staffId: value });

    }
    const handleFromChild3 = value => {
        console.log('status', value);
        form.setFieldsValue({ status: value });

    }
    const isTopHandleChange = value => {

        // eslint-disable-next-line eqeqeq
        if (value == 1) {
            setSelectDisabled(false);
        } else {
            setSelectDisabled(true);
            form.setFieldsValue({ parentId: null });
        }

    }

    // 选择时间处理
    const setTimeOnChange = (date, dateString) => {
        form.setFieldsValue({ setTime: dateString.toString() });
    }




    return (
        <div>
            <Modal
                id='editModal'
                title={props.title}
                visible={props.visible}
                onOk={handleOk}
                onCancel={handleCancel}
                maskClosable={maskClosable}
                destroyOnClose="true"
                width='600px'
                footer={
                    [] // 设置footer为空，去掉 取消 确定默认按钮
                }
                getContainer={false}
            >
                <Form
                    form={form}
                    // name=""
                    // className=""
                    onFinish={onFinish}
                >
                    <Row gutter={24}>
                        <Col span={5}>
                            <Form.Item
                                name="id"
                                label="编号"
                            >
                                <Input defaultValue={form.getFieldValue('id')} disabled />
                            </Form.Item>
                        </Col>
                        <Col span={9}>
                            <Form.Item
                                name="name"
                                label="部门名称"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入员部门名称',
                                    },
                                    {
                                        max: 50, message: '部门名称不得超过50个字符'
                                    }
                                ]}
                            >
                                <Input placeholder="请输入员部门名称" />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item
                                name="isTop"
                                label="是否有上级"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择是否有上级部门',
                                    },
                                ]}
                            >
                                <Select defaultValue="请选择"
                                    onChange={isTopHandleChange}
                                >
                                    <Select.Option value="1">是</Select.Option>
                                    <Select.Option value="2">否</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="parentId"
                                label="上级部门"
                            >
                                <SelectItem selectDisabled={selectDisabled} placeholder="请选择上级部门" toParent={handleFromChild1.bind(this)} url='/api/base/department/listAll' optionDisabled='true' defaultValue={form.getFieldValue('parentId')} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="staffId"
                                label="负责人"
                            >
                                <SelectItem placeholder="请选择负责人" toParent={handleFromChild2.bind(this)} url='/api/base/staff/listAll' optionDisabled='true' defaultValue={form.getFieldValue('staffId')} />
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={24}>
                        <Col span={12} >
                            <Form.Item
                                name="status"
                                label="状态"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择状态',
                                    },
                                ]}
                            >
                                <SelectItem placeholder="请选择状态" toParent={handleFromChild3.bind(this)} url='/api/base/department/status' optionDisabled='true' defaultValue={form.getFieldValue('status')} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                format='YYYY-MM-DD'
                                name="setTimePicker"
                                label="成立日期"
                            >
                                <DatePicker onChange={setTimeOnChange} defaultValue={moment(form.getFieldValue('setTime'), 'YYYY-MM-DD')} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="state"
                                label="部门描述"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入部门描述',
                                    },
                                ]}
                            >

                                <Input placeholder="请输入部门描述" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="address"
                                label="地址"
                            >

                                <Input placeholder="请输入部门地址" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Button style={{
                        marginLeft: 8,
                    }}
                        type="primary"
                        htmlType="submit"
                    >
                        确定
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


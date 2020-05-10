/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react'
import { Modal, Button, Form, Input, Row, Col, DatePicker, Select, message } from 'antd'
import request from '@/utils/request';
import SelectItem from './SelectItem';


const AddModal = (props) => {


    const [form] = Form.useForm()
    const [maskClosable,] = useState(false);
    const [selectDisabled, setSelectDisabled,] = useState(true);
    const [ isSubmit, setIsSubmit ] = useState(true);


    const timeOut = () => {
        setTimeout(()=>{
            setIsSubmit(true);
        },
        20000);
    }



    const handleCancel = () => {
        Modal.confirm({
            title: '添加部门',
            content: '确定取消添加部门',
            onOk() {
                props.setVisible(false);
                form.resetFields();
            },
            onCancel() {

            }
        })

    }



    const onFinish = () => {
        if(isSubmit){
            setIsSubmit(false);
            request.post("/api/base/department/add", {
                data: {
                    ...form.getFieldsValue(),
                    userId: localStorage.getItem('userId'),
                    setTime: form.getFieldValue('setTime').format('YYYY-MM-DD')
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).then(res => {
                if (res.code === '0000') {
                    Modal.confirm({
                        title: '添加部门',
                        content: '添加部门成功',
                        onOk() {
                            props.setVisible();
                        },
                    })
                    setIsSubmit(true);
                } else {
                    Modal.confirm({
                        title: '添加部门',
                        content: '系统添加部门失败，请重新添加！',
                        onOk() {
                        },
                    })
                    setIsSubmit(true);
                }
            })
            setIsSubmit(true);
        }else{
            message.info("您操作太频繁，请20秒后后再试")
        }
        
    }

    const handleFromChild1 = value => {
        form.setFieldsValue({ parentId: value });
    }
    const handleFromChild2 = value => {
        form.setFieldsValue({ staffId: value });

    }
    const handleFromChild3 = value => {
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
                        <Col span={12}>
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
                        <Col span={12}>
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
                                <Select defaultValue="请选择" onChange={isTopHandleChange}>
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
                                rules={[
                                    {
                                        required: false,
                                        message: '请选择上级部门',
                                    },
                                ]}
                            >
                                <SelectItem selectDisabled={selectDisabled} placeholder="请选择上级部门" toParent={handleFromChild1.bind(this)} url='/api/base/department/listAll' optionDisabled='true' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="staffId"
                                label="负责人"
                            >
                                <SelectItem placeholder="请选择负责人" toParent={handleFromChild2.bind(this)} url='/api/base/staff/listAll' optionDisabled='true' />
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
                                <SelectItem placeholder="请选择状态" toParent={handleFromChild3.bind(this)} url='/api/base/department/status' optionDisabled='true' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                format='YYYY-MM-DD'
                                name="setTime"
                                label="成立日期"
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

export default AddModal;


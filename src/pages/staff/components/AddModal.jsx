/* eslint-disable react/jsx-no-bind */
import React, {  useState } from 'react'
import { Modal, Button, Form, Input,  Row, Col, message } from 'antd'
import request from '@/utils/request';
import SelectItem from './SelectItem';

const AddModal = (props) => {


    const [form] = Form.useForm()
    const [ maskClosable,] = useState(false);
    const [ isSubmit, setIsSubmit ] = useState(true);


    const timeOut = () => {
        setTimeout(()=>{
            setIsSubmit(true);
        },
        20000);
    }

    const handleCancel = e => {
        Modal.confirm({
            title: '添加员工',
            content: '确定取消添加员工',
            onOk() {
                props.setVisible();
                form.resetFields();
            },
            onCancel() {

            }
        })

    }

    const onFinish = () => {
        if(isSubmit){
            setIsSubmit(false);
            request.post("/api/base/staff/add", {
                data: {
                    ...form.getFieldsValue(),
                    userId: localStorage.getItem("userId"),
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).then(res => {
                if (res.code === '0000') {
                    Modal.confirm({
                        title: '添加员工',
                        content: '添加员工成功',
                        onOk() {
                            props.setVisible(false);
                            form.resetFields();
                        },
                    })
                    setIsSubmit(true);
                } else {
                    Modal.confirm({
                        title: '添加员工失败',
                        content: res.data ? res.data : '添加员工失败,请重试',
                        onOk() {
                        },
                    })
                    setIsSubmit(true);
                }
            })
            setIsSubmit(true);
        }else{
            message.error('操作太频繁，请稍后再试，约20-30s');
        }
        
    }

    const handleFromChild1 = value => {
        console.log('departmentId', value);
        form.setFieldsValue({ departmentId: value });
    }
    const handleFromChild2 = value => {
        console.log('jobId', value);
        form.setFieldsValue({ jobId: value });

    }
    const handleFromChild3 = value => {
        console.log('emergencyRelation', value);
        form.setFieldsValue({ emergencyRelation: value });

    }
    const handleFromChild4 = value => {
        console.log('roleId', value);
        form.setFieldsValue({ roleId: value });

    }
    const handleFromChild5 = value => {
        console.log('status', value);
        form.setFieldsValue({ status: value });

    }

    return (
        <div>
            <Modal
                id='addModal'
                title={props.title}
                visible={props.visible}
                maskClosable={maskClosable}
                getContainer={false}
                destroyOnClose
                width='600px'
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
                                label="姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入员工姓名',
                                    },
                                    {
                                        max: 50, message: '姓名不得超过50个字符'
                                    }
                                ]}
                            >
                                <Input placeholder="请输入员工姓名" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="mobilePhone"
                                label="手机号码"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入员工手机号码',
                                    },
                                    {
                                        pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码'
                                    }
                                ]}
                            >
                                <Input placeholder="请输入员工手机号码" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={14}>
                            <Form.Item
                                name="idNum"
                                label="身份证号"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入员工身份证号码',
                                    },
                                    {
                                        min: 15, message: '身份证号码长度不小于15位'
                                    },
                                    {
                                        max: 18, message: '身份证号码长度不大于18位'
                                    }
                                ]}
                            >
                                <Input placeholder="请输入员工身份证号码" />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
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
                                <SelectItem placeholder="请选择部门" optionDisabled='false' toParent={handleFromChild1.bind(this)} url='/api/base/department/listAll' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                name="jobId"
                                label="职位"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择职位',
                                    },
                                ]}
                            >

                                <SelectItem placeholder="请选择职位" optionDisabled='false' toParent={handleFromChild2.bind(this)} url='/api/base/job/list' />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="roleId"
                                label="角色"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择角色',
                                    },
                                ]}
                            >

                                <SelectItem placeholder="请选择角色" optionDisabled='false' toParent={handleFromChild4.bind(this)} url='/api/base/role/list' />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
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

                                <SelectItem placeholder="请选择状态" optionDisabled='false' toParent={handleFromChild5.bind(this)} url='/api/base/staff/status' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="emergencyName"
                                label="紧急联系人"
                                rules={[
                                    {
                                        required: true,
                                        message: '紧急联系人姓名',
                                    },

                                ]}
                            >
                                <Input placeholder="紧急联系人姓名" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="emergencyRelation"
                                label="紧急联系人关系"
                                rules={[
                                    {
                                        required: true,
                                        message: '紧急联系人关系',
                                    },
                                ]}
                            >
                                <SelectItem placeholder="请选择" optionDisabled='false' toParent={handleFromChild3.bind(this)} url='/api/relation' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={20}>
                            <Form.Item
                                name="emergencyPhone"
                                label="紧急联系人手机号码"
                                rules={[
                                    {
                                        required: true,
                                        message: '紧急联系人手机号码',
                                    },
                                    {
                                        pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码'
                                    }
                                ]}
                            >
                                <Input placeholder="紧急联系人手机号码" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={20}>
                            <Form.Item
                                name="address"
                                label="通讯地址"
                                rules={[
                                    {
                                        required: true,
                                        message: '通讯地址',
                                    },
                                ]}
                            >
                                <Input placeholder="通讯地址" />
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


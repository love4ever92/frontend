import React, { useEffect,useState } from 'react'
import { Modal, Button, Form, Input, Alert, message, Row, Col, } from 'antd'
import SelectItem from './SelectItem';
import request from '@/utils/request'; 

const EditModal = (props) => {

    const [ form ] = Form.useForm();
    const [ isSubmit, setIsSubmit ] = useState(true);


    const timeOut = () => {
        setTimeout(()=>{
            setIsSubmit(true);
        },
        20000);
    }


    useEffect(() => {
        form.setFieldsValue(props.editObj)
    }, [props.editObj])

    
    const handleOk = e =>{
        
    }

    const handleCancel = e =>{
        Modal.confirm({
            title: '修改员工信息',
            content: '确定取消修改员工信息',
            onOk(){
                props.setVisible(false);
            },
            onCancel(){

            }
        })
    }

    const onFinish = () =>{
        if(isSubmit){
            setIsSubmit(false);
            if(form.getFieldValue('departmentId') === props.editObj.departmentId
            && form.getFieldValue('emergencyName') === props.editObj.emergencyName
            && form.getFieldValue('emergencyPhone') === props.editObj.emergencyPhone
            && form.getFieldValue('address') === props.editObj.address
            && form.getFieldValue('emergencyRelation') === props.editObj.emergencyRelation
            && form.getFieldValue('jobId') === props.editObj.jobId
            && form.getFieldValue('roleId') === props.editObj.roleId
            && form.getFieldValue('status') === props.editObj.status){
            setIsSubmit(true);
            props.setVisible(false);
            }else{
                request.post("/api/base/staff/update",{
                    data: { ...form.getFieldsValue(), userId:localStorage.getItem('userId')},
                    headers:{
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                }).then( res =>{
                    if(res.code === '0000'){
                        Modal.confirm({
                            title: '修改员工信息',
                            content: '修改员工信息成功',
                            onOk(){
                                props.setVisible(true);
                                form.resetFields();
                            },
                        })
                        setIsSubmit(true);
                    }else{
                        Modal.confirm({
                            title: '修改员工信息',
                            content: `系统修改员工信息失败，请重新添加！${res.data}`,
                            onOk(){
                            },
                        })
                        setIsSubmit(true);
                    }
                })
            }
            setIsSubmit(true);
        }else{
            message.error('操作太频繁，请稍后再试，约20-30s');
        }
        
    }

    const handleFromChild1 = value =>{
        console.log('departmentId',value);
        form.setFieldsValue({departmentId:value});
    }
    const handleFromChild2 = value =>{
        console.log('roleId',value);
        form.setFieldsValue({ roleId : value});
        
    }
    const handleFromChild3 = value =>{
        console.log('emergencyRelation',value);
        form.setFieldsValue({ emergencyRelation : value});
    }
    const handleFromChild4 = value =>{
        console.log('jobId',value);
        form.setFieldsValue({ jobId : value});
    }
    const handleFromChild5 = value =>{
        console.log('status',value);
        form.setFieldsValue({ status : value});
    }

    return(
        <div>
            <Modal
                id='editModal'
                title={props.title}
                visible={props.visible}
                onOk = {handleOk}
                onCancel = {handleCancel}
                maskClosable
                destroyOnClose="true"
                width = '600px'
                getContainer={false}
                footer={
                    [] // 设置footer为空，去掉 取消 确定默认按钮
                }    
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                >
                    <Row gutter={24}>
                            <Col span={6}>
                                <Form.Item
                                    name="id"
                                    label="编号"
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="name"
                                    label="姓名"
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
                                    <Input  disabled />
                                </Form.Item>
                            </Col>
                            <Col span={10}>
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
                                    <Input placeholder="请输入员工手机号码" disabled/>
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
                                    <Input placeholder="请输入员工身份证号码" disabled />
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
                                    <SelectItem placeholder="请选择部门" optionDisabled='false' toParent = { handleFromChild1.bind(this) }  url='/api/base/department/listAll' defaultValue={form.getFieldValue("departmentId")} />
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
                                    
                                    <SelectItem placeholder="请选择职位" optionDisabled='false' toParent = { handleFromChild4.bind(this) } url='/api/base/job/list' defaultValue={form.getFieldValue("jobId")} />
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
                                    
                                    <SelectItem placeholder="请选择状态" optionDisabled='false' toParent = { handleFromChild5.bind(this) } url='/api/base/staff/status' defaultValue={form.getFieldValue("status")} />
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
                                    
                                    <SelectItem placeholder="请选择角色" optionDisabled='false' toParent = { handleFromChild2.bind(this) } url='/api/base/role/list' defaultValue={form.getFieldValue("roleId")} />
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
                                    <SelectItem placeholder="请选择" optionDisabled='false' toParent = { handleFromChild3.bind(this) } url='/api/relation' defaultValue={form.getFieldValue("emergencyRelation")}/>
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
                                        required:  true,
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
                            onClick={ handleCancel } 
                        >
                            取消
                        </Button>

                </Form>

            </Modal>
        </div>
    );

}

export default EditModal;


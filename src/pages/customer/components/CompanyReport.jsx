import React, { useState,useEffect } from 'react'
import { Modal, Button, Form, Input, Row, Col,  DatePicker,message } from 'antd'
import request from '@/utils/request';
import moment from 'moment';
import EditableTable from './EditableTable';



const CompanyReport = (props) => {

    const [form] = Form.useForm()

    const [addreportStatus, setAddreportStatus] = useState(false);
    const [companyReportId,setCompanyReportId] = useState(0);
    const [ isSubmit, setIsSubmit ] = useState(true);


    const timeOut = () => {
        setTimeout(()=>{
            setIsSubmit(true);
        },
        20000);
    }

    useEffect(() => {
        form.setFieldsValue({ ...form.getFieldsValue(),
            name: props.editObj.customerName,
            companyName: props.editObj.companyName,
            reportDate:  props.editObj.reportDate?moment(props.editObj.reportDate, 'YYYY-MM-DD'):null,
        })
        if(props.editObj.id){
            setCompanyReportId(props.editObj.id);
            setAddreportStatus(true);
        }
        if(props.editObj.modalType === 'look'){
            setAddreportStatus(true)
        }
    }, [props.editObj])



    const handleCancel = () => {
        Modal.confirm({
            title: '客户信用报告',
            content: '确定停止操作企业信用报告',
            onOk() {
                props.setVisible();
                form.resetFields();
            },
            onCancel() {
            }
        })
    }

    const nextStep = () => {
        if(isSubmit){
            setIsSubmit(false);
            if(props.modalType === 'add'){
                Modal.confirm({
                    title: '添加企业信用报告',
                    content: '确定完成企业信用报告的新增？',
                    onOk() {
                        props.setVisible(false);
                    },
                })
                
            }else if(props.modalType === 'edit'){
                Modal.confirm({
                    title: '修改企业信用报告',
                    content: '确定完成企业信用报告的修改？',
                    onOk() {
                        props.setVisible(false);
                    },
                })
            }else if(props.modalType === 'look'){
                Modal.confirm({
                    title: '查看企业信用报告',
                    content: '确定结束查看企业信用报告的详情？',
                    onOk() {
                        props.setVisible(false);
                    },
                })
            }
            setIsSubmit(true);
        }else{
            message.error(`操作过于频繁，请稍后再试`);
        }
    }

    const addreport = () =>{
        try{
            if(!form.getFieldValue('reportDate').format('YYYY-MM-DD') || form.getFieldValue('reportDate') == 'Invalid date'){
                message.error('请选择正确的日期！！');
                return;
            }
        }catch(e){
            message.error('请选择正确的日期！！');
        }
        
        request.post("/api/base/company-report/add",{
            data: { ...form.getFieldsValue,
                reportDate: form.getFieldValue('reportDate').format('YYYY-MM-DD'),
                lendUnit: form.getFieldValue('lendUnit'),
                userId: localStorage.getItem("userId"),
                customerId: props.editObj.customerId,
                companyId: props.editObj.companyId,
                lendPeople: form.getFieldValue('lendPeople'),
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(res => {
            if(res.code === '0000'){
                message.info('企业信用报告基本信息保存成功，请继续录入详细资料');
                setAddreportStatus(true);
                setCompanyReportId(res.data)
            }else{
                message.error(res.data);
            }
        })
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
                maskClosable={false}
                destroyOnClose
                getContainer={false}
                width="1200px"
                footer={
                    [] // 设置footer为空，去掉 取消 确定默认按钮
                }
            >
                <Form
                    form={form}
                    // name=""
                    // className=""
                    // onFinish={onFinish}
                >
                    <Row>
                        <h2>报告基本信息</h2>
                    </Row>
                    <Row gutter={20}>
                        <Col span={5} >
                            <Form.Item
                                name="reportDate"
                                label="报告日期："
                            >
                                <DatePicker format='YYYY-MM-DD' disabled={addreportStatus}/>
                            </Form.Item>
                        </Col>
                        <Col span={3} >
                            <Form.Item
                                name="name"
                                label="客户"
                            >
                                <Input placeholder="客户"  disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={8} >
                            <Form.Item
                                name="companyName"
                                label="公司"
                            >
                                <Input placeholder="公司"  disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={4} >
                            <Button type="primary" onClick={addreport} disabled={addreportStatus} >保存</Button>
                            <Button style={{ marginLeft: 12, }} type="primary" 
                                onClick={() => { 
                                    Modal.confirm({
                                        title: '企业信用报告',
                                        content: '确定取消添加企业信用报告，如果确定，所有与本报告有关的信息都会删除！！！',
                                        onOk() {
                                            form.setFieldsValue({...form.getFieldsValue(), reportDate: null});  
                                            setAddreportStatus(false) 
                                        },
                                        onCancel() {
                                            
                                        }
                                    }) 
                                }}  
                                disabled={props.modalType==='look'} 
                            >取消</Button>
                        </Col>
                    </Row>
                    <h2 id='t0'>1.主要出资人信息</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        companyId = {props.editObj.companyId}
                        companyReportId={companyReportId}
                        modalType={props.modalType}
                        editObj={props.editObj}
                        // eslint-disable-next-line react/no-string-refs
                        type="companyShare"/>
                    <h2 id='t0'>2.企业高管信息</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        companyId = {props.editObj.companyId}
                        companyReportId={companyReportId}
                        modalType={props.modalType}
                        editObj={props.editObj}
                        // eslint-disable-next-line react/no-string-refs
                        type="companyTopManager"/>
                    <h2 id='t0'>3.直接关联企业</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        companyId = {props.editObj.companyId}
                        companyReportId={companyReportId}
                        modalType={props.modalType}
                        editObj={props.editObj}
                        // eslint-disable-next-line react/no-string-refs
                        type="companyRelation"/>
                    <h2 id='t1'>4.贷款情况</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        companyId = {props.editObj.companyId}
                        companyReportId={companyReportId}
                        modalType={props.modalType}
                        editObj={props.editObj}
                        // eslint-disable-next-line react/no-string-refs
                        type="companyLoans"/>
                    <h2 id='t1'>5.企业资产</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        companyId = {props.editObj.companyId}
                        companyReportId={companyReportId}
                        modalType={props.modalType}
                        editObj={props.editObj}
                        // eslint-disable-next-line react/no-string-refs
                        type="companyAsset"/>
                    <h2 id='t1'>6.企业负债</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        companyId = {props.editObj.companyId}
                        companyReportId={companyReportId}
                        modalType={props.modalType}
                        editObj={props.editObj}
                        // eslint-disable-next-line react/no-string-refs
                        type="companyDebt"/>
                    <h2 id='t1'>7.企业逾期</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        companyId = {props.editObj.companyId}
                        companyReportId={companyReportId}
                        modalType={props.modalType}
                        editObj={props.editObj}
                        // eslint-disable-next-line react/no-string-refs
                        type="companyOverdue"/>
                    <h2 id='t1'>8.企查查（补充）</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        companyId = {props.editObj.companyId}
                        companyReportId={companyReportId}
                        modalType={props.modalType}
                        editObj={props.editObj}
                        // eslint-disable-next-line react/no-string-refs
                        type="companyJudicatureInfo"/>
                    <Button style={{
                        marginLeft: 8,
                    }}
                        type="primary"
                        onClick={nextStep}
                    >
                        完成
                        </Button>
                </Form>
            </Modal>
        </div>
    );
}

export default CompanyReport;
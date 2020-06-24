import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Input, Row, Col,  DatePicker,message,Select  } from 'antd'
import request from '@/utils/request';
import moment from 'moment';
import EditableTable from './EditableTable';
import { List } from 'antd/es/form/Form';



const CustomerReport = (props) => {

    const [form] = Form.useForm()

    const [addreportStatus, setAddreportStatus] = useState(false);
    const [customerReportId,setCustomerReportId] = useState(0);
    const [ isSubmit, setIsSubmit ] = useState(true);
    const [ reportDateList, setReportDateList ] = useState([]);
    const [ customerLoan, setCustomerLoan ] = useState({});
    const [ customerAsset, setCustomerAsset ] = useState({});
    const [ customerGuarantee, setCustomerGuarantee ] = useState({});
    const [ customerDebt, setCustomerDebt ] = useState({});
    const [ customerOverdue, setCustomerOverdue ] = useState({});
    const [ loanQuery, setLoanQuery ] = useState({});
    const [ t, setT ] = useState("");

    useEffect(() => {
        if(props.modalType === 'look'){
            setAddreportStatus(true)
        }
    }, [props.visible])

    useEffect(() => {
        
        const list = props.editObj.customerReportList;
    

        if(list && list.length > 0){

            setReportDateList(list);
            console.log(list);
            form.setFieldsValue({ 
                ...form.getFieldsValue(),
                customerName: props.customerName,
                customerId: props.customerId,
                reportDate: `0:${list[0].id}:${list[0].reportDate}`,
            })
            setCustomerLoan({
                list: list[0].customerLoans,
            });
            setCustomerAsset({
                list: list[0].customerAssets,
            });
            setCustomerGuarantee({
                list: list[0].customerGuarantees
            });
            setCustomerDebt({
                list: list[0].customerDebts
            });
            setCustomerOverdue({
                list: list[0].customerOverdues
            });
            setLoanQuery({
                list: list[0].loanQueries
            });
            
        }else{
            form.setFieldsValue({ 
                ...form.getFieldsValue(),
                customerName: props.customerName,
                customerId: props.customerId,
                reportDate:  props.editObj.reportDate ? moment(props.editObj.reportDate, 'YYYY-MM-DD') : null,
            })
        }
        
        if(props.editObj.id){
            setCustomerReportId(props.editObj.id);
            setAddreportStatus(true);
        }

        if(props.editObj.modalType === 'look'){
            setAddreportStatus(true);
        }

    }, [props.editObj])



    const handleCancel = () => {
        Modal.confirm({
            title: '客户信用报告',
            content: '确定停止客户信用资料和企业信用报告',
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
                    title: '添加个人信用报告',
                    content: '是否完成个人信用报告的新增，跳转到公司信用报告窗口！',
                    onOk() {
                        props.setVisible(true, 
                            props.editObj.customerId, 
                            props.editObj.customerName, 
                            props.editObj.companyName,
                            props.editObj.companyId);
                    },
                })
            }else if(props.modalType === 'edit'){ 
                Modal.confirm({
                    title: '修改个人信用报告',
                    content: '是否完成个人信用报告的修改，跳转到公司信用报告窗口！',
                    onOk() {
                        props.setVisible(true, 
                            props.editObj.customerId, 
                            props.editObj.customerName, 
                            props.editObj.companyName,
                            props.editObj.companyId);
                    },
                })
            }else if(props.modalType === 'look'){
                props.setVisible(true,
                    props.editObj.customerId, 
                    form.getFieldValue("customerName"), 
                    props.editObj.companyName,
                    props.editObj.companyId);
            }
            setIsSubmit(true);
        }else{
            message.error(`操作过于频繁，请稍后再试`);
        }
        
        
    }

    const addreport = () =>{

        if(!form.getFieldValue('reportDate') || form.getFieldValue('reportDate') == 'Invalid date'){
            message.error('请选择正确的日期！！');
            return;
        }
        request.post("/api/base/customer-report/add",{
            data: { ...form.getFieldsValue,
                reportDate: form.getFieldValue('reportDate').format('YYYY-MM-DD'),
                lendUnit: form.getFieldValue('lendUnit'),
                userId: localStorage.getItem("userId"),
                customerId: props.editObj.customerId,
                lendPeople: form.getFieldValue('lendPeople'),
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(res => {
            if(res.code === '0000'){
                message.info('客户信用报告基本信息保存成功，请继续录入详细资料');
                setAddreportStatus(true);
                setCustomerReportId(res.data)
            }else{
                message.error(res.data);
            }
        })
    }





    const onChange = (value) =>{
        const item = props.editObj.customerReportList.find(v  => v.id == value.split(":")[1] )
        console.log(value, item);
        setCustomerLoan({
            list: item.customerLoans,
        });
        setCustomerAsset({
            list: item.customerAssets,
        });
        setCustomerGuarantee({
            list: item.customerGuarantees
        });
        setCustomerDebt({
            list: item.customerDebts
        });
        setCustomerOverdue({
            list: item.customerOverdues
        });
        setLoanQuery({
            list: item.loanQueries
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
                    <Row gutter={30}>
                        <Col span={5} >
                                { props.modalType == "add"? 
                                (<Form.Item
                                    name="reportDate"
                                    label="报告日期："
                                >
                                    <DatePicker format='YYYY-MM-DD' disabled={addreportStatus}/>
                                </Form.Item>)
                                :
                                (<Form.Item
                                    name="reportDate"
                                    label="报告日期："
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择报告日期',
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        onChange={onChange}
                                        //onFocus={onFocus4Company}
                                        //onBlur={onBlur}
                                        //onSearch={onSearch}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                        {reportDateList.map((v,i) => {
                                            
                                            return (<Select.Option key={v.id} value={`${i}:${v.id}:${v.reportDate}`}>{v.reportDate}</Select.Option>);
                                        })}
                                    </Select>
                                </Form.Item>)
                                }    
                        </Col>
                        <Col span={5} >
                            <Form.Item
                                name="customerName"
                                label="客户姓名"
                            >
                                <Input placeholder="客户姓名"  disabled={addreportStatus}/>
                            </Form.Item>
                        </Col>
                        <Col span={4} >
                            <Button type="primary" onClick={addreport} disabled={addreportStatus} >保存</Button>
                            <Button style={{ marginLeft: 12, }} type="primary" 
                                onClick={() => { 
                                    Modal.confirm({
                                        title: '客户信用报告',
                                        content: '确定取消添加客户信用报告，如果确定，所有与本报告有关的信息都会删除！！！',
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
                    <h2 id='t0'>1.贷款记录</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        customerReportId={customerReportId}
                        modalType={props.modalType}
                        editObj={customerLoan}
                        // eslint-disable-next-line react/no-string-refs
                        type="loanInfos"/>
                    <h2 id='t1'>2.逾期记录</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        customerReportId={customerReportId}
                        modalType={props.modalType}
                        editObj={customerOverdue}
                        // eslint-disable-next-line react/no-string-refs
                        type="overdues"/>
                    <h2 id='t1'>3.对外担保</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        customerReportId={customerReportId}
                        modalType={props.modalType}
                        editObj={customerGuarantee}
                        // eslint-disable-next-line react/no-string-refs
                        type="guarantees"/>
                    <h2 id='t1'>4.查询记录</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        customerReportId={customerReportId}
                        modalType={props.modalType}
                        editObj={loanQuery}
                        // eslint-disable-next-line react/no-string-refs
                        type="loanquerys"/>
                    <h2 id='t1'>5.资产记录</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        customerReportId={customerReportId}
                        modalType={props.modalType}
                        editObj={customerAsset}
                        // eslint-disable-next-line react/no-string-refs
                        type="assets"/>
                    <h2 id='t1'>6.负债记录</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        customerReportId={customerReportId}
                        modalType={props.modalType}
                        editObj={customerDebt}
                        // eslint-disable-next-line react/no-string-refs
                        type="debts"/>
                    <Button style={{
                        marginLeft: 8,
                    }}
                        type="primary"
                        onClick={nextStep}
                    >
                        下一步 - 公司信用报告
                        </Button>
                </Form>
            </Modal>
        </div>
    );
}

export default CustomerReport;
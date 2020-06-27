import React, { useState,useEffect } from 'react'
import { Modal, Button, Form, Input, Row, Col,  DatePicker,message,Select  } from 'antd'
import request from '@/utils/request';
import moment from 'moment';
import EditableTable from './EditableTable';
import { ConsoleSqlOutlined } from '@ant-design/icons';



const CompanyReport = (props) => {

    const [form] = Form.useForm()

    const [addreportStatus, setAddreportStatus] = useState(false);
    const [companyReportId,setCompanyReportId] = useState(0);
    const [ isSubmit, setIsSubmit ] = useState(true);
    const [ reportDateList, setReportDateList ] = useState([]);
    const [ companyList, setCompanyList  ] = useState([]);
    const [ companyAssets, setCompanyAssets] = useState({});
    const [ companyDebts, setCompanyDebts] = useState({});
    const [ companyShares, setCompanyShares] = useState({});
    const [ companyLoans, setCompanyLoans] = useState({});
    const [ companyOverdue, setCompanyOverdue] = useState({});
    const [ companyJudicatureInfos, setCompanyJudicatureInfos ] = useState({});
    const [ companyRelations, setCompanyRelations] = useState({});
    const [ companyTopManagers, setCompanyTopManagers] = useState({});


    const timeOut = () => {
        setTimeout(()=>{
            setIsSubmit(true);
        },
        20000);
    }


    useEffect(() => {
        if(props.modalType === 'look'){
            setAddreportStatus(true)
        }
    }, [props.visible])

    useEffect(() => {

        if(props.editObj.modalType === 'look'){
            setAddreportStatus(true)
        }
        
        const list = props.editObj.companyList;
        

        if(list && list.length > 0){
            console.log(list);
            setCompanyList(list);            

            form.setFieldsValue({ ...form.getFieldsValue(),
                customerId: props.editObj.customerId,
                name: props.editObj.customerName,
                companyName: props.editObj.companyName,
                reportDate:  props.editObj.reportDate?moment(props.editObj.reportDate, 'YYYY-MM-DD'):null,
            })
            if(props.editObj.id){
                setCompanyReportId(props.editObj.id);
                setAddreportStatus(true);
            }
            
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
        debugger;
        console.log(11111);
        if(!form.getFieldValue('reportDate') || form.getFieldValue('reportDate') == 'Invalid date'){
            message.error('请选择正确的日期！！');
            return;
        }
        console.log(11111);
        console.log(11111);
        console.log(11111);
        console.log(11111);
        console.log(11111);
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


    const onChange4Company = (value) =>{
        if(value){

            request.get('/api/base/company-report/getByCompanyId',{
                params:{
                  userId: localStorage.getItem('userId'),
                  customerId: form.getFieldValue('customerId'),
                  companyId: value,
                },
                headers:{
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                }
              }).then(res => {
                if(res.code === '0000'){
                    let list = res.data;
                    list.map(v => {
                        v.key = v.id;
                    })
                    if(list.length == 0){
                        Modal.confirm({
                            title: '提示',
                            content: '选中的企业还未添加企业信用报告。',
                            onOk() {
                                setReportDateList(list);
                            },
                            onCancel() {
                                
                            }
                        }) 
                    }else{
                        setReportDateList(list);
                    }
                    
                }
              })

        }

    }
    
    const onChange4ReportDate = (value) =>{
        if(value){

            request.get('/api/base/company-report/getById',{
                params:{
                  userId: localStorage.getItem('userId'),
                  id: value,
                },
                headers:{
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                }
              }).then(res => {
                if(res.code === '0000'){
                    let data = res.data;
                    setCompanyAssets({list: data.companyAssets});
                    setCompanyDebts({list: data.companyDebts});
                    setCompanyShares({list: data.companyShares});
                    setCompanyLoans({list: data.companyLoans});
                    setCompanyOverdue({list: data.companyOverdue});
                    setCompanyJudicatureInfos({list: data.companyJudicatureInfos});
                    setCompanyRelations({list: data.companyRelations});
                    setCompanyTopManagers({list: data.companyTopManagers});
                    
                }
              })
        }
    }

    const lastStep = () =>{
        props.lastStep();
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
                        <Col span={3} >
                            <Form.Item
                                name="name"
                                label="客户"
                            >
                                <Input placeholder="客户"  disabled/>
                            </Form.Item>
                        </Col>
                        <Col span={8} >
                            { props.modalType == "add"? 
                                (<Form.Item
                                    name="companyId"
                                    label="企业名称"
                                >
                                     <Input placeholder="企业名称"  />
                                </Form.Item>)
                                :
                                (<Form.Item
                                    name="companyId"
                                    label="企业名称"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择报告企业名称',
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        onChange={onChange4Company}
                                        //onFocus={onFocus4Company}
                                        //onBlur={onBlur}
                                        //onSearch={onSearch}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                        {companyList.map((v,i) => {
                                            
                                            return (<Select.Option key={v.id} value={v.id}>{v.name}</Select.Option>);
                                        })}
                                    </Select>
                                </Form.Item>)
                            }    
                        </Col>
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
                                        onChange={onChange4ReportDate}
                                        //onFocus={onFocus4Company}
                                        //onBlur={onBlur}
                                        //onSearch={onSearch}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                        {reportDateList.map((v,i) => {
                                            
                                            return (<Select.Option key={v.id} value={v.id}>{v.reportDate}</Select.Option>);
                                        })}
                                    </Select>
                                </Form.Item>)
                            }    
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
                        editObj={companyShares}
                        // eslint-disable-next-line react/no-string-refs
                        type="companyShare"/>
                    <h2 id='t0'>2.企业高管信息</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        companyId = {props.editObj.companyId}
                        companyReportId={companyReportId}
                        modalType={props.modalType}
                        editObj={companyTopManagers}
                        // eslint-disable-next-line react/no-string-refs
                        type="companyTopManager"/>
                    <h2 id='t0'>3.直接关联企业</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        companyId = {props.editObj.companyId}
                        companyReportId={companyReportId}
                        modalType={props.modalType}
                        editObj={companyRelations}
                        // eslint-disable-next-line react/no-string-refs
                        type="companyRelation"/>
                    <h2 id='t1'>4.贷款情况</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        companyId = {props.editObj.companyId}
                        companyReportId={companyReportId}
                        modalType={props.modalType}
                        editObj={companyLoans}
                        // eslint-disable-next-line react/no-string-refs
                        type="companyLoans"/>
                    <h2 id='t1'>5.企业资产</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        companyId = {props.editObj.companyId}
                        companyReportId={companyReportId}
                        modalType={props.modalType}
                        editObj={companyAssets}
                        // eslint-disable-next-line react/no-string-refs
                        type="companyAsset"/>
                    <h2 id='t1'>6.企业负债</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        companyId = {props.editObj.companyId}
                        companyReportId={companyReportId}
                        modalType={props.modalType}
                        editObj={companyDebts}
                        // eslint-disable-next-line react/no-string-refs
                        type="companyDebt"/>
                    <h2 id='t1'>7.企业逾期</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        companyId = {props.editObj.companyId}
                        companyReportId={companyReportId}
                        modalType={props.modalType}
                        editObj={companyOverdue}
                        // eslint-disable-next-line react/no-string-refs
                        type="companyOverdue"/>
                    <h2 id='t1'>8.企查查（补充）</h2>
                    <EditableTable 
                        customerId={props.editObj.customerId}
                        companyId = {props.editObj.companyId}
                        companyReportId={companyReportId}
                        modalType={props.modalType}
                        editObj={companyJudicatureInfos}
                        // eslint-disable-next-line react/no-string-refs
                        type="companyJudicatureInfo"/>
                    {
                       props.modalType == "look" ? 
                       (<Button style={{
                           marginLeft: 30,
                       }}
                        onClick={lastStep}
                       >
                           上一步
                       </Button>)
                   :
                       ("")     
                    }     
                    <Button style={{
                        marginLeft: 30,
                    }}
                        type="primary"
                        onClick={nextStep}
                    >
                        结束查看
                        </Button>
                </Form>
            </Modal>
        </div>
    );
}

export default CompanyReport;
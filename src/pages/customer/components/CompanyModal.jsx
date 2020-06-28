/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Input, Row, Col, Select, DatePicker, message, Upload } from 'antd'
import request from '@/utils/request';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';



const CompanyModal = (props) => {


    const [form] = Form.useForm()
    const [ imageUrl, setImageUrl ] = useState("");
    const [companyCityOptions, setCompanyCityOptions] = useState([]);
    const [companyAreaOptions, setCompanyAreaOptions] = useState([]);
    const [companyProvinceOptions, setCompanyProvinceOptions] = useState([]);
    const [ loaded, setLoaded] = useState(false);
    const [ imgVisible, setImgVisible] = useState(false);
    const [ isSubmit, setIsSubmit ] = useState(true);
    const [ isLongTime, setIsLongTime ] = useState(true);
    const [ customerOptions, setCustomerOptions ] = useState([]);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [ isRequired, setIsRequired ] = useState(true)

    const photo = {
        action: '../photos/',
        name: 'businessPhoto',
        showUploadList: false,
        url: 'https://www.baidu.com/img/baidu_jgylogo3.gif',
        customRequest: info => {// 手动上传
            const formData = new FormData();
            formData.append('businessPhoto', info.file);// 名字和后端接口名字对应
            request.post("/api/base/company/uploadImage", {
                headers: {
                    'Content': 'multipart/form-data',
                },
                method: 'post',
                processData: false, // 因为data值是FormData对象，不需要对数据做处理。
                contentType: false,
                data: formData
            }).then(
                res => {
                    if (res && res.code === '0000') {
                        if(res.data.legalPeople === props.editObj.name){
                            form.setFieldsValue({ 
                                ...res.data, 
                                setTime: moment(res.data.setTime, 'YYYY-MM-DD'),
                                endTime: moment(res.data.endTime, 'YYYY-MM-DD'),
                                legalPeopleIdNum: props.editObj.idNum,
                                mobilePhone: props.editObj.mobilePhone,
                            });
                        }else{
                            message.info("提醒：营业执照的法人与客户姓名不同");
                            form.setFieldsValue({ 
                                ...res.data, 
                                setTime: moment(res.data.setTime, 'YYYY-MM-DD'),
                                endTime: moment(res.data.endTime, 'YYYY-MM-DD'),
                            });
                        }
                        setImageUrl(`photos/${res.data.imgName}`);
                        setLoaded(true);
                    }else{
                        message.error('上传失败！');
                    }
                })  
            },
        onRemove: file => {// 删除图片调用
            // eslint-disable-next-line react/no-this-in-sfc
            this.setState(state => {
                const index = state.fileList.indexOf(file);
                const newFileList = state.fileList.slice();
                newFileList.splice(index, 1);
                return {
                    fileList: newFileList,
                };
            });
        },
        listType: "picture-card",
        className: "avatar-uploader",

        beforeUpload: file => { // 控制上传图片格式
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

            if (!isJpgOrPng) {
                message.error('您只能上传JPG/PNG 文件!');
                return;
            }
            const isLt3M = file.size / 1024 / 1024 < 3;
            if (!isLt3M) {
                message.error('图片大小必须小于3MB!');
                return;
            }
            // eslint-disable-next-line consistent-return
            return isJpgOrPng && isLt3M;
        },
    }

    useEffect(() => {
        
        if(props.editObj.list && props.editObj.list.length > 0){
            form.setFieldsValue({ ...props.editObj.list[0], 
                companyId: `0:${props.editObj.list[0].id}:${props.editObj.list[0].name}`,
                customerId: `${props.editObj.customerId}`,
                setTime: props.editObj.list[0].setTime?moment(props.editObj.list[0].setTime, 'YYYY-MM-DD'):null,
                endTime: props.editObj.list[0].endTime?moment(props.editObj.list[0].endTime, 'YYYY-MM-DD'):null,
                
            });
        }else{
            form.setFieldsValue({ 
                setTime: null,
                endTime: null,
            });
        }
        
        if(props.modalType === "look"){
            setCompanyOptions(props.editObj.list); 
            setIsRequired(false);
        }
    }, [props.editObj])

    useEffect(() => {
        if (props.visible) {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            getProvince();
            if(props.editObj.province){
                companyProvinceHandleChange(props.editObj.province.split(":")[0]);
            }
            request.get("/api/base/customer/list1",{
                params: {userId:localStorage.getItem('userId')},
                headers:{
               'Content-Type': 'application/json',
               'Accept': 'application/json',
               }
             }).then(res =>{ 
               if(res.code === '0000'){
                setCustomerOptions(res.data)
               }else{
                 message.error('获取数据失败！');
               }
             })
        }
    }, [props.visible])

    const handleCancel = () => {
        Modal.confirm({
            title: '企业信息',
            content: '确定停止操作企业信息、客户信用报告、企业信用报告',
            onOk() {
                props.setVisible();
                form.resetFields();
            },
            onCancel() {
                
            }
        })
    }

    const addData = () => {
        if(!form.getFieldValue('setTime')){
            message.error('未选择正确的成立时间')
            return;
        }
        console.log(11111,form.getFieldValue('timeType'))
        if(form.getFieldValue('timeType')===1 && !form.getFieldValue('endTime')){
            message.error('期限类型为固定期限，需要选择营业期限')
            return;
        }
        request.post("/api/base/company/add", {
            data: {
                ...form.getFieldsValue(),
                userId: localStorage.getItem('userId'),
                setTime: form.getFieldValue('setTime').format('YYYY-MM-DD'),
                endTime: form.getFieldValue('endTime')?form.getFieldValue('endTime').format('YYYY-MM-DD'):"",
                customerId: props.editObj.customerId,
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(res => {
            if (res.code === '0000') {
                form.setFieldsValue({ id: res.data });
                Modal.confirm({
                    title: '添加公司',
                    content: '添加公司成功',
                    onOk() {
                        props.setVisible(true,
                            props.editObj.customerId, 
                            props.editObj.customerName, 
                            form.getFieldValue('name'),
                            res.data);
                            form.resetFields();
                        
                    },
                })
            } else {
                Modal.confirm({
                    title: '添加公司',
                    content: `系统添加公司失败，原因： ${res.data}`,
                    onOk() {
                    },
                })
            }
        })
    }


    const editData = () =>{
        if(!form.getFieldValue('setTime')){
            message.error('未选择正确的成立时间')
            return;
        }
        console.log(11111,form.getFieldValue('timeType'))
        if(form.getFieldValue('timeType')===1 && !form.getFieldValue('endTime')){
            message.error('当期限类型为固定期限时，需要选择营业期限')
            return;
        }
        request.post("/api/base/company/update", {
            data: {
                ...form.getFieldsValue(),
                userId: localStorage.getItem('userId'),
                setTime: form.getFieldValue('setTime').format('YYYY-MM-DD'),
                endTime: form.getFieldValue('endTime')?form.getFieldValue('endTime').format('YYYY-MM-DD'):"",
                customerId: props.editObj.customerId,
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(res => {
            if (res.code === '0000') {
                form.setFieldsValue({ id: res.data });
                Modal.confirm({
                    title: '修改公司信息',
                    content: '修改公司信息成功',
                    onOk() {
                        props.setVisible(true,
                            props.editObj.customerId, 
                            props.editObj.customerName, 
                            form.getFieldValue('name'),
                            form.getFieldValue('id'),
                            )
                        form.resetFields();
                    },
                    
                })
            } else {
                Modal.confirm({
                    title: '修改公司信息',
                    content: `系统修改公司信息失败，原因： ${res.data}? ${res.data}:'联系系统管理员排查'`,
                    onOk() {
                    },
                })
            }
        })
    }


    const onFinish = () => {
        if(isSubmit){
            try{
                setIsSubmit(false);
                if(props.modalType === 'add'){
                    Modal.confirm({
                        title: '添加公司',
                        content: '确定添加公司信息',
                        onOk() {
                            addData();
                            setIsSubmit(true);
                        },                
                    })
                }else if(props.modalType === 'edit'){
                    Modal.confirm({
                        title: '修改公司',
                        content: '确定修改公司信息',
                        onOk() {
                            editData();
                            setIsSubmit(true);
                        },                
                    })
                }else if(props.modalType === 'look'){
                    console.log(12345,props.editObj.customerId);
                    props.setVisible(
                        true,
                        props.editObj.customerId,
                        props.editObj.customerName,
                        form.getFieldValue().companyId?form.getFieldValue().companyId.split(":")[2]:null,
                        form.getFieldValue().companyId?form.getFieldValue().companyId.split(":")[1]:null,
                    );
                }
                setIsSubmit(true);
            }catch(e){
                console.error(e);
                setIsSubmit(true);
            }
            
        }else{
            message.error(`操作过于频繁，请稍后再试`);
        }
    }



    // 选择公司类型
    const typeHandleChange = value => {
        form.setFieldsValue({ companyType: value });
    }
    const invoiceMoneyHandleChange = value => {
        form.setFieldsValue({ invoiceMoney: value });
    }

    const payTaxesHandleChange = value => {
        form.setFieldsValue({ payTaxes: value });
    }

    const taxLevelHandleChange = value => {
        form.setFieldsValue({ taxLevel: value });
    }
    
    const timeTypeoOnChange = value => {
        form.setFieldsValue({ timeType : value });
        console.log(111,value);
        if (value == 1) {
            setIsLongTime(false);
        } else if ((value == 2)){
            setIsLongTime(true);
            form.setFieldsValue({ ...form.setFieldsValue, endTime : null });
        }else{
            setIsLongTime(true);
        }
    }
    /**
    * 下拉框获取城市
    */
    const getProvince = async () => {
        try {
            const res = await request.get('/api/base/address/province/')
            if (res.code === '0000') {
                setCompanyProvinceOptions(res.data);
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
        return new Promise((resolve) => {
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

    const companyCityHandleChange = value => {
        getArea(value).then(res => {
            setCompanyAreaOptions(res);
        });
    }

    const companyAreaHandleChange = () => {
    }

    const seeBig = () =>{
        setImgVisible(true);          
    }
    
    const onChange = (value) =>{
        const data = props.editObj.list[value.split(":")[0]];
        form.setFieldsValue({ ...data, 
            // companyId: `${props.editObj[0].id}:${props.editObj[0].name}`,
            setTime: data.setTime?moment(data.setTime, 'YYYY-MM-DD'):null,
            endTime: data.endTime?moment(data.endTime, 'YYYY-MM-DD'):null,
        });
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
                width="800px"
                footer={
                    [] // 设置footer为空，去掉 取消 确定默认按钮
                }
                getContainer={false}
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                >
                    <Row gutter={24}>
                        <Col span={5} hidden>
                            <Form.Item
                                name="id"
                                label="公司编号"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            

                            {props.modalType == "edit" || props.modalType == "add"? 
                                (<Form.Item
                                    name="name"
                                    label="企业名称"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入企业名称',
                                        },
                                    ]}
                                >
                                    <Input placeholder="请输入企业名称" 
                                    disabled ={props.modalType==='look' 
                                        || 
                                        (props.modalType === 'edit' && form.getFieldValue('name'))
                                         }/>
                                </Form.Item>)
                                :
                                (<Form.Item
                                    name="companyId"
                                    label="企业名称"
                                >
                                    <Select
                                        showSearch
                                        placeholder={props.modalType=="look"?"":"请选择"}
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
                                        {companyOptions.map((v,i) => {
                                            
                                        return (<Select.Option key={v.id} value={`${i}:${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                        })}
                                    </Select>
                                </Form.Item>)
                                }    
                        </Col>
                        <Col span={12} >
                            {
                                props.modalType==='look' ? (<Form.Item
                                    name="companyCode"
                                    label="统一信用编码"
                                    rules={[
                                        {
                                            required: false,
                                            message: '请输入公司统一信用编码',
                                        },
                                    ]}
                                >
                                    <Input 
                                        placeholder="" 
                                        disabled />
                                </Form.Item>) : (<Form.Item
                                    name="companyCode"
                                    label="统一信用编码"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入公司统一信用编码',
                                        },
                                    ]}
                                >
                                    <Input 
                                        placeholder="请输入公司统一信用编码" 
                                        />
                                </Form.Item>)
                            }
                        </Col>
                    </Row>
                    <Row gutter={24}>
                    <Col span={7} >
                            <Form.Item
                                name="customerId"
                                label="客户姓名"
                                
                            >
                               <Select
                                    showSearch
                                    placeholder={props.modalType=="look"?"":"请选择"}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {customerOptions.map(v => {
                                        return (<Select.Option key={v.id} value={v.id}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8} >
                            {
                                props.modalType==='look'?
                                    (<Form.Item
                                        name="registerMoney"
                                        label="公司注册资金"
                                        rules={[
                                            {
                                                required: false,
                                                message: '请输入公司注册资金',
                                            },
                                        ]}
                                    >
                                        <Input 
                                            placeholder="" 
                                            prefix="￥" 
                                            suffix="万元" 
                                            disabled = {props.modalType==='look'}
                                            />
                                    </Form.Item>)
                                :
                                    (<Form.Item
                                        name="registerMoney"
                                        label="公司注册资金"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入公司注册资金',
                                            },
                                        ]}
                                    >
                                        <Input 
                                            placeholder="请输入公司注册资金" 
                                            prefix="￥" 
                                            suffix="万元" 
                                            disabled = {props.modalType==='look'}
                                            />
                                    </Form.Item>)
                            }
                            
                        </Col>
                        <Col span={9} >
                            <Form.Item
                                name="companyType"
                                label="公司类型"
                                rules={[
                                    {
                                        required: isRequired,
                                        message: '公司类型',
                                    },
                                ]}
                            >
                                <Select defaultValue={props.modalType=="look"?"":"0"} onChange={typeHandleChange} disabled ={props.modalType==='look'}>
                                    <Select.Option key="0" value="0" disabled >请选择</Select.Option>
                                    <Select.Option key="1" value={1}>有限责任公司</Select.Option>
                                    <Select.Option key="2" value={2}>股份有限公司</Select.Option>
                                    <Select.Option key="3" value={3}>个人独资企业</Select.Option>
                                    <Select.Option key="4" value={4}>个体工商户</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={6} >
                            <Form.Item
                                name="legalPeople"
                                label="法人"
                                rules={[
                                    {
                                        required: isRequired,
                                        message: '法人姓名',
                                    },
                                ]}
                            >
                                <Input 
                                    placeholder={props.modalType=="look"?"":"法人姓名"}
                                    disabled ={props.modalType==='look'}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="mobilePhone"
                                label="手机号码"
                                rules={[
                                   
                                    {
                                        pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码'
                                    }
                                ]}
                            >
                                <Input 
                                    placeholder={props.modalType=="look"?"":"请输入客户手机号码"}
                                    disabled={props.modalType==='look'}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={10} >
                            <Form.Item
                                name="legalPeopleIdNum"
                                label="身份证"
                                rules={[
                                    {
                                        required: isRequired,
                                        message: '请输入法人身份证号码',
                                    },
                                ]}
                            >
                                <Input 
                                    placeholder={props.modalType=="look"?"":"请输入法人身份证号码"}
                                    disabled ={props.modalType==='look'}
                                />
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
                                name="province"
                                label=""
                                rules={[
                                    {
                                        required: isRequired,
                                        message: '请选择',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="省"
                                    optionFilterProp="children"
                                    onChange={companyProvinceHandleChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    defaultValue={form.getFieldValue('city')}
                                    key={form.getFieldValue('companyProvince')}
                                    disabled ={props.modalType==='look'}
                                >
                                    <Select.Option disabled key='0' value='0'>省</Select.Option>
                                    {!companyProvinceOptions?"":companyProvinceOptions.map(v => {
                                        return (<Select.Option key={v.code} value={v.code ? `${v.code}:${v.name}` : v.id}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="city"
                                label=""
                            >
                                <Select
                                    showSearch
                                    placeholder="市"
                                    optionFilterProp="children"
                                    onChange={companyCityHandleChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    defaultValue={form.getFieldValue('companyCity')}
                                    disabled ={props.modalType==='look'}
                                >
                                    <Select.Option disabled key='0' value='0'>市</Select.Option>
                                    {!companyCityOptions?"":companyCityOptions.map(v => {
                                        return (<Select.Option key={v.code} value={v.code ? `${v.code}:${v.name}` : v.id}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                name="area"
                                label=""
                            >
                                <Select
                                    showSearch
                                    placeholder="区"
                                    optionFilterProp="children"
                                    onChange={companyAreaHandleChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    disabled ={props.modalType==='look'}
                                >
                                    <Select.Option disabled key='0' value='0'>区</Select.Option>
                                    {!companyAreaOptions?"":companyAreaOptions.map(v => {
                                        return (<Select.Option key={v.code} value={v.code ? `${v.name}` : v.id}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={9}>
                            <Form.Item
                                name="address"
                                label=""
                            >
                                <Input placeholder={props.modalType=="look"?"":"请输入详细地址"} disabled ={props.modalType==='look'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8} >
                            <Form.Item
                                name="invoiceMoney"
                                label="年开票金额"
                            >
                                <Select defaultValue={props.modalType=="look"?"":"0"} onChange={invoiceMoneyHandleChange} disabled ={props.modalType==='look'}>
                                    <Select.Option key='0' value="0">请选择</Select.Option>
                                    <Select.Option key='1' value={1}>0-50万</Select.Option>
                                    <Select.Option key='2' value={2}>50-100万</Select.Option>
                                    <Select.Option key='3' value={3}>100-300万</Select.Option>
                                    <Select.Option key='4' value={4}>300-500万</Select.Option>
                                    <Select.Option key='5' value={5}>500万以上</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8} >
                            <Form.Item
                                name="payTaxes"
                                label="年纳税金额"
                            >
                                <Select defaultValue={props.modalType=="look"?"":"0"} onChange={payTaxesHandleChange} disabled ={props.modalType==='look'}>
                                    <Select.Option key='0' value="0">请选择</Select.Option>
                                    <Select.Option key='1' value={1}>0-50万</Select.Option>
                                    <Select.Option key='2' value={2}>50-100万</Select.Option>
                                    <Select.Option key='3' value={3}>100-300万</Select.Option>
                                    <Select.Option key='4' value={4}>300-500万</Select.Option>
                                    <Select.Option key='5' value={5}>500万以上</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8} >
                            <Form.Item
                                name="taxLevel"
                                label="纳税评级"
                            >
                                <Select defaultValue={props.modalType=="look"?"":"0"} onChange={taxLevelHandleChange} disabled ={props.modalType==='look'}>
                                    <Select.Option key='0' value="0">请选择</Select.Option>
                                    <Select.Option key='1' value="A">A</Select.Option>
                                    <Select.Option key='2' value="B">B</Select.Option>
                                    <Select.Option key='3' value="C">C</Select.Option>
                                    <Select.Option key='4' value="D">D</Select.Option>
                                    <Select.Option key='5' value="M">M</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="businessScope"
                                label="经营范围"
                            >
                                <Input placeholder={props.modalType=="look"?"":"请输入经营范围"} disabled ={props.modalType==='look'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item
                                name="setTime"
                                label="成立日期"
                            rules={[
                                {
                                    required: isRequired,
                                    message: '请选择成立日期',
                                },
                            ]}
                            >
                                <DatePicker
                                    disabled ={props.modalType==='look'}
                                    format='YYYY-MM-DD'
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="timeType"
                                label="期限类型"
                                rules={[
                                    {
                                        required: isRequired,
                                        message: '请选择期限类型',
                                    },
                                ]}
                            >
                                <Select 
                                    defaultValue={props.modalType=="look"?"":"0"} 
                                    onChange={timeTypeoOnChange} 
                                    disabled ={props.modalType==='look'}
                                    >
                                    <Select.Option key="0" value="0" disabled >请选择</Select.Option>
                                    <Select.Option key="1" value={1}>固定期限</Select.Option>
                                    <Select.Option key="2" value={2}>长期</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="endTime"
                                label="营业期限"
                            >
                                <DatePicker
                                    disabled = { props.modalType==='look' || isLongTime }
                                    format='YYYY-MM-DD'
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                name="remark"
                                label="备注"
                            >
                                <Input placeholder={props.modalType=="look"?"":"请输入备注"} disabled ={props.modalType==='look'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={8}>
                        <Upload {...photo} >
                            <Button disabled={loaded || props.modalType==='look'}>
                                <UploadOutlined />上传营业执照
                            </Button>
                        </Upload>
                        </Col>
                        <Col span={8}>
                            <img src={imageUrl}  width='200px' height='100%'   />
                        </Col>
                        <Col span={8}>
                            <Button disabled={!loaded} onClick={seeBig} >打开图片</Button>
                            <Button  onClick={()=>{setLoaded(false)}} >重新上传</Button>
                            <Modal visible={imgVisible}
                                onOk = {()=>{setImgVisible(false)}}
                                onCancel={()=>{setImgVisible(false)}}
                                getContainer={false}
                                width = '1000px'
                            >
                                <img src={imageUrl}  width='100%' height='100%'   />
                            </Modal>
                        </Col>
                    </Row>
                    <Row> 
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
                            htmlType="submit"
                        >
                            下一步 - 个人信用报告
                        </Button>
                        <Button
                            style={{
                                marginLeft: 30,
                            }}
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick={handleCancel}
                        >
                            取消
                        </Button>
                    </Row>

                </Form>
            </Modal>
        </div>
    );
}

export default CompanyModal;
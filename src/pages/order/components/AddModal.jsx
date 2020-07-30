/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react'
import { Modal, Button, Form, Input, Row, Col, DatePicker, Divider, Select, message } from 'antd'
import request from '@/utils/request';
import moment from 'moment';
import CustomerModal  from './CustomerModal'
import CompanyModal  from './CompanyModal'

const AddModal = (props) => {


    const [form] = Form.useForm();
    const [maskClosable,] = useState(false);
    const [isSubmit, setIsSubmit] = useState(true);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [customerVisible, setCustomerVisible] = useState(false);
    const [companyVisible, setCompanyVisible] = useState(false);
    const [customerObj, setCustomerObj] = useState({});
    const [companyObj, setCompanyObj] = useState({});
    const [customerButton, setCustomerButton] = useState(true);
    const [companyButton, setCompanyButton] = useState(true);

    const timeOut = (m) => {
        setTimeout(() => {
            setIsSubmit(false);
        },
            m);
    }

    const handleCancel = () => {
        Modal.confirm({
            title: '添加订单',
            content: '确定取消添加订单',
            onOk() {
                props.setVisible(false);
                form.resetFields();
            },
            onCancel() {

            }
        })
    }

    const add = (data) => {
        request.post('/api/base/order/add', {
            data,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }).then(res => {
            if (res.code && res.code === '0000') {
                message.info('创建订单成功！');
                timeOut(20000);
                props.setVisible(false);
                form.resetFields();
                setIsSubmit(true);
            } else {
                message.error(res.data ? res.data : "添加失败，原因不明，请联系维护人员");
                setIsSubmit(true);
            }
        })
    }

    /**
     * 校验字符串是小数还是整数
     * 如果是小数或者整数就返回true
     * @param {*} str 
     */
    const checkeNum1 = (str) => {
        str = str.toString();
        const reg = new RegExp(/^[0-9]*$/);
        if (str.indexOf(".") === -1) {
            if (str.length > 1) {
                if (str.charAt(0) == 0) {
                    return false;
                }
            }
            if (str.length > 0 && reg.test(str)) {
                return true;
            } else {
                return false;
            }
        } else {
            const s = str.split(".");
            if (s.length !== 2) {
                return false;
            } else {
                if (s[0].length > 1) {
                    if (s[0].charAt(0) == 0) {
                        return false;
                    }
                }
                if (s[0].length > 0 && reg.test(s[0])) {
                    if (s[1].length > 0 && reg.test(s[1])) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
    }

    /**
    * 校验字符串是小数还是整数
    * 如果是整数就返回true
    * @param {*} str 
    */
    const checkeNum2 = (str) => {

        str = str.toString();

        console.log("str", str)
        const reg = new RegExp(/^[0-9]*$/);
        if (str.indexOf(".") === -1) {
            if (str.length > 1) {

                if (str.charAt(0) == 0) {
                    return false;
                }
            }

            console.log(reg.test(str));
            console.log("str.length", str.length);
            if (str.length > 0 && reg.test(str)) {

                return true;
            } else {

                return false;
            }
        } else {

            return false;
        }
    }


    const onFinish = () => {
        if (isSubmit) {
            setIsSubmit(false);
            if (localStorage.getItem('userName').trim() === form.getFieldValue('createUserName2').trim()) {
                // 填表人与登录用户是否一致
                // if(moment().isBefore(moment().locale('zh-cn').format('YYYY-MM-DD'),
                //     form.getFieldValue('operatTime').format('YYYY-MM-DD'))){
                //     // eslint-disable-next-line eqeqeq
                if (checkeNum2(form.getFieldValue('loan').trim())) {
                    // eslint-disable-next-line eqeqeq
                    if (checkeNum1(form.getFieldValue('serviceRate').trim())) {
                        // eslint-disable-next-line eqeqeq
                        if (checkeNum2(form.getFieldValue('serviceMoney').trim())) {
                            // eslint-disable-next-line eqeqeq
                            if (checkeNum2(form.getFieldValue('otherCost').trim())) {
                                // eslint-disable-next-line eqeqeq
                                if (checkeNum2(form.getFieldValue('getMoney').trim())) {
                                    if (Math.floor(form.getFieldValue('getMoney').trim()) <= form.getFieldValue('serviceMoney').trim()) {
                                        // 校验完成
                                        const data = {
                                            ...form.getFieldsValue(),
                                            userId: localStorage.getItem("userId"),
                                            createUserName: localStorage.getItem('userName').trim(),
                                            operatTime: form.getFieldValue('operatTime').format('YYYY-MM-DD'),
                                            departmentId: form.getFieldValue('departmentId').split(":")[0],
                                            departmentName: form.getFieldValue('departmentId').split(":")[1],
                                            companyId: form.getFieldValue('companyId').split(":")[0],
                                            companyName: form.getFieldValue('companyId').split(":")[1],
                                            serviceStaffId: form.getFieldValue('serviceStaffId').split(":")[0],
                                            serviceStaff: form.getFieldValue('serviceStaffId').split(":")[1],
                                            phoneStaffId: form.getFieldValue('phoneStaffId').split(":")[0],
                                            phoneStaff: form.getFieldValue('phoneStaffId').split(":")[1],
                                            helpStaffId: form.getFieldValue('helpStaffId').split(":")[0],
                                            helpStaff: form.getFieldValue('helpStaffId').split(":")[1],
                                            customerId: form.getFieldValue('customerId').split(":")[0],
                                            customerName: form.getFieldValue('customerId').split(":")[1],
                                        }
                                        // 添加
                                        Modal.confirm({
                                            title: '新增订单',
                                            content: '确定添加订单',
                                            onOk() {
                                                add(data);
                                                setIsSubmit(true);
                                            }
                                        })
                                        setIsSubmit(true);
                                    } else {
                                        setIsSubmit(true);
                                        Modal.confirm({
                                            title: '新增订单',
                                            content: '已收金额大于小款金额，输入有误，请重新输入！',
                                        })

                                    }

                                } else {
                                    setIsSubmit(true);
                                    Modal.confirm({
                                        title: '新增订单',
                                        content: '已收金额输入有误（只能是数字），请重新输入！',
                                    })
                                }
                            } else {
                                setIsSubmit(true);
                                Modal.confirm({
                                    title: '新增订单',
                                    content: '其他费用输入有误（只能是数字），请重新输入！',
                                })
                            }
                        } else {
                            setIsSubmit(true);
                            Modal.confirm({
                                title: '新增订单',
                                content: '小款金额输入有误（只能是数字），请重新输入！',
                            })
                        }
                    } else {
                        setIsSubmit(true);
                        Modal.confirm({
                            title: '新增订单',
                            content: '小款点位输入有误（只能是数字），请重新输入！',
                        })
                    }
                } else {
                    setIsSubmit(true);
                    Modal.confirm({
                        title: '新增订单',
                        content: '下款金额输入有误（只能是数字），请重新输入！',
                    })
                }
                // }else{
                //     Modal.confirm({
                //         title: '新增订单',
                //         content: '操作时间在开单时间必须在开单时间之前',   
                //     })
                // }
            } else {
                setIsSubmit(true);
                Modal.confirm({
                    title: '新增订单',
                    content: '填表人与登录用户不一致！！请重新确认（填表人与登录用户必须一致）！',
                })
            }
            setIsSubmit(true);
        } else {
            message.error("操作太频繁，请稍后20秒再试！！")
        }
    }



    function onChange(value) {
        console.log(`selected ${value}`);
        console.log(form.getFieldValue('isGet'));
    }

    function onChange4Company(value) {
        console.log(`selected ${value}`);
        setCompanyButton(false);
    }

    async function onChange4Customer(value) {
        setCompanyOptions([]);
        setCustomerButton(false);
        setCompanyButton(true);
        form.setFieldsValue({
            ...form.getFieldsValue(),
            "companyId": "0"
        });
        try {
            const res = await request.get('/api/base/company/getByCustomerId', {
                params: {
                    userId: localStorage.getItem('userId'),
                    customerId: form.getFieldValue("customerId").toString().split(":")[0],
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
            if (res.code === '0000') {
                setCompanyOptions(res.data);
                console.log(companyOptions);
            }
        } catch (error) {
            console.log(111, error);
        }
    }

    function onBlur() {
        console.log('blur');
    }

    async function onFocus4Company() {

        try {
            const res = await request.get('/api/base/company/getByCustomerId', {
                params: {
                    userId: localStorage.getItem('userId'),
                    customerId: form.getFieldValue("customerId").toString().split(":")[0],
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            })
            if (res.code === '0000') {
                setCompanyOptions(res.data);
                console.log(companyOptions);
            }
        } catch (error) {
            console.log(111, error);
        }
    }

    function onSearch(val) {
        console.log('search:', val);
    }

    function getCustomer() {
        console.log("aa",form.getFieldValue("customerId"));
        request.get("/api/base/customer/getOne", {
            params: { id: form.getFieldValue("customerId").toString().split(":")[0], userId: localStorage.getItem('userId') },
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }).then(res => {
            if (res.code === '0000') {
              setCustomerObj(res.data);
              setCustomerVisible(true);
            } else {
              Modal.confirm({
                title: '获取客户失败',
                content: `失败原因： ${res.data}`,
                onOk() { },
              })
            }
          })
        

    }

     function getCompany() {
        request.get("/api/base/company/getOne", {
            params: { id: form.getFieldValue("companyId").toString().split(":")[0], userId: localStorage.getItem('userId') },
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }).then(res => {
            if (res.code === '0000') {
              setCompanyObj(res.data);
              setCompanyVisible(true);
            } else {
              Modal.confirm({
                title: '获取企业失败',
                content: `失败原因： ${res.data}`,
                onOk() { },
              })
            }
        })
    }

    function setVisible4CustomerModal(){
        
        setCustomerVisible(false);
        
    }
    function setVisible4CompanyModal(){
        setCompanyVisible(false);
    }

    /**
     * 
     * @param {金额转换} Num 
     */
    function arabia2Chinese(Num) {
        for (i = Num.length - 1; i >= 0; i--) {
            Num = Num.replace(",", "")//替换tomoney()中的“,”
            Num = Num.replace(" ", "")//替换tomoney()中的空格
        }
        Num = Num.replace("￥", "")//替换掉可能出现的￥字符
        if (isNaN(Num)) { //验证输入的字符是否为数字
            alert("请检查小写金额是否正确");
            return;
        }
        //---字符处理完毕，开始转换，转换采用前后两部分分别转换---//
        part = String(Num).split(".");
        newchar = "";
        //小数点前进行转化
        for (i = part[0].length - 1; i >= 0; i--) {
            if (part[0].length > 10) { alert("位数过大，无法计算"); return ""; } //若数量超过拾亿单位，提示
            tmpnewchar = ""
            perchar = part[0].charAt(i);
            switch (perchar) {
                case "0": tmpnewchar = "零" + tmpnewchar; break;
                case "1": tmpnewchar = "壹" + tmpnewchar; break;
                case "2": tmpnewchar = "贰" + tmpnewchar; break;
                case "3": tmpnewchar = "叁" + tmpnewchar; break;
                case "4": tmpnewchar = "肆" + tmpnewchar; break;
                case "5": tmpnewchar = "伍" + tmpnewchar; break;
                case "6": tmpnewchar = "陆" + tmpnewchar; break;
                case "7": tmpnewchar = "柒" + tmpnewchar; break;
                case "8": tmpnewchar = "捌" + tmpnewchar; break;
                case "9": tmpnewchar = "玖" + tmpnewchar; break;
            }
            switch (part[0].length - i - 1) {
                case 0: tmpnewchar = tmpnewchar + "元"; break;
                case 1: if (perchar != 0) tmpnewchar = tmpnewchar + "拾"; break;
                case 2: if (perchar != 0) tmpnewchar = tmpnewchar + "佰"; break;
                case 3: if (perchar != 0) tmpnewchar = tmpnewchar + "仟"; break;
                case 4: tmpnewchar = tmpnewchar + "万"; break;
                case 5: if (perchar != 0) tmpnewchar = tmpnewchar + "拾"; break;
                case 6: if (perchar != 0) tmpnewchar = tmpnewchar + "佰"; break;
                case 7: if (perchar != 0) tmpnewchar = tmpnewchar + "仟"; break;
                case 8: tmpnewchar = tmpnewchar + "亿"; break;
                case 9: tmpnewchar = tmpnewchar + "拾"; break;
            }
            newchar = tmpnewchar + newchar;
        }
        //小数点之后进行转化
        if (Num.indexOf(".") != -1) {
            if (part[1].length > 2) {
                alert("小数点之后只能保留两位,系统将自动截段");
                part[1] = part[1].substr(0, 2)
            }
            for (i = 0; i < part[1].length; i++) {
                tmpnewchar = ""
                perchar = part[1].charAt(i)
                switch (perchar) {
                    case "0": tmpnewchar = "零" + tmpnewchar; break;
                    case "1": tmpnewchar = "壹" + tmpnewchar; break;
                    case "2": tmpnewchar = "贰" + tmpnewchar; break;
                    case "3": tmpnewchar = "叁" + tmpnewchar; break;
                    case "4": tmpnewchar = "肆" + tmpnewchar; break;
                    case "5": tmpnewchar = "伍" + tmpnewchar; break;
                    case "6": tmpnewchar = "陆" + tmpnewchar; break;
                    case "7": tmpnewchar = "柒" + tmpnewchar; break;
                    case "8": tmpnewchar = "捌" + tmpnewchar; break;
                    case "9": tmpnewchar = "玖" + tmpnewchar; break;
                }
                if (i == 0) tmpnewchar = tmpnewchar + "角";
                if (i == 1) tmpnewchar = tmpnewchar + "分";
                newchar = newchar + tmpnewchar;
            }
        }
        //替换所有无用汉字
        while (newchar.search("零零") != -1)
            newchar = newchar.replace("零零", "零");
        newchar = newchar.replace("零亿", "亿");
        newchar = newchar.replace("亿万", "亿");
        newchar = newchar.replace("零万", "万");
        newchar = newchar.replace("零元", "元");
        newchar = newchar.replace("零角", "");
        newchar = newchar.replace("零分", "");

        if (newchar.charAt(newchar.length - 1) == "元" || newchar.charAt(newchar.length - 1) == "角")
            newchar = newchar + "整"
      //  document.write(newchar);
        return newchar;

    }


    /**
     *  实时显示input框输入金额
     */
    function keyup() {
        if ($('#moneyAmount').val() == '') {
            $('#moneyAmountCN').text("未输入金额");
        } else {
            $('#moneyAmountCN').text(Arabia_to_Chinese($('#moneyAmount').val()))
        }
    }

    /**
 * 输入验证
 *
 * @param value
 * @returns {string}
 */
function moneyInput(value) {
    //修复第一个字符是小数点 的情况.
    let fa = '';
    if (value !== '' && value.substr(0, 1) === '.') {
        value = "";
    }
    value = value.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
    value = value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    if (value.indexOf(".") < 0 && value !== "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if (value.substr(0, 1) === '0' && value.length === 2) {
            value = value.substr(1, value.length);
        }
    }
    value = fa + value;
    return value;
    }


    const layoutcol_6 = {

        md: {
            span: 6
        },
        xs: {
            span: 12
        }
    }

    const layoutcol_12 = {

        md: {
            span: 12
        },
        xs: {
            span: 24
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
                width={1000}
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
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="id "
                                label="编号"
                            >
                                <Input placeholder="编号" disabled />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="createUserName"
                                label="填表人"
                            >
                                <Input defaultValue={localStorage.getItem('userName')} disabled />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>

                            <Form.Item
                                format='YYYY-MM-DD'
                                name="operatTime"
                                label="操作时间"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择操作时间',
                                    },
                                ]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>

                        </Col>
                        <Col {...layoutcol_6}>
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
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    // onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.departmentOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>


                            <Form.Item
                                name="customerId"
                                label="客户"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择客户',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange4Customer}
                                    // onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.customerOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>

                            <Form.Item
                                name="serviceStaffId"
                                label="主办人"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择主办人',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    // onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.staffOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>

                            <Form.Item
                                name="helpStaffId"
                                label="辅助人"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择辅助人',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    // onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.staffOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>

                            <Form.Item
                                name="phoneStaffId"
                                label="电销"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择电销',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    // onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.staffOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_12}>


                            <Form.Item
                                name="companyId"
                                label="贷款企业"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择贷款企业',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange4Company}
                                    // onFocus={onFocus4Company}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {companyOptions.map(v => {
                                        return (<Select.Option key={v.id} value={`${v.id}:${v.name}`}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_12}>

                            <Form.Item
                                name="bankName"
                                label="下款银行"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择银行',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    // onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Select.Option disabled key='0' value='0'>请选择</Select.Option>
                                    {props.bankOptions.map(v => {
                                        return (<Select.Option key={v.id} value={v.name}>{v.name}</Select.Option>);
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>


                            <Form.Item
                                name="loan"
                                label="下款金额(￥)"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入下款金额',
                                    },
                                ]}
                            >
                                <Input placeholder="下款金额" />
                            </Form.Item>

                        </Col>
                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="serviceRate"
                                label="小款点位(%)"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入小款点位',
                                    },
                                ]}
                            >
                                <Input placeholder="小款点位" />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>

                            <Form.Item
                                name="serviceMoney"
                                label="应收小款金额(￥)"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入小款金额',
                                    },
                                ]}
                            >
                                <Input placeholder="小款金额" />
                            </Form.Item>

                        </Col>
                        <Col {...layoutcol_6}>

                            <Form.Item
                                name="isGet"
                                label="收款情况"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    // onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    <Select.Option disabled key={0} value="0">请选择</Select.Option>
                                    <Select.Option key={1} value="全部已收">全部已收</Select.Option>
                                    <Select.Option key={2} value="全部未收">全部未收</Select.Option>
                                    <Select.Option key={3} value="部分未收">部分未收</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>

                            <Form.Item
                                name="otherCost"
                                label="其他费用(￥)"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入其他费用',
                                    },
                                ]}
                            >
                                <Input placeholder="其他费用(￥)" />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>

                            <Form.Item
                                name="getMoney"
                                label="已收金额(￥)"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入已收金额',
                                    }
                                ]}
                            >
                                <Input placeholder="已收金额" />
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>


                            <Form.Item
                                name="needInvoice"
                                label="是否开票"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    // onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    <Select.Option disabled key={0} value="0">请选择</Select.Option>
                                    <Select.Option key={1} value="是">是</Select.Option>
                                    <Select.Option key={2} value="否">否</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col {...layoutcol_6}>

                            <Form.Item
                                name="remark"
                                label="备注"
                            >
                                <Input placeholder="备注" />
                            </Form.Item>
                        </Col>


                        <Divider />


                        <Col {...layoutcol_6}>
                            <Form.Item
                                name="createUserName2"
                                label="填表人"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入填表人',
                                    },
                                ]}
                            >
                                <Input placeholder="填表人签名" />
                            </Form.Item>
                        </Col>

                        <Col {...layoutcol_6}>
                            <Button style={{
                                marginLeft: 8,
                            }}
                                type="primary"
                                htmlType="submit"
                            >
                                提交
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
                        </Col>

                        <Col {...layoutcol_6}>
                            <Button
                                style={{
                                    marginLeft: 8,
                                }}
                                // eslint-disable-next-line react/jsx-no-bind
                                onClick={getCustomer}
                                disabled={customerButton}
                            >
                                查看客户
                            </Button>
                            <Button
                                style={{
                                    marginLeft: 8,
                                }}
                                // eslint-disable-next-line react/jsx-no-bind
                                onClick={getCompany}
                                disabled={companyButton}
                            >
                                查看企业
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <CustomerModal
                title= "客户资料"       
                visible={customerVisible}
                setVisible={setVisible4CustomerModal}
                editObj={customerObj}
                modalType="look"
            />
            
            <CompanyModal
                title='企业资料'
                visible={companyVisible}
                setVisible={setVisible4CompanyModal}
                modalType="look"
                editObj={companyObj}
                // eslint-disable-next-line react/jsx-no-bind
            />
        </div>
    );
}

export default AddModal;


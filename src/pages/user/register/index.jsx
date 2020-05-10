import React, { Component } from 'react'
import { Modal, Button, Form, Input, Alert, Radio, Row, Col,message } from 'antd'
import  request  from '@/utils/request';
import styles from './style.less';

// eslint-disable-next-line react/prefer-stateless-function
export default class index extends Component {

    constructor(props) {
        super(props)
        this.state = {
            // eslint-disable-next-line react/no-unused-state
            disabled: false,
            // eslint-disable-next-line react/no-unused-state
            count: 0,
            // eslint-disable-next-line react/no-unused-state
            interval: 0,
        }
        
    }

    sendMsg = () => {
        if(document.getElementById('name').value){
            this.setState({ disabled: true, count:120  })
            request.get('/api/base/staff/sendVerMsg',{
                params:{ name:document.getElementById('name').value },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }).then(res =>{
                if(res.code){
                    message.info("发送短信成功！");
                    
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    let p = 120;
                    const interval = window.setInterval(() => {
                        p -=1;
                        this.setState({
                            // eslint-disable-next-line react/no-unused-state
                            count : p
                        })
                        if(p===0){
                            this.setState({ disabled: false })
                            clearInterval(interval)
                        }
                        
                    }, 1000);
                }else{
                    this.setState({ disabled: false })
                    message.info("发送短信失败！");
                }
            })
        }else{
            message.info("请输入姓名");
        }
        
    }

    onFinish = (o) => {
        if(o.password === o.comfirmPassword){
            request.post('/api/base/staff/changePwd', {
                data: {
                    name: o.name,
                    password: o.password,
                    captcha: o.captcha,
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }).then(res => {
                if (res.code === "0000") {
                    // message.info('修改密码成功');
                    Modal.confirm({
                        title: '修改密码',
                        content: '修改密码成功,请按确定跳转至登录页',
                        onOk() {
                            window.location.href = '/user/login'
                        },
                    })
                    
                } else {
                    message.error(res.msg);
                }
            })
        }else{
            message.error("新密码与确认密码不一致");
        }
    }


    render() {
        return (
            <div className={styles.main}>
                <Form 
                    form={this.form}
                    onFinish={this.onFinish}>
                    <Row>
                    <Form.Item
                        name="name"
                        id="name"
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
                    </Row>
                    <Row>
                    <Form.Item
                        name="password"
                        label="新&nbsp;&nbsp;密&nbsp;&nbsp;码"
                        rules={[
                            {
                                required: true,
                                message: '请输入新密码',
                            },
                        ]}
                    >
                        <Input.Password placeholder="请输入新密码" />
                    </Form.Item>
                    </Row>
                    <Row>
                    <Form.Item
                        name="comfirmPassword"
                        label="确认密码"
                        rules={[
                            {
                                required: true,
                                message: '确认密码',
                            },
                        ]}
                    >
                        <Input.Password placeholder="请输入新密码" />
                    </Form.Item>
                    </Row>
                    <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item
                            name="captcha"
                            label="验&nbsp;&nbsp;证&nbsp;&nbsp;码"
                            rules={[
                                {
                                required: true,
                                message: '请输入验证码！',
                                },
                            ]}
                        >
                        <Input placeholder="请输入验证码！" />
                        </Form.Item>
                    </Col>
                    <Col span={1}>
                        <Button type="primary"  style={{marginLeft: 16,}}  onClick={this.sendMsg}  disabled={this.state.disabled}>
                            {this.state.disabled ? `${this.state.count} 秒` : '获取验证码'}
                        </Button>
                    </Col>
                    </Row>
                    <Row gutter={10}>
                    <Col span={4}>
                        <Button type="primary"  htmlType="submit"  >提交</Button>
                    </Col>
                    <Col span={4}>
                        <Button type="primary"  style={{marginLeft: 100,}} onClick={()=>{ window.location.href = '/user/login'; }}>取消</Button>
                    </Col> 
                    </Row>
                </Form>
            </div>
        )
    }
}


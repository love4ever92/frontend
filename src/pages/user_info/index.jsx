import React, { Component } from 'react'

// eslint-disable-next-line react/prefer-stateless-function
export default class index extends Component {

    constructor(props){
        super(props)
        this.state={
            // eslint-disable-next-line react/no-unused-state
            userName: localStorage.getItem("userName"),
            // eslint-disable-next-line react/no-unused-state
            role: localStorage.getItem("antd-pro-authority"),
            // eslint-disable-next-line react/no-unused-state
            mobilePhone: localStorage.getItem("mobilePhone"),
            // eslint-disable-next-line react/no-unused-state
            department: localStorage.getItem("department"),
        }
        // if(localStorage.getItem("roleId") != 1){
        //     document.getElementById('a1').style.display="none"
        //     document.getElementById('a2').style.display="none"
        //     document.getElementById('a3').style.display="none"
        //     document.getElementById('a4').style.display="none"
        // }
    }

    init = () =>{
        this.state={
            // eslint-disable-next-line react/no-unused-state
            userName: "",
            // eslint-disable-next-line react/no-unused-state
            role: "",
            // eslint-disable-next-line react/no-unused-state
            mobilePhone: "",
            // eslint-disable-next-line react/no-unused-state
            department: "",
        }
    }

    getData = (i) =>{

    }

    render() {
        this.init();
        // eslint-disable-next-line no-undef
        const userName = localStorage.getItem("userName");
        const role = localStorage.getItem("antd-pro-authority");
        const mobilePhone = localStorage.getItem("mobilePhone");
        const department = localStorage.getItem("department");
        return (
            <div>
                <h2>当前登录用户姓名：{userName}</h2>
                <h2>当前登录用户角色：{role}</h2>
                <h2>当前登录用户所属部门：{department}</h2>
                <h2>当前登录用户手机号码：{mobilePhone}</h2>
                
                {/* <a id='a1' onClick={this.getData(1)}>今天</a>
                <br/>
                <a id='a2' onClick={this.getData(2)}>昨天</a>
                <br/>
                <a id='a3' onClick={this.getData(3)}>近三天</a>
                <br/>
                <a id='a4' onClick={this.getData(4)}>一周内</a>     */}
                
            </div>
        )
    }
}

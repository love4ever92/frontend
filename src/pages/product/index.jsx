import React, { Component } from 'react'
import { Table,Button, message  } from 'antd'

// eslint-disable-next-line import/no-unresolved
import request from '@/utils/request';
import AdvancedSearchForm  from './components/AdvancedSearchForm';

const dataSource= [
  {
    key: '1',
    name: '胡彦斌',
    mobilePhone: '15920726541',
    department: '业务一部',
    job: '部门经理'
  },
  {
    key: '2',
    name: '胡彦祖',
    mobilePhone: '15920726541',
    department: '业务二部',
    job: '部门助理'

  },
];


const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: '手机号码',
    dataIndex: 'mobile',
    key: 'mobile',
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
  },
  {
    title: '职位',
    dataIndex: 'job',
    key: 'job',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a style={{ marginRight: 16 }}>授权</a>
        <a style={{ marginRight: 16 }}>编辑</a>
        <a>删除</a>
      </span>
    ),
  },
];



// eslint-disable-next-line react/prefer-stateless-function
export default class index extends Component {

  // eslint-disable-next-line react/sort-comp
  constructor(props){
    super(props)
    this.state={
        list: [],
        isLoading: false,
    }
  }

  


// eslint-disable-next-line react/sort-comp
bindSerch=(o)=>{
    // eslint-disable-next-line no-console
    console.log('111',o)
    request.get('/api/base/staff/list', {
      headers:{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      }
    }).then(res=>{
        if(res.code === "0000"){
            message.info('成功了');

            const  list = res.data.records
            list.map(v=>{
              v.key=v.id
              return v
            })

            this.setState({
              list
          })
        }else{
          message.info('失败了');
        }
        
    })
  
}

login=()=>{

    this.setState({
        isLoading: true
    })
      request.get('/api/login').then(res=>{

        this.setState({
            isLoading:false
        })

        if(!res.success){
            message.info(res.msg)
            return
        }
        if(res.code === '9999'){
            message.error('改用户已经注册了')
            return
        }
        if(res.code === '0000'){
            // Router.push('/')
            window.location.href="http://www.baidu.com"

        }
    })
}

componentDidMount(){
  
}

  render() {
    return (
      <div >
        <AdvancedSearchForm bindSerch = { this.bindSerch } title="员工管理" />
        <Table  dataSource={this.state.list} columns={columns} loading={this.state.isLoading} />;
      </div>
    )
  }
}

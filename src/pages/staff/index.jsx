import React, { Component } from 'react'
import { Table, message, Button, Modal } from 'antd'
// eslint-disable-next-line import/no-unresolved
import request from '@/utils/request';
import AdvancedSearchForm from './components/AdvancedSearchForm';
import EditModal from './components/EditModal';



// eslint-disable-next-line react/prefer-stateless-function
export default class index extends Component {

  // eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      isLoading: false,
      editVisible: false,
      editObj: {},
      searchObj: {},
      current: 1,
      pageSize: 10,
      total: 0,
      isSubmit: true,
      columns: [
        {
          title: '编号',
          dataIndex: 'id',
          key: 'id',
          // render: text => <a>{text}</a>,
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          render: text => <a>{text}</a>,
        },
        {
          title: '手机号码',
          dataIndex: 'mobilePhone',
          key: 'mobilePhone',
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
          title: '角色',
          dataIndex: 'role',
          key: 'role',
        },
        {
          title: '状态',
          dataIndex: 'statusDesc',
          key: 'statusDesc',
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => {

            return (
              <>
                <Button type='link' onClick={() => this.editModalHandle(text)} style={{ marginRight: 16 }}>编辑</Button>
                <Button type='link' onClick={() => this.removeComfirm(text.id)}>删除</Button>
                <Button type='link' onClick={() => this.resetPassword(text.id)}>重置密码</Button>
              </>
            )
          },
        },
      ],
    }
  }

  resetPassword = (id) =>{
    Modal.confirm({
      title: '重置员工密码',
      content: '确定重置员工密码？？',
      onOk() {
        request.get("/api/base/staff/resetPwd", {
          params: { 
            staffId:id, 
            userId: localStorage.getItem('userId') 
          },
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          }).then(res => {
            if (res.code === '0000') {
              Modal.confirm({
                title: '重置员工密码',
                content: '重置员工密码成功',
                onOk() {
                  
                },
              })
            } else {
              Modal.confirm({
                title: '删除员工',
                content: '删除员工失败',
                onOk() {},
              })
            }
          })
      },
    })
    
  }

  remove = (id) =>{
    let that = this;
    request.get("/api/base/staff/remove", {
      params: { id, userId: localStorage.getItem('userId') },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      }).then(res => {
        if (res.code === '0000') {
          Modal.confirm({
            title: '删除员工',
            content: '删除员工成功',
            onOk() {
              that.getData({
                current: that.state.current,
                pageSize: that.state.pageSize,
                searchObj: that.state.searchObj,
              })
            },
          })
        } else {
          Modal.confirm({
            title: '删除员工',
            content: `删除员工失败: 原因 ${res.data}`,
            onOk() {},
          })
        }
      })
  }

  removeComfirm = (id) => {
    let that = this;
    Modal.confirm({
      title: '删除员工',
      content: '确定删除员工？',
      onOk() {
        that.remove(id);
      },
    })
  }

  // eslint-disable-next-line react/sort-comp
  editModalHandle = (text) => {
    if (text == null) {
      return;
    }
    this.setState({
      editObj: text
    }, () => {
      this.setState({
        editObj: text,
        editVisible: true
      })
    })
  }

  setVisible = (isChange) => {
    this.setState({
      editVisible: false
    })
    if(isChange){
      this.getData();
    }
  }


  getData = (conf) => {
    request.post('/api/base/staff/list', {
      data: {
        userId: localStorage.getItem("userId"),
        pageSize: this.state.pageSize,
        current: this.state.current,
        ...this.state.searchObj,
        ...conf,
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then(res => {
      if (res.code === "0000") {
        const list = res.data.records
        list.map(v => {
          v.key = v.id
          return v
        })
        this.setState({
          list,
          total: res.data.total,
          pageSize: res.data.size,
          current: res.data.current,
        })
        this.timeOut();
      } else {
        
        message.error(`查询列表失败，失败原因：${ res.data}`);
        this.setState({
          isSubmit: true,
        })
      }
    })
  }

  // eslint-disable-next-line react/sort-comp
  bindSerch = (o) => {
    
    if(this.state.isSubmit){
      this.setState({
        searchObj: o.values,
        isSubmit: false,
        isLoading: true,
      }, () => {
        this.getData(o.values)
        setTimeout(() => {
          this.setState({
            isLoading: false,
          });
        }, 1000);
        
      })
    }else{
      message.info("您操作太频繁，请10秒后后再试")
    }
    
  }

  changePage = (current, pageSize) => {


    const searchObj1 = this.state.searchObj
    this.getData({
      current,
      pageSize,
      ...searchObj1
    })
    
  }


  componentDidMount = () => {
    this.bindSerch({});
  }

  timeOut = () => {
    setTimeout(()=>{
      this.setState({
        isSubmit:true,
      })
    },
      5000);
  }

  render() {
    return (
      <div >
        <AdvancedSearchForm bindSerch={this.bindSerch} title="员工管理" />

        <Table dataSource={this.state.list} columns={this.state.columns} loading={this.state.isLoading}
          pagination={{
            total: this.state.total, pageSize: this.state.pageSize, current: this.state.current,
            onChange: this.changePage
          }}
        />;

        <EditModal title='修改员工信息' 
          visible={this.state.editVisible} 
          setVisible={this.setVisible} 
          editObj={this.state.editObj} />

      </div>
    )
  }
}

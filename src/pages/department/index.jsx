import React, { Component } from 'react'
import { Table, Button, message, Modal } from 'antd'
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
      current: 1,
      pageSize: 10,
      total: 0,
      isSubmit: true,
      searchObj: {},
      // eslint-disable-next-line react/no-unused-state
      columns: [
        {
          title: '编号',
          dataIndex: 'id',
          key: 'id',
          render: text => <a>{text}</a>,
        },
        {
          title: '部门名称',
          dataIndex: 'name',
          key: 'name',
          render: text => <a>{text}</a>,
        },
        {
          title: '负责人姓名',
          dataIndex: 'staffName',
          key: 'staffName',
        },
        {
          title: '上级部门',
          dataIndex: 'parentName',
          key: 'parentName',
        },
        {
          title: '负责人手机号码',
          dataIndex: 'staffMobilePhone',
          key: 'staffMobilePhone',
        },
        {
          title: '状态',
          dataIndex: 'statusStr',
          key: 'statusStr',
        },
        {
          title: '操作',
          key: 'action',
          render: (text) => (
            <span>
              <Button type='link' onClick={() => this.editModalHandle(text)} style={{ marginRight: 16 }}>编辑</Button>
              <Button type='link' onClick={() => this.removeComfirm(text.id)}>删除</Button>
            </span>
          ),
        },
      ]
    }
  }


  componentDidMount = () => {
    this.bindSerch({});
  }



  getData = (conf) => {
    request.post('/api/base/department/list', {
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
      },
    }).then(res => {
      if (res.code === "0000") {
        const list = res.data.records
        list.map(v => {
          v.key = v.id
          return v
        })

        this.setState({
          list,
          // eslint-disable-next-line react/no-unused-state
          total: res.data.total,
          pageSize: res.data.size,
          current: res.data.current,
          isSubmit:true,
        })
      } else {
        this.setState({
          isSubmit:true,
        })
        message.error(`查询列表失败，失败原因：${res.data}`);
      }
    })
  }

  // eslint-disable-next-line react/sort-comp
  bindSerch = (o) => {
    if(this.state.isSubmit){
      this.setState({
        searchObj: o.values,
        isSubmit: false,
      })
      this.getData(o.values)


    }
    

  }

  remove = (id) => {
    let that = this;
    request.get("/api/base/department/remove", {
      params: { id, userId: localStorage.getItem('userId') },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }).then(res => {
      if (res.code === '0000') {
        Modal.confirm({
          title: '删除部门',
          content: '删除部门成功',
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
          title: '删除部门',
          content: `删除部门失败: 原因 ${res.data}`,
          onOk() { },
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

  changePage = (current, pageSize) => {


    const searchObj1 = this.state.searchObj
    this.getData({
      current,
      pageSize,
      ...searchObj1
    })

  }

  editModalHandle = (text) => {
    console.log('text', text)
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

  setVisible = () => {
    this.setState({
      editVisible: false
    })
    this.getData(this.state.searchObj);
  }

  render() {
    return (
      <div >
        <AdvancedSearchForm bindSerch={this.bindSerch} title="部门管理" />
        <Table dataSource={this.state.list}
          columns={this.state.columns}
          loading={this.state.isLoading}
          pagination={{
            total: this.state.total, pageSize: this.state.pageSize, current: this.state.current,
            onChange: this.changePage
          }}
        />
        <EditModal
          title='修改部门信息'
          visible={this.state.editVisible}
          setVisible={this.setVisible}
          editObj={this.state.editObj}
        />
      </div>
    )
  }
}

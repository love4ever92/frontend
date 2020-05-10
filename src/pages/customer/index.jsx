import React, { Component } from 'react'
import { Table, Button, message } from 'antd'
import request from '@/utils/request';
import CustomerModal from './components/CustomerModal';
import CompanyModal from './components/CompanyModal';
import QiChaCha from './components/QiChaCha';
import CompanyReport from './components/CompanyReport';
import CustomerReport from './components/CustomerReport';

// eslint-disable-next-line import/no-unresolved
import AdvancedSearchForm from './components/AdvancedSearchForm';




// eslint-disable-next-line react/prefer-stateless-function
export default class index extends Component {


  constructor(props) {
    super(props)
    this.state = {
      list: [],
      isLoading: false,
      editObj: {},
      current: 1,
      pageSize: 10,
      total: 0,
      searchObj: {},
      isSubmit: true,
      customerVisible: false,
      companyVisible: false,
      customerReportVisible: false,
      companyReportVisible: false,
      qichachaVisible: false,
      companyObj: {},
      customerReportObj: {},
      companyReportObj: {},
      qiChaChaObj: {},
      modalType: '',
      customerTitle: '',
      companyTitle: '',
      customerReportTitle: '',
      companyReportTitle: '',
      qiChaChaTitle: '',
      columns: [
        {
          title: '编号',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '姓名',
          dataIndex: 'customerName',
          key: 'customerName',
          render: text => <a>{text}</a>,
        },
        {
          title: '身份证号码',
          dataIndex: 'idNum',
          key: 'idNum',
        },
        {
          title: '手机号码',
          dataIndex: 'mobilePhone',
          key: 'mobilePhone',
        },
        {
          title: '公司名称',
          dataIndex: 'companyName',
          key: 'companyName',
        },
        {
          title: '所属部门',
          dataIndex: 'departmentName',
          key: 'departmentName',
        },
        {
          title: '负责人',
          dataIndex: 'staffName',
          key: 'staffName',
        },
        {
          title: '状态',
          dataIndex: 'customerStatus',
          key: 'customerStatus',
        },
        {
          title: '拜访日期',
          dataIndex: 'visitDate',
          key: 'visitDate',
        },
        {
          title: '拜访次数',
          dataIndex: 'visitTimes',
          key: 'visitTimes',
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
        },
        {
          title: '操作',
          key: 'action',
          render: (text) => (
            <span>
              <Button type='link' onClick={() => this.lookModalHandle(text)} style={{ marginRight: 16 }}>查看</Button>
              <Button type='link' onClick={() => this.editModalHandle(text)} style={{ marginRight: 16 }}>编辑</Button>
              <Button type='link' onClick={() => this.remove(text.id)}>删除</Button>
            </span>
          ),
        },
      ]
    }
  }



  componentDidMount = () => {
    this.bindSerch({});
  }

  remove = (id) => {
    if(this.state.isSubmit){
      this.setState({
        isSubmit: false,
      })
      request.get('/api/base/customer/remove', {
        params: {
          id,
          userId: localStorage.getItem('userId'),
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }).then(res => {
        if (res.code === '0000') {
          message.info('删除成功');
          this.setState({
            isSubmit: true,
          },() => {
            this.bindSerch(this.state.searchObj);
          })
        } else {
          message.info('删除失败');
        }
      })
    }
    
  }

  getData = (conf) => {
    if(this.state.isSubmit){
      this.setState({
        isSubmit: false,
      })
      request.post('/api/base/customer/list', {
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
            isSubmit: true,
          })
  
        } else {
          message.error(`查询列表失败，失败原因：${res.data}`);
          this.setState({
            isSubmit: true,
          })
        }
      })
    }else{
      message.error(`操作过于频繁，请稍后再试`);
    }
    
  }


  // eslint-disable-next-line react/sort-comp
  bindSerch = (o) => {
    if(o.values){
      this.setState({
        searchObj: o.values
      })
      this.getData(o.values)
    }else{
      this.getData()
    }
    
  }

  lookModalHandle = (text) => {
    
    if (text == null) {
      return;
    }
    this.setState({
      editObj: text,
      modalType: 'look',
      customerVisible: true,
      customerTitle: '查看-客户',
      companyTitle: '查看-企业',
      customerReportTitle: '查看-客户信用报告',
      companyReportTitle: '查看-企业信用报告',
      qiChaChaTitle: '查看-企查查报告',
    })
    

  }

  editModalHandle = (text) => {
    
    if (text == null) {
      return;
    }
    this.setState({
      editObj: text,
      modalType: 'edit',
      customerVisible: true,
      customerTitle: '编辑-客户',
      companyTitle: '编辑-企业',
      customerReportTitle: '编辑-客户信用报告',
      companyReportTitle: '编辑-企业信用报告',
      qiChaChaTitle: '编辑-企查查报告',
    })
    

  }
  
  showAdd = () => {
    this.setState({
      customerVisible: true,
      modalType: 'add',
      customerTitle: '添加-客户',
      companyTitle: '添加-企业',
      customerReportTitle: '添加-客户信用报告',
      companyReportTitle: '添加-企业信用报告',
      qiChaChaTitle: '添加-企查查报告'
    })
  }

  changePage = (current, pageSize) => {
    this.setState({
      current
    })
    const searchObj1 = this.state.searchObj
    this.getData({
      current,
      pageSize,
      ...searchObj1
    })

  }

  /**
   * 获取公司信息（编辑按钮）
   */
  getCompany = ( customerName, mobilePhone, idNum, customerId ) =>{
    request.get('/api/base/company/getOne',{
      params:{
        userId: localStorage.getItem('userId'),
        customerId,
      },
      headers:{
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    }).then(res => {
      if(res.code === '0000'){
        this.setState({
          customerVisible: false,
          companyVisible: true,
          companyObj: {...res.data, legalPeople:customerName,customerName,idNum, mobilePhone, legalPeopleIdNum:idNum, customerId, }
        })
      }else{
        message.error(res.data? res.data : '获取公司信息失败，请联系系统运维人员');
      }
    })
  }

  // 改变客户对话框，同时判断是否打开添加企业对话框
  changeCustomer = (next,customerName,mobilePhone,idNum,customerId) => {
    
    if (next) {
      if(this.state.modalType === 'add'){
        this.setState({
          customerVisible: false,
          companyVisible: true,
          companyObj: { legalPeople:customerName, customerName,idNum, mobilePhone, legalPeopleIdNum:idNum, customerId },
        })
      }else if(this.state.modalType === 'edit'){
        this.getCompany(customerName, mobilePhone, idNum, customerId);
      }else if(this.state.modalType === 'look'){
        this.getCompany(customerName, mobilePhone, idNum, customerId);
      }
      
    } else {
      this.setState({
        customerVisible: false,
      })
      if (this.state.searchObj) {
        this.bindSerch(this.state.searchObj);
      } else {
        this.bindSerch();
      }

    }
  }

  getCustomerReport = (customerId, name, companyName, companyId) => {
    request.get('/api/base/customer-report/getCustomerReport',{
      params:{
        userId: localStorage.getItem('userId'),
        customerId
      },
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then(res => {
      if(res.code && res.code === '0000'){
        this.setState({
          companyVisible: false,
          customerReportVisible: true,
          customerReportObj:{...res.data, 
            customerId,
            customerName:name, 
            companyName, 
            companyId}
        })
      }else if(res.code && res.code === '1111'){
        this.setState({
          companyVisible: false,
          customerReportVisible: true,
          customerReportObj:{
            customerId,
            customerName:name, 
            companyName, 
            companyId
          }
        })
      }else{
        message.info(res.data);
      }
    })
  }

  // 改变添加企业对话框，同时片段是否打开添加个人信用报告对话框
  changeCompany = (next,customerId, customerName, companyName, companyId) => {
   
    if (next) {
      if(this.state.modalType === 'add'){
        this.setState({
          companyVisible: false,
          customerReportObj: { customerId, customerName, companyName, companyId },
          customerReportVisible: true,
        })
      }else if(this.state.modalType === 'edit'){
        this.getCustomerReport(customerId, customerName, companyName, companyId)
      }else if(this.state.modalType === 'look'){
        console.log(this.state.modalType );
        this.getCustomerReport(customerId, customerName, companyName, companyId)
      }
      
    } else {
      this.setState({
        companyVisible: false,
      })
      if (this.state.searchObj) {
        this.bindSerch(this.state.searchObj);
      } else {
        this.bindSerch();
      }
    }
  }

  getCompanyReport = (customerId, name, companyName, companyId) =>{
    
    request.get('/api/base/company-report/getCompanyReport',{
      params:{
        userId: localStorage.getItem('userId'),
        companyId
      },
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then(res => {
      if(res.code && res.code === '0000'){
        this.setState({
          customerReportVisible: false,
          companyReportVisible: true,
          companyReportObj:{...res.data, 
            customerId,
            customerName:name, 
            companyName, 
            companyId
          }
        })
      }else if(res.code && res.code === '1111'){
        this.setState({
          customerReportVisible: false,
          companyReportVisible: true,
          companyReportObj:{
            customerId,
            customerName:name, 
            companyName, 
            companyId
          }
        })
      }else{
        message.info(res.data);
      }
    })
  }

  // 改变添加个人信用报告对话框，同时片段是否打开添加个人信用报告对话框
  changeCustomerReport = (next,customerId, name, companyName, companyId) => {
    console.log(2,next,customerId, name, companyName, companyId);
    if (next) {
      if(this.state.modalType === 'add'){
        this.setState({
          customerReportVisible: false,
          companyReportObj: {customerId, customerName:name, companyName, companyId},
          companyReportVisible: true,
        })
      }else if(this.state.modalType === 'edit'){
        this.getCompanyReport(customerId, name, companyName, companyId);
      }else if(this.state.modalType === 'look'){
        this.getCompanyReport(customerId, name, companyName, companyId);
      }
      
    } else {
      this.setState({
        customerReportVisible: false,
      })
      if (this.state.searchObj) {
        this.bindSerch(this.state.searchObj);
      } else {
        this.bindSerch();
      }
    }
  }

  // 改变添加个人信用报告对话框，同时片段是否打开添加个人信用报告对话框
  changeCompanyReport = (next) => {
    if (next) {
      this.setState({
        companyReportVisible: false,
      })
    } else {
      this.setState({
        companyReportVisible: false,
      })
      if (this.state.searchObj) {
        this.bindSerch(this.state.searchObj);
      } else {
        this.bindSerch();
      }
    }
  }




  render() {
    return (
      <div >
        <AdvancedSearchForm
          bindSerch={this.bindSerch}
          showAdd={this.showAdd}
          title="客户管理"
        />
        <Table dataSource={this.state.list}
          columns={this.state.columns}
          loading={this.state.isLoading}
          pagination={{
            total: this.state.total, pageSize: this.state.pageSize, current: this.state.current,
            onChange: this.changePage
          }}
        />
        <CustomerModal
          title= {this.state.customerTitle}       
          visible={this.state.customerVisible}
          setVisible={this.changeCustomer}
          editObj={this.state.editObj}
          modalType={this.state.modalType}
        />
        <CompanyModal
          title= {this.state.companyTitle}  
          visible={this.state.companyVisible}
          setVisible={this.changeCompany}
          editObj={this.state.companyObj}
          modalType={this.state.modalType}
        />
        <CustomerReport
          title= {this.state.customerReportTitle}  
          visible={this.state.customerReportVisible}
          setVisible={this.changeCustomerReport}
          editObj={this.state.customerReportObj}
          modalType={this.state.modalType}
        />
        <CompanyReport
          title= {this.state.companyReportTitle}  
          visible={this.state.companyReportVisible}
          setVisible={this.changeCompanyReport}
          editObj={this.state.companyReportObj}
          modalType={this.state.modalType}
        />
        <QiChaCha
          title= {this.state.qiChaChaTitle} 
          visible={this.state.qichachaVisible}
          setVisible={this.changeQichacha}
          editObj={this.state.qiChaChaObj}
          modalType={this.state.modalType}
        />
      </div>
    )
  }
}

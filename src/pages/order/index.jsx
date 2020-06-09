import React, { Component } from 'react'
import { Table, Button, message, Modal } from 'antd'
import request from '@/utils/request';
import AdvancedSearchForm from './components/AdvancedSearchForm';
import EditModal from './components/EditModal'
import LookModal from './components/LookModal'
import AuditModal from './components/AuditModal'





// eslint-disable-next-line react/prefer-stateless-function
export default class index extends Component {
  // eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props)
    let columns = [];
    const auth = localStorage.getItem("antd-pro-authority");
      const list = [
        {
          title: '编号',
          dataIndex: 'key',
          key: 'key',
        },
        {
          title: '填表时间',
          dataIndex: 'createTime',
          key: 'createTime',
        },
        {
          title: '部门',
          dataIndex: 'departmentName',
          key: 'departmentName',
        },
        {
          title: '填表人',
          dataIndex: 'createUserName',
          key: 'createUserName',
        },
        {
          title: '贷款企业',
          dataIndex: 'companyName',
          key: 'companyName',
        },
        {
          title: '下款银行',
          dataIndex: 'bankName',
          key: 'bankName',
        },
        {
          title: '下款金额',
          dataIndex: 'loan',
          key: 'loan',
        },
        {
          title: '小款点位',
          dataIndex: 'serviceRate',
          key: 'serviceRate',
        },
        {
          title: '小款是否已收(是/否)',
          dataIndex: 'isGet',
          key: 'isGet',
        },
        {
          title: '其他渠道费用',
          dataIndex: 'otherCost',
          key: 'otherCost',
        },
        {
          title: '业务确认结果',
          dataIndex: 'confirmOpinion',
          key: 'confirmOpinion',
        },
        {
          title: '财务确认结果',
          dataIndex: 'financeOpinion',
          key: 'financeOpinion',
        },
        {
          title: '操作时间',
          dataIndex: 'operatTime',
          key: 'operatTime',
        },
        {
          title: '状态',
          dataIndex: 'statusDesc',
          key: 'statusDesc',
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span>
              <Button type='link' onClick={() => this.openLook(text, record)}>查看</Button>
              <Button 
               style={ auth === "管理员" ?{ marginRight: 16  }:{ marginRight: 16, display: "none" }}
               type='link' onClick={() => this.getFirsh(text, record)}>
                 初始化
                 </Button>
              <Button  type='link' 
                onClick={() => this.openEdit(text, record)}
                style={ text.createUser == localStorage.getItem("userId") ?{ marginRight: 16  }:{ marginRight: 16, display: "none" }}
              >编辑</Button>
              <Button 
                style={ (text.createUser == localStorage.getItem("userId") &&  text.status == 2)
                || (auth === "管理员" && text.status == 3)
                || (auth === "财务"  && text.status == 5)
                ?{ marginRight: 16  }:{ marginRight: 16, display: "none" }}
                type='link'
                onClick={() => this.getBack(text, record)}
              >撤回</Button>
              <Button  
                style={ (auth === "管理员" && text.status == 2  ) 
                ?{ marginRight: 16  }:{ marginRight: 16, display: "none" }}
                type='link' onClick={() => this.audit(text, record)}>业务确认</Button>
                <Button  
                style={ (auth === "会计" && text.status == 3 
                || localStorage.getItem("userName")==='admin' && text.status == 3  ) 
                ?{ marginRight: 16  }:{ marginRight: 16, display: "none" }}
                type='link' onClick={() => this.finance(text, record)}>财务确认</Button>
                <Button  
                style={ (auth === "出纳" && text.status == 5 
                || localStorage.getItem("userName")==='admin' && text.status == 5  ) 
                ?{ marginRight: 16  }:{ marginRight: 16, display: "none" }}
                type='link' onClick={() => this.teller(text, record)}>出纳确认</Button>
                <Button  
                style={ (auth === "财务经理" && text.status == 6 
                 || localStorage.getItem("userName")==='admin' && text.status == 6  ) 
                ?{ marginRight: 16  }:{ marginRight: 16, display: "none" }}
                type='link' onClick={() => this.financeManager(text, record)}>财务经理确认</Button>
                <Button  
                
                style={ (auth === "管理员" && text.status == 9 ) 
                  && text.confirmCountersignStaffPlan === localStorage.getItem("userName")
                ?{ marginRight: 16  }:{ marginRight: 16, display: "none" }}
                type='link' onClick={() => this.countersign(text, record)}>会签</Button>
              <Button  type='link'
               onClick={() => this.remove(text, record)}
               style={ text.createUser == localStorage.getItem("userId") ?{ marginRight: 16  }:{ marginRight: 16, display: "none" }}
              >删除</Button>
            </span>
          ),
        },
      ];
      columns = list;
    
    this.state = {
      list: [],
      columns,
      isLoading: false,
      isSubmit: true,
      current: 1,
      pageSize: 10,
      total: 0,
      searchObj: {},
      departmentOptions: [],
      staffOptions: [],
      companyOptions: [],
      bankOptions: [],
      customerOptions: [],
    }
    this.getBank();
    this.getCompany();
    this.getDepartment();
    this.getStaff();
    this.getCustomer();
    this.bindSerch();
  }


  /**
       * 获取银行下拉款
       */
  // eslint-disable-next-line react/sort-comp
  getBank = async () => {
    try {
      const res = await request.get('/api/base/bank/list', {
        params: {
          userId: localStorage.getItem('userId'),
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      if (res.code === '0000') {
        this.setState({ bankOptions: res.data });
      }
    } catch (error) {
      console.log(111, error);
    }
  }


  /**
   * 获取公司下拉款
   */
  getCompany = async () => {
    try {
      const res = await request.get('/api/base/company/list', {
        params: {
          userId: localStorage.getItem('userId'),
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      if (res.code === '0000') {
        this.setState({ companyOptions: res.data });
      }
    } catch (error) {
      console.log(111, error);
    }
  }

  /**
   * 下拉框获取部门
   */
  getDepartment = async () => {
    try {
      const res = await request.get('/api/base/department/list1', {
        params: {
          userId: localStorage.getItem('userId'),
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      if (res.code === '0000') {
        this.setState({ departmentOptions: res.data });
      }
    } catch (error) {
      console.log(111, error);
    }
  }

  /**
   * 下拉框获取员工
   */
  getStaff = async () => {
    try {
      const res = await request.get('/api/base/staff/listAll', {
        params: {
          userId: localStorage.getItem('userId'),
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      if (res.code === '0000') {
        this.setState({ staffOptions: res.data });
      }
    } catch (error) {
      console.log(111, error);
    }
  }

  /**
   * 获取客户
   */
  getCustomer = async () => {
    try {
      const res = await request.get('/api/base/customer/list1', {
        params: {
          userId: localStorage.getItem('userId'),
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
      if (res.code === '0000') {
        this.setState({ customerOptions: res.data });
      }
    } catch (error) {
      console.log(111, error);
    }
  }

  // eslint-disable-next-line react/sort-comp
  getData = (conf) => {
    request.post('/api/base/order/list', {
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
      if (res && res.code === "0000") {
        const list = res.data.records
        // eslint-disable-next-line array-callback-return
        if(list.length > 0){
          list.map(v => {
            // eslint-disable-next-line no-param-reassign
            v.key = v.id;
          })
        }
        this.setState({
          list,
          total: res.data.total,
          pageSize: res.data.size,
          current: res.data.current,
        })

      } else {
        this.setState({
          isSubmit: true
        })
        message.error(`查询列表失败，失败原因：${res.data}?${res.data}:请联系运维人员！`);
      }
    })
  }

  openEdit = (text, record) => {

    if(text.createUser != localStorage.getItem('userId')){
      message.error('登录用户不是创建该订单的用户，无法编辑');
      return;
    }
    if (text.status == 3) {
      message.info("业务负责人审核通过,无法编辑");
    } else if (text.status == 5) {
      message.info("财务负责人已确认,无法编辑");
    } else if (text.status == 6) {
      message.info("已做工资结算,结束流程,无法编辑");
    } else if (text.status == 2) {
      message.info("订单已提交,待业务负责人确认,无法编辑");
    } else {
      this.setState({
        editObj: text
      }, () => {
        this.setState({
          editObj: text,
          editVisible: true
        })
      })
    }
  }

  getOrderBack = (id) => {
    let that = this;
    if (id) {
      Modal.confirm({
        title: '撤回订单',
        content: '确定撤回订单',
        onOk() {
          request.get('/api/base/order/getBack', {
            params: {
              userId: localStorage.getItem("userId"),
              orderId: id,
            },
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }).then(res => {
            if (res.code && res.code === "0000") {
              Modal.confirm({
                title: '撤回订单',
                content: '撤回订单成功',
                onOk() {
                  that.bindSerch(that.state.searchObj);
                },
                oncancel() {
                  that.bindSerch(that.state.searchObj);
                }
              })
            } else {
              Modal.confirm({
                title: '撤回订单',
                content: `撤回订单失败,失败原因: ${res.data}:联系运维人员处理！}`,
              })
            }
          })
        },
        onCancel() {

        }
      })
    }
  }

  /**
   * 撤回
   */
  getBack = (text, record) => {
    if (this.state.isSubmit) {
      this.setState({
        isSubmit: false,
      }, () => {
        if (localStorage.getItem("roleId") == 1) {
          if (text.status != 8) {
            this.getOrderBack(text.id);
          } else {
            message.info("订单流程已结束，无法撤回！！！")
          }
        } else if (localStorage.getItem("roleId") == 2) {
          if (localStorage.getItem("userId") == text.createUser) {
            if (text.status == 2) {
              this.getOrderBack(text.id);
            } else {
              message.info("订单状态不是待业务确认，无法撤回！！！")
            }
          } else {
            message.info("不是填表人，无法撤回！！！")
          }
        } else if (localStorage.getItem("roleId") == 3) {
          if (localStorage.getItem("userId") == text.createUser) {
            if (text.status == 2) {
              this.getOrderBack(text.id);
            } else {
              message.info("订单状态不是待业务确认，无法撤回！！")
            }
          } else {
            message.info("不是填表人，无法撤回！！！")
          }
        } else if (localStorage.getItem("roleId") == 4) {
          if (text.status == 7) {
            this.getOrderBack(text.id);
          } else {
            message.info("订单状态不是（财务经理已确认-待结算），财务经理无法撤回！！")
          }
        }else if (localStorage.getItem("roleId") == 5) {
          if (text.status == 5) {
            this.getOrderBack(text.id);
          } else {
            message.info("订单状态不是（财务已确认，待出纳确认），会计无法撤回！！")
          }
        }else if (localStorage.getItem("roleId") == 6) {
          if (text.status == 6) {
            this.getOrderBack(text.id);
          } else {
            message.info("订单状态不是（出纳已确认，待财务经理确认），出纳无法撤回！！")
          }
        }
        this.setState({
          isSubmit: true,
        }, () => {
          console.log(this.state.isSubmit);
        })
      })
    } 

  }


   /**
   * 邀请会签
   */
  countersign = (text, record) => {
    if (localStorage.getItem("roleId") == 1) {
      if (text.status == 9) {
        this.setState({
          editObj: text
        }, () => {
          this.setState({
            editObj: text,
            auditVisible: true,
            type: "countersign",
          })
        })
      } else {
        message.error("订单状态不是“业务会签中”，不能确认")
      }
    } else {
      message.error("登录账号不是管理者，不能会签")
    }
  }

  /**
   * 业务确认
   */
  audit = (text, record) => {
    if (localStorage.getItem("roleId") == 1) {
      if (text.status == 2) {
        this.setState({
          editObj: text
        }, () => {
          this.setState({
            editObj: text,
            auditVisible: true,
            type: "confirm",
          })
        })
      } else {
        message.error("订单状态不是“待业务负责人确认”，不能确认")
      }
    } else {
      message.error("登录账号不是管理者，不能确认")
    }
  }

  /**
   * 财务确认
   */
  finance = (text, record) => {
    if (localStorage.getItem("roleId") == 5) {
      if (text.status == 3) {
        this.setState({
          editObj: text
        }, () => {
          this.setState({
            editObj: text,
            auditVisible: true,
            type: "finance",
          })
        })
      } else {
        message.error("订单状态不是“待财务确认”，不能确认")
      }
    } else {
      message.error("登录账号不是会计，不能确认")
    }
  }
  
  /**
   * 出纳确认
   */
  teller = (text, record) => {
    if (localStorage.getItem("roleId") == 6) {
      if (text.status == 5) {
        this.setState({
          editObj: text
        }, () => {
          this.setState({
            editObj: text,
            auditVisible: true,
            type: "teller",
          })
        })
      } else {
        message.error("订单状态不是“待出纳确认”，不能审核")
      }
    } else {
      message.error("登录账号不是出纳，不能确认")
    }
  }
  
   /**
   * 财务经理确认
   */
  financeManager = (text, record) => {
    if (localStorage.getItem("roleId") == 4) {
      if (text.status == 6) {
        this.setState({
          editObj: text
        }, () => {
          this.setState({
            editObj: text,
            auditVisible: true,
            type: "financeManager",
          })
        })
      } else {
        message.error("订单状态不是“出纳已确认，待财务经理确认”，不能确认")
      }
    } else {
      message.error("登录账号不是财务经理，不能确认")
    }
  }


  setAuditVisible = (visible) => {
    this.bindSerch(this.state.searchObj);
    this.setState({
      auditVisible: visible,
      type: "",
    })
  }

  /**
   * 删除
   */
  remove = (text, record) => {
    let that = this;
    if (localStorage.getItem("roleId") == 1
      || text.createUser == localStorage.getItem("userId")) {
      Modal.confirm({
        title: '删除订单',
        content: '确定删除订单',
        onOk() {
          request.get('/api/base/order/remove', {
            params: {
              userId: localStorage.getItem("userId"),
              orderId: text.id,
            },
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }).then(res => {
            if (res.code && res.code === "0000") {
              Modal.confirm({
                title: '删除订单',
                content: '删除成功',
                onOk() {
                  that.bindSerch(that.state.searchObj);
                },
                oncancel() {
                  that.bindSerch(that.state.searchObj);
                }
              })
            } else {
              Modal.confirm({
                title: '删除订单',
                content: `删除失败,失败原因: ${res.data}`,
              })
            }
          })
        },
        onCancel() {

        }
      })
    } else {
      message.error("不是订单创建者，无订单删除权限");
    }
  }

  /**
   * 查看
   */
  openLook = (text, record) => {
    this.setState({
      editObj: text
    }, () => {
      this.setState({
        editObj: text,
        lookVisible: true
      })
    })
  }

  setLookVisible = (visible) => {
    this.setState({
      lookVisible: visible,
    })
  }

  /**
   * 初始化
   */
  getFirsh = (text, record) => {
    const that = this;
    if (localStorage.getItem("roleId") == 1) {
      Modal.confirm({
        title: '初始化订单',
        content: '确定初始化订单',
        onOk() {
          request.get('/api/base/order/getFirsh', {
            params: {
              userId: localStorage.getItem("userId"),
              orderId: text.id,
            },
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }).then(res => {
            if (res.code && res.code === "0000") {
              Modal.confirm({
                title: '初始化订单',
                content: '初始化订单成功',
                onOk() {
                  that.bindSerch(that.state.searchObj);
                },
                oncancel() {
                  that.bindSerch(that.state.searchObj);
                }
              })
            } else {
              Modal.confirm({
                title: '初始化订单',
                content: `初始化订单失败,失败原因: ${res.data}`,
              })
            }
          })
        },
        onCancel() {

        }
      })
    } else {
      message.error("不是管理员，无订单删除权限");
    }
  }

  // eslint-disable-next-line react/sort-comp
  bindSerch = (o) => {
    if (this.state.isSubmit) {
      this.setState({
        isSubmit: false,
      })
      let conf = {};
      if (o) {
        if (o.values) {
          conf = { ...o.values }
          if (o.values.createTimeRange) {
            conf = {
              ...conf,
              startCreateTime: o.values.createTimeRange[0].format('YYYY-MM-DD'),
              endCreateTime: o.values.createTimeRange[1].format('YYYY-MM-DD'),
            }
          }
          if (o && o.values && o.values.operatTimeRange) {
            conf = {
              ...conf,
              startOperatTime: o.values.operatTimeRange[0].format('YYYY-MM-DD'),
              endOperatTime: o.values.operatTimeRange[1].format('YYYY-MM-DD'),
            }
          }
          this.setState({
            searchObj: o.values,
            isLoading: true,
          }, () => {
            this.getData(conf)
            setTimeout(() => {
              this.setState({
                isLoading: false,
              });
            }, 1000);
            this.timeOut();
          })

        } else {
          this.getData()
        }
      } else {
        this.getData();
        setTimeout(() => {
          this.setState({
            isLoading: false,
          });
        }, 1000);
        this.timeOut();
      }
      this.setState({
        isSubmit: true,
      })
    } else {
      message.info("您操作太频繁，请5秒后后再试")
    }
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

  setEditVisible = (visible) => {
    this.bindSerch(this.state.searchObj);

    this.setState({
      editVisible: visible,
    })
  }

  timeOut = () => {
    setTimeout(() => {
      this.setState({
        isSubmit: true,
      })
    },
      5000);
  }


  componentDidMount() {

  }



  render() {
    return (
      <div >
        <AdvancedSearchForm
          bindSerch={this.bindSerch}
          title="订单管理"
          departmentOptions={this.state.departmentOptions?this.state.departmentOptions:[]}
          staffOptions={this.state.staffOptions?this.state.staffOptions:[]}
          companyOptions={this.state.companyOptions?this.state.companyOptions:[]}
          bankOptions={this.state.bankOptions?this.state.bankOptions:[]}
          customerOptions={this.state.customerOptions?this.state.customerOptions:[]}
        />
        <Table dataSource={this.state.list} columns={this.state.columns} loading={this.state.isLoading}
          pagination={{
            total: this.state.total, pageSize: this.state.pageSize, current: this.state.current,
            onChange: this.changePage
          }}
        />
        <EditModal
          title='修改订单信息'
          visible={this.state.editVisible}
          setVisible={this.setEditVisible}
          editObj={this.state.editObj}
          departmentOptions={this.state.departmentOptions?this.state.departmentOptions:[]}
          staffOptions={this.state.staffOptions?this.state.staffOptions:[]}
          companyOptions={this.state.companyOptions?this.state.companyOptions:[]}
          bankOptions={this.state.bankOptions?this.state.bankOptions:[]}
          customerOptions={this.state.customerOptions?this.state.customerOptions:[]}
        />
        <LookModal
          title='查看订单详情'
          visible={this.state.lookVisible}
          setVisible={this.setLookVisible}
          editObj={this.state.editObj}
          departmentOptions={this.state.departmentOptions?this.state.departmentOptions:[]}
          staffOptions={this.state.staffOptions?this.state.staffOptions:[]}
          companyOptions={this.state.companyOptions?this.state.companyOptions:[]}
          bankOptions={this.state.bankOptions?this.state.bankOptions:[]}
          customerOptions={this.state.customerOptions?this.state.customerOptions:[]}
        />
        <AuditModal
          title='审核订单'
          visible={this.state.auditVisible}
          setVisible={this.setAuditVisible}
          editObj={this.state.editObj}
          departmentOptions={this.state.departmentOptions?this.state.departmentOptions:[]}
          staffOptions={this.state.staffOptions?this.state.staffOptions:[]}
          companyOptions={this.state.companyOptions?this.state.companyOptions:[]}
          bankOptions={this.state.bankOptions?this.state.bankOptions:[]}
          customerOptions={this.state.customerOptions?this.state.customerOptions:[]}
          type={this.state.type}
        />

      </div>
    )
  }
}

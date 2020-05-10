import React, { Component } from 'react'
import { Table,Button, message, Form, Row, Col, Input,Select  } from 'antd'
import SelectItem from './components/SelectItem';
// eslint-disable-next-line import/no-unresolved
import request from '@/utils/request';
import AdvancedSearchForm  from './components/AdvancedSearchForm';
import BasicInfoForm  from './components/CustomerInfoForm';


const dataSource7= [
  {
    key: '1',
    lendUnit: '中国平安',
    limit: '50000',
    repayMode: '按月归还',
    times: '36期',
    status: '正常',
    fiveClassify: '正常',
    OPB: '10000',
    surplusTimes: 6,
    overdueTimes: 0,
    overdueMoney: 0,
    lastDate: '2019-02-02',
    startTime: '2018-02-02',
    endTime: '2020-02-02'
  },
];
const dataSource4= [
  {
    key: '1',
    id: 1,
    name: '云南云滴科技有限公司',
    companyCode: '91530000790277150C',
    legalPerson: '黄丽萍',
    registeredCapital: '1000万元整',
    type: '有限责任公司（自然人投资或控股）',
    setTime: '2006-07-24',
    runningTime: '长期',
    trade: '贸易',
    rate: '51%',
    state: '汽车、摩托车林哥披、轮胎、软件加工、日用百货汽车、摩托车林哥披、轮胎、软件加工、日用百货汽车、摩托车林哥披、轮胎、软件加工、日用百货汽车、摩托车林哥披、轮胎、软件加工、日用百货',
    remark: '很好的一家公司'
  },
  
];

const personLoan= [ 
  {
    title: '放款单位',
    dataIndex: 'lendUnit',
    key: 'lendUnit',
    render: text => <a>{text}</a>,
  },
  {
    title: '发放金额',
    dataIndex: 'limit',
    key: 'limit',
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
  },
  {
    title: '到期时间',
    dataIndex: 'endTime',
    key: 'endTime',
  },
  {
    title: '当前逾期数',
    dataIndex: 'overdueTimes',
    key: 'overdueTimes',
  },
  {
    title: '当前逾金额',
    dataIndex: 'overdueMoney',
    key: 'overdueMoney',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a style={{ marginRight: 16 }}>编辑</a>
        <a>删除</a>
      </span>
    ),
  },
];
// 个人逾期
const personOverdue= [ 
  {
    title: '编号',
    dataIndex: 'num',
    key: 'num',
    render: text => <a>{text}</a>,
  },
  {
    title: '逾期月份',
    dataIndex: 'month',
    key: 'month',
    render: text => <a>{text}</a>,
  },
  {
    title: '逾期连续月数',
    dataIndex: 'overdueMonths',
    key: 'overdueMonths',
  },
  {
    title: '逾期金额',
    dataIndex: 'overdueMoney',
    key: 'overdueMoney',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a style={{ marginRight: 16 }}>编辑</a>
        <a>删除</a>
      </span>
    ),
  },
];
// 公司逾期
const companyOverdue= [ 
  {
    title: '编号',
    dataIndex: 'num',
    key: 'num',
    render: text => <a>{text}</a>,
  },
  {
    title: '逾期月份',
    dataIndex: 'month',
    key: 'month',
    render: text => <a>{text}</a>,
  },
  {
    title: '逾期连续月数',
    dataIndex: 'overdueMonths',
    key: 'overdueMonths',
  },
  {
    title: '逾期金额',
    dataIndex: 'overdueMoney',
    key: 'overdueMoney',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a style={{ marginRight: 16 }}>编辑</a>
        <a>删除</a>
      </span>
    ),
  },
];
// 个人担保
const personGuarantee= [
  {
    title: '序号',
    dataIndex: 'num',
    key: 'num',
    render: text => <a>{text}</a>,
  },
  {
    title: '发放机构',
    dataIndex: 'lendUnit',
    key: 'lendUnit',
  },
  {
    title: '被担保方',
    dataIndex: 'guarantee',
    key: 'guarantee',
  },
  {
    title: '被担保方证件号码',
    dataIndex: 'idNum',
    key: 'idNum',
  },
  {
    title: '担保金额',
    dataIndex: 'money',
    key: 'money',
  },
  {
    title: '开始日期',
    dataIndex: 'startTime',
    key: 'startTime',
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a style={{ marginRight: 16 }}>编辑</a>
        <a>删除</a>
      </span>
    ),
  },
];
// 个人贷款查询
const personLoanQuery = [
  {
    title: '编号',
    dataIndex: 'num',
    key: 'num',
    render: text => <a>{text}</a>,
  },
  {
    title: '查询日期',
    dataIndex: 'approvalDate',
    key: 'approvalDate',
  },
  {
    title: '查询机构',
    dataIndex: 'lendUnit',
    key: 'lendUnit',
  },
  {
    title: '查询原因',
    dataIndex: 'use',
    key: 'use',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a style={{ marginRight: 16 }}>编辑</a>
        <a>删除</a>
      </span>
    ),
  },
];
// 个人资产
const personAsset = [
  {
    title: '序号',
    dataIndex: 'num',
    key: 'num',
    render: text => <a>{text}</a>,
  },
  {
    title: '资产类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '描述',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '估值',
    dataIndex: 'money',
    key: 'money',
  },
  {
    title: '位置',
    dataIndex: 'position',
    key: 'position',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a style={{ marginRight: 16 }}>编辑</a>
        <a>删除</a>
      </span>
    ),
  },
];
// 个人负债
const personDebt= [
  {
    title: '序号',
    dataIndex: 'num',
    key: 'num',
    render: text => <a>{text}</a>,
  },
  {
    title: '债权方',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: '债权方证件号码',
    dataIndex: 'idNum',
    key: 'idNum',
  },
  {
    title: '负债金额',
    dataIndex: 'money',
    key: 'money',
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
  },
  {
    title: '到期时间',
    dataIndex: 'endTime',
    key: 'endTime',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a style={{ marginRight: 16 }}>编辑</a>
        <a>删除</a>
      </span>
    ),
  },
];
// 公司负债
const companyDebt= [
  {
    title: '序号',
    dataIndex: 'num',
    key: 'num',
    render: text => <a>{text}</a>,
  },
  {
    title: '债权方',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: '债权方证件号码',
    dataIndex: 'idNum',
    key: 'idNum',
  },
  {
    title: '负债金额',
    dataIndex: 'money',
    key: 'money',
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
  },
  {
    title: '到期时间',
    dataIndex: 'endTime',
    key: 'endTime',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a style={{ marginRight: 16 }}>编辑</a>
        <a>删除</a>
      </span>
    ),
  },
];
// 公司基础信息
const companyBaseInfo= [
  {
    title: '机构信用代码',
    dataIndex: 'ICCC',
    key: 'ICCC',
    render: text => <a>{text}</a>,
  },
  {
    title: '中征码',
    dataIndex: 'signature',
    key: 'signature',
  },
  {
    title: '组织机构代码',
    dataIndex: 'OIBC',
    key: 'OIBC',
  },
  {
    title: '国税登记号',
    dataIndex: 'NTRN',
    key: 'NTRN',
  },
  {
    title: '地税登记号',
    dataIndex: 'GTRN',
    key: 'GTRN',
  },
];
// 公司出资人
const contributor= [
  {
    title: '编号',
    dataIndex: 'num',
    key: 'num',
    render: text => <a>{text}</a>,
  },
  {
    title: '出资方名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: '证件类型',
    dataIndex: 'idType',
    key: 'idType',
  },
  {
    title: '证件号码',
    dataIndex: 'idNum',
    key: 'idNum',
  },
  {
    title: '出资占比',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a style={{ marginRight: 16 }}>编辑</a>
        <a>删除</a>
      </span>
    ),
  },
];
// 公司贷款
const companyLoan = [
  {
    title: '放款单位',
    dataIndex: 'lendUnit',
    key: 'lendUnit',
    render: text => <a>{text}</a>,
  },
  {
    title: '发放金额',
    dataIndex: 'limit',
    key: 'limit',
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
  },
  {
    title: '到期时间',
    dataIndex: 'endTime',
    key: 'endTime',
  },
  {
    title: '当前逾期数',
    dataIndex: 'overdueTimes',
    key: 'overdueTimes',
  },
  {
    title: '当前逾金额',
    dataIndex: 'overdueMoney',
    key: 'overdueMoney',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a style={{ marginRight: 16 }}>编辑</a>
        <a>删除</a>
      </span>
    ),
  },
];
// 公司资产
const companyAsset= [
  {
    title: '序号',
    dataIndex: 'num',
    key: 'num',
    render: text => <a>{text}</a>,
  },
  {
    title: '资产类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '描述',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '估值',
    dataIndex: 'money',
    key: 'money',
  },
  {
    title: '位置',
    dataIndex: 'position',
    key: 'position',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a style={{ marginRight: 16 }}>编辑</a>
        <a>删除</a>
      </span>
    ),
  },
];
// 企查查
const qichacha= [
  {
    title: '序号',
    dataIndex: 'num',
    key: 'num',
    render: text => <a>{text}</a>,
  },
  {
    title: '事件类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '描述',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '是否结束',
    dataIndex: 'isOver',
    key: 'isOver',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a style={{ marginRight: 16 }}>编辑</a>
        <a>删除</a>
      </span>
    ),
  },
];
// 公司信息
const companyInfo = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    // render: text => <a>{text}</a>,
  },
  {
    title: '公司名称',
    dataIndex: 'name',
    key: 'name',
    // render: text => <a>{text}</a>,
  },
  {
    title: '统一信用编码',
    dataIndex: 'companyCode',
    key: 'companyCode',
  },
  {
    title: '法人',
    dataIndex: 'legalPerson',
    key: 'legalPerson',
  }, 
  {
    title: '注册资本',
    dataIndex: 'registeredCapital',
    key: 'registeredCapital',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '成立日期',
    dataIndex: 'setTime',
    key: 'setTime',
  },
  {
    title: '营业期限',
    dataIndex: 'runningTime',
    key: 'runningTime',
  },
  {
    title: '行业',
    dataIndex: 'trade',
    key: 'trade',
  },
  {
    title: '占股',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: '经营范围',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        {/* <a style={{ marginRight: 16 }}>编辑</a> */}
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
        
        personInfo: {},
        list2: [],
        list3: [],
        list4: dataSource4,

        list6: [],
        list7: dataSource7,
        list8: [],
        list9: [],
        list10: [],

        isLoading1: false,
        isLoading2: false,
        isLoading3: false,
        isLoading4: false,
        isLoading5: false,
        isLoading6: false,
        isLoading7: false,
        isLoading8: false,
    }
  }

  


// eslint-disable-next-line react/sort-comp
bindSerch=(o)=>{
    // eslint-disable-next-line no-console
    console.log('111',o)
    request.get('/api/base/customer/getByNameMobileIdNum', {
      params: o.values,
      headers:{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      }
    }).then(res=>{
        if(res.code === "0000"){
            message.info('成功了');
            const  personInfo = res.data
            console.log("personInfo",personInfo)
            this.setState({
              personInfo
          })
        }else{
          message.info('失败了');
        }
        
    })
  
}

handleAddCompanyInfo = () => {
  const { count, list4 } = this.state;
  const newData = {
    id: '',
    name: '公司名',
    companyCode: 32,
    legalPerson: '法人',
    registeredCapital: '注册资金',
    type:{render:() => 
      { 
      // eslint-disable-next-line no-unused-expressions
      <Select defaultValue="0"  >
      <Select.Option value="0" disabled>请选择</Select.Option>
      <Select.OptionOption value="1">有限责任公司</Select.OptionOption>
      <Select.OptionOption value="2">股份有限公司</Select.OptionOption>
      <Select.OptionOption value="3">个人独资企业</Select.OptionOption>
      <Select.OptionOption value="4">个体工商户</Select.OptionOption>
      </Select>
      }
    },
    setTime:'成立日期',
    runningTime:'营业期限',
    trade:'行业',
    rate:'占股',
    state:'经营范围',
    remark:'备注'
  };
  this.setState({
    list4: [...list4, newData],
    count: count + 1,
  });
};

componentDidMount(){
  
}

  render() {
    return (
      <div >
        <div id='top1' style={{  top:'65px', zIndex: 100, background:'white' }}>
        <h2 style={{  marginLeft:12 }}>客户信息详情</h2>
        <AdvancedSearchForm  bindSerch={ this.bindSerch }   />
        </div>
        <div>
        <h2 id='t1' >1.个人信息</h2>
        <div style={{ marginLeft: 10, background:'white' }}>
        <Button style={{  marginTop:5, marginLeft: 12, }} type="primary" >修改-个人信息</Button>
          <div style={{ marginLeft: 12 }}>
            <BasicInfoForm  personInfo={ this.state.personInfo }/>
          </div>
        </div>
        <h2 id='t2'>2.企业信息</h2>
        <Button style={{  marginLeft: 12, }} type="primary"  onClick={this.handleAddCompanyInfo} >添加-企业信息</Button>
        <Button style={{  marginLeft: 1000, }} type="primary" ><a href="#top1" >回到顶部</a></Button>
        <Table   dataSource={this.state.list4} columns={companyInfo} loading={this.state.isLoading4}  />
        </div>
        <div>
        <h2 id='t3'  >3.个人信用报告
        <Button style={{  marginLeft: 12, }} type="primary" ><a href="#top1" >回到顶部</a></Button>
        </h2>
        <div>
        <Form
          name="companyNmae"
          className="ant-advanced-search-form"
        >
        <Row gutter={24}>
        <Col span={8} >
          <Form.Item
            name="reportDate"
            label="报告日期："
          >
            <Input name='reportDate' />
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item
            name="companyName"
            label="被查询者姓名"
          >
             <SelectItem placeholder="选择被查询者姓名" url='/api/base/companyShare/getByCompany'  />
          </Form.Item>
        </Col>
        </Row>
        </Form>  
        </div>
        </div>
        <div id='personCredit' style={{ marginTop:10, background: 'white' }}>
        <h3 >3.1 贷款信息
        <Button style={{  marginLeft: 12, }} type="primary" >添加-贷款信息</Button>
        </h3>
        <Table  dataSource={this.state.list7} columns={personLoan} loading={this.state.isLoading7}  />
        <h3 >3.2 逾期记录
        <Button style={{  marginLeft: 12, }} type="primary" >添加-逾期记录</Button>
        </h3>
        <Table  dataSource={this.state.list3} columns={personOverdue} loading={this.state.isLoading3}  />
        <h3 >3.3 对外担保
        <Button style={{  marginLeft: 12, }} type="primary" >添加-担保记录</Button>
        </h3>
        <Table  dataSource={this.state.list9} columns={personGuarantee} loading={this.state.isLoading9}  />
        <h3  >3.4 贷款查询记录
        <Button style={{  marginLeft: 12, }} type="primary" >添加-贷款查询记录</Button>
        </h3>
        <Table  dataSource={this.state.list2} columns={ personLoanQuery } loading={this.state.isLoading2}  />
        <h3 >3.5 个人资产情况
        <Button style={{  marginLeft: 12, }} type="primary" >添加-资产情况</Button>
        </h3>
        <Table  dataSource={this.state.list6} columns={ personAsset } loading={this.state.isLoading6}  />
        <h3>3.6 个人负债信息
        <Button style={{  marginLeft: 12, }} type="primary" >添加-负债信息</Button>
        </h3>
        <Table  dataSource={this.state.list8} columns={personDebt} loading={this.state.isLoading8}  />
        </div>
        <div>
        <h2 id='t4'>4.企业信用报告
        <Button style={{  marginLeft: 12, }} type="primary" ><a href="#top1" >回到顶部</a></Button>
        </h2>
        <Form
          name="companyNmae"
          className="ant-advanced-search-form"
        >
        <Row gutter={24}>
        <Col span={8} >
          <Form.Item
            name="reportDate"
            label="报告日期："
          >
            <Input name='reportDate' />
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item
            name="companyName"
            label="企业名称："
          >
             <SelectItem placeholder="请选择企业" url='/api/base/company/getByCustomerId' />
          </Form.Item>
        </Col>
        </Row>
        </Form>  
        </div>
        <div id='companyCredit' style={{ marginTop:10, background: 'white' }}>
        <h3 >4.1 企业基础信息
        <Button style={{  marginLeft: 12, }} type="primary" >修改-企业基础信息</Button>
        </h3>
        <Table  dataSource={this.state.list2} columns={companyBaseInfo} loading={this.state.isLoading2}  />
        <h3 >4.2 主要出资人信息
        <Button style={{  marginLeft: 12, }} type="primary" >添加-出资人信息</Button>
        </h3>
        <Table  dataSource={this.state.list3} columns={contributor} loading={this.state.isLoading3}  />
        
        <h3 >4.3 贷款情况
        <Button style={{  marginLeft: 12, }} type="primary" >添加-贷款情况</Button>
        </h3>
        <Table  dataSource={this.state.list7} columns={companyLoan} loading={this.state.isLoading7}  />
    
        <h3 >4.4 企业资产情况
        <Button style={{  marginLeft: 12, }} type="primary" >添加-企业资产情况</Button>
        </h3>
        <Table  dataSource={this.state.list6} columns={companyAsset} loading={this.state.isLoading6}  />
        <h3>4.5 企业负债信息
        <Button style={{  marginLeft: 12, }} type="primary" >添加-企业负债信息</Button>
        </h3>
        <Table  dataSource={this.state.list8} columns={companyDebt} loading={this.state.isLoading8}  />
        <h3>4.6 企业逾期信息
        <Button style={{  marginLeft: 12, }} type="primary" >添加-企业逾期信息</Button>
        </h3>
        <Table  dataSource={this.state.list8} columns={companyOverdue} loading={this.state.isLoading8}  />
        </div>
        <h2 id='t5'>5.企查查</h2>
        <Button style={{  marginLeft: 12, }} type="primary" >添加-企查查信息</Button>
        <Button style={{  marginLeft: 12, }} type="primary" ><a href="#top1" >回到顶部</a></Button>
        <Table  dataSource={this.state.list10} columns={qichacha} loading={this.state.isLoading10}  />
      </div>
    )
  }
}

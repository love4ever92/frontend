module.exports = {
      // 个人贷款信息
      PersonLoan: [ 
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
      ],
      // 个人逾期
      PersonOverdue: [ 
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
      ],
      // 公司逾期
      CompanyOverdue: [ 
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
      ],
      // 个人担保
      PersonGuarantee: [
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
      ],
      // 个人贷款查询
      PersonLoanQuery: [
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
      ],
      // 个人资产
      PersonAsset: [
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
      ],
      // 个人负债
      PersonDebt: [
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
      ],
      // 公司负债
      CompanyDebt: [
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
      ],
      // 公司基础信息
      CompanyBaseInfo: [
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
      ],
      // 公司出资人
      Contributor: [
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
      ],
      // 公司贷款
      CompanyLoan : [
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
      ],
      // 公司资产
      CompanyAsset: [
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
      ],
      // 企查查
      Qichacha: [
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
      ],
      // 公司信息
      CompanyInfo : [
        {
          title: '公司名称',
          dataIndex: 'name',
          key: 'name',
          render: text => <a>{text}</a>,
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
              <a style={{ marginRight: 16 }}>编辑</a>
              <a>删除</a>
            </span>
          ),
        },
      ],
}
module.exports = {
     dataSource: [
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
      ],
      
       columns : [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
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
      ]
}
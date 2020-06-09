import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form, message } from 'antd';
import request from '@/utils/request'

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);


    const toggleEdit = () => {
        setEditing(!editing);

        if (record[dataIndex] === '点击输入') {
            form.setFieldsValue({
                [dataIndex]: "",
            });
        } else {
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        }
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('保存失败:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `请输入${title}`,
                    },
                ]}
            >
                <Input ref={inputRef} placeholder='' onBlur={save} />
            </Form.Item>
        ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        return <td {...restProps}>{childNode}</td>;

    }
    return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {

    

    constructor(props) {
        super(props);

        if (this.props.type === 'loanInfos') {
            // 贷款记录
            this.columns = [{
                title: '编号',
                dataIndex: 'key',
                key: 'key',
                // render: text => <a>{text}</a>,
            },
            {
                title: '放款单位',
                dataIndex: 'lendUnit',
                key: 'lendUnit',
                editable: true,

                // render: text => <a>{text}</a>,
            },
            {
                title: '发放金额/元',
                dataIndex: 'money',
                key: 'money',
                editable: true,
            },
            {
                title: '开始时间',
                dataIndex: 'startTime',
                key: 'startTime',
                editable: true,
            },
            {
                title: '到期时间',
                dataIndex: 'endTime',
                key: 'endTime',
                editable: true,
            },
            {
                title: '当前逾期数',
                dataIndex: 'overdueTimes',
                key: 'overdueTimes',
                editable: true,
            },
            {
                title: '当前逾金额/元',
                dataIndex: 'overdueMoney',
                key: 'overdueMoney',
                editable: true,
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                editable: true,
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key, '/api/base/customer-loans/remove')}>
                            <a style={ this.props.modalType == 'look'? { display: "none"}:{}}>删除</a>
                        </Popconfirm>
                    ) : null,
            },
            ];

        } else if (this.props.type === 'overdues') {
            // 逾期记录
            this.columns = [
                {
                    title: '编号',
                    dataIndex: 'key',
                    key: 'key',
                    // render: text => <a>{text}</a>,
                },
                {
                    title: '放款单位',
                    dataIndex: 'lendUnit',
                    key: 'lendUnit',
                    editable: true,
                },
                {
                    title: '贷款编号',
                    dataIndex: 'customerLoansId',
                    key: 'customerLoansId',
                    editable: true,
                },
                {
                    title: '逾期月份',
                    dataIndex: 'month',
                    key: 'month',
                    // render: text => <a>{text}</a>,
                    editable: true,
                },
                {
                    title: '逾期连续月数',
                    dataIndex: 'overdueMonths',
                    key: 'overdueMonths',
                    editable: true,
                },
                {
                    title: '逾期金额',
                    dataIndex: 'overdueMoney',
                    key: 'overdueMoney',
                    editable: true,
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    editable: true,
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key, '/api/base/customer-overdue/remove')}>
                                <a style={ this.props.modalType == 'look'? { display: "none"}:{}}>删除</a>
                            </Popconfirm>
                        ) : null,
                },
            ];
        } else if (this.props.type === 'guarantees') {
            // 担保记录
            this.columns = [
                {
                    title: '序号',
                    dataIndex: 'key',
                    key: 'key',
                    // render: text => <a>{text}</a>,
                },
                {
                    title: '发放机构',
                    dataIndex: 'lendUnit',
                    key: 'lendUnit',
                    editable: true,

                },
                {
                    title: '被担保方',
                    dataIndex: 'securedParty',
                    key: 'securedParty',
                    editable: true,

                },
                {
                    title: '被担保方证件号码',
                    dataIndex: 'securedPartyIdNum',
                    key: 'securedPartyIdNum',
                    editable: true,
                },
                {
                    title: '担保金额',
                    dataIndex: 'guaranteeMoney',
                    key: 'guaranteeMoney',
                    editable: true,
                },
                {
                    title: '开始日期',
                    dataIndex: 'startTime',
                    key: 'startTime',
                    editable: true,
                },
                {
                    title: '结束时间',
                    dataIndex: 'endTime',
                    key: 'endTime',
                    editable: true,
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    editable: true,
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key, '/api/base/customer-guarantee/remove')}>
                                <a style={ this.props.modalType == 'look'? { display: "none"}:{}}>删除</a>
                            </Popconfirm>
                        ) : null,
                },
            ];
        } else if (this.props.type === 'loanquerys') {
            // 查询记录
            this.columns = [
                {
                    title: '编号',
                    dataIndex: 'key',
                    key: 'key',
                    render: text => <a>{text}</a>,
                },
                {
                    title: '查询日期',
                    dataIndex: 'approvalDate',
                    key: 'approvalDate',
                    editable: true,

                },
                {
                    title: '查询机构',
                    dataIndex: 'lendUnit',
                    key: 'lendUnit',
                    editable: true,

                },
                {
                    title: '查询原因',
                    dataIndex: 'purpose',
                    key: 'purpose',
                    editable: true,

                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    editable: true,
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key, '/api/base/loan-query/remove')}>
                                <a style={ this.props.modalType == 'look'? { display: "none"}:{}}>删除</a>
                            </Popconfirm>
                        ) : null,
                },
            ];
        } else if (this.props.type === 'assets') {
            // 资产记录
            this.columns = [
                {
                    title: '序号',
                    dataIndex: 'key',
                    key: 'key',
                },
                {
                    title: '资产类型',
                    dataIndex: 'type',
                    key: 'type',
                    editable: true,
                },
                {
                    title: '资产名称',
                    dataIndex: 'name',
                    key: 'name',
                    editable: true,
                },
                {
                    title: '描述',
                    dataIndex: 'state',
                    key: 'state',
                    editable: true,
                },
                {
                    title: '估值/元',
                    dataIndex: 'money',
                    key: 'money',
                    editable: true,
                },
                {
                    title: '位置',
                    dataIndex: 'position',
                    key: 'position',
                    editable: true,
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    editable: true,
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key, '/api/base/customer-asset/remove')}>
                                <a style={ this.props.modalType == 'look'? { display: "none"}:{}}>删除</a>
                            </Popconfirm>
                        ) : null,
                },
            ]
        } else if (this.props.type === 'debts') {
            // 负债记录
            this.columns = [
                {
                    title: '序号',
                    dataIndex: 'key',
                    key: 'key',
                    editable: true,
                    // render: text => <a>{text}</a>,
                },
                {
                    title: '债权方',
                    dataIndex: 'name',
                    key: 'name',
                    editable: true,
                    // render: text => <a>{text}</a>,
                },
                {
                    title: '债权方证件号码',
                    dataIndex: 'debtPartyIdNum',
                    key: 'debtPartyIdNum',
                    editable: true,
                },
                {
                    title: '负债金额/元',
                    dataIndex: 'money',
                    key: 'money',
                    editable: true,
                },
                {
                    title: '开始时间',
                    dataIndex: 'startTime',
                    key: 'startTime',
                    editable: true,
                },
                {
                    title: '到期时间',
                    dataIndex: 'endTime',
                    key: 'endTime',
                    editable: true,
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    editable: true,
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key, '/api/base/customer-debt/remove')}>
                                <a style={ this.props.modalType == 'look'? { display: "none"}:{}}>删除</a>
                            </Popconfirm>
                        ) : null,
                },
            ]
        } else if (this.props.type === 'companyShare') {
            // 企业主要出资人
            this.columns = [
                {
                    title: '编号',
                    dataIndex: 'key',
                    key: 'key',
                },
                {
                    title: '出资方名称',
                    dataIndex: 'name',
                    key: 'name',
                    editable: true,
                },
                {
                    title: '证件号码',
                    dataIndex: 'idNum',
                    key: 'idNum',
                    editable: true,
                },
                {
                    title: '出资占比(%)',
                    dataIndex: 'rate',
                    key: 'rate',
                    editable: true,
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    editable: true,
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key, '/api/base/company-share/remove')}>
                                <a style={ this.props.modalType == 'look'? { display: "none"}:{}}>删除</a>
                            </Popconfirm>
                        ) : null,
                },
            ]
        } else if (this.props.type === 'companyLoans') {
            // 企业贷款情况
            this.columns = [
                {
                    title: '编号',
                    dataIndex: 'key',
                    key: 'key',
                },
                {
                    title: '放款单位',
                    dataIndex: 'lendUnit',
                    key: 'lendUnit',
                    editable: true,
                },
                {
                    title: '发放金额(元)',
                    dataIndex: 'money',
                    key: 'money',
                    editable: true,
                },
                {
                    title: '资金用途',
                    dataIndex: 'purpose',
                    key: 'purpose',
                    editable: true,
                },
                {
                    title: '开始时间',
                    dataIndex: 'startTime',
                    key: 'startTime',
                    editable: true,
                },
                {
                    title: '到期时间',
                    dataIndex: 'endTime',
                    key: 'endTime',
                    editable: true,
                },
                {
                    title: '当前逾期数(次)',
                    dataIndex: 'overdueTimes',
                    key: 'overdueTimes',
                    editable: true,
                },
                {
                    title: '当前逾金额(元)',
                    dataIndex: 'overdueMoney',
                    key: 'overdueMoney',
                    editable: true,
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    editable: true,
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key, '/api/base/company-loans/remove')}>
                                <a style={ this.props.modalType == 'look'? { display: "none"}:{}}>删除</a>
                            </Popconfirm>
                        ) : null,
                },
            ]
        } else if (this.props.type === 'companyAsset') {
            // 企业资产
            this.columns = [
                {
                    title: '编号',
                    dataIndex: 'key',
                    key: 'key',
                },
                {
                    title: '资产类型',
                    dataIndex: 'type',
                    key: 'type',
                    editable: true,
                },
                {
                    title: '资产名称',
                    dataIndex: 'name',
                    key: 'name',
                    editable: true,
                },
                {
                    title: '描述',
                    dataIndex: 'state',
                    key: 'state',
                    editable: true,
                },
                {
                    title: '估值',
                    dataIndex: 'money',
                    key: 'money',
                    editable: true,
                },
                {
                    title: '位置',
                    dataIndex: 'position',
                    key: 'position',
                    editable: true,
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    editable: true,
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key, '/api/base/company-asset/remove')}>
                                <a style={ this.props.modalType == 'look'? { display: "none"}:{}}>删除</a>
                            </Popconfirm>
                        ) : null,
                },
            ]
        } else if (this.props.type === 'companyDebt') {
            // 企业负债
            this.columns = [
                {
                    title: '编号',
                    dataIndex: 'key',
                    key: 'key',
                },
                {
                    title: '债权方',
                    dataIndex: 'name',
                    key: 'name',
                    editable: true,
                },
                {
                    title: '债权方证件号码',
                    dataIndex: 'idNum',
                    key: 'idNum',
                    editable: true,
                },
                {
                    title: '负债金额',
                    dataIndex: 'money',
                    key: 'money',
                    editable: true,
                },
                {
                    title: '开始时间',
                    dataIndex: 'startTime',
                    key: 'startTime',
                    editable: true,
                },
                {
                    title: '到期时间',
                    dataIndex: 'endTime',
                    key: 'endTime',
                    editable: true,
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    editable: true,
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key, '/api/base/company-debt/remove')}>
                                <a style={ this.props.modalType == 'look'? { display: "none"}:{}}>删除</a>
                            </Popconfirm>
                        ) : null,
                },
            ]
        } else if (this.props.type === 'companyOverdue') {
            // 企业逾期
            this.columns = [
                {
                    title: '编号',
                    dataIndex: 'key',
                    key: 'key',
                    editable: true,
                },
                {
                    title: '放款单位',
                    dataIndex: 'lendUnit',
                    key: 'lendUnit',
                    editable: true,
                },
                {
                    title: '贷款编号',
                    dataIndex: 'companyLoansId',
                    key: 'companyLoansId',
                    editable: true,
                },
                {
                    title: '逾期月份',
                    dataIndex: 'month',
                    key: 'month',
                    editable: true,
                },
                {
                    title: '逾期连续月数',
                    dataIndex: 'overdueTimes',
                    key: 'overdueTimes',
                    editable: true,
                },
                {
                    title: '逾期金额',
                    dataIndex: 'overdueMoney',
                    key: 'overdueMoney',
                    editable: true,
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    editable: true,
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key, '/api/base/company-overdue/remove')}>
                                <a style={ this.props.modalType == 'look'? { display: "none"}:{}}>删除</a>
                            </Popconfirm>
                        ) : null,
                },
            ]
        } else if (this.props.type === 'companyJudicatureInfo') {
            // 企查查（补充）
            this.columns = [
                {
                    title: '编号',
                    dataIndex: 'key',
                    key: 'key',
                },
                {
                    title: '事件类型',
                    dataIndex: 'type',
                    key: 'type',
                    editable: true,
                },
                {
                    title: '描述',
                    dataIndex: 'state',
                    key: 'state',
                    editable: true,
                },
                {
                    title: '是否结束(是/否)',
                    dataIndex: 'isOver',
                    key: 'isOver',
                    editable: true,
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    editable: true,
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key, '/api/base/company-judicature-info/remove')}>
                                <a style={ this.props.modalType == 'look'? { display: "none"}:{}}>删除</a>
                            </Popconfirm>
                        ) : null,
                },
            ]
        }else if (this.props.type === 'companyTopManager') {
            // 企业高管
            this.columns = [
                {
                    title: '编号',
                    dataIndex: 'key',
                    key: 'key',
                },
                {
                    title: '职务',
                    dataIndex: 'job',
                    key: 'job',
                    editable: true,
                },
                {
                    title: '姓名',
                    dataIndex: 'name',
                    key: 'name',
                    editable: true,
                },
                {
                    title: '身份证号码',
                    dataIndex: 'idNum',
                    key: 'idNum',
                    editable: true,
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    editable: true,
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key, '/api/base/company-top-manager/remove')}>
                                <a style={ this.props.modalType == 'look'? { display: "none"}:{}}>删除</a>
                            </Popconfirm>
                        ) : null,
                },
            ]
        }else if (this.props.type === 'companyRelation') {
            // 关联企业
            this.columns = [
                {
                    title: '编号',
                    dataIndex: 'key',
                    key: 'key',
                },
                {
                    title: '公司名称',
                    dataIndex: 'name',
                    key: 'name',
                    editable: true,
                },
                {
                    title: '中征码',
                    dataIndex: 'companyCode',
                    key: 'companyCode',
                    editable: true,
                },
                {
                    title: '关系',
                    dataIndex: 'relation',
                    key: 'relation',
                    editable: true,
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    editable: true,
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) =>
                        this.state.dataSource.length >= 1 ? (
                            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key, '/api/base/company-relation/remove')}>
                                <a style={ this.props.modalType == 'look'? { display: "none"}:{}}>删除</a>
                            </Popconfirm>
                        ) : null,
                },
            ]
        }
        if(this.props.modalType === 'add'){
            this.state = {
                // eslint-disable-next-line react/no-unused-state
                isSubmit: false,
                dataSource: [],
                count: 0,
                // eslint-disable-next-line react/no-unused-state
                submitData: [],
            };
        }else if(this.props.modalType === 'edit' || this.props.modalType === 'look'){
            if (this.props.type === 'loanInfos' && this.props.editObj.customerLoans) {
                const list = this.props.editObj.customerLoans;
                if(list.length > 0){
                    list.map(v => {
                        // eslint-disable-next-line no-param-reassign
                        v.key = v.id
                        return v
                    });
                }
                this.state = {
                    // eslint-disable-next-line react/no-unused-state
                    isSubmit: false,
                    count: list.length,
                    // eslint-disable-next-line react/no-unused-state
                    submitData: [],
                    dataSource: list,
                };
            } else if (this.props.type === 'overdues' && this.props.editObj.customerOverdues) {
                const list = this.props.editObj.customerOverdues;
                if(list.length > 0){
                    list.map(v => {
                        // eslint-disable-next-line no-param-reassign
                        v.key = v.id
                        return v
                    });
                }
                this.state = {
                    // eslint-disable-next-line react/no-unused-state
                    isSubmit: false,
                    count: list.length,
                    // eslint-disable-next-line react/no-unused-state
                    submitData: [],
                    dataSource: list,
                };
            } else if (this.props.type === 'guarantees' && this.props.editObj.customerGuarantees) {
                const list = this.props.editObj.customerGuarantees;
                if(list.length > 0){
                    list.map(v => {
                        // eslint-disable-next-line no-param-reassign
                        v.key = v.id
                        return v
                    });
                }
                this.state = {
                    // eslint-disable-next-line react/no-unused-state
                    isSubmit: false,
                    count: list.length,
                    // eslint-disable-next-line react/no-unused-state
                    submitData: [],
                    dataSource: list,
                };
            } else if (this.props.type === 'loanquerys' && this.props.editObj.loanQueries) {
                const list = this.props.editObj.loanQueries;
                if(list.length > 0){
                    list.map(v => {
                        // eslint-disable-next-line no-param-reassign
                        v.key = v.id
                        return v
                    });
                }
                // 查询记录
                this.state = {
                    // eslint-disable-next-line react/no-unused-state
                    isSubmit: false,
                    count: list.length,
                    // eslint-disable-next-line react/no-unused-state
                    submitData: [],
                    dataSource: list,
                };
            } else if (this.props.type === 'assets' && this.props.editObj.customerAssets) {
                const list = this.props.editObj.customerAssets;
                if(list.length > 0){
                    list.map(v => {
                        // eslint-disable-next-line no-param-reassign
                        v.key = v.id
                        return v
                    });
                }
                // 资产记录
                this.state = {
                    // eslint-disable-next-line react/no-unused-state
                    isSubmit: false,
                    count: list.length,
                    // eslint-disable-next-line react/no-unused-state
                    submitData: [],
                    dataSource: list,
                };
            } else if (this.props.type === 'debts' && this.props.editObj.customerDebts) {
                const list = this.props.editObj.customerDebts;
                if(list.length > 0){
                    list.map(v => {
                        // eslint-disable-next-line no-param-reassign
                        v.key = v.id
                        return v
                    });
                }
                // 负债记录
                this.state = {
                    // eslint-disable-next-line react/no-unused-state
                    isSubmit: false,
                    count: list.length,
                    // eslint-disable-next-line react/no-unused-state
                    submitData: [],
                    dataSource: list,
                };
            } else if (this.props.type === 'companyShare' && this.props.editObj.companyShares){
                const list = this.props.editObj.companyShares;
                if(list.length > 0){
                    list.map(v => {
                        // eslint-disable-next-line no-param-reassign
                        v.key = v.id
                        return v
                    });
                }
                this.state = {
                    // eslint-disable-next-line react/no-unused-state
                    isSubmit: false,
                    count: list.length,
                    // eslint-disable-next-line react/no-unused-state
                    submitData: [],
                    dataSource: list,
                };
            } else if (this.props.type === 'companyLoans' && this.props.editObj.companyLoans){
                const list = this.props.editObj.companyLoans;
                if(list.length > 0){
                    list.map(v => {
                        // eslint-disable-next-line no-param-reassign
                        v.key = v.id
                        return v
                    });
                }
                this.state = {
                    // eslint-disable-next-line react/no-unused-state
                    isSubmit: false,
                    count: list.length,
                    // eslint-disable-next-line react/no-unused-state
                    submitData: [],
                    dataSource: list,
                };
            }else if (this.props.type === 'companyAsset' && this.props.editObj.companyAssets){
                const list = this.props.editObj.companyAssets;
                if(list.length > 0){
                    list.map(v => {
                        // eslint-disable-next-line no-param-reassign
                        v.key = v.id
                        return v
                    });
                }
                this.state = {
                    // eslint-disable-next-line react/no-unused-state
                    isSubmit: false,
                    count: list.length,
                    // eslint-disable-next-line react/no-unused-state
                    submitData: [],
                    dataSource: list,
                };
            }else if (this.props.type === 'companyDebt' && this.props.editObj.companyDebts){
                const list = this.props.editObj.companyDebts;
                if(list.length > 0){
                    list.map(v => {
                        // eslint-disable-next-line no-param-reassign
                        v.key = v.id
                        return v
                    });
                }
                this.state = {
                    // eslint-disable-next-line react/no-unused-state
                    isSubmit: false,
                    count: list.length,
                    // eslint-disable-next-line react/no-unused-state
                    submitData: [],
                    dataSource: list,
                };
            }else if (this.props.type === 'companyOverdue' && this.props.editObj.companyOverdues){
                const list = this.props.editObj.companyOverdues;
                if(list.length > 0){
                    list.map(v => {
                        // eslint-disable-next-line no-param-reassign
                        v.key = v.id
                        return v
                    });
                }
                this.state = {
                    // eslint-disable-next-line react/no-unused-state
                    isSubmit: false,
                    count: list.length,
                    // eslint-disable-next-line react/no-unused-state
                    submitData: [],
                    dataSource: list,
                };
            }else if (this.props.type === 'companyJudicatureInfo' && this.props.editObj.companyJudicatureInfos){
                const list = this.props.editObj.companyJudicatureInfos;
                if(list.length > 0){
                    list.map(v => {
                        // eslint-disable-next-line no-param-reassign
                        v.key = v.id
                        return v
                    });
                }
                this.state = {
                    // eslint-disable-next-line react/no-unused-state
                    isSubmit: false,
                    count: list.lenth,
                    // eslint-disable-next-line react/no-unused-state
                    submitData: [],
                    dataSource: list,
                };
            }else if (this.props.type === 'companyTopManager' && this.props.editObj.companyTopManagers){
                const list = this.props.editObj.companyTopManagers;
                if(list.length > 0){
                    list.map(v => {
                        // eslint-disable-next-line no-param-reassign
                        v.key = v.id
                        return v
                    });
                }
                this.state = {
                    // eslint-disable-next-line react/no-unused-state
                    isSubmit: false,
                    count: list.lenth,
                    // eslint-disable-next-line react/no-unused-state
                    submitData: [],
                    dataSource: list,
                };
            }else if (this.props.type === 'companyRelation' && this.props.editObj.companyRelations){
                const list = this.props.editObj.companyRelations;
                if(list.length > 0){
                    list.map(v => {
                        // eslint-disable-next-line no-param-reassign
                        v.key = v.id
                        return v
                    });
                }
                this.state = {
                    // eslint-disable-next-line react/no-unused-state
                    isSubmit: false,
                    count: list.lenth,
                    // eslint-disable-next-line react/no-unused-state
                    submitData: [],
                    dataSource: list,
                };
            }else{
                this.state = {
                    // eslint-disable-next-line react/no-unused-state
                    isSubmit: false,
                    count: 0,
                    // eslint-disable-next-line react/no-unused-state
                    submitData: [],
                    dataSource: [],
                };
            }
        }
        
    }

    handleDelete = (key, url) => {
        if(this.state.isSubmit){
            request.get(url, {
                params: {
                    userId: localStorage.getItem('userId'),
                    id: key
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).then(res => {
                if (res.code === '0000') {
                    message.info(res.data);
                    this.list(url.replace('remove', 'list'), 
                    this.props.customerId, this.props.customerReportId,
                    this.props.companyId,this.props.companyReportId)
                } else {
                    message.error(res.data);
                }
            })
        }else{
            // eslint-disable-next-line react/no-access-state-in-setstate
            const dataSource = [ ...this.state.dataSource ];
            this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
        }
        

    };

    handleAdd = () => {
        const { count, dataSource } = this.state;
        let newData = {};
        if (this.props.type === 'loanInfos') {
            // 贷款记录
            newData = {
                key: count,
                lendUnit: "点击输入",
                money: "点击输入",
                startTime: "点击输入",
                endTime: "点击输入",
                overdueTimes: "点击输入",
                overdueMoney: "点击输入",
                remark: "点击输入",
            };
        } else if (this.props.type === 'overdues') {
            // 逾期记录
            newData = {
                key: count,
                lendUnit: "点击输入",
                customerLoansId: "点击输入",
                month: "点击输入",
                overdueMonths: "点击输入",
                overdueMoney: "点击输入",
                remark: "点击输入",
            };
        } else if (this.props.type === 'guarantees') {
            // 担保记录
            newData = {
                key: count,
                lendUnit: "点击输入",
                securedParty: "点击输入",
                securedPartyIdNum: "点击输入",
                guaranteeMoney: "点击输入",
                startTime: "点击输入",
                endTime: "点击输入",
                remark: "点击输入",
            };
        } else if (this.props.type === 'loanquerys') {
            // 查询记录
            newData = {
                key: count,
                approvalDate: "点击输入",
                lendUnit: "点击输入",
                purpose: "点击输入",
                remark: "点击输入",
            };
        } else if (this.props.type === 'assets') {
            // 资产记录
            newData = {
                key: count,
                type: "点击输入",
                name: "点击输入",
                state: "点击输入",
                money: "点击输入",
                position: "点击输入",
                remark: "点击输入",
            };
        } else if (this.props.type === 'debts') {
            // 负债记录
            newData = {
                key: count,
                name: "点击输入",
                debtPartyIdNum: "点击输入",
                money: "点击输入",
                startTime: "点击输入",
                endTime: "点击输入",
                remark: "点击输入",
            };
        } else if (this.props.type === 'companyShare'){
            newData = {
                key: count,
                name: "点击输入",
                idNum: "点击输入",
                rate: "点击输入",
                remark: "点击输入",
            };
        } else if (this.props.type === 'companyLoans'){
            newData = {
                key: count,
                lendUnit: "点击输入",
                money: "点击输入",
                purpose: "点击输入",
                startTime: "点击输入",
                endTime: "点击输入",
                overdueTimes: "点击输入",
                overdueMoney: "点击输入",
                remark: "点击输入",
            };
        }else if (this.props.type === 'companyAsset'){
            newData = {
                key: count,
                name: "点击输入",
                type: "点击输入",
                money: "点击输入",
                state: "点击输入",
                position: "点击输入",
                remark: "点击输入",
            };
        }else if (this.props.type === 'companyDebt'){
            newData = {
                key: count,
                name: "点击输入",
                idNum: "点击输入",
                money: "点击输入",
                startTime: "点击输入",
                endTime: "点击输入",
                remark: "点击输入",
            };
        }else if (this.props.type === 'companyOverdue'){
            newData = {
                key: count,
                lendUnit: "点击输入",
                month: "点击输入",
                companyLoansId: "点击输入",
                overdueTimes: "点击输入",
                overdueMoney: "点击输入",
                remark: "点击输入",
            };
        }else if (this.props.type === 'companyJudicatureInfo'){
            newData = {
                key: count,
                type: "点击输入",
                state: "点击输入",
                isOver: "点击输入",
                remark: "点击输入",
            };
        }else if (this.props.type === 'companyTopManager'){
            newData = {
                key: count,
                job: "点击输入",
                name: "点击输入",
                idNum: "点击输入",
                remark: "点击输入",
            };
        }else if (this.props.type === 'companyRelation'){
            newData = {
                key: count,
                name: "点击输入",
                companyCode: "点击输入",
                relation: "点击输入",
                remark: "点击输入",
            };
        }


        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };


    handleSave = row => {

        // eslint-disable-next-line react/no-access-state-in-setstate
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        this.setState({
            dataSource: newData,
            // eslint-disable-next-line react/no-unused-state
            submitData: newData,
        });

    };

    submit = () => {
        
        if (this.state.submitData.length === 0) {
            message.info("没有添加记录");
            return;
        }
        if (this.props.type === 'loanInfos') {
            if(!this.props.customerReportId){
                message.error("未保存个人报告基本信息");
                return;
            }
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.state.submitData.length; i++) {
                // eslint-disable-next-line eqeqeq
                if ((Math.floor(this.state.submitData[i].money) != this.state.submitData[i].money)
                    // eslint-disable-next-line eqeqeq
                    || (Math.floor(this.state.submitData[i].overdueTimes) != this.state.submitData[i].overdueTimes)
                    // eslint-disable-next-line eqeqeq
                    || (Math.floor(this.state.submitData[i].overdueMoney) != this.state.submitData[i].overdueMoney)
                ) {
                    message.error('贷款金额或逾期次数或逾期金额不为整数');
                    return;
                }
                if(this.state.submitData[i].lendUnit.trim() === '点击输入' || this.state.submitData[i].lendUnit.trim() ===''){
                    message.error('放款单位不得为空');
                    return;
                }
                const regexp = new RegExp(/^([1][7-9][0-9][0-9]|[2][0][0-9][0-9])(-)([0][1-9]|[1][0-2])(-)([0-2][1-9]|[3][0-1]|[1-2][0])$/i);
                if(this.state.submitData[i].startTime.trim() === '点击输入' 
                    || this.state.submitData[i].startTime.trim() === ''){
                    message.error('开始时间不得为空');
                    return;
                }
                if (!regexp.test(this.state.submitData[i].startTime.trim())){
                    message.error('请输入正确的开始时间，时间格式入：2019-01-01（‘-’是英文字符）');
                    return;
                }
                if(this.state.submitData[i].endTime.trim() === '点击输入' 
                || this.state.submitData[i].endTime.trim() === ''){
                    message.error('到期时间不得为空');
                    return;
                }
                if (!regexp.test(this.state.submitData[i].endTime.trim())){
                    message.error('请输入正确的到期时间，时间格式入：2019-01-01（‘-’是英文字符）');
                    return;
                }
                
            }
            this.add('/api/base/customer-loans/add', '/api/base/customer-loans/list');
        } else if (this.props.type === 'overdues') {
            if(!this.props.customerReportId){
                message.error("未保存个人报告基本信息");
                return;
            }
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.state.submitData.length; i++) {
                // eslint-disable-next-line eqeqeq
                if ((Math.floor(this.state.submitData[i].customerLoansId) != this.state.submitData[i].customerLoansId)
                    // eslint-disable-next-line eqeqeq
                    || (Math.floor(this.state.submitData[i].overdueMonths) != this.state.submitData[i].overdueMonths)
                    // eslint-disable-next-line eqeqeq
                    || (Math.floor(this.state.submitData[i].overdueMoney) != this.state.submitData[i].overdueMoney)
                ) {
                    message.error('贷款编号或连续逾期月数或逾期金额不为整数');
                    return;
                }
                const regexp = new RegExp(/^([1][7-9][0-9][0-9]|[2][0][0-9][0-9])(-)([0][1-9]|[1][0-2])$/i);
                if(!regexp.test(this.state.submitData[i].month.trim())){
                    message.error('逾期月份格式不正确，正确格式如"2020-01",(-是英文字符)');
                    return;
                }
                if(this.state.submitData[i].lendUnit.trim() === '点击输入' || this.state.submitData[i].lendUnit.trim() ===''){
                    message.error('放款单位不得为空');
                    return;
                }
            }
            this.add('/api/base/customer-overdue/add', '/api/base/customer-overdue/list');
        } else if (this.props.type === 'guarantees') {
            if(!this.props.customerReportId){
                message.error("未保存个人报告基本信息");
                return;
            }
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.state.submitData.length; i++) {
                // eslint-disable-next-line eqeqeq
                if ((Math.floor(this.state.submitData[i].guaranteeMoney) != this.state.submitData[i].guaranteeMoney)) {
                    message.error('担保金额不为整数');
                    return;
                }
                if(this.state.submitData[i].lendUnit.trim() === '点击输入' || this.state.submitData[i].lendUnit.trim() === ''){
                    message.error('放款单位不得为空');
                    return;
                }
                if(this.state.submitData[i].securedParty.trim() === '点击输入' || this.state.submitData[i].securedParty.trim() === ''){
                    message.error('被担保方不得为空');
                    return;
                }
                const regexp = new RegExp(/^([1][7-9][0-9][0-9]|[2][0][0-9][0-9])(-)([0][1-9]|[1][0-2])(-)([0-2][1-9]|[3][0-1]|[1-2][0])$/i);
                if(this.state.submitData[i].startTime.trim() === '点击输入' 
                    || this.state.submitData[i].startTime.trim() === ''){
                    message.error('开始时间不得为空');
                    return;
                }
                if (!regexp.test(this.state.submitData[i].startTime.trim())){
                    message.error('请输入正确的开始时间，时间格式入：2019-01-01（‘-’是英文字符）');
                    return;
                }
                if(this.state.submitData[i].endTime.trim() === '点击输入' 
                || this.state.submitData[i].endTime.trim() === ''){
                    message.error('到期时间不得为空');
                    return;
                }
                if (!regexp.test(this.state.submitData[i].endTime.trim())){
                    message.error('请输入正确的到期时间，时间格式入：2019-01-01（‘-’是英文字符）');
                    return;
                }
            }
            this.add('/api/base/customer-guarantee/add', '/api/base/customer-guarantee/list');
        } else if (this.props.type === 'loanquerys') {
            if(!this.props.customerReportId){
                message.error("未保存个人报告基本信息");
                return;
            }
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.state.submitData.length; i++) {
                if(this.state.submitData[i].lendUnit.trim() === '点击输入' && this.state.submitData[i].lendUnit.trim() ===''){
                    message.error('查询机构不得为空');
                    return;
                }
                const regexp = new RegExp(/^([1][7-9][0-9][0-9]|[2][0][0-9][0-9])(-)([0][1-9]|[1][0-2])(-)([0-2][1-9]|[3][0-1]|[1-2][0])$/i);
                if(this.state.submitData[i].approvalDate.trim() === '点击输入' 
                    || this.state.submitData[i].approvalDate.trim() === ''){
                    message.error('查询日期不得为空');
                    return;
                }
                if (!regexp.test(this.state.submitData[i].approvalDate.trim())){
                    message.error('请输入正确的查询日期，时间格式入：2019-01-01（‘-’是英文字符）');
                    return;
                }

            }
            this.add('/api/base/loan-query/add', '/api/base/loan-query/list');
        } else if (this.props.type === 'assets') {
            if(!this.props.customerReportId){
                message.error("未保存个人报告基本信息");
                return;
            }
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.state.submitData.length; i++) {
                // eslint-disable-next-line eqeqeq
                if ((Math.floor(this.state.submitData[i].money) != this.state.submitData[i].money)) {
                    message.error('估值/元不为整数');
                    return;
                }
                if(this.state.submitData[i].type.trim() === '点击输入' 
                    || this.state.submitData[i].type.trim() === ''){
                    message.error('资产类型不得为空');
                    return;
                }
                if(this.state.submitData[i].name.trim() === '点击输入' 
                    || this.state.submitData[i].name.trim() === ''){
                    message.error('资产名称不得为空');
                    return;
                }
                if(this.state.submitData[i].state.trim() === '点击输入' 
                    || this.state.submitData[i].state.trim() === ''){
                    message.error('描述不得为空');
                    return;
                }
                if(this.state.submitData[i].position.trim() === '点击输入' 
                    || this.state.submitData[i].position.trim() === ''){
                    message.error('位置不得为空');
                    return;
                }
            }
            this.add('/api/base/customer-asset/add', '/api/base/customer-asset/list');
        } else if (this.props.type === 'debts') {
            if(!this.props.customerReportId){
                message.error("未保存个人报告基本信息");
                return;
            }
            for (let i = 0; i < this.state.submitData.length; i++) {
                // eslint-disable-next-line eqeqeq
                if ((Math.floor(this.state.submitData[i].money) != this.state.submitData[i].money)) {
                    message.error('负债不为整数');
                    return;
                }
                if(this.state.submitData[i].name.trim() === '点击输入' 
                    || this.state.submitData[i].name.trim() === ''){
                    message.error('债权方不得为空');
                    return;
                }
                const regexp = new RegExp(/^([1][7-9][0-9][0-9]|[2][0][0-9][0-9])(\-)([0][1-9]|[1][0-2])(\-)([0-2][1-9]|[3][0-1]|[1-2][0])$/i);
                if(this.state.submitData[i].startTime.trim() === '点击输入' 
                    || this.state.submitData[i].startTime.trim() === ''){
                    message.error('开始时间不得为空');
                    return;
                }
                if (!regexp.test(this.state.submitData[i].startTime.trim())){
                    message.error('请输入正确的开始时间，时间格式入：2019-01-01（‘-’是英文字符）');
                    return;
                }
                if(this.state.submitData[i].endTime.trim() === '点击输入' 
                || this.state.submitData[i].endTime.trim() === ''){
                    message.error('到期时间不得为空');
                    return;
                }
                if (!regexp.test(this.state.submitData[i].endTime.trim())){
                    message.error('请输入正确的到期时间，时间格式入：2019-01-01（‘-’是英文字符）');
                    return;
                }
            }
            this.add('/api/base/customer-debt/add', '/api/base/customer-debt/list');
        } else if (this.props.type === 'companyShare'){
            if(!this.props.companyReportId){
                message.error("未保存公司报告基本信息");
                return;
            }
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.state.submitData.length; i++) {
                // eslint-disable-next-line eqeqeq
                if(this.state.submitData[i].rate * 100){
                    // eslint-disable-next-line eqeqeq
                    if ((Math.floor(this.state.submitData[i].rate * 100) != this.state.submitData[i].rate * 100)) {
                        message.error('出资占比(%)格式不正确，必须数字');
                        return;
                    }
                }
                
                if(this.state.submitData[i].name.trim() === '点击输入' 
                    || this.state.submitData[i].name.trim() === ''){
                    message.error('出资方名称不得为空');
                    return;
                }
            }
            this.add('/api/base/company-share/add', '/api/base/company-share/list');
        } else if (this.props.type === 'companyLoans'){
            if(!this.props.companyReportId){
                message.error("未保存公司报告基本信息");
                return;
            }
            
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.state.submitData.length; i++) {
                if(this.state.submitData[i].lendUnit.trim() === '点击输入' 
                    || this.state.submitData[i].lendUnit.trim() === ''){
                    message.error('放款单位不得为空');
                    return;
                }
                if ((Math.floor(this.state.submitData[i].money) != this.state.submitData[i].money)
                    || (Math.floor(this.state.submitData[i].overdueTimes) != this.state.submitData[i].overdueTimes)
                    // eslint-disable-next-line eqeqeq
                    || (Math.floor(this.state.submitData[i].overdueMoney) != this.state.submitData[i].overdueMoney)) {
                    message.error('发放金额(元)或当前逾期数(次)或当前逾金额(元)不为整数');
                    return;
                }
                const regexp = new RegExp(/^([1][7-9][0-9][0-9]|[2][0][0-9][0-9])(\-)([0][1-9]|[1][0-2])(\-)([0-2][1-9]|[3][0-1]|[1-2][0])$/i);
                if(this.state.submitData[i].startTime.trim() === '点击输入' 
                    || this.state.submitData[i].startTime.trim() === ''){
                    message.error('开始时间不得为空');
                    return;
                }
                if (!regexp.test(this.state.submitData[i].startTime.trim())){
                    message.error('请输入正确的开始时间，时间格式入：2019-01-01（‘-’是英文字符）');
                    return;
                }
                if(this.state.submitData[i].endTime.trim() === '点击输入' 
                || this.state.submitData[i].endTime.trim() === ''){
                    message.error('到期时间不得为空');
                    return;
                }
                if (!regexp.test(this.state.submitData[i].endTime.trim())){
                    message.error('请输入正确的到期时间，时间格式入：2019-01-01（‘-’是英文字符）');
                    return;
                }
            }

            this.add('/api/base/company-loans/add', '/api/base/company-loans/list');
        } else if (this.props.type === 'companyAsset'){
            if(!this.props.companyReportId){
                message.error("未保存公司报告基本信息");
                return;
            }
            
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.state.submitData.length; i++) {
                if ((Math.floor(this.state.submitData[i].money) != this.state.submitData[i].money)) {
                    message.error('估值/元不为整数');
                    return;
                }
                if(this.state.submitData[i].type.trim() === '点击输入' 
                    || this.state.submitData[i].type.trim() === ''){
                    message.error('资产类型不得为空');
                    return;
                }
                if(this.state.submitData[i].name.trim() === '点击输入' 
                    || this.state.submitData[i].name.trim() === ''){
                    message.error('资产名称不得为空');
                    return;
                }
                if(this.state.submitData[i].state.trim() === '点击输入' 
                    || this.state.submitData[i].state.trim() === ''){
                    message.error('描述不得为空');
                    return;
                }
                if(this.state.submitData[i].position.trim() === '点击输入' 
                    || this.state.submitData[i].position.trim() === ''){
                    message.error('位置不得为空');
                    return;
                }
            }
            this.add('/api/base/company-asset/add', '/api/base/company-asset/list');
        } else if (this.props.type === 'companyDebt'){

            if(!this.props.companyReportId){
                message.error("未保存公司报告基本信息");
                return;
            }
            
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.state.submitData.length; i++) {
                // eslint-disable-next-line eqeqeq
                if ((Math.floor(this.state.submitData[i].money) != this.state.submitData[i].money)) {
                    message.error('负债不为整数');
                    return;
                }
                if(this.state.submitData[i].name.trim() === '点击输入' 
                    || this.state.submitData[i].name.trim() === ''){
                    message.error('债权方不得为空');
                    return;
                }
                const regexp = new RegExp(/^([1][7-9][0-9][0-9]|[2][0][0-9][0-9])(-)([0][1-9]|[1][0-2])(-)([0-2][1-9]|[3][0-1]|[1-2][0])$/i);
                if(this.state.submitData[i].startTime.trim() === '点击输入' 
                    || this.state.submitData[i].startTime.trim() === ''){
                    message.error('开始时间不得为空');
                    return;
                }
                if (!regexp.test(this.state.submitData[i].startTime.trim())){
                    message.error('请输入正确的开始时间，时间格式入：2019-01-01（‘-’是英文字符）');
                    return;
                }
                if(this.state.submitData[i].endTime.trim() === '点击输入' 
                || this.state.submitData[i].endTime.trim() === ''){
                    message.error('到期时间不得为空');
                    return;
                }
                if (!regexp.test(this.state.submitData[i].endTime.trim())){
                    message.error('请输入正确的到期时间，时间格式入：2019-01-01（‘-’是英文字符）');
                    return;
                }
            }

            this.add('/api/base/company-debt/add', '/api/base/company-debt/list');
        } else if (this.props.type === 'companyOverdue'){
            if(!this.props.companyReportId){
                message.error("未保存公司报告基本信息");
                return;
            }
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.state.submitData.length; i++) {
                // eslint-disable-next-line eqeqeq
                if ((Math.floor(this.state.submitData[i].companyLoansId) != this.state.submitData[i].companyLoansId)
                    // eslint-disable-next-line eqeqeq
                    || (Math.floor(this.state.submitData[i].overdueTimes) != this.state.submitData[i].overdueTimes)
                    // eslint-disable-next-line eqeqeq
                    || (Math.floor(this.state.submitData[i].overdueMoney) != this.state.submitData[i].overdueMoney)
                ) {
                    message.error('贷款编号或连续逾期月数或逾期金额不为整数');
                    return;
                }
                const regexp = new RegExp(/^([1][7-9][0-9][0-9]|[2][0][0-9][0-9])(-)([0][1-9]|[1][0-2])$/i);
                if(!regexp.test(this.state.submitData[i].month.trim())){
                    message.error('逾期月份格式不正确，正确格式如"2020-01",(-是英文字符)');
                    return;
                }
                if(this.state.submitData[i].lendUnit.trim() === '点击输入' || this.state.submitData[i].lendUnit.trim() ===''){
                    message.error('放款单位不得为空');
                    return;
                }
            }
            this.add('/api/base/company-overdue/add', '/api/base/company-overdue/list');
        } else if (this.props.type === 'companyJudicatureInfo'){
            if(!this.props.companyReportId){
                message.error("未保存公司报告基本信息");
                return;
            }
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.state.submitData.length; i++) {
                if(this.state.submitData[i].type.trim() === '点击输入' 
                    || this.state.submitData[i].type.trim() === ''){
                    message.error('事件类型不得为空');
                    return;
                }

                if(this.state.submitData[i].state.trim() === '点击输入' 
                    || this.state.submitData[i].state.trim() === ''){
                    message.error('描述不得为空');
                    return;
                }
                const regexp = new RegExp(/^([\u662f|\u5426])$/i);
                if(this.state.submitData[i].isOver.trim() === '点击输入' 
                    || this.state.submitData[i].isOver.trim() === ''){
                    message.error('是否结束不得为空');
                    return;
                }
                if(!regexp.test(this.state.submitData[i].isOver.trim())){
                    message.error('是否结束只能填是或否');
                }
            }
            this.add('/api/base/company-judicature-info/add', '/api/base/company-judicature-info/list');
        }else if (this.props.type === 'companyTopManager'){
            if(!this.props.companyReportId){
                message.error("未保存公司报告基本信息");
                return;
            }
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.state.submitData.length; i++) {
                if(this.state.submitData[i].job.trim() === '点击输入' 
                    || this.state.submitData[i].job.trim() === ''){
                    message.error('职务不得为空');
                    return;
                }

                if(this.state.submitData[i].name.trim() === '点击输入' 
                    || this.state.submitData[i].name.trim() === ''){
                    message.error('姓名不得为空');
                    return;
                }
                
                if(this.state.submitData[i].idNum.trim() === '点击输入' 
                    || this.state.submitData[i].idNum.trim() === ''){
                    message.error('身份证号码不得为空');
                    return;
                }                
            }
            this.add('/api/base/company-top-manager/add', '/api/base/company-top-manager/list');
        }else if (this.props.type === 'companyRelation'){
            if(!this.props.companyReportId){
                message.error("未保存公司报告基本信息");
                return;
            }
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.state.submitData.length; i++) {
                if(this.state.submitData[i].name.trim() === '点击输入' 
                    || this.state.submitData[i].name.trim() === ''){
                    message.error('公司名称不得为空');
                    return;
                }

                if(this.state.submitData[i].companyCode.trim() === '点击输入' 
                    || this.state.submitData[i].companyCode.trim() === ''){
                    message.error('中征码不得为空');
                    return;
                }
                if(this.state.submitData[i].relation.trim() === '点击输入' 
                    || this.state.submitData[i].relation.trim() === ''){
                    message.error('关系不得为空');
                    return;
                }
                
            }
            this.add('/api/base/company-relation/add', '/api/base/company-relation/list');
        }
    };


    list = (url, customerId, customerReportId,companyId,companyReportId) => {
        request.get(url, {
            params: {
                userId: localStorage.getItem("userId"),
                customerId,
                customerReportId,
                companyId,
                companyReportId,
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(res => {
            if (res.code === '0000') {
                const list = res.data;
                if(list.length > 0){
                    list.map(v => {
                        // eslint-disable-next-line no-param-reassign
                        v.key = v.id
                        return v
                    })
                    this.setState({
                        dataSource: list,
                        count: list?list[list.length-1].key+1:1
                    })
                }else{
                    this.setState({
                        dataSource: [],
                        count: 0
                    })
                }
                
            } else {
                message.error(res.data);
            }
        })
    }


    /**
     * 添加贷款记录
     */
    add = (add, list) => {

        request.post(add, {
            data: {
                list: this.state.submitData,
                userId: localStorage.getItem("userId"),
                customerId: this.props.customerId,
                companyId: this.props.companyId,
                companyReportId: this.props.companyReportId,
                customerReportId: this.props.customerReportId,
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(res => {
            if (res.code === '0000') {
                message.info(res.data);
                this.list(list, this.props.customerId, this.props.customerReportId, this.props.companyId, this.props.companyReportId);
                this.setState({
                    submitData: [],
                    // eslint-disable-next-line react/no-unused-state
                    isSubmit: true
                })
            } else {
                message.error(res.data);
            }
        })
    }



    render() {
        const { dataSource } = this.state;
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div>
                <Button
                    onClick={this.handleAdd}
                    type="primary"
                    style={{
                        marginBottom: 16,
                    }}
                    disabled = {this.props.modalType === "look"}
                >
                    添加数据
                </Button>
                <Button
                    onClick={this.submit}
                    type="primary"
                    style={{
                        marginBottom: 16,
                        marginLeft: 8,
                    }}
                    disabled = {this.props.modalType === "look"}
                >
                    提交数据
                </Button>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    modalType = {this.props.modalType}
                />
            </div>
        );
    }
}

// ReactDOM.render(<EditableTable />, mountNode);
export default EditableTable;




/* eslint-disable react/react-in-jsx-scope */
import React, { useState ,useEffect} from 'react';
import { Select,message } from 'antd';
import request from '@/utils/request';

const SelectItem = (props) => {


  const [options, setOptions] = useState([]);
  const [defaultValue, setDefaultValue] = useState(String);
  
  const getOptions = () =>{
    if(props.url === '/api/relation'){
      const relation = [
        {
          id: 1,
          name: '配偶'
        },
        {
          id: 2,
          name: '父亲'
        },
        {
          id: 3, 
          name: '母亲'
        },
        {
          id: 4, 
          name: '兄弟姐妹'
        },
        {
          id: 5, 
          name: '其他亲戚'
        },
        {
          id: 6, 
          name: '朋友'
        },
      ]
      setOptions(relation);
    }else if(props.url === '/api/base/staff/status'){
      const status = [
        {
          id: 1,
          name: '正式员工'
        },
        {
          id: 2,
          name: '试用期'
        },
        {
          id: 3, 
          name: '离职'
        },
      ]
      setOptions(status);
    }else{
      request.get(props.url,{
        params: {userId:localStorage.getItem('userId')},
        headers:{
       'Content-Type': 'application/json',
       'Accept': 'application/json',
       }
     }).then(res =>{ 
       if(res.code === '0000'){
         setOptions(res.data)
       }else{
         message.error('获取数据失败！');
       }
       
     })
    }
    
    
  }

  useEffect(() => {
    getOptions()
    
  }, [props.placeholder])

  function onChange(value) {
    console.log(`selected ${value}`);
  }
  
  function onBlur() {
    console.log('blur');
  }
  
  function onFocus() {
    console.log('focus');
  }
  
  function onSearch(val) {
    console.log('search:', val);
  }

  const toParent =(value) =>{
    props.toParent(value);
  }

  return(
    <div>
      <Select
        showSearch
        placeholder={props.placeholder}
        optionFilterProp="children"
        // eslint-disable-next-line react/jsx-no-bind
        onChange={ toParent.bind(this) }
        onFocus={onFocus}
        onBlur={onBlur}
        onSearch={onSearch}
        filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        defaultValue = {props.defaultValue}
        
      >
        <Select.Option   key='0' value='0' disabled={props.optionDisabled}>请选择</Select.Option>
      {options.map(v => {
        return (
          <Select.Option   key={v.id} value={v.id}>{v.name}</Select.Option>
        );
      })}
      
    </Select>
  </div>
  );
};
export default  SelectItem;

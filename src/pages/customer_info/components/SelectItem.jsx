/* eslint-disable react/react-in-jsx-scope */
import React, { useState ,useEffect} from 'react';
import { Select,message } from 'antd';
import request from '@/utils/request';

const SelectItem = (props) => {


  const [options, setOptions] = useState([]);

  
  const getOptions = () =>{
    if(props.url === '/api/ismarried'){
      const ismarried = [
        {
          id: 1,
          name: '未婚'
        },
        {
          id: 2,
          name: '已婚'
        },
        {
          id: 3, // 正式环境不展示
          name: '离异'
        },
      ]
      setOptions(ismarried);
    }else if(props.url === '/api/base/customer/status'){
      const status = [
        {
          id: 1,
          name: '正常'
        },
        {
          id: 2,
          name: '暂停服务'
        },
        {
          id: 4, // 正式环境不展示
          name: '删除'
        },
      ]
      setOptions(status);
    }else{
      request.get(props.url,{
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
    if(props.url !== '/api/base/companyShare/getByCompany' && props.url !== '/api/base/company/getByCustomerId'){
      getOptions()
    }
  }, [props.placeholder])

  function onChange(value) {
    console.log(`selected ${value}`);
  }
  
  function onBlur() {
    console.log('blur');
  }
  
  function onFocus() {
    console.log('focus');
    if(props.url === '/api/base/companyShare/getByCompany'){
      request.get(props.url,{
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }).then(res => {
        if(res.code === '0000'){
          setOptions(res.data)
        }else{
          message.error('获取数据失败！');
        }
      });
      
    }else if(props.url === '/api/base/company/getByCustomerId'){
      request.get(props.url, {
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }   
      }).then(res => {
        if(res.code === '0000'){
          setOptions(res.data)
        }else{
          message.error('获取数据失败！');
        }
      });
    }
  }
  
  function onSearch(val) {
    console.log('search:', val);
  }

  return(
    <div>
      <Select
        showSearch
        placeholder={props.placeholder}
        optionFilterProp="children"
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onSearch={onSearch}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
      {options.map(v => {
        return (<Select.Option   key={v.id} value={v.id}>{v.name}</Select.Option>);
      })}
      
    </Select>
  </div>
  );
};
export default  SelectItem;

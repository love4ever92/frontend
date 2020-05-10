/* eslint-disable react/react-in-jsx-scope */
import React, { useState ,useEffect} from 'react';
import { Select,message } from 'antd';
import request from '@/utils/request';

const SelectItem = (props) => {


  const [options, setOptions] = useState([]);
  const getOptions = () =>{
    if(props.url === '/api/base/address/area/'){
      // eslint-disable-next-line no-useless-return
      if(!props.city) return;
    }else if(props.url === '/api/base/address/city/'){
      // eslint-disable-next-line no-useless-return
      if(!props.province) return;
    }else if(props.url === '/api/base/address/province/'){
      request.get(props.url,{
        headers: {
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
    }else if( props.url === '/api/base/customer/isMarried'){
      const isMarried = [
        {
          id: 1,
          name: '未婚'
        },
        {
          id: 2,
          name: '已婚'
        },
        {
          id: 3, 
          name: '离异'
        },
      ]
      setOptions(isMarried);
    }else if( props.url === '/api/base/customer/status' ){
      const status = [
        {
          id: 1,
          name: '正常'
        },
        {
          id: 2,
          name: '禁用'
        },
      ]
      setOptions(status);
    }else if( props.url === '/api/base/company/list' ){
      request.get(props.url,{
        params: {
          userId: localStorage.getItem('userId')
        }, 
        headers: {
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
    }else{
      request.get(props.url,{
        params: {
          userId: localStorage.getItem('userId')
        },
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

  
  function onBlur() {
    console.log('blur');
  }
  
  function onFocus(val) {
    console.log('focus');
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
        onChange={props.onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        province={props.province}
        city={props.city}
        onSearch={onSearch}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Select.Option  disabled={props.disabledOption} key='0' value='0'>不选择</Select.Option>
      {options.map(v => {
        return (<Select.Option   key={v.id} value={ v.code? v.name:v.id }>{v.name}</Select.Option>);
      })}
      
    </Select>
  </div>
  );
};
export default  SelectItem;

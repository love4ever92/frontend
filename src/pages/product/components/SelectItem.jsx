/* eslint-disable react/react-in-jsx-scope */
import React, { useState ,useEffect} from 'react';
import { Select,message } from 'antd';
import request from '@/utils/request';

const SelectItem = (props) => {


  const [options, setOptions] = useState([]);

  
  const getOptions = () =>{
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

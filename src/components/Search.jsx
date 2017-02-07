import { Select } from 'antd';
import React, { Component } from 'react';  
import fetch from 'isomorphic-fetch'
import { Link ,browserHistory } from 'react-router'; 

const Option = Select.Option;

let timeout;
let currentValue;

function _fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  function fake() { 
    fetch('/v1/songtitles', {
        method: 'post',
        credentials: 'include', //配置cookie来获取session
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: value, 
        })
    }).then(function(response) {
        return response.json()
    }).then(function(json) {
        if (!json.success) {
          alert(json.error)
        } else {  
          console.log(json.data.list)
          callback(json.data.list)
        }
    }).catch(function(err) {
        console.log(err)
    })  
  }

  timeout = setTimeout(fake, 300);
}

const SearchInput = React.createClass({
  getInitialState() {
    return {
      data: [],
      value: '',
    };
  },
  handleChange(value) { //这里会报一个 切换组件后渲染的报错 
    this.setState({ value });
    _fetch(value, data => { 
      this.setState({ data })
    });
  },
  handleSelect(value) { 
    browserHistory.push('/list/search'+ value )
  },
  render() { 
    var optionValuesMap = {}
    const options = this.state.data
      .filter(d => !optionValuesMap[d.title] && (optionValuesMap[d.title]=true))
      .map(d => <Option  key={d._id} value={d.title}>{d.title}</Option>);
    return (
      <Select
        combobox
        value={this.state.value}
        placeholder={this.props.placeholder}
        notFoundContent=""
        style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        onBlur={this.handleSelect}
      >
        {options}
      </Select>
    );
  },
});

export default  SearchInput
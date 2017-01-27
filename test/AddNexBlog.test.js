import React from 'react';               
import { RootAddNewBlog } from '../src/containers/AddNewBlog.js';  // import our soon to be component 
import { bindActionCreators } from 'redux'  
import { shallow, mount, render } from 'enzyme';
import chai from 'chai'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
const sinon = require('sinon/pkg/sinon');    
const expect = chai.expect  
const should = chai.should()

describe('AddNewBlog', () => {
  let _props, _spies, _wrapper 
  let innerblog = {
      title:"",
      content:"hello",
      date:"",
      to:"",
      comment:[ 
      ],
      pid:1
  }
  let lastpid = 1 ;
  let params = {
    pid : 1
  } 
  beforeEach(() => {
    _spies = {}
    _props = {
      lastpid,
      params,
      innerblog,
      ...bindActionCreators({
        handleaddblogAction: (_spies.addblogAction = sinon.spy()),
        handledelblogAction: (_spies.delblogAction = sinon.spy())
      }, _spies.dispatch = sinon.spy())
    }
    _wrapper = shallow(<RootAddNewBlog {..._props} />)

  })

  it('Should render as a <div>.', () => {
    expect(_wrapper.is('div')).to.equal(true)
  })
 
  it('Should call addBlog.', () => { 
    _spies.addblogAction.should.have.not.been.called   
    _wrapper.find('.btn').at(0).simulate('click')
    _spies.dispatch.should.have.been.called
  })

  it('Should call delBlog.', () => { 
    _spies.delblogAction.should.have.not.been.called    
    _wrapper.find('.btn').at(1).simulate('click')
    _spies.dispatch.should.have.been.called
  })

})
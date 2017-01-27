import React from 'react';               
import { RootInnerBlog } from '../src/containers/InnerBlog.js';  // import our soon to be component 
import { bindActionCreators } from 'redux'  
import { shallow, mount, render } from 'enzyme';
import chai from 'chai'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
const sinon = require('sinon/pkg/sinon');    
const expect = chai.expect  
const should = chai.should()

describe('InnerBlog', () => {
  let _props, _spies, _wrapper 
  let innerblog = {
      title:"",
      content:"hello",
      date:"",
      to:"",
      comment:[ 
      ],
      pid:""
  }
  let params = {
    pid : 0
  }  
  beforeEach(() => {
    _spies = {}
    _props = {
      params,
      innerblog,
      ...bindActionCreators({
        getBlog: (_spies.getinnerblogAction = sinon.spy())
      }, _spies.dispatch = sinon.spy())
    }
    _wrapper = shallow(<RootInnerBlog {..._props} />)

  })

  it('Should render as a <div>.', () => {
    expect(_wrapper.is('div')).to.equal(true)
  })
 
  it('Should call patchList.', () => { 
    _spies.getinnerblogAction.should.have.been.called 
    _spies.dispatch.should.have.been.called
  })

})
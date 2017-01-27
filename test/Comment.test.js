import React from 'react';               
import { RootComment } from '../src/components/Comment.js';  // import our soon to be component 
import { bindActionCreators } from 'redux'  
import { shallow, mount, render } from 'enzyme';
import chai from 'chai'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
const sinon = require('sinon/pkg/sinon');    
const expect = chai.expect  
const should = chai.should()

describe('Comment', () => {
  let _props, _spies, _wrapper
  let innerblog = {
      title:"",
      content:"",
      date:"",
      to:"",
      comment:[ 
      ],
      pid:""
  }
 
  beforeEach(() => {
    _spies = {}
    _props = {
      innerblog,
      ...bindActionCreators({
        pushComment: (_spies.pushCommentAction = sinon.spy())
      }, _spies.dispatch = sinon.spy())
    }
    _wrapper = shallow(<RootComment {..._props} />)

  })

  it('Should render as a <div>.', () => {
    expect(_wrapper.is('div')).to.equal(true)
  })

  
  it('Should call pushComment.', () => { 
    _spies.pushCommentAction.should.have.not.been.called
    _wrapper.find('.btn').simulate('click')
    _spies.dispatch.should.have.been.called
    
  })

})
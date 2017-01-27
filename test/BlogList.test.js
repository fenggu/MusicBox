import React from 'react';               
import { RootBlogList } from '../src/components/BlogList.js';  // import our soon to be component 
import { bindActionCreators } from 'redux'  
import { shallow, mount, render } from 'enzyme';
import chai from 'chai'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
const sinon = require('sinon/pkg/sinon');    
const expect = chai.expect  
const should = chai.should()

describe('BlogList', () => {
  let _props, _spies, _wrapper
  let bloglist = { 
      page: 0,
      maxpage: 2,
      data: [   
      ] 
  }
 
  beforeEach(() => {
    _spies = {}
    _props = {
      bloglist,
      ...bindActionCreators({
        patchList: (_spies.getlistAction = sinon.spy())
      }, _spies.dispatch = sinon.spy())
    }
    _wrapper = shallow(<RootBlogList {..._props} />)

  })

  it('Should render as a <div>.', () => {
    expect(_wrapper.is('div')).to.equal(true)
  })
 
  it('Should call patchList.', () => { 
    _spies.getlistAction.should.have.been.called 
    _spies.dispatch.should.have.been.called
  })

})
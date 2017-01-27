import React from 'react';               
import { RootBurster } from '../src/components/Burster.js';  // import our soon to be component 
import { bindActionCreators } from 'redux'  
import { shallow, mount, render } from 'enzyme';
import chai from 'chai'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
const sinon = require('sinon/pkg/sinon');    
const expect = chai.expect  
const should = chai.should()

describe('Burster', () => {
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
    _wrapper = shallow(<RootBurster {..._props} />)

  })

  it('Should render as a <div>.', () => {
    expect(_wrapper.is('div')).to.equal(true)
  })

  
  it('Should has three children.', () => {
    expect(_wrapper.find("i")).to.have.length(3)
  })

  it('Should call patchList.', () => { 
    _spies.getlistAction.should.have.not.been.called
    _wrapper.find('i').at(2).simulate('click')
    _spies.dispatch.should.have.been.called
    
  })

})
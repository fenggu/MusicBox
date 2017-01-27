import React from 'react';               
import { shallow, mount, render } from 'enzyme';
import { expect } from 'chai';    
import { TopBar } from '../src/components';  // import our soon to be component
describe('TopBar Shallow', function () {
  it('TopBar\'s title should be Blog', function () {
    let app = shallow(<TopBar/>);
    expect(app.find('h1').text()).to.equal('Blog');
  });
});
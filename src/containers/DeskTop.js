import React, { Component, Children } from 'react';
import { TopBar, Player } from '../components';

class DeskTop extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.params) {
            var pid = this.props.params.pid 
        }
        return (
            <div> 
              { this.props.children }
            <Player />
            </div>
      );
    }
}

export default DeskTop;

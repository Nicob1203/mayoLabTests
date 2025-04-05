import React, { Component } from 'react';
import Stimulus from './Stimulus';

class Trial extends Component {

  constructor(props) {
    super(props);
    this.state = {
      height: props.height,
      width: props.width,
    };
  }

  // main rendering function:
  render() {
    let self = this
    return <Stimulus
      width={this.state.width}
      height={this.state.height}
      w={self.state.width * 0.6}
      h={self.state.height * 0.6}
      min_w={self.state.width * 0.1}
      min_h={self.state.height * 0.1}
      opacity={1.0}
      min_op={0.1}
      onFinalized={function(data) {
        self.props.onFinalized(data);
      }}
    />
  }
}

export default Trial;
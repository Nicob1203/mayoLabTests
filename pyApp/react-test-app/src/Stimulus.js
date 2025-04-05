import React, { Component } from 'react';
import Rectangle from './Rectangle';
import Utils from './Utils';

class Stimulus extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: props.width,
      height: props.height,
      color: 'white',
      isFinalized: false,
      timestamp: 0,
    };

    this.finalize = this.finalize.bind(this);
    //this.rectangleRef = null;
  }

  finalize() {
    if(!this.state.isFinalized) {

      let timestamp = Utils.getTimeStamp();

      let data = {timestamp: timestamp,
                  timegap: timestamp - this.state.timestamp,
                };

      this.setState(prevState => ({
        color: 'Black',
        isFinalized: true,
        timestamp: timestamp,
      }));
      
      this.props.onFinalized(data);
    }
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
    //document.removeEventListener("click", this.handleDocumentClick);
  }

  componentDidMount() {
    this.tsStartTrial = Utils.getTimeStamp();
    //document.addEventListener("click", this.handleDocumentClick);
  }

  // if component is re-generated, this is called rather than the constructor:
  componentWillReceiveProps(props) {
    this.setState(prevState => ({
      color: 'white',
      isFinalized: false,
      timestamp: prevState.timestamp,
    }));
  }

  render() {
    let self = this;
    return (
      <svg width={this.props.width} height={this.props.height}>
        <Rectangle
          x={0}
          y={0}
          width={this.state.width}
          height={this.state.height}
          color={this.state.color}
          onClick={function() {
            self.finalize();
          }}
          onTouchStart={function() {
            self.finalize();
          }}
        />
      </svg>
    );
  }
}

export default Stimulus;

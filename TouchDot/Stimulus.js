import React, { Component } from 'react';
import Circle from '../../generic/Circle';
import Utils from '../../generic/Utils';

class Stimulus extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: props.width,
      height: props.height,
      r: props.r,
      color: "white",
      isFinalized: false,
      isInside: false,
      timestamp: 0, //setting initial timestamp to 0 when
      misclicks: 0,

    };
    //tells us whether the next circle should be in the center or not
    this.wrapperRef = React.createRef();
    this.finalize = this.finalize.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }


  finalize(isInside) {

    if(!this.isFinalized) {
      let tsResponse = Utils.getTimeStamp();
      if(isInside) {
        this.setState(prevState => ({
          color: 'Black',
          isFinalized: true,
          isInside: isInside,
        }));

        let data = {
          misclicks: this.state.misclicks,
          tsResponse: tsResponse,
          tsStart: this.tsStartTrial,
          rt: tsResponse - this.tsStartTrial,
        };

        this.props.onFinalized(data);
        
      }
      else {
        this.setState(prevState => ({
          misclicks: prevState.misclicks + 1,
          isInside: isInside,
        }));

      }
    }
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
    document.removeEventListener("click", this.handleDocumentClick);
  }

  componentDidMount() {
    this.tsStartTrial = Utils.getTimeStamp();
    document.addEventListener("click", this.handleDocumentClick, true);
  }

  // if component is re-generated, this is called rather than the constructor:
  componentWillReceiveProps(props) {
    this.setState(prevState => ({
      color: "white",
      isFinalized: false,
      misclicks: 0, //may not be necessary but this should ensure that the timestamp is the same as the prev
    }));
  }

  handleDocumentClick = (event) => {
    let isInside = this.state.isInside;

    event.preventDefault();
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      isInside = false;
    } else {
      isInside = true;
    }

    this.finalize(isInside);
  };

  render() {
    let self = this
    return (
      <svg width={this.props.width} height={this.props.height}>
        <Circle
          setRef={this.wrapperRef}
          centerx={this.state.width * 0.5}
          centery={this.state.height * 0.5}
          radius={this.state.r}
          color={this.state.color}
        />
      </svg>
    );
  }
}

export default Stimulus;

import React, { Component } from 'react';
import Rectangle from '../../generic/Rectangle';
import Utils from '../../generic/Utils';

class Stimulus extends Component {

  constructor(props) {
    super(props);
    this.state = {
      xoffset: 0,
      yoffset: 0,
      width: props.width,
      height: props.height,
      w: props.w,
      h: props.h,
      color: 'white',
      opacity: props.opacity,
      isFinalized: false,
      isInside: false,
      center: true,
      location: [0,1,2,3,4,5,6,7],
      misclicks: 0,
    };

    this.wrapperRef = React.createRef();
    this.finalize = this.finalize.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  finalize(isInside) {
    if(!this.isFinalized) {

      let new_center = this.state.center;
      let tsResponse = Utils.getTimeStamp();

      if(isInside) {
        if(this.state.center) {
          new_center = false
        } else {
          new_center = true
        }

        this.setState(prevState => ({
          color: 'Black',
          isFinalized: true,
          center: new_center,
          isInside: isInside,
        }));

        let data = {
          misclicks: this.state.misclicks,
          tsResponse: tsResponse,
          tsStart: this.tsStartTrial,
          rt: tsResponse - this.tsStartTrial,
          xposAbs: (this.state.width / 2 + this.state.xoffset), // FIXME
          yposAbs: (this.state.height / 2 + this.state.yoffset), // FIXME
          xposRel: (this.state.xoffset),
          yposRel: (this.state.yoffset)
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
    let x_offset = this.state.xoffset;
    let y_offset = this.state.yoffset;
    let location = this.state.location;
    let opacity = this.state.opacity;
    let w = this.state.w;
    let h = this.state.h;


    if(this.state.isInside) {
      this.tsStartTrial = Utils.getTimeStamp();
      //set range based on what the next radius is gonna be...
      w = Math.max(w * 0.85, this.props.min_w);
      h = Math.max(h * 0.85, this.props.min_h);

      opacity = Math.max(opacity - 0.1, this.props.min_op);

      //dynamically changing the range to take into account the new borders as the radius gets smaller
      let range_x = 0.5 - (w / (2*this.props.width));
      let range_y = 0.5 - (h / (2*this.props.height));

      x_offset = 0;
      y_offset = 0;
      
      if(!this.state.center) {
        //getting a random item from the list of potential items
        if(location.length === 0){
          location = [0,1,2,3,4,5,6,7];
        }
        const randomElement = location[Math.floor(Math.random() * location.length)];
        location = location.filter(function(item) {
          return item !== randomElement
        });
        
        if(randomElement === 0 || randomElement === 4) {
          x_offset = 0; //top bottom
        } else if (randomElement === 1 || randomElement === 3 || randomElement === 2) {
          x_offset = this.props.width * range_x; //right and right corners
        } else {
          x_offset = this.props.width * -range_x //left and left corners
        }

        if(randomElement === 0 || randomElement === 1 || randomElement === 7) {
          y_offset = this.props.height * range_y; //top and top corners
        } else if (randomElement === 2 || randomElement === 6) {
          y_offset = 0; //left right
        } else {
          y_offset = this.props.height * -range_y; //bottom and bottom corners 
        }
      };

    }
    this.setState(prevState => ({
      xoffset: x_offset,//Utils.getRandomInt(this.props.width * -range_x, this.props.width * range_x),
      yoffset: y_offset,//Utils.getRandomInt(this.props.height * -range_y, this.props.height * range_y),
      color: 'white',
      isFinalized: false,
      w: w,
      h: h,
      opacity: opacity,
      location: location,
      misclicks: 0,
    }));
  };



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
    let self = this;
    return (
      <svg width={this.props.width} height={this.props.height}>
        <Rectangle
          setRef={this.wrapperRef}
          x={(this.state.width / 2) - (this.state.w/2) + this.state.xoffset}
          y={(this.state.height / 2) - (this.state.h/2)+ this.state.yoffset}
          width={this.state.w}
          height={this.state.h}
          color={this.state.color}
          opacity={this.state.opacity}
        />
      </svg>
    );
  }
}

export default Stimulus;
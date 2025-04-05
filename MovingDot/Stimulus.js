import React, { Component } from 'react';
import Circle from '../../generic/Circle';
import Utils from '../../generic/Utils';

class Stimulus extends Component {

  constructor(props) {
    super(props);
    this.state = {
      xoffset: 0,
      yoffset: 0,
      width: props.width,
      height: props.height,
      r: props.r,
      color: 'white',
      opacity: props.opacity,
      isFinalized: false,
      isInside: false,
      center: true,
      location: [0,1,2,3,4,5,6,7],
      misclicks: 0,
    };
    //stores locations we can go to when not going to the center
    
    //tells us whether the next circle should be in the center or not
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
          new_center = false;
        } else {
          new_center = true;
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
    this.tsStartTrial = Utils.getTimeStamp(); // only used for first trial
    document.addEventListener("click", this.handleDocumentClick, true);
    
  }

  // if component is re-generated, this is called rather than the constructor:
  componentWillReceiveProps(props) {

    let x_offset = this.state.xoffset;
    let y_offset = this.state.yoffset;
    let r = this.state.r;
    let opacity = this.state.opacity;
    let location = this.state.location;

    if(this.state.isInside) {
      this.tsStartTrial = Utils.getTimeStamp();
      //set new r since we had a successful click
      r = Math.max(r * 0.85, this.props.minr);

      //set new opacity since we have a successful click
      opacity = Math.max(opacity - 0.1, this.props.min_op)

      //dynamically changing the range to take into account the new borders as the radius gets smaller
      let range_x = 0.5 - (r / this.props.width);
      let range_y = 0.5 - (r / this.props.height);

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
      xoffset: x_offset, //Utils.getRandomInt(this.props.width * -range_x, this.props.width * range_x),
      yoffset: y_offset,//Utils.getRandomInt(this.props.height * -range_y, this.props.height * range_y),
      color: 'white',
      isFinalized: false,
      r: r,
      opacity: opacity,
      location: location,
      misclicks: 0,
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
    let self = this;
    return (
      <svg width={this.props.width} height={this.props.height}>
        <Circle
          setRef={this.wrapperRef}
          centerx={this.state.width / 2 + this.state.xoffset} // FIXME also on line 29
          centery={this.state.height / 2 + this.state.yoffset} // FIXME also on line 30
          radius={this.state.r}
          color={this.state.color}
          opacity={this.state.opacity}
        />
      </svg>
    );
  }
}

export default Stimulus;

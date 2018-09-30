import React, { Component } from 'react';

const white = {
  transparent: 'rgba(255, 255, 255, 0.0)',
  opaque: 'rgb(255, 255, 255)',
};

const black = {
  transparent: 'rgba(0, 0, 0, 0)',
  opaque: 'rgb(0, 0, 0)',
};

const Circle = ({size, color, style}) => {
  const palette = color === 'black' ? black : white;

  return <div style={{
      backgroundImage: `radial-gradient(at 100px 100px, ${palette.opaque} 50%, ${palette.transparent} 70%, white )`,
      borderRadius: 100,
      width: 200,
      height: 200,
      transform: `scale(${size/200}, ${size/200})`,
      transition: 'transform 2s',
      ...style,
  }}/>
};

class EnlargingCircle extends Component {
  state = {
    size: this.props.initialSize,
  };

  static defaultProps = {
    offsetX: 0,
    offsetY: 0,
  };

  componentDidMount() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.setState({
          size: this.props.finalSize,
        });
      });
    });
  }

  render() {
    return <div style={{
        position: 'fixed',
        left: `calc(50% - ${this.props.offsetX}px)`,
        top: `calc(50% - ${this.props.offsetY}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: this.props.zIndex,
    }}>
        <Circle size={this.state.size} color={this.props.color}/>
  </div>
  }
}

const BlackRing = (props) => <EnlargingCircle initialSize={20} finalSize={1200} color="black" {...props}/>;
const WhiteRing = (props) => <EnlargingCircle initialSize={20} finalSize={1200} color="white" {...props}/>;

class App extends Component {
  state = {
    rings: [{
      index: 0,
      color: 'white',
    }],
  };

  componentDidMount() {
    let ringID = 0;
    const doLoop = () => {
      setTimeout(() => {
        this.setState(({rings}) => {
          const newRings = rings.length > 10 ? rings.slice(1) : rings.slice();
          ++ringID;
          newRings.push({
            color: ringID % 2 === 0 ? 'black' : 'white',
            index: ringID,
            offsetX: (Math.random() * 500) - 250,
            offsetY: (Math.random() * 500) - 250,
          });

          return { rings: newRings };
        });
        doLoop();
      }, 200);
    }
    doLoop();
  }

  render() {
    return (
      <div id='app'>
        <div style={{
          backgroundColor: 'black',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}/>
        {this.state.rings.map((ring) => {
          const RingToShow = ring.color === 'black' ? BlackRing : WhiteRing;

          return <RingToShow key={ring.index} zIndex={ring.index} offsetX={ring.offsetX} offsetY={ring.offsetY}/>;
        })}
      </div>
    );
  }
}

export default App;
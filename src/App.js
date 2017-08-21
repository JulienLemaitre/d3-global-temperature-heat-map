import React, { Component } from 'react';
import * as d3 from 'd3';
import HeatMap from './components/heat-map';
import Tooltip from './components/tooltip';
import './App.css';

const colors = ['#1e90ff','#8dacae','#b1c971','#d3e53e','#ffff00','#ffd200','#ffa300','#ff6e00','#ff0000'];

// TODO - Propose a change in the color Scale => the perception of the heat change dramaticaly !

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      showTooltip: false,
      tooltipData: null,
      colorScale: null
    };

    this.onCaseMouseOver = this.onCaseMouseOver.bind(this);
    this.onCaseMouseOut = this.onCaseMouseOut.bind(this);
  }

  componentDidMount() {
    d3.json("global-temperature.json", function (err, data) {
      if (err) {
        console.log("error:", err);
      } else {
        const d3data = data.monthlyVariance;
        const maxTemp = d3.max(d3data, d => d.variance);
        const minTemp = d3.min(d3data, d => d.variance);
        const baseTemperature = data.baseTemperature;
        // const warmVariance = maxTemp - baseTemperature;
        // const coldVariance = baseTemperature - minTemp;
        // const maxVariance = warmVariance > coldVariance ? warmVariance : coldVariance;

        let colorScale = d3.scaleThreshold()
        // .domain([
        //   baseTemperature - maxVariance,
        //   baseTemperature - ( maxVariance * 2 / 3 ),
        //   baseTemperature - ( maxVariance / 2 ),
        //   baseTemperature - ( maxVariance * 1 / 3 ),
        //   0,
        //   baseTemperature + ( maxVariance * 1 / 3 ),
        //   baseTemperature + ( maxVariance / 2 ),
        //   baseTemperature + ( maxVariance * 2 / 3 ),
        //   baseTemperature + maxVariance,
        // ])
          .domain([
            minTemp,
            minTemp + (( maxTemp - minTemp ) / 9),
            minTemp + (( maxTemp - minTemp ) / 9 * 2),
            minTemp + (( maxTemp - minTemp ) / 9 * 3),
            minTemp + (( maxTemp - minTemp ) / 9 * 4),
            minTemp + (( maxTemp - minTemp ) / 9 * 5),
            minTemp + (( maxTemp - minTemp ) / 9 * 6),
            minTemp + (( maxTemp - minTemp ) / 9 * 7),
            minTemp + (( maxTemp - minTemp ) / 9 * 8),
          ])
          .range(colors);

        this.setState({ data, colorScale });
      }
    }.bind(this));
  }

  onCaseMouseOver(e) {
    clearTimeout(this.tooltipTimer);
    this.setState({ showTooltip: true, tooltipData: e, tooltipX : d3.event.pageX, tooltipY : d3.event.pageY});
  }

  onCaseMouseOut() {
    this.tooltipTimer = setTimeout(() => {
      this.setState({ showTooltip: false });
    }, 300);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Global Temperature Heat Map</h1>
        </div>
        <div className="App-body">
          <HeatMap
            data = {this.state.data}
            onCaseMouseOver = {this.onCaseMouseOver}
            onCaseMouseOut = {this.onCaseMouseOut}
            colors = {colors}
            colorScale = {this.state.colorScale}
          />
          <Tooltip
            showTooltip = {this.state.showTooltip}
            data = {this.state.tooltipData}
            tooltipX = {this.state.tooltipX}
            tooltipY = {this.state.tooltipY}
            colors = {colors}
            colorScale = {this.state.colorScale}
          />
        </div>
      </div>
    );
  }
}

export default App;

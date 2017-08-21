import React, {Component} from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import legend from 'd3-svg-legend';

class HeatMap extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.data !== this.props.data;
  }

  render() {
    if (this.props.data) {

      const width = 1000;
      const height = 600;
      const margin = {top: 100, right: 10, bottom: 70, left: 100};
      const data = this.props.data.monthlyVariance;
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const rectWidth = 5;
      const rectHeight = (height - margin.top - margin.bottom) / 12;
      const colorScale = this.props.colorScale;

      // Scales
      const xExtent = d3.extent(data, d => d.year);

      let xScale = d3.scaleLinear()
        .domain(xExtent)
        .range([margin.left, width - margin.right]);

      let yScale = d3.scaleBand()
        .domain(months)
        .range([height - margin.bottom, margin.top]);

      // build the heat map
      let svg = d3.select(ReactFauxDOM.createElement('svg'))
        .attr('width', width)
        .attr('height', height);

      svg.selectAll('rect')
        .data(data)
        .enter().append('rect')
        .attr('x', d => xScale(d.year))
        .attr('y', d => yScale(months[d.month - 1]))
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', d => colorScale(d.variance))
        .on('mouseover', this.props.onCaseMouseOver)
        .on('mouseout', this.props.onCaseMouseOut);

      // Axis

      let xAxis = d3.axisBottom().tickFormat(d => d3.format(".0f")(d)).tickPadding(5).scale(xScale);
      let yAxis = d3.axisLeft().tickSize(0).tickPadding(10).scale(yScale);

      let xAxisG = svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, ${height - margin.bottom})`);

      xAxisG.call(xAxis);

      xAxisG.append('text')
        .attr('class','legendTitle')
        .attr('x', width / 2)
        .attr('y', 50)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .html('Years');

      let yAxisG = svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${margin.left}, 0)`);

      yAxisG.call(yAxis);

      yAxisG.append('text')
        .attr('class','legendTitle')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -70)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
        .html('Months');

      // Title
      svg.append('text')
        .attr('class','title1')
        .attr('x', width / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .style('font-size', '25px')
        .style('font-weight', 'bold')
        .html('Monthly Global Land-Surface Temperature');

      svg.append('text')
        .attr('class','title2')
        .attr('x', width / 2)
        .attr('y', 52)
        .attr('text-anchor', 'middle')
        .style('font-size', '20px')
        .style('font-weight', 'bold')
        .html('1753 - 2015');

      svg.append('text')
        .attr('class','subtitle1')
        .attr('x', width / 2)
        .attr('y', 70)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .html(`Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average.`);

      svg.append('text')
        .attr('class','subtitle1')
        .attr('x', width / 2)
        .attr('y', 85)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .html(`Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07`);

      // Legend

      // Select parent wrapper for it to work, because React-Faux-DOM didn't create the DOM elements yet
      let wrapper = d3.select('.App-body')
        .append('svg');
      wrapper.append('g')
        .attr('class', 'legend');

      const maxTemp = d3.max(data, d => d.variance);
      const minTemp = d3.min(data, d => d.variance);

      let linear = d3.scaleLinear()
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
        .range(this.props.colors);

      let myLegend = legend.legendColor()
        .shapeWidth(30)
        .cells(9)
        .labelFormat(d3.format("+.01f"))
        .orient('horizontal')
        .scale(linear);

      d3.select(".legend")
        .call(myLegend);

      return (
        <div className="chart">
          {svg.node().toReact()}
        </div>
      );
    } else {
      return (
        <div className="chart">
          Loading...
        </div>
      );
    }
  }
}

export default HeatMap;
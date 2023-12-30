import React, { useState, useEffect} from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip'
function Detail2() {
  const data = [{x:0.12, y:124}, {x:0.14, y:456}, {x:0.21, y:567}, {x: 0.36, y:463}, {x:0.88, y:87}, {x:1.1, y:903}]

   useEffect(() => {
    // tip()
    let tip = d3Tip(); // 设置tip
    tip.attr('class', 'd3-tip')
      .offset([30, 0])
      .html(function(d) {
        return (
          '<div style="color:red;">hello world</div>'
        )
      })
    const myScaleX = d3.scaleLinear().domain([0.12, 1.1]).range([0, 500]);
    const myScaleY = d3.scaleLinear().domain([0, 1000]).range([0, 400]);
    const axis = d3.axisBottom(myScaleX);
    d3.select('.axis').call(axis).selectAll('text').style('fill', '#7E8A93');
    const chart = d3.select('.chart').selectAll('line').data(data).join('line').attr('x1', function (d) {
      return myScaleX(d.x)
    })
    .attr('x2', function (d) {
      return myScaleX(d.x)
    })
    .attr('y1', 0)
    .attr('y2', function(d){
      return myScaleY(d.y)
    })
    .attr('class', 'bar')
    .attr('stroke-width', 3)
    .attr('cursor', 'pointer')
    .attr('stroke', 'green').on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    chart.call(tip)
   }, [])
  return (
    <div style={{margin: '500px'}}>
      <svg width="500" height="500" >
         <g className="chart"></g>
         <g className='axis'></g>
      </svg>

    </div>
  );
}


export default Detail2;

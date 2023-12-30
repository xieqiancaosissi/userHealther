import React, { useRef, useState, useEffect } from "react";
import * as d3 from 'd3';
import './App.css'

export default function App() {
  const [fee, setFee] = useState();
  const [amount, setAmount] = useState();
  const [position, setPosition] = useState(1);
  
  useEffect(() => {
    drawChart([1.03, 2.48]);
  },[]);
  function drawChart(arr) {
    // 创建横坐标轴
    // 1.03~1.08 柱体的宽度
    const scale = d3.scaleLinear().domain(arr || [1.03, 2.48]).range([0, 460]).nice();
    const axis = d3.axisBottom(scale).tickSize(0).tickPadding(10);
    const barWidth = scale(1.08) - scale(1.03)
    d3.select('svg .axis').call(axis).attr('transform', 'translate(20, 276)').selectAll('text').attr('fill', '#7E8A93');
    d3.select('svg .axis').select('.domain').attr('opacity', '0')
    // 创建柱体 
    const data = [{bar1: 20, bar2:2, price: 1.09}, {bar1: 30, bar2:4, price: 1.14}, {bar1: 10, bar2: 10, price: 1.19}, {bar1: 60, bar2:7, price: 1.24},{bar1: 44, bar2:9, price:1.29}, {bar1: 20, bar2:2, price: 1.34}, {bar1: 30, bar2:4, price: 1.39}, {bar1: 10, bar2:0.8, price: 1.44}, {bar1: 60, bar2:7, price: 1.49}, {bar1: 44, bar2:9, price: 1.54}, {bar1: 20, bar2:2, price: 1.59}, {bar1: 30, bar2:4, price: 1.64}, {bar1: 10, bar2: 10, price: 1.69}, {bar1: 60, bar2:7, price: 1.74}, {bar1: 20, bar2:2, price: 1.79}, {bar1: 30, bar2:4, price: 1.84}, {bar1: 10, bar2:0.8, price: 1.89}, {bar1: 60, bar2:7, price: 1.94}, {bar1: 44, bar2:9, price: 1.99}, {bar1: 20, bar2:2, price: 2.04}, {bar1: 30, bar2:4, price: 2.09}, {bar1: 10, bar2: 10, price: 2.14}, {bar1: 60, bar2:7, price: 2.19}];
    // 柱体 down 
    d3.select('svg .bars_down').attr('transform', 'translate(20, 200)').selectAll('rect').data(data).join('rect').on('mousemove', function(e, d) {
      hoverBox(e, d)
    }).on('mouseleave', function(e,d) {
      LeaveBox(e,d)
    }).transition().attr('width', barWidth).attr('height', (d, i) => {
      return d['bar1'];
    }).attr('x', (d, i) => {
       return scale(d.price);
    }).attr('y', (d, i) => {
      return 100 - d['bar1'] - 24;
    }).attr('rx', 2).style('fill','#3F4A52').style('stroke-width', '2').style('stroke', 'white')
    
    // 柱体 up
    d3.select('svg .bars_up').attr('transform', 'translate(20, 200)').selectAll('rect').data(data).join('rect').on('mousemove', function(e, d) {
      hoverBox(e, d)
    }).on('mouseleave', function(e,d) {
      LeaveBox(e,d)
    }).transition().attr('width', barWidth).attr('height', (d, i) => {
      return d['bar2'];
    }).attr('x', (d, i) => {
      return scale(d.price);
    }).attr('y', (d, i) => {
      return 100 - d['bar1'] - d['bar2'] - 24;
    }).attr('rx', 2).style('fill','red').style('stroke-width', '2').style('stroke', 'white')

    // 左 拖拽
    const dragLeft = d3.drag().on('drag', function(e) {
      d3.select('.drag-left').attr('transform', `translate(${e.x - 14}, 24)`);
      d3.select('.percentLeft').attr('transform',  `translate(${e.x - 45}, 22)`);
      d3.select('.percentLeft text').text(e.x).attr('fill', 'white');
      const rightX = Number(d3.select('.drag-right').attr('transform').split(',')[0].slice(10));
      const W = rightX - e.x;
      d3.select('.overlap rect').attr('transform', `translate(${e.x}, 0)`).attr('width', W);
      setPosition(e.x)
    });
    d3.select('.drag-left').call(dragLeft);
    // 右 拖拽
    const dragRight = d3.drag().on('drag', (e)=> {
      d3.select('.drag-right').attr('transform', `translate(${e.x}, 24)`)
      d3.select('.percentRight').attr('transform',  `translate(${e.x + 6}, 22)`);
      d3.select('.percentRight text').text(e.x).attr('fill', 'white');
      const leftX = Number(d3.select('.drag-left').attr('transform').split(',')[0].slice(10));
      const W = e.x - leftX - 14;
      d3.select('.overlap rect').attr('width', W)
    });
    d3.select('.drag-right').call(dragRight);
  }

  function hoverBox(e, d) {
    d3.select('.overBox').attr('style', `visibility:visible;transform:translate(${e.offsetX + 20}px, ${e.offsetY}px)`)
    setFee(d.bar1)
    setAmount(d.bar2)
  }
  function LeaveBox(e, d) {
    d3.select('.overBox').attr('style', `visibility:hidden;transform:translate(${e.offsetX + 20}px, ${e.offsetY}px)`)
    setFee(d.bar1)
    setAmount(d.bar2)
  }
  function zoomIn() {
    drawChart([0.05, 3.5]);
  }
  function zoomOut() {
    drawChart([1.15, 2.2]);
  }
  return <div className="relative mt-20 mx-auto " style={{width: '500px', height: '300px', background: 'linear-gradient(180deg, #213441 0%, #15242F 100%)'}}>
     <svg width="500" height="300" className="border-2  border-green-600">
        {/* bars */}
        <g className="bars_up">
        </g>
        <g className="bars_down">
        </g>
        {/* 坐标轴 */}
        <g className="axis"></g>
        {/* 拖拽线 left */}
        <g>
          <g className="percentLeft" transform="translate(-32, 24)">
            <rect width="44" height="22" fill="#172631" rx="4"></rect>
            <text x="22" y="12" dominant-baseline="middle" text-anchor="middle"></text>
          </g>
          <g className="drag-left cursor-ew-resize" transform="translate(0, 24)">
            <rect width="28" height="253" opacity='0'></rect>
            <path d="M15 245L15 -3.69549e-06" stroke="#00FFD1" stroke-width="1.6"/>
            <path d="M1 242C1 240.343 2.34315 239 4 239H15V253H4C2.34315 253 1 251.657 1 250V242Z" fill="#1C272E" stroke="#00FFD1" stroke-width="1.6"/>
            <path d="M5.30798 248.034H10.9917" stroke="#00FFD1" stroke-width="1.6" stroke-linecap="round" />
            <path d="M5.30798 244.444H10.9917" stroke="#00FFD1" stroke-width="1.6" stroke-linecap="round" />
          </g>
        </g>
        {/* 拖拽线 right */}
        <g>
          <g className="percentRight" transform="translate(406, 24)">
            <rect width="44" height="22" fill="#172631" rx="4"></rect>
            <text x="22" y="12" dominant-baseline="middle" text-anchor="middle"></text>
          </g>
          <g className="cursor-ew-resize drag-right" transform="translate(400, 24)">
            <rect width="28" height="253" opacity='0' x="-14"></rect>
            <path d="M1 245L0.999989 -3.69549e-06" stroke="#00FFD1" stroke-width="1.6" />
            <path d="M15 242C15 240.343 13.6569 239 12 239H1V253H12C13.6569 253 15 251.657 15 250V242Z" fill="#1C272E" stroke="#00FFD1" stroke-width="1.6"/>
            <path d="M10.6921 248.034H5.00838" stroke="#00FFD1" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M10.6921 244.444H5.00838" stroke="#00FFD1" stroke-width="1.6" stroke-linecap="round"/>
          </g>
        </g>
        {/* 左右坐标轴中间的重叠区域 */}
        <g className="overlap" transform="translate(0, 24)" pointer-events="none">
            <rect width="200" height="253" fill="rgba(255,255,255,0.1)"></rect>
        </g>
     </svg>
     {position}
     {/* 悬浮框 */}
     <div className="overBox absolute rounded-xl border border-gray-400 p-1 left-0 top-0 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white mr-5">Fee APR (24h)</span>
          <span className="text-xs text-white font-bold">{fee}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white mr-5">USDC Amount</span>
          <span className="text-xs text-white font-bold">{amount}</span>
        </div>
     </div>
     <div className="flex items-center">
        <div style={{border:'1px solid rgba(126, 138, 147, 0.2)'}} className="w-6 h-6 flex items-center justify-center cursor-pointer" onClick={zoomIn}>+</div>
        <div style={{border:'1px solid rgba(126, 138, 147, 0.2)'}} className="w-6 h-6 flex items-center justify-center cursor-pointer" onClick={zoomOut}>-</div>
        <div style={{border:'1px solid rgba(126, 138, 147, 0.2)'}} className="w-6 h-6 flex items-center justify-center cursor-pointer" onClick={zoomOut}>-</div>
     </div>
  </div>
}

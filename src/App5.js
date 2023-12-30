import React, { useRef, useState, useEffect, useMemo } from "react";
import * as d3 from 'd3'
import styled from "styled-components";
import Big from "big.js";
const StyledWrap = styled.div`
    margin:200px auto auto 500px;
    width:600px;
    background-color:#131313;
    svg{
      border:2px solid red;
    }
`
const StyledButton = styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
    gap:20px;
    button{
      display:flex;
      align-items:center;
      justify-content:center;
      width:50px;
      height:20px;
      color:#fff;
      background-color:green;
    }
`
export default function App() {
  const svgWidth = 600, svgHeight = 300; // custom
  const svgPadding = 50; // svg custom
  const axisHeight = 24; // custom
  const barHeight = 195; // custom fixed Bar
  const barWidth = 22;
  const percentBoxWidth = 44;
  const percentToBarDistance = 6;

  const axis = [1800, 1900]; // from interface
  const liquidityRange = [0, 300]; // from interface
  const current_price = 1855; // from interface

  const [left_coordinate, set_left_coordinate] = useState(1844);
  const [right_coordinate, set_right_coordinate] = useState(1875);
  const [zoom, setZoom] = useState(null);
  // useEffect(() => {
  //   drawSection();
  // }, [left_coordinate, right_coordinate])
  function drawInitChart(scaleAxis) {
    // 创建横坐标轴
    drawBottomAxis(scaleAxis);
    // 创建流动性分布图
    drawLiquidityArea(scaleAxis);
    // 创建左拖拽Bar
    drawLeftBar(scaleAxis);
    // 创建右拖拽Bar
    drawRightBar(scaleAxis);
    // 创建选中区域
    drawSection(scaleAxis);
    // 创建当前价格Line
    drawCurrentPriceLine(scaleAxis);
    // bind zoom behaviour
    bindZoomBehaviour();
  }
  const scaleAxis = d3.scaleLinear().domain(axis).range([0, svgWidth - svgPadding*2])
  const yScale = d3.scaleLinear().domain(liquidityRange).range([svgHeight-axisHeight, 0]);
  const kk = {
    name: Big(11)
  }
  console.log(JSON.parse(JSON.stringify(kk)))
  useEffect(() => {
     testFun().then((res) => {
      alert(res);
    })
  }, [])
  async function testFun() {
    const b = testFun1();
    return b;
  }
  async function testFun1(){
    const res2 = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('hello')
      }, 5000)
    })
    return res2;
  }
  // async function testFun2() {
  //   const res2 = await new Promise((resolve, reject) => {
  //     reject('789----3')
  //   })
  //   return await testFun3();
  // } 
  // async function testFun3() {
  //   const res3 = await new Promise((resolve, reject) => {
  //     reject('1000----4')
  //   })
  //   return res3;
  // }
  useEffect(() => {
    // fetch('http://139.162.85.48:8400/api/message/send', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     "content":"{'alarmType': 'PRICE_ZERO', 'source': 'coingecko', 'coin': 'wrap.near', 'extraMsg': '{\"coingecko\":0,\"binance\":1.928,\"binanceFutures\":1.93,\"huobi\":1.9295,\"cryptocom\":null,\"kucoin\":1.9293,\"gate\":1.928,\"chainlink\":0}', 'startTime': '2023-11-21T07:14:49.374Z'}",
    //     "product": "oracle",
    //     "level": "medium",
    //     "email":true,
    //     "telegram":true,
    //     "slack":true,
    //     "type":"recover"
    //  }),
    //   headers: { 'Content-type': 'application/json; charset=UTF-8' },
    // }).then((res) => {
    //   console.log('0000000-res', res);
    // })

    // fetch('https://hermes-beta.pyth.network/api/latest_vaas?ids[]=27e867f0f4f61076456d1a73b14c7edc1cf5cef4f4d6193a33424288f11bd0f4&ids[]=1fc18861232290221461220bd4e2acd1dcdfbc89c84092c93c18bdc7756c1588', {
    //   method: 'GET',
    //   // headers: { 'Content-type': 'application/json; charset=UTF-8' },
    //   headers: { 'accept': 'application/json;' },
    // }).then((res) => {
    //   return console.log('00000000000-JSON.stringify(res.json())', JSON.stringify(res.json()))
    // }).then((res) => {
    //   // console.log('0000000000-res', res);
    // })
  }, [])
  useEffect(() => {
    if (zoom && scaleAxis) {
      const newXscale = zoom.rescaleX(scaleAxis);
      scaleAxis.domain(newXscale.domain())
      console.log('000000-new domain', scaleAxis.domain());
    }
  }, [zoom, scaleAxis])
  useEffect(() => {
    drawInitChart(scaleAxis);
  }, [scaleAxis]);
  const zoomEvent = useMemo(
    () => {
    const zoomEvent = d3.zoom().extent([
      [0, 0],
      [svgWidth, svgHeight],
    ]).on('zoom', (e) => {
      setZoom(e.transform)
    })
    return zoomEvent;
  }, [])
  function drawBottomAxis() {
    const axisBottom = d3.axisBottom(scaleAxis).tickSize(0).tickPadding(10);
    d3.select('.axis').call(axisBottom).selectAll('text').attr('fill', '#8E8E8E')
    d3.select('.axis').select('.domain').attr('stroke', 'transparent');
  }
  function drawLiquidityArea() {
    const points = [];
    const liquidityPoints = [];
    for( let i=axis[0]; i < axis[1]; i++ ) {
      const x = scaleAxis(i);
      const y_random = Math.round(Math.random() * 200);
      const y = yScale(y_random);
      points.push([x, y]);
      liquidityPoints.push([x, y_random]);
    }
    const areaGenerator = d3.area().y0(svgHeight - axisHeight);
    const pathData = areaGenerator.curve(d3.curveStepAfter)(points);
    d3.select('.liquidity').attr('d', pathData);
  }
  function drawLeftBar() {
    const dragEvent = d3.drag().on('drag', (e) => {
      d3.select('.leftBar').attr('transform', `translate(${e.x}, ${svgHeight - barHeight - axisHeight})`)
      set_left_coordinate(scaleAxis.invert(e.x));
    })
    d3.select('.leftBar').attr('transform', `translate(${scaleAxis(left_coordinate)}, ${svgHeight - barHeight - axisHeight})`);
    d3.select('.leftPercent').attr('transform', `translate(-${percentBoxWidth + percentToBarDistance}, 0)`)
    d3.select('.leftBar').call(dragEvent);
  }
  function drawRightBar() {
    const dragEvent = d3.drag().on('drag', (e) => {
      d3.select('.rightBar').attr('transform', `translate(${e.x}, ${svgHeight - barHeight - axisHeight})`);
      set_right_coordinate(scaleAxis.invert(e.x));
    })
    d3.select('.rightBar').attr('transform', `translate(${scaleAxis(right_coordinate)}, ${svgHeight - barHeight - axisHeight})`);
    d3.select('.rightPercent').attr('transform', `translate(${barWidth + percentToBarDistance}, 0)`)
    d3.select('.rightBar').call(dragEvent);
  }
  function drawSection() {
    const x1 = d3.select('.leftBar').attr('transform').split(',')[0].slice(10)
    const x2 = d3.select('.rightBar').attr('transform').split(',')[0].slice(10)
    const width = Number(x2) - Number(x1);
    const rect_x = Number(x1) + barWidth / 2;
    const rect_y = svgHeight - barHeight - axisHeight;
    d3.select('.section').attr('height', '195').attr('width', width).attr('x', rect_x).attr('y', rect_y)
  }
  function drawCurrentPriceLine() {
    const current_x = scaleAxis(current_price);
    d3.select('.current').attr('x1', current_x).attr('y1', svgHeight - barHeight - axisHeight).attr('x2', current_x).attr('y2', svgHeight - axisHeight)

  }
  function bindZoomBehaviour() {
    d3.select('svg .zoomRef').call(zoomEvent);
  }
  function zoomIn() {
    d3.select('svg .zoomRef').transition().call(zoomEvent.scaleBy, 2);
  }
  function zoomOut() {
    d3.select('svg .zoomRef').transition().call(zoomEvent.scaleBy, 0.5);
  }
  function zoomReset() {
    d3.select('svg .zoomRef').transition().call(zoomEvent.transform, d3.zoomIdentity.translate(50, 0).scale(1))
  }
  return <StyledWrap>
      <StyledButton>
        <button onClick={ zoomIn }> + </button>
        <button onClick={ zoomOut }> - </button>
        <button onClick={ zoomReset }> reset </button>
      </StyledButton>
      <svg width={svgWidth} height={svgHeight}>
        <defs>
           <linearGradient id="paint0_linear_7_2204" x1="0" y1="194" x2="600" y2="194" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="white" stop-opacity="0.1" />
              <stop offset="1" stop-color="#3E5BF2" stop-opacity="0.1" />
          </linearGradient>
        </defs>
        <g className="zoomRef" width={svgWidth} height={svgHeight}></g>
        <g className="container" transform={`translate(${svgPadding}, 0)`}>
          {/* 横坐标轴 */}
          <g className="axis" transform={`translate(0, ${svgHeight - axisHeight})`}></g>
          {/* 流动性分布图 */}
          <path className="liquidity" fill="rgba(98, 221, 255, 0.5)"></path>
          {/* 创建两根Bar之间的区域 */}
          <rect className="section" fill="url(#paint0_linear_7_2204)"></rect>
          {/* 当前价格 */}
           <line className="current" stroke="#ffffff" strokeWidth="1"></line>
          {/* 左拖拽Bar */}
           <g className="leftBar" style={{cursor: 'ew-resize'}}>
            <svg width="22" height="195" viewBox="0 0 22 195" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="22" height="195" fill="transparent"/>
              <rect x="7" width="4" height="195" fill="#D9D9D9"/>
              <path d="M0 4C0 1.79086 1.79086 0 4 0H11V20H4C1.79086 20 0 18.2091 0 16V4Z" fill="#D9D9D9"/>
              <line x1="4.5" y1="5" x2="4.5" y2="14" stroke="white"/>
              <line x1="7.5" y1="5" x2="7.5" y2="14" stroke="white"/>
            </svg>

            <g className="leftPercent">
              <rect width="44" height="24" rx="6" fill="#262626"></rect>
              <text fontSize="12" x="22" y="12" fill="white" textAnchor="middle" dominantBaseline="middle">-0.1%</text>
            </g>
           </g>
           {/* 右拖拽Bar */}
           <g className="rightBar" style={{cursor: 'ew-resize'}}>
            <svg width="22" height="195" viewBox="0 0 22 195" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="22" height="195" fill="transparent"/>
              <path d="M22 4C22 1.79086 20.2091 0 18 0H11V20H18C20.2091 20 22 18.2091 22 16V4Z" fill="#4B68FF"/>
              <rect x="11" width="4" height="195" fill="#4B68FF"/>
              <line x1="15.5" y1="5" x2="15.5" y2="14" stroke="white"/>
              <line x1="18.5" y1="5" x2="18.5" y2="14" stroke="white"/>
            </svg>
            <g className="rightPercent">
              <rect width="44" height="24" rx="6" fill="#262626"></rect>
              <text fontSize="12" x="22" y="12" fill="white" textAnchor="middle" dominantBaseline="middle">0.1%</text>
            </g>
           </g>
        </g>
      </svg>
      
  </StyledWrap>
}
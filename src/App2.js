import React, { useRef, useState, useEffect } from "react";
import * as d3 from 'd3';
import Big from 'big.js';
import './App.css'

export default function App() {
  const svg_width = 600;
  const svg_height = 400;
  const svg_padding = 40;
  const [amount, setAmount] = useState();
  
  useEffect(() => {
    drawChart();
  },[]);
  function drawChart() {
    const buy_list = [{"point":410960,"amount_x":"0","amount_y":"2000000000000000000000000","price":"0.7028678837421116","amount_x_readable":"2.8454849713033944320515835443275020910088","accumulated_x_readable":"2.8454849713033944320515835443275020910088"},{"point":409040,"amount_x":"0","amount_y":"100000000000000000000000","price":"0.5800872605343367","amount_x_readable":"0.17238785748869375464205349352777624360324","accumulated_x_readable":"3.01787282879208818669363703785527833461204"},{"point":408840,"amount_x":"0","amount_y":"10000000000000000000000000","price":"0.5686013317410518","amount_x_readable":"17.587014735579490005752896994458152837215","accumulated_x_readable":"20.60488756437157819244653403231343117182704"},{"point":407800,"amount_x":"0","amount_y":"50000000000000000000000000","price":"0.5124405688188262","amount_x_readable":"97.572290412622546730406106384651309363665","accumulated_x_readable":"118.17717797699412492285264041696474053549204"},{"point":407640,"amount_x":"0","amount_y":"100000000000000000000000000","price":"0.5043071670979562","amount_x_readable":"198.29184775511247910329747698085276603925","accumulated_x_readable":"316.46902573210660402615011739781750657474204"},{"point":407560,"amount_x":"0","amount_y":"68000000000000000000000000","price":"0.5002890047444613","amount_x_readable":"135.9214361201745520837149895240148633557904","accumulated_x_readable":"452.39046185228115610986510692183236993053244"},{"point":407520,"amount_x":"0","amount_y":"20000000000000000000000000","price":"0.4982919453581734","amount_x_readable":"40.13711276353053199626350241541535262819","accumulated_x_readable":"492.52757461581168810612860933724772255872244"},{"point":403480,"amount_x":"0","amount_y":"49811841869997666061904366883","price":"0.3326884077840425","amount_x_readable":"149725.2104507709454001376967851859649209223659669706914982560349551629","accumulated_x_readable":"150217.7380253867570882438253945232126434810884069706914982560349551629"},{"point":391440,"amount_x":"0","amount_y":"100000000000000000000000000000","price":"0.09980981603603914","amount_x_readable":"1001905.46352567355432489082217512207591802","accumulated_x_readable":"1152123.2015510603114131346475696452885615010884069706914982560349551629"},{"point":385160,"amount_x":"0","amount_y":"8000000000000000000000000","price":"0.05326598426101387","amount_x_readable":"150.1896587660600793837063824363327668290656","accumulated_x_readable":"1152273.3912098263714925183539520816213283301540069706914982560349551629"}];
    const sell_list = [{"point":412760,"amount_x":"50171439","amount_y":"0","price":"0.8414780615649408","amount_x_readable":"50.171439","accumulated_x_readable":"50.171439"},{"point":414480,"amount_x":"49978925456","amount_y":"0","price":"0.9993962465847384","amount_x_readable":"49978.925456","accumulated_x_readable":"50029.096895"},{"point":418280,"amount_x":"10000000","amount_y":"0","price":"1.461373965601052","amount_x_readable":"10","accumulated_x_readable":"50039.096895"},{"point":437520,"amount_x":"400000000000","amount_y":"0","price":"10.006960210476901","amount_x_readable":"400000","accumulated_x_readable":"450039.096895"}];
    // 获取价格区间、数量区间
    const prices = [];
    const amounts = [];
    buy_list.concat(sell_list).forEach((item) => {
      prices.push(item.price);
      amounts.push(Big(item.accumulated_x_readable).toFixed(0));
    })
    prices.sort((b, a) => {
      return Big(b).minus(a).toNumber();
    })
    amounts.sort((b, a) => {
      return Big(b).minus(a).toNumber();
    })
    // 价格区间中去掉 过大或过小价格的 todo
    const price_range = [prices[0], prices[prices.length - 2]];
    const amount_range = [amounts[amounts.length - 1], 0];

    // 创建一个横坐标轴
    const scaleBottom = d3.scaleLinear().domain(price_range).range([0, svg_width - svg_padding*2]).clamp(true);
    const axisBottom = d3.axisTop(scaleBottom).tickSize(0).tickPadding(10);
    d3.select('.axisBottom').attr('transform', `translate(0, ${svg_height - svg_padding})`).call(axisBottom).selectAll('text').attr('fill', '#7E8A93');
    d3.select('.axisBottom').select('.domain').attr('stroke', 'transparent');
    
    // 创建一个纵坐标
    const scaleRight = d3.scaleLinear().domain(amount_range).range([0, svg_height - svg_padding*2]).clamp(true);
    const axisRight = d3.axisLeft(scaleRight).tickSize(0).tickPadding(10);
    d3.select('.axisRight').attr('transform', `translate(${svg_width - svg_padding}, 0)`).call(axisRight).selectAll('text').attr('fill', '#7E8A93').select('.domain')
    d3.select('.axisRight').attr('stroke', 'transparent');
  
    const areaGenerator = d3.area().x((d, i) => {
      return +Big(scaleBottom(d.price)).toFixed(0)
    }).y0((d, i) => {
      return svg_height - svg_padding * 2;
    }).y1((d, i) => {
      return +Big(scaleRight(d.accumulated_x_readable)).toFixed(0);
    });

    const lineGenerator = d3.line().x((d, i) => {
      return Big(scaleBottom(d.price)).toFixed(0);
    }).y((d, i) => {
      return Big(scaleRight(d.accumulated_x_readable)).toFixed(0);
    })

    // buy_list 增加辅助点
    const buy_list_new = [];
    const max_index = buy_list.length - 1;
    buy_list.forEach((item, index) => {
      buy_list_new.push(item);
      // 当前点 item,如果存在下一个点则 两点之间插入一个辅助点
      if (index + 1 <= max_index) {
        const nextItem = buy_list[index + 1];
        buy_list_new.push({
          "point": nextItem.point,
          "price": nextItem.price,
          "accumulated_x_readable": item.accumulated_x_readable
        })
      }
      
    })

    // sell_list 增加辅助点
    const sell_list_new = [];
    const sell_max_index = sell_list.length - 1;
    sell_list.forEach((item, index) => {
      sell_list_new.push(item);
      // 当前点 item,如果存在下一个点则 两点之间插入一个辅助点
      if (index + 1 <= sell_max_index) {
        const nextItem = sell_list[index + 1];
        sell_list_new.push({
          "point": nextItem.point,
          "price": nextItem.price,
          "accumulated_x_readable": item.accumulated_x_readable
        })
      }
      
    })




    /** 创建左侧面积区域 */ 
    // 面积
    const area_path_data_left = areaGenerator(buy_list_new);
    d3.select('.areaLeft').append('path').join(function(enter){
      return enter.attr('d', area_path_data_left).attr('opacity', '0').attr('fill', 'red')
    // }).transition().attr('d', area_path_data_left).attr('opacity', '0.8').attr('fill', 'url(#paint0_linear_7545_2924)')
    }).transition().attr('d', area_path_data_left).attr('opacity', '0.8').attr('fill', 'yellow')
    
    // 折线
    var line_path_data_left = lineGenerator(buy_list_new);
    d3.select('.areaLeft').append('path').attr('d', line_path_data_left).attr('stroke', '#00FFD1').attr('strokeWidth', '2').attr('fill', 'none');
    // rect 矩形 用来触发hover事件
    const dashLineGenerator = d3.line();
    d3.select('.rectLeft').attr('width', () => {
      return scaleBottom(buy_list[0].price) - scaleBottom(buy_list[buy_list.length - 1].price);
    }).attr('height', () => {
      return svg_height;
    }).attr('x', () => {
      return scaleBottom(buy_list[buy_list.length - 1]);
    }).attr('y', `${-svg_padding}`).attr('fill', 'transparent').on('mousemove', function (e) {
      const { offsetX, offsetY } = e;
      const x = offsetX - svg_padding;
      // 找到离这个点最近的一个数据
      let targetX;
      let targetY;
      const list = buy_list.concat([]).reverse();
      const gtIndex = list.findIndex((item) => {
       return scaleBottom(item.price) >= x;
      })
      if (gtIndex !== -1) {
        const x1 = scaleBottom(list[gtIndex].price);
        setAmount(list[gtIndex].accumulated_x_readable)
      if (gtIndex == 0) {
        targetY = scaleRight(list[gtIndex].accumulated_x_readable);
        targetX = x1;
        setAmount(list[gtIndex].accumulated_x_readable)
      } else {
        const ltIndex = gtIndex - 1;
        const x0 = scaleBottom(list[ltIndex].price);
        if ((x1 - x) > (x - x0)) {
          targetX = x0;
          targetY = scaleRight(list[ltIndex].accumulated_x_readable);
          setAmount(list[ltIndex].accumulated_x_readable)
        } else {
          targetX = x1;
          targetY = scaleRight(list[gtIndex].accumulated_x_readable);
          setAmount(list[gtIndex].accumulated_x_readable)
        }
      }
      const pathDataX = dashLineGenerator([[targetX, -40], [targetX, 360]]);
      const pathDataY = dashLineGenerator([[0, targetY], [520, targetY]]);
      d3.select('.verticalDashLine').attr('d', pathDataX).attr('opacity', '1');
      d3.select('.horizontalDashLine').attr('d', pathDataY).attr('opacity', '1');
      d3.select('.dot').attr('cx', targetX).attr('cy', targetY).attr('opacity', '1').attr('fill', '#00FFD1')
      }
      console.log('offsetX, offsetY', offsetX, offsetY);
      d3.select('.hoverBox').attr(
        'style',
        `visibility:visible;background:rgba(29, 41, 50, 0.8); transform:translate(${
          offsetX + 20
        }px, ${offsetY - 20}px)`
      );
    }).on('mouseleave', function (e, d) {
      d3.select('.verticalDashLine').attr('opacity', '0');
      d3.select('.horizontalDashLine').attr('opacity', '0');
      d3.select('.dot').attr('opacity', '0');
      d3.select('.hoverBox').attr(
        'style',
        `visibility:invisible;background:rgba(29, 41, 50, 0.8);)`
      );
    })

    d3.select('.rectRight').attr('width', () => {
      return scaleBottom(sell_list[sell_list.length - 1].price) - scaleBottom(sell_list[0].price);
    }).attr('height', () => {
      return svg_height;
    }).attr('x', () => {
      return scaleBottom(sell_list[0].price);
    }).attr('y', `${-svg_padding}`).attr('fill', 'transparent').on('mousemove', function (e) {
      const x = e.offsetX - svg_padding;
      // 找到离这个点最近的一个数据
      let targetX;
      let targetY;
      const list = sell_list;
      const gtIndex = list.findIndex((item) => {
       return scaleBottom(item.price) >= x;
      })
      if (gtIndex !== -1) {
        const x1 = scaleBottom(list[gtIndex].price);
        if (gtIndex == 0) {
          targetY = scaleRight(list[gtIndex].accumulated_x_readable);
          targetX = x1;
        } else {
          const ltIndex = gtIndex - 1;
          const x0 = scaleBottom(list[ltIndex].price);
          if ((x1 - x) > (x - x0)) {
            targetX = x0;
            targetY = scaleRight(list[ltIndex].accumulated_x_readable);
          } else {
            targetX = x1;
            targetY = scaleRight(list[gtIndex].accumulated_x_readable);
          }
        }
        const pathDataX = dashLineGenerator([[targetX, -40], [targetX, 360]]);
        const pathDataY = dashLineGenerator([[0, targetY], [520, targetY]]);
        d3.select('.verticalDashLine').attr('d', pathDataX).attr('opacity', '1');
        d3.select('.horizontalDashLine').attr('d', pathDataY).attr('opacity', '1');
        d3.select('.dot').attr('cx', targetX).attr('cy', targetY).attr('opacity', '1').attr('fill', '#FF6A8E')
      }
    }).on('mouseleave', function (e, d) {
      d3.select('.verticalDashLine').attr('opacity', '0');
      d3.select('.horizontalDashLine').attr('opacity', '0');
      d3.select('.dot').attr('opacity', '0');
    })

    // 创建右侧面积区域 start
    const area_path_data_right = areaGenerator(sell_list_new);
    d3.select('.areaRight').append('path').attr('d', area_path_data_right).attr('opacity', '0.5').attr('fill', 'red');
    
    const line_path_data_right = lineGenerator(sell_list_new);
    d3.select('.areaRight').append('path').attr('d', line_path_data_right).attr('stroke', '#FF6A8E').attr('strokeWidth', '2').attr('fill', 'none');
  }
  
  
  return <div className="relative mt-20 mx-auto relative" style={{width: `${svg_width}px`, height: `${svg_height}px`, background: '#001220'}}>
     <svg width={`${svg_width}`} height={`${svg_height}`}>
        <g transform={`translate(${svg_padding}, ${svg_padding})`}>
          {/* 横坐标 */}
          {/* <g className="axisBottom" ></g> */}
          {/* 纵坐标 */}
          <g className="axisRight" ></g>
          {/* 左侧面积图 */}
          <g className="areaLeft" >
          </g>
          {/* 右侧面积图 */}
          <g className="areaRight" ></g>
          {/* 左侧触发鼠标事件区域 */}
          <rect className="rectLeft"></rect>
          {/* 右侧触发鼠标事件区域 */}
          <rect className="rectRight"></rect>
          {/* 垂直 虚线 */}
          <path className="verticalDashLine"  fill="none" stroke="#999" stroke-dasharray="2,2"></path>
          {/* 水平 虚线 */}
          <path className="horizontalDashLine" fill="none" stroke="#999" stroke-dasharray="2,2"></path>
          {/* 折线上的点 */}
          <circle className="dot" r="5" stroke="#0D1A23" stroke-width="2" opacity='0'/>
        </g>
        {/* 渐变色绿色 */}
        <defs>
          <linearGradient id="paint0_linear_7545_2924" x1="137" y1="0" x2="137" y2="216.071" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00D6AF"/>
          <stop offset="1" stop-color="#00D6AF" stop-opacity="0"/>
          </linearGradient>
        </defs>
        {/* 渐变色红色 */}
        <defs>
        <linearGradient id="paint0_linear_7545_2926" x1="137" y1="100" x2="137" y2="360" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FF6A8E"/>
        <stop offset="1" stop-color="#FF6A8E" stop-opacity="0"/>
        </linearGradient>
        </defs>
     </svg>
     {/* hover上去的悬浮框 */}
     <div className="hoverBox absolute px-2 py-3 invisible left-0 top-0" style={{
      backgroundColor: 'rgba(29, 41, 50, 0.8)',
      border: '1px solid #293844;',
      borderRadius: '5px',
      boxShadow: '0px 0px 10px 4px rgba(0, 0, 0, 0.15)'
     }}>
        <div className="flex items-center justify-between">
          <span className="text-xs mr-10" style={{color:'#7E8A93'}} >Amount</span>
          <span className="text-sm" style={{color:'#00FFD1'}}>{Big(amount || 0).toFixed(0)}</span>
        </div>

     </div>
  </div>
}




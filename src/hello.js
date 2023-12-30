
// import { getConfig, init_env, ftGetTokenMetadata } from '@ref-finance/ref-sdk';
import React from 'react';
import { useEffect, useState, useMemo, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
export default function ShowContent() {
  const chartDom = useRef(null);
  useEffect(() => {
    // const current = chartDom.current;
    // if (current) {
    //   debugger;
    // }
  }, [chartDom.current])
  const pieOption = {
    renderer: 'svg',
    tooltip: {
      trigger: 'item',
      show:false,
    },
    legend: {
      top: '5%',
      left: 'center',
      show:false,
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['80%', '90%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          scaleSize:20,
          label: {
            show: true,
            formatter: (data) => {
              console.log('111111', data);
              const { age, name, value} = data.data;
              
              return `{k|}\n{m|${value}}\n{p|${age}}`
            },
            // formatter: '{c}:{b}:{m|age}',
            rich: {
              k: {
                fontSize:'blue',
                width:30,
                height:30,
                borderRadius: 50,
                borderWidth:3,
                borderColor:'red',
                backgroundColor: {
                  image:`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='16 24 248 248' style='background: %23000'%3E%3Cpath d='M164,164v52h52Zm-45-45,20.4,20.4,20.6-20.6V81H119Zm0,18.39V216h41V137.19l-20.6,20.6ZM166.5,81H164v33.81l26.16-26.17A40.29,40.29,0,0,0,166.5,81ZM72,153.19V216h43V133.4l-11.6-11.61Zm0-18.38,31.4-31.4L115,115V81H72ZM207,121.5h0a40.29,40.29,0,0,0-7.64-23.66L164,133.19V162h2.5A40.5,40.5,0,0,0,207,121.5Z' fill='%23fff'/%3E%3Cpath d='M189 72l27 27V72h-27z' fill='%2300c08b'/%3E%3C/svg%3E%0A`
                },
                overflow:'break',
              },
              m:{
                color:'green'
              },
              p: {
                color:'red'
              }
            }
          },
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Search Engine', age: '30' },
          { value: 735, name: 'Direct', age: '31' },
          { value: 580, name: 'Email', age: '32' },
          { value: 484, name: 'Union Ads', age: '33' },
          { value: 300, name: 'Video Ads', age: '34' }
        ]
      }
    ]
  }

  const onEvents = {
    'click': (parms) => {
        console.log('9999999', parms);
    },
    'mouseover': (parms) => {
      console.log('9999999', parms);
    }
  }
  // setNameFun('oo');
  return <div>
      <div></div>
       <ReactECharts 
          ref={chartDom} 
          option={pieOption}
          onEvents={onEvents}
          
          notMerge={true} 
        />
    </div>
}
/**
formatter:标签内容格式器, 支持字符串模板和回调函数两种形式，字符串模板与回调函数返回的字符串均支持用 \n 换行
字符串模板 模板变量有：
{a}：系列名。
{b}：数据名。
{c}：数据值。
{d}：百分比。
{@xxx}：数据中名为 'xxx' 的维度的值，如 {@product} 表示名为 'product' 的维度的值。
{@[n]}：数据中维度 n 的值，如 {@[3]} 表示维度 3 的值，从 0 开始计数。

回调函数格式：
(params: Object|Array) => string

rich 里是文本片段的样式设置

例子：
label: {
    formatter: [
      '{tc|Center Title}{titleBg|}',
      '  Content text xxxxxxxx {sunny|} xxxxxxxx {cloudy|}  ',
      '{hr|}',
      '  xxxxx {showers|} xxxxxxxx  xxxxxxxxx  '
    ].join('\n'),
    rich: {
      titleBg: {
        align: 'right'
      }
    }
  }

  formatter: (data, type) => {
              let info = data.data;
              let str = `{a|${info.value}}\n\n {b|${info.name}}`; //这里对不同的内容进行标识 a，b，或者可以随便自己起个别的名字
              return str;
            },

 */
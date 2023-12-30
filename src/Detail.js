import logo from './logo.svg';
import React, { useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import Ping from 'ping.js';
import ping from 'web-pingjs';

function Detail () {
  const [show, setShow] = useState(false);
  const [selectValue,setSelectValue] = useState('hello');
  const hideBox = (e) => {
    console.log('失去焦点了');
    setShow(false);
  }
  const changeShow = (e) => {
    setShow(!show);
  }
  const foucsP = (v) => {
    setSelectValue(v)
    setShow(false);
  }
  return <div>
    <svg width="362" height="188" viewBox="0 0 362 188" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_bd_3_191)">
        <rect
          x="11"
          y="11"
          width="340"
          height="166"
          rx="15"
          fill="url(#paint0_linear_3_191)"
          shapeRendering="crispEdges"
        />
        <rect
          x="11"
          y="11"
          width="340"
          height="166"
          rx="15"
          stroke="url(#paint1_linear_3_191)"
          strokeWidth="2"
          shapeRendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="filter0_bd_3_191"
          x="-40"
          y="-40"
          width="442"
          height="268"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImage" stdDeviation="25" />
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_3_191" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
          <feBlend mode="normal" in2="effect1_backgroundBlur_3_191" result="effect2_dropShadow_3_191" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_3_191" result="shape" />
        </filter>
        <defs>
        <linearGradient
          id="paint0_linear_3_191"
          x1="346.453"
          y1="172.435"
          x2="50.373"
          y2="-43.0893"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0641396" stopColor="white"  />
          <stop offset="1" stopColor="white"  />
        </linearGradient>
        </defs>
        <defs>
        <linearGradient
          id="paint1_linear_3_191"
          x1="343.55"
          y1="11"
          x2="74.2363"
          y2="227.279"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00C6A2"  />
          <stop offset="0.588542" style={{stopColor: '#73818B'}}/>
          <stop offset="1" stopColor="#00BA98"  />
        </linearGradient>
        </defs>
      </defs>
    </svg>
    {/* <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     width="300px" height="300px" viewBox="0 0 300 300" enable-background="new 0 0 300 300" xml:space="preserve">
      <defs>
      <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="5.6665" y1="149.5" x2="293.333" y2="149.5">
          <stop  offset="0" style="stop-color:#FFF33B"/>
          <stop  offset="0.0595" style="stop-color:#FFE029"/>
          <stop  offset="0.1303" style="stop-color:#FFD218"/>
          <stop  offset="0.2032" style="stop-color:#FEC90F"/>
          <stop  offset="0.2809" style="stop-color:#FDC70C"/>
          <stop  offset="0.6685" style="stop-color:#F3903F"/>
          <stop  offset="0.8876" style="stop-color:#ED683C"/>
          <stop  offset="1" style="stop-color:#E93E3A"/>
      </linearGradient>
      </defs>
      <rect x="5.667" y="5.333" fill="url(#SVGID_1_)" width="287.667" height="288.333"/>
  </svg> */}
    {/* </div> */}
    {/* <a href="http://www.w3school.com.cn/" tabindex="2">W3School</a>
<a href="http://www.google.com/" tabindex="1">Google</a>
<a href="http://www.microsoft.com/" tabindex="3">Microsoft</a> */}
  </div>
}


export default Detail;

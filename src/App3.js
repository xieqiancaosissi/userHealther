import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import * as d3 from 'd3';
import Big from 'big.js';
import ReactSlider from 'react-slider';
import debounce from 'lodash/debounce';
import { styled } from 'styled-components';

const StyledContainer = styled.div`
   input[type='text']{
     width:400px;
     height:40px;
     border:1px solid red;
     margin:300px;
   }
`
export default function App() {
  const [value, setValue] = useState('0');
  const [finalValue, setFinalValue] = useState('0');

  useEffect(() => {
    window.document.documentElement.onclick = () => {
      console.log('000000000-当前value值是：', value);
    }
  }, [])

  function changeValue(e) {
    setValue(e.target.value);
    
  }

  function clickMe() {
    setFinalValue(value + 1);
  }

  return <StyledContainer>
    <input type="text" value={value} onChange={changeValue}/>
    你猜猜我输出的最终值是多少呢？{finalValue}
    <button onClick={clickMe}>click me</button>
  </StyledContainer>
}


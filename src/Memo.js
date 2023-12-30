import logo from './logo.svg';
import React, { useState, useEffect, useMemo, useCallback} from 'react';
import ClipLoader from "react-spinners/PulseLoader";
import Select from 'react-select';
import './App.css';
import { cleanup } from '@testing-library/react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import * as nearAPI from 'near-api-js'
import { functionCall } from 'near-api-js/lib/transaction';
import BigNumber from 'bignumber.js'
function Child (props) {
  console.log('我是子组件呀。。。');
  return <div>I am Child, I am {props.age}</div>
}
const Child2 = React.memo(Child);
function Memo() {
  const [name, setName] = useState('xieqian');
  const [age, setAge] = useState('32');
  const changeTest = useMemo(() => {
    return () => {
      console.log('我执行啦');
    }
  },[name]);
  const changeTest = useCallback(()=> {
    console.log('我执行啦');
  }, [name])
  const changeName = () => {
    setName('sisi')
  }
  const changeAge = () => {
    setAge('35');
  }
  
  
  return <div>
    my name is {name}
    <button onClick={changeName}>change name</button>
    <button onClick={changeAge}>change age</button>
    <Child2 age={age} onTest={changeTest}></Child2>
  </div>
}

export default Memo;

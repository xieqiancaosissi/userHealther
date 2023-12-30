import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { changeName, fetchAssets } from '../store'

function Test () {
  const people_name = useSelector(( store ) => store.people.name + 'hello');
  const status = useSelector( ( store ) => store.people.status); 
  const prices = useSelector( ( store ) => store.people.tokenPrices); 
  const store = useSelector((store) => store );
  console.log('00000000-store', store);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAssets())
  }, [])
  function ClickMe() {
    dispatch(changeName('caosisi'))
  }
  return <div>
    <div>hello kity --- {people_name}</div>
    <button onClick={ClickMe}>Click me to Change name</button>
    <div>{status}</div>    
    <div>{JSON.stringify(prices|| {})}</div>    
  </div>
}


export default Test;

import React, { useEffect, useState } from "react";
import { getHealthInfo } from "./burrow/index";

export default function App() {
  const [accountId, setAccountId] = useState("");
  const [healthFactorInfo, setHealthFactorInfo] = useState([]);
  // useEffect(() => {
  //   getHealthInfo();
  // }, [])
  return <div style={{margin: "200px"}}>Dear: 请输入你想查的账号
    <div style={{marginTop: "20px", marginBottom: "20px"}}>
        <input style={{border:"1px solid green"}} type="text" value={ accountId } onChange={(v) => {
          console.log("000000000-p", v.target.value);
        setAccountId(v.target.value)
          }} />
    </div>
  <button style={{border: "1px solid orange", borderRadius: "20px", width: "100px"}} onClick={() => {
    getHealthInfo(accountId).then((res) => {
      setHealthFactorInfo(res)
    })
  }}>确认</button>
  <div style={{marginTop: "20px"}}>账号健康度为：{healthFactorInfo?.map((res) => {
    return <div>{res}</div>
  })}</div>
  </div>
} 
  
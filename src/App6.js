import React, { useEffect } from "react";
import { getHealthInfo } from "./burrow/index";

export default function App() {

  useEffect(() => {
    getHealthInfo();
  }, [])
  return <div>hello kity</div>
} 
  
import Image from 'next/image'
import { useState, useEffect } from 'react';
import Dashboard from '../components/dashboard'

export default function Test() {

  const [tokenUrl, setTokenUrl] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  // const [tokenUrl, setTokenUrl] = useState(JSON.parse(localStorage.getItem("tokenExoMai")) !== null ? JSON.parse(localStorage.getItem("tokenExoMai")) : null);

  useEffect(() => {
    if (localStorage.getItem("tokenExoMai") !== null) {
      // setTokenUrl(localStorage.getItem("tokenExoMai"))
      // console.log(localStorage.getItem("tokenExoMai"))
    }
  }, [])

  return (
    <main>
        <Dashboard
          tokenUrl={tokenUrl}
          setTokenUrl={setTokenUrl}
        /> 
    </main>
  )
}

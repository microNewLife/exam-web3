import * as React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import oraclePng from './assert/oracle.png';
import CoinItem from './component/coin';

interface mockDataProps {
  id: string;
  leaseEnd: number;
  blockNumber: number;
  createdTimestamp: number;
  symbol: string;
  status: number;
  subscriptionId: string;
  selected: boolean;
}

const mockAPI = (): Promise<Array<mockDataProps>> => {
  let mockData = [];
  for (let i = 0; i < 8; i++) {
    mockData.push({
      "id": Math.round(Math.random() * 10000),
      "blockNumber": 12297450,
      "transactionIndex": 6,
      "sources": [0, 1, 2, 3],
      "symbol": "eth",
      "slug": "ethereum",
      "leaseEnd": 12499050,
      "subscriptionId": Math.round(Math.random() * 10000),
      "networkId": 0,
      "aggregationStrategy": 1,
      "reportingStrategy": 0,
      "status": Math.round(Math.random() * 2),
      "client": {
        "clientType": 0,
        "connectionInfo": {
          "contractAddress": "0x0F9dfd6043965B02e74D01188c13936fBE71D688",
          "networkId": 0
        }
      },
      "createdTimestamp": "2021-09-12T08:36:26.555",
      "updatedTimestamp": "2021-09-12T08:39:16.526",
      "display": true,
      "selected": false
    })
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(mockData);
    }, Math.random() * 3 * 100)
  })
}


const App: React.FC = () => {

  const [dataList, setDataList] = useState<mockDataProps[]>([])
  const [selectedItemId, setSelectItemId] = useState<string>();
  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    const mockData = await mockAPI();
    setDataList(mockData);
  }


  return (
    <div className="App" >
      <div className="title-block" >
        <img alt="oracle" src={oraclePng} className="title-icon" />
        <span className="title-name" > oracle </span>
      </div>
      {
        dataList.length === 0 ?
          <p className='data-loading' > loading……</p>
          :
          null
      }

      <div className='item-warp' >
        {
          dataList.length ?
            dataList.map(d => {
              return <CoinItem
                key={d.id}
                leaseEnd={d.leaseEnd}
                blockNumber={d.blockNumber}
                createdTimestamp={d.createdTimestamp}
                name={d.symbol}
                status={d.status}
                subscriptionId={d.subscriptionId}
                selected={selectedItemId === d.id}
                onClick={() => {
                  setSelectItemId(d.id);
                }}
              />
            })
            :
            null
        }
      </div>

    </div>
  );
}



export default App;

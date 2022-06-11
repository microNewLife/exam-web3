import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import './coin.css';
import coinPng from '../assert/coin.png';
import coinBgImg from '../assert/coinBg.png';
import coinBgBorderImg from '../assert/coinBgBorder.png';

const one2two = (str: string): string => {
  if (str.length === 1) {
    return '0' + str
  } else {
    return str
  }
}

const formatTime = (timeValue: number): string => {
  const date = new Date(timeValue);
  const day = date.getDate();
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date).slice(0, 4);
  const year = date.getFullYear();
  const hours = one2two(date.getHours() + '');
  const minutes = one2two(date.getMinutes() + '');
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

const mockPriceAPI = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const backData = (Math.random() * 100000000).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      resolve(backData);
    }, Math.random() * 3 * 1000)
  })
}

const mockLogoAPI = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(coinPng);
    }, Math.random() * 3 * 1000)
  })
}

interface CoinItemProp {
  name: string;
  status: number;
  subscriptionId: string;
  selected?: boolean;
  leaseEnd: number;
  blockNumber: number;
  createdTimestamp: number;
  onClick(): void
}

const CoinItem: React.FC<CoinItemProp> = ({ name, status, subscriptionId, selected, leaseEnd, blockNumber, createdTimestamp, onClick }) => {
  const [price, setPrice] = useState<string>();
  const [logo, setLogo] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [mouseOver, setMouseOver] = useState<boolean>(false);
  const [bgImg, setBgImg] = useState<string>();
  const endTimeStr = useMemo(() => {
    return new Date(createdTimestamp).valueOf() + 3 * 1000 * (leaseEnd - blockNumber)
  }, [createdTimestamp, leaseEnd, blockNumber]);

  const fetchPrice = useCallback(async () => {
    const asyncPrice = await mockPriceAPI(subscriptionId);
    setPrice(asyncPrice);
  }, [subscriptionId])

  const fetchLogo = useCallback(async () => {
    const asyncLogo = await mockLogoAPI(subscriptionId);
    setLogo(asyncLogo);
  }, [subscriptionId])

  useEffect(() => {
    fetchPrice();
  }, [fetchPrice])

  useEffect(() => {
    fetchLogo();
  }, [fetchLogo])

  useEffect(() => {
    if (!!price && !!logo && loading === true) {
      setLoading(false);
    }
  }, [price, logo, loading])

  useEffect(() => {
    setBgImg(selected || mouseOver ? coinBgBorderImg : coinBgImg)
  }, [selected, mouseOver])

  return <div className='coin'>
    <img
      src={bgImg}

      className='coin-bg-img'
      style={{
        zIndex: loading ? '100' : '0',
        backgroundColor: loading ? 'beige' : ''
      }}
      alt="bg"
    />

    <div
      className='loading'
      onClick={onClick}
      onMouseEnter={() => {
        setMouseOver(true)
      }}
      onMouseLeave={() => {
        setMouseOver(false)
      }}
    >
      <div className='info-header'>
        <span className='info-name'>{name}</span>
        <StatusBar status={status} />
      </div>

      <div className='info-body'>
        <img alt="logo" src={logo || coinPng} className="coin-icon" />
        <div className="coin-detail">
          <p className='price'>
            {price}
          </p>
          <p className='end-time'>
            End: {formatTime(endTimeStr)}
          </p>
        </div>
      </div>
    </div>


  </div>
}

interface StatusBarProps {
  status: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ status }) => {
  const textEnum = {
    '0': { text: 'Active', color: '#76FCB3' },
    '1': { text: 'Suspended', color: '#FFE500' },
    '2': { text: 'Terminated', color: '#FF007A' },
  }
  return <p className='status-bar'>
    <span className='circle-warp'>
      <span className='circle-out' style={{ border: `1px solid  ${textEnum[status].color}` }} ></span>
      <span className='circle-mid' style={{ border: `1px solid  ${textEnum[status].color}` }}></span>
      <span className='circle-in' style={{ backgroundColor: textEnum[status].color }}></span>
    </span>

    <span className='text' style={{ color: textEnum[status].color }}>{textEnum[status].text}</span>
  </p >
}

export default CoinItem;
import React from 'react';

export default function Hero({ children }) {
  return (
    <div className='hero'>
      <div className='banner'>
        <h1>blah blah blah</h1>
        <p>embrace your blah - we do</p>
        {children}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 }
];
const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];
function Dashboard() {
  return (
    <div className="db">
      <div className="d-flex justify-content-space-between mb-1">
        <h5 className="db-title">
          Borrow Limit:{' '}
          <span className="brand-color" style={{ color: 'var(--brand-color)' }}>
            64%
          </span>
        </h5>
        <p className="db-subtitle">$ 234.50</p>
      </div>

      <div className="bar">
        <div className="ind" style={{ width: '60%' }}></div>
      </div>

      <div className="grid align-items-center">
        <div className="col-sm-6">
          <div style={{ width: '100%', height: 200, position: 'relative' }}>
            <div className="pie-label">
              Net APY
              <b>7.5%</b>
            </div>{' '}
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                opacity="0.4"
                d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                fill="#006AE3"
              ></path>
              <path
                d="M14.85 3.95012V7.75011H6.26C4.19 7.75011 2.5 9.44012 2.5 11.5101V7.84014C2.5 6.65014 3.23 5.59009 4.34 5.17009L12.28 2.17009C13.52 1.71009 14.85 2.62012 14.85 3.95012Z"
                fill="#006AE3"
              ></path>
              <path
                d="M22.5608 13.9702V16.0302C22.5608 16.5802 22.1208 17.0302 21.5608 17.0502H19.6008C18.5208 17.0502 17.5308 16.2602 17.4408 15.1802C17.3808 14.5502 17.6208 13.9602 18.0408 13.5502C18.4108 13.1702 18.9208 12.9502 19.4808 12.9502H21.5608C22.1208 12.9702 22.5608 13.4202 22.5608 13.9702Z"
                fill="#006AE3"
              ></path>
              <path
                d="M14 12.75H7C6.59 12.75 6.25 12.41 6.25 12C6.25 11.59 6.59 11.25 7 11.25H14C14.41 11.25 14.75 11.59 14.75 12C14.75 12.41 14.41 12.75 14 12.75Z"
                fill="#006AE3"
              ></path>
            </svg>
            <div>
              <h5 className="db-title">Supply Balance</h5>
              <h5 className="db-subtitle">123.4567 ETH</h5>
            </div>
          </div>
          <div className="mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M17 4H7C4 4 2 5.5 2 9V12.56C2 12.93 2.38 13.16 2.71 13.01C3.69 12.56 4.82 12.39 6.01 12.6C8.64 13.07 10.57 15.51 10.5 18.18C10.49 18.6 10.43 19.01 10.32 19.41C10.24 19.72 10.49 20.01 10.81 20.01H17C20 20.01 22 18.51 22 15.01V9C22 5.5 20 4 17 4ZM12 14.5C10.62 14.5 9.5 13.38 9.5 12C9.5 10.62 10.62 9.5 12 9.5C13.38 9.5 14.5 10.62 14.5 12C14.5 13.38 13.38 14.5 12 14.5ZM19.25 14C19.25 14.41 18.91 14.75 18.5 14.75C18.09 14.75 17.75 14.41 17.75 14V10C17.75 9.59 18.09 9.25 18.5 9.25C18.91 9.25 19.25 9.59 19.25 10V14Z"
                fill="#27AE60"
              ></path>
              <path
                d="M5 14C3.75 14 2.62 14.59 1.89 15.49C1.33 16.18 1 17.05 1 18C1 20.21 2.8 22 5 22C6.74 22 8.23 20.89 8.77 19.33C8.92 18.92 9 18.47 9 18C9 15.8 7.21 14 5 14ZM7.36 19.74C7.34 19.8 7.3 19.86 7.26 19.9L6.54 20.61C6.45 20.71 6.33 20.75 6.2 20.75C6.07 20.75 5.94 20.71 5.85 20.61C5.69 20.46 5.67 20.22 5.77 20.04H3.76C3.12 20.04 2.6 19.52 2.6 18.87V18.77C2.6 18.49 2.82 18.28 3.09 18.28C3.36 18.28 3.58 18.49 3.58 18.77V18.87C3.58 18.98 3.66 19.07 3.77 19.07H5.78C5.68 18.88 5.7 18.65 5.86 18.49C6.05 18.3 6.36 18.3 6.54 18.49L7.26 19.21C7.3 19.25 7.34 19.31 7.37 19.37C7.41 19.48 7.41 19.62 7.36 19.74ZM7.4 17.23C7.4 17.51 7.18 17.72 6.91 17.72C6.64 17.72 6.42 17.51 6.42 17.23V17.13C6.42 17.02 6.34 16.93 6.23 16.93H4.23C4.33 17.12 4.31 17.35 4.15 17.51C4.06 17.6 3.94 17.65 3.8 17.65C3.68 17.65 3.55 17.6 3.46 17.51L2.74 16.79C2.7 16.75 2.66 16.69 2.63 16.63C2.59 16.51 2.59 16.38 2.63 16.26C2.66 16.21 2.69 16.14 2.74 16.1L3.46 15.39C3.65 15.19 3.96 15.19 4.14 15.39C4.3 15.54 4.32 15.78 4.22 15.96H6.23C6.87 15.96 7.39 16.48 7.39 17.13V17.23H7.4Z"
                fill="#27AE60"
              ></path>
            </svg>
            <div>
              <h5 className="db-title">Borrow Balance</h5>
              <h5 className="db-subtitle">123.4567 ETH</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

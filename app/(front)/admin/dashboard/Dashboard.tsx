'use client';

import Link from 'next/link';
import React from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import useSWR from 'swr';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';
import { formatNumber } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

const Dashboard = () => {
  const { data: summary, error } = useSWR('/api/orders/summary');

  if (error) {
    return <div>{error.message}</div>;
  }
  if (!summary) {
    return <div>Loading...</div>;
  }

  const salesData = {
    labels: summary.salesData.map((d: { _id: string }) => d._id),
    datasets: [
      {
        fill: true,
        label: 'Sales',
        data: summary.salesData.map(
          (d: { totalSales: number }) => d.totalSales
        ),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  const ordersData = {
    labels: summary.salesData.map((d: { _id: string }) => d._id),
    datasets: [
      {
        fill: true,
        label: 'Orders',
        data: summary.salesData.map(
          (d: { totalOrders: number }) => d.totalOrders
        ),
        borderColor: 'rgb(52, 162, 235)',
        backgroundColor: 'rgba(52, 162, 235, 0.5)',
      },
    ],
  };
  const productsData = {
    labels: summary.productsData.map((d: { _id: string }) => d._id),
    datasets: [
      {
        label: 'Category',
        data: summary.productsData.map(
          (d: { totalProducts: number }) => d.totalProducts
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)',
        ],
      },
    ],
  };
  const usersData = {
    labels: summary.usersData.map((d: { _id: string }) => d._id),
    datasets: [
      {
        label: 'Users',
        data: summary.usersData.map(
          (d: { totalUsers: number }) => d.totalUsers
        ),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const stats = [
    { name: 'Sales', value: summary.ordersPrice, href: 'orders' },
    { name: 'Orders', value: summary.ordersCount, href: 'orders' },
    { name: 'Products', value: summary.productsCount, href: 'products' },
    { name: 'Users', value: summary.usersCount, href: 'users' },
  ];

  return (
    <div>
      <div className='my-4 stats inline-grid md:flex shadow stats-vertical md:stats-horizontal'>
        {stats.map((stat) => (
          <div key={stat.name} className='stat'>
            <div className='stat-title'>{stat.name}</div>
            <div className='stat-value text-primary'>
              {stat.name === 'Sales'
                ? `$${formatNumber(stat.value)}`
                : stat.value}
            </div>
            <div className='stat-desc'>
              <Link href={`/admin/${stat.href}`}>
                View {stat.name.toLowerCase()}
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className='grid md:grid-cols-2 gap-4'>
        <div className='max-w-xs'>
          <h2 className='text-xl py-2'>Sales Report</h2>
          <Line data={salesData} />
        </div>
        <div className='max-w-xs'>
          <h2 className='text-xl py-2'>Orders Report</h2>
          <Line data={ordersData} />
        </div>
      </div>
      <div className='grid md:grid-cols-2 gap-4'>
        <div>
          <h2 className='text-xl py-2'>Products Report</h2>
          <div className='flex items-center justify-center h-80 w-96 max-w-xs'>
            {' '}
            <Doughnut data={productsData} />
          </div>
        </div>
        <div className='max-w-xs'>
          <h2 className='text-xl py-2'>Users Report</h2>
          <Bar data={usersData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

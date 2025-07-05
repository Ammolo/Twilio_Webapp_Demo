import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

const TotalSales = ({ sales_data, period_selection, single_date }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (single_date || !chartRef.current || typeof ApexCharts === 'undefined') return;

    const options = {
      chart: {
        height: "100%",
        maxWidth: "100%",
        type: "area",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: "#1C64F2",
          gradientToColors: ["#1C64F2"],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 6,
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: 0
        },
      },
      series: [
        {
          name: "Sales",
          data: sales_data[0].sales,
          color: "#1A56DB",
        },
      ],
      xaxis: {
        categories: sales_data[0].period,
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: true,
      },
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();
    return () => chart.destroy();
  }, [sales_data, single_date]);

  return (
    <div 
      className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6"
      style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: 'pointer' }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '10px 10px 20px rgba(50, 50, 93, 0.25)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)';
      }}
    >
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">{sales_data[0].total_sales}</h5>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">Sales {period_selection ? period_selection.toLowerCase() : ''}</p>
        </div>
        <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
          60 %
          <svg className="w-3 h-3 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
          </svg>
        </div>
      </div>
      {!single_date && <div id="total-sales-chart" ref={chartRef}></div>}
    </div>
  );
};

export default TotalSales;

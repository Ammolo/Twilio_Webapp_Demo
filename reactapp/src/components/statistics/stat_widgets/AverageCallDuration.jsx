import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ApexCharts from 'apexcharts';

const AverageCallDuration = ({ period_selection }) => {
  const chartRef = useRef(null);
  const [avgCallData, setAvgCallData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/call/statistics/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          },
          params: {
            period: period_selection,
            type: "avg"
          }
        });

        setAvgCallData(response.data);
      } catch (error) {
        console.error('Error fetching average call duration data:', error);
        setAvgCallData({
          period_avg_call: 0,
          avg_call_duration: [],
          period: []
        });
      }
    };

    fetchData();
  }, [period_selection]);

  useEffect(() => {
    if (period_selection === "Today" || !avgCallData || !avgCallData.avg_call_duration.length || !chartRef.current) {
      return;
    }

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
      series: [{
        name: "Avg. call duration",
        data: avgCallData.avg_call_duration,
        color: "#1A56DB",
      }],
      xaxis: {
        categories: avgCallData.period,
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
  }, [avgCallData, period_selection]);

  if (!avgCallData || !avgCallData.avg_call_duration.length) return null;

  return (
    <div 
      className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6"
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
          <h5 className="leading-none text-left text-3xl font-bold text-gray-900 dark:text-white pb-2">
            {avgCallData.period_avg_call !== null ? avgCallData.period_avg_call : 0}s
          </h5>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
            Avg. call duration {period_selection ? period_selection.toLowerCase() : ''}
          </p>
        </div>

      </div>
      {avgCallData.avg_call_duration.length && period_selection !== "Today" && <div id="avg-call-duration-chart" ref={chartRef}></div>}
    </div>
  );
};

export default AverageCallDuration;

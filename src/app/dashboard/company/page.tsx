/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { useDashboard } from '@/hooks/useDashboard';
import ReservationIcon from '@public/assets/images/icon/reservation_icon.svg';
import AgendarIcon from '@public/assets/images/icon/agendar_icon.svg';
import BuildingIcon from '@public/assets/images/icon/building_icon.svg';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Company = () => {
  const [chartData, setChartData] = useState<{ month: string; count: number }[]>([]);
  const [todayReservationDatas, setTodayReservationDatas] = useState<{ id:number,flat_name:string,room_num:number,user_name:string,work_name:string,division:string}[]>([]);

  const [totalFlatNum, setTotalFlatNum] = useState(0);
  const [totalWorkNum, setTotalWorkNum] = useState(0);
  // const [totalUserNum, setTotalUserNum] = useState(0);
  const [totalRservationNum, setTotalRservationNum] = useState(0);

  const {getDashboardData} = useDashboard();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setTotalFlatNum(data.totalFlatItems);
        setTotalWorkNum(data.totalWorkItems);
        // setTotalUserNum(data.totalUserItems);
        setTotalRservationNum(data.totalReservationItems);
        setChartData(data.monthlyReservations);
        setTodayReservationDatas(data.todayReservations);
        
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  },[]);  

  return (
    <DashboardLayout>
      <div className="flex flex-col">
  
  
      </div>
    </DashboardLayout>
  );
};

export default Company;

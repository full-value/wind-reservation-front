import { useState, useEffect, useRef } from 'react';
import { useNotificationData } from '@/state/notificationNum';

export const useDashboard = () => {
  const {setField}= useNotificationData();

  let token: string | null = null;

  // Check if we're on the client side before accessing localStorage
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const getFlatData = async () => {  

    const res = await fetch("/api/flat/getAllData", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Space added here
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Fetching failed");
    }

    const data = await res.json();
    return data;
  };
  const getApiLogData = async (pageNum:Number,searchTerm:string) => {   
    if(searchTerm === ""){
    searchTerm = "!allData!"
    }
    const res = await fetch(`/api/log/getApiLogData/${pageNum}/${searchTerm}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Fetching failed");
    }
  
    return res.json();
  };
  const getNotification = async()=>{
      const res = await fetch("/api/log/getNotification", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
    
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Fetching failed");
      }
      console.log(res)
      return res.json();
  }
  const markAsRead = async (id:Number)=>{
    const res = await fetch(`/api/log/getNotification/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Fetching failed");
    }
    console.log(res)
    return res.json();
  }
  const getDashboardData = async () => {  

    const res = await fetch("/api/reservation/getDashboardData", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Space added here
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Fetching failed");
    }

    const data = await res.json();
    return data;
  };
  const getReservationListData = async (startTime:string,endTime:string) => {  
    const res = await fetch("/api/reservation/getReservationListData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Space added here
      },
      body: JSON.stringify({startTime,endTime}),
    });
    
    const data = await res.json();
    return data;
  };
















  
  const updateReservation = async (body:any) => {  
    const res = await fetch('/api/reservation/updateReservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer${token}`  },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'search failed');
    }
    const data = await res.json();   
  };















  
  const getWorkData = async () =>{
    
    const res = await fetch('/api/work/getAllData', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer${token}` },
    }); 
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'get Data failed');
    }
    const data = await res.json();
    return data;
  }
  const getUserData = async () =>{
    
    const res = await fetch('/api/user/getAllData', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer${token}` },
    }); 
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'get Data failed');
    }
    const data = await res.json();
    return data;
  }
  const getErrorLogData = async () =>{
    
    const res = await fetch('/api/log/getErrorData', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer${token}` },
    }); 
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'get Data failed');
    }
    const data = await res.json();
    return data;
  }
  const getChangeLogData = async () =>{
    
    const res = await fetch('/api/log/getChangeData', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer${token}` },
    }); 
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'get Data failed');
    }
    const data = await res.json();
    return data;
  }
  const getNotificationNum = async () =>{
    
    const res = await fetch('/api/log/getNotificationNum', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer${token}` },
    }); 
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'get Data failed');
    }
    const data = await res.json();
    setField('Notification_Num', data.NotificationNum);
    setField('Message_Num', data.MessageNum);
    return data;
  }









  

  const changeFlat = async (body:any) =>{    
    const res = await fetch('/api/flat/changeFlat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer${token}` },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'search failed');
    }
    const data = await res.json();
  }
  const changeWork = async (body:any) =>{
    console.log("this is hookfile")
    const res = await fetch('/api/work/changeWork', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer${token}` },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'search failed');
    }
    const data = await res.json();
  }
  const changeUser = async (body:any) =>{
    console.log(token);
    const res = await fetch('/api/user/changeUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer${token}`},
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'search failed');
    }
    const data = await res.json();
  }

  const createFlat = async (body:any) =>{
    const res = await fetch('/api/flat/createFlat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer${token}` },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'search failed');
    }
    const data = await res.json();
    return data;
  }
  const createWork = async (body:any) =>{
    console.log("this is hook ",body)
    const res = await fetch('/api/work/createWork', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer${token}` },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'search failed');
    }
    const data = await res.json();
    return data
  }
  const createUser = async (body:any) =>{
 
    console.log("this is hook ",body)
    const res = await fetch('/api/user/createUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer${token}` },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'search failed');
    }
    const data = await res.json();
    return data
  }

  const deleteFlat = async (id:number) =>{
    
    const res = await fetch('/api/flat/deleteFlat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer${token}` },
      body: JSON.stringify({id}),
    });
   
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'search failed');
    }

    const data = await res.json();
    console.log("aaaaaaaaaa",data);
    return data;
  }
  const deleteWork = async (id:number) =>{
    
    const res = await fetch('/api/work/deleteWork', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer${token}` },
      body: JSON.stringify({id}),
    });
   
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'search failed');
    }

    const data = await res.json();
    return data;
  }
  const deleteUser = async (id:number) =>{
    
    const res = await fetch('/api/user/deleteUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer${token}` },
      body: JSON.stringify({id}),
    });
   
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'search failed');
    }
    
    const data = await res.json();
    
    return data;
  }
  const deleteReservation = async (id:number) =>{
    const res = await fetch('/api/reservation/deleteReservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer${token}` },
      body: JSON.stringify({id}),
    });
   
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'search failed');
    }
    
    const data = await res.json();
    
    return data;
  }
  const createReservation = async(body:any) =>{
    const res = await fetch('/api/reservation/createReservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json','Authorization': `Bearer${token}`  },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'search failed');
    }
    const data = await res.json();
    return data;
  }
 



  return { getFlatData, changeFlat, createFlat, deleteFlat,getWorkData,createWork,changeWork,deleteWork, 
           getUserData,changeUser,deleteUser,createUser, getErrorLogData,getChangeLogData,getApiLogData
           ,getNotificationNum,getNotification,markAsRead,getReservationListData,updateReservation,deleteReservation
           ,createReservation,getDashboardData
  };
};
 
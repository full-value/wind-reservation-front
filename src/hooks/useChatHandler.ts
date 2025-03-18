import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/state/chatStore';
import { chatMessages } from '@/data/chatMessages';

export const useChatHandler = () => {
  const { chatData, setField,resetForm } = useChatStore();
  const [messages, setMessages] = useState<any[]>([]); 
  const hasMounted = useRef(false);  

  const addMessage = (newMessage: any) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };
  const removeMessage = () => {
    setMessages((prevMessages) => prevMessages.slice(0, prevMessages.length - 1));
  };

  useEffect(() => {
    if (!hasMounted.current) {
      addMessage(chatMessages.welcome);
    }    
    hasMounted.current = true;
  }, [chatMessages]);

  const handleButtonClick = async (value: string, reqType: string) => {    

    switch (reqType) { // `reqType[0]` ではなく `reqType` にする
      case "select_requirement":
        resetForm();
        setField('requirement', value);
        addMessage(chatMessages[value]);
        break;
      case "installationNum":  
        setField('installNum', value);
        addMessage(chatMessages.ResidentialType);
        break;
      case "BuildingType": 
        setField('ResidentialType', value);
        addMessage(chatMessages.BuildingType);
        break;
      case "installationType":  
        setField('BuildingType', value);
        addMessage(chatMessages.installationType);
        break;
      case "isConsent": 
        setField('installationType', value);
        if (value === "入替工事") {
          addMessage(chatMessages.isRecycleRequirement);
        }else{
          addMessage(chatMessages.isConsent);
        }
        break;  
      case "isRecycleRequirement":
        setField('recycleRequirement', value);
        addMessage(chatMessages.isConsent);
        break;
      case "installationStatus":
        setField('isConsent', value);
        addMessage(chatMessages.installationStatus);
        break; 
      case "installationMethod":
        setField('installationStatus', value);
        addMessage(chatMessages.installationMethod);
        break;   
      case "isHolePiping" :
        setField('installationMethod',value);
        addMessage(chatMessages.isHolePiping);     
        break;
      case "isOutdoorDecorativeCoverRequired" :
        setField('isHolePiping',value);
        if (value === "あり") {
          addMessage(chatMessages.isOutdoorDecorativeCoverRequired);
        }else{
          addMessage(chatMessages.constructionStartDate);
        }
        break;
      case "constructionStartDate" :
        addMessage(chatMessages.isOutdoorDecorativeCoverRequired);
        break;
      case "isIndoorDecorativeCoverRequired" :
        if (value === "新規希望") {
          addMessage(chatMessages.selectColor);
        }else{
          addMessage(chatMessages.isIndoorDecorativeCoverRequired);
        }        
        break;
      case "selectedColor" : 
        addMessage(chatMessages.isIndoorDecorativeCoverRequired);
        break;
      case "inputName":
        setField('isIndoorDecorativeCoverRequired',value);
        addMessage(chatMessages.inputName);
        break;
      case "reservationConfirmation":
        setField('selectTime',value);
        if (chatData.requirement === "新しい予約") {
        const reservationData = {  
          "customerAddress": chatData.customerAddress,
          "reservationDate": chatData.selectDate,
          "reservationTime": value, 
          "customerName": chatData.customerName,
          "customerPhoneNum": chatData.customerPhoneNum
        };
        
        chatMessages.reservationConfirmation.options = Object.values(reservationData);
        addMessage(chatMessages.reservationConfirmation);
      }else if(chatData.requirement === "予約変更"){
        const res = await fetch('/api/reservation/getReservation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({customer_name:chatData.customerName, customer_phone:chatData.customerPhoneNum}),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'search failed');
        }
        const data = await res.json();
        if(data[0].length>0){
          chatMessages.bookedReservation.options = data[0];
          addMessage(chatMessages.bookedReservation);
        }else{
          addMessage(chatMessages.getReservationError);
        }
        
        
        
      }
        break;
      case "reservate" :
        if (chatData.requirement === "新しい予約") {
          if (value === "はい") {
            const reservationData = {  
              "customer_address": chatData.customerAddress,
              "reservationDate": chatData.selectDate,
              "start_time": chatData.selectTime, 
              "customer_name": chatData.customerName,
              "customer_phoneNum": chatData.customerPhoneNum
            };
            const res = await fetch('/api/reservation/createReservation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json'},
              body: JSON.stringify(reservationData),
            });
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message || 'search failed');
            }
            const data = await res.json();
            chatMessages.bookedReservation.options = data;
            addMessage(chatMessages.bookedReservation);
          }else{
            resetForm();
            addMessage(chatMessages.welcomeAgain);          
          }
        }else if(chatData.requirement === "予約変更"){
         
         
        }
        
        
        break;
      case "EndBtn" :
        resetForm();
        addMessage(chatMessages.welcomeAgain);          
        break;

      default:
        console.log("No matching case found");
        break;
    }
  };


  const handleInputEnterPress = async (value:string,reqType:string) =>{
    console.log(value,reqType);
    
    switch (reqType) {
      case 'inputAddress':
          setField('customerName',value);
          addMessage(chatMessages.inputAddress);
        break;
      case 'inputPhoneNum' :
        if (chatData.requirement === "新しい予約") {
          setField('customerAddress',value);
        }else{
          setField('customerName',value);
        }        
        addMessage(chatMessages.inputPhoneNum);
        break;
      case 'selectDate' :
        setField('customerPhoneNum',value);
        addMessage(chatMessages.selectWorkDate);
        
        break;
      case 'selectedDate':
        console.log(value);
        const res = await fetch('/api/reservation/getAvailableDate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({selectedDate:value}),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'search failed');
        }
        const data = await res.json();
        setField('selectDate',value);
        chatMessages.selectTime.options = data.availableSlots;
        addMessage(chatMessages.selectTime);
        break      
        
      default:
        break;
    }
    
  }
  const handleSelectClick = async (value:string, reqType:string) =>{     
   
  }
  const handleBackClick = async () =>{
    removeMessage();
  }
  return { messages, handleButtonClick,handleInputEnterPress,handleSelectClick, handleBackClick };
};
 
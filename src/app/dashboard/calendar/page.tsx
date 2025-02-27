'use client';
import { useState, useEffect,useRef  } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { useDashboard } from '@/hooks/useDashboard';
import { Modal } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import CustomButton from '@shared/components/UI/CustomButton';
import { notify } from '@/utils/notification';

const Calendar = () => {
  const {getReservationListData,updateReservation,deleteReservation,createReservation} = useDashboard();
  const [selectedEvent, setSelectedEvent] = useState<{id:number,user_name:string,flat_name:string,room_num:string,work_name:string,reservation_time:string,division:string} | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const calendarRef = useRef(null); 
  const [originalData,setOriginalData] = useState<{id:number,user_name:string,flat_name:string,room_num:string,work_name:string,reservation_time:string,division:string} | null>(null);
  const [changedData,setChangedData] = useState();
 
  const handleEventClick = (clickInfo: any) => {
    if (originalData && Array.isArray(originalData)) { // Check if originalData is not null and is an array
      const selectedEvent = originalData.find(
        (event: any) => Number(event.id) === Number(clickInfo.event._def.publicId)
      );
  
      if (selectedEvent) {
        setSelectedEvent(selectedEvent);
      }
    } else {
      console.error('originalData is not available');
    }   
    setModalOpen(true);
  };  
  const handleSave = async () => {
    if (selectedEvent?.id) {
      // Update existing reservation
      if (selectedEvent && originalData) {
        await updateReservation(selectedEvent);
  
        // Update the list of reservations
        const updatedEvents = originalData.map((event: any) =>
          event.id === selectedEvent.id ? selectedEvent : event
        );
  
        setOriginalData(updatedEvents);
        setChangedData(
          updatedEvents.map((reservation: any) => ({
            id: reservation.id,
            title: `予約番号${reservation.id}-${reservation.work_name}`,
            date: new Date(reservation.reservation_time).toISOString().split("T")[0],
          }))
        );
  
        setModalOpen(false);
      } else {
        console.error("originalData is null or undefined.");
      }
    } else {
      // Create new reservation
      try {
        const newReservation = await createReservation(selectedEvent);
        console.log("ddddddddd",newReservation);
        
        if (newReservation) {
          // Add new reservation to state
          const updatedOriginalData = [...originalData, newReservation];
          setOriginalData(updatedOriginalData);
  
          setChangedData([
            ...changedData,
            {
              id: newReservation.id,
              title: `予約番号${newReservation.id}-${newReservation.work_name}`,
              date: new Date(newReservation.reservation_time).toISOString().split("T")[0],
            },
          ]);
  
          
        }
        setModalOpen(false);
      } catch (error) {
        console.error("Error creating reservation:", error);
      }
    }
  };
   
  const handleDatesSet = async ({ start, end }: { start: Date; end: Date }) => {
    const startDate = start.toISOString();
    const endDate = end.toISOString();
    const data = await getReservationListData(startDate, endDate);
    changeData(data);
  };
  const changeData = (data: any) => {
    // Check if data is an array
    console.log(data);
    
    if (data.status) {
      console.log('Expected data to be an array, but got:');
    } else {
      setOriginalData(data);
      console.log(data);
  
      const dataValues = data.map((reservation: any) => {
        const formattedDate = new Date(reservation.reservation_time).toISOString().split('T')[0]; // Format the date
        const title = `予約番号${reservation.id}-${reservation.work_name}`;
        return {
          id: reservation.id,
          title: title,
          date: formattedDate,
        };
      });
      setChangedData(dataValues);
      
    }
  };
  
  const handleDelete = () => {
    if (selectedEvent?.id) {
      try {
        // Call the deleteReservation function (assumed to be an async operation)
        deleteReservation(selectedEvent.id);
  
        // Update the changedData to remove the deleted event
        setChangedData((prevChangedData) => {
          return prevChangedData.filter(data => data.id !== selectedEvent.id);
        });
  
        // Show success notification
        notify('success', '成功!', '予約が成果的に削除されました!');
  
        // Close the modal
        setModalOpen(false);
      } catch (error) {
        console.error('Error during delete operation:', error);
        notify('error', '失敗!', '予約の削除に失敗しました!');
      }
    } else {
      console.error('Selected event is not available for deletion.');
      notify('error', '失敗!', '選択されたイベントがありません。');
    }
  };

  

  useEffect(() => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    const fetchData = async () => {
      try {
        const data = await getReservationListData(currentMonthStart, currentMonthEnd);
        changeData(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col bg-gray-900">      
        <div className="bg-gray-900 p-8">   
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white mb-8">カレンダー</h1>
            <CustomButton
              type="button"
              className="font-semibold !text-[40px]"
              label="+追加"
              onClick={() => {
                setSelectedEvent({
                  id: 0,
                  user_name: "",
                  flat_name: "",
                  room_num: "",
                  work_name: "",
                  reservation_time: "",
                  division: "午前", // Set a default value for the select dropdown
                });
                setModalOpen(true);
              }} // Open modal for creating a new entry
            />
          </div>
          <div className="bg-white p-5 shadow-lg rounded-lg">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              locale={jaLocale}
              events={changedData}
              datesSet={handleDatesSet}
              eventContent={(arg) => (
                <div className="truncate-event" title={arg.event.title}>
                  {arg.event.title}
                </div>
              )}
              eventClick={(event) => handleEventClick(event)} // Event click handler
              height="600px"
            />
            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              aria-labelledby="edit-reservation-modal"
              aria-describedby="edit-reservation-description"
              className='flex justify-center items-center'
            >
              <div className="modal-content p-4 bg-white w-[40%] rounded-lg">
                {selectedEvent && (
                  <div className="flex inset-0 flex items-center justify-center  bg-opacity-50">
                  <div className="bg-white p-6 rounded-[10px] w-full">
                      <h2 className="text-xl font-bold mb-4">予約編集</h2>
                      <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="物件名"
                            value={selectedEvent.flat_name}
                            onChange={(e) => setSelectedEvent({
                              ...selectedEvent,
                              flat_name: e.target.value
                            })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            placeholder="部屋番号"
                            value={selectedEvent.room_num}
                            onChange={(e) => setSelectedEvent({
                              ...selectedEvent,
                              room_num: e.target.value
                            })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            placeholder="案件名"
                            value={selectedEvent.work_name}
                            onChange={(e) => setSelectedEvent({
                              ...selectedEvent,
                              work_name: e.target.value
                            })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                          type="number"
                          placeholder="ユーザID"
                          value={selectedEvent.user_name}
                          onChange={(e) => setSelectedEvent({
                            ...selectedEvent,
                            user_name: e.target.value
                          })}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                        <select
                          id="slelectdivision"
                          value={selectedEvent.division} // Ensure a string value
                          onChange={(e) => setSelectedEvent({
                            ...selectedEvent,
                            division: e.target.value
                          })}
                          required
                          className="w-full py-2 px-2 pr-10 rounded-[6px] border mt-1 "
                        >
                          <option value="午前">午前</option>
                          <option value="午後">午後</option>
                          <option value="どちらでも">どちらでも</option>
                        </select>
                        <input
                          type="date"
                          placeholder="開始時間"
                          value={selectedEvent.reservation_time}
                          onChange={(e) => setSelectedEvent({
                            ...selectedEvent,
                            reservation_time: e.target.value
                          })}
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex justify-end mt-4 space-x-2">
                          <button
                              onClick={handleSave}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                          >
                              保存
                          </button>
                          {selectedEvent.id? (
                            <button
                              onClick={handleDelete}
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                               削除
                            </button>
                          ):""}
                         
                          <button
                              onClick={()=>setModalOpen(false)}
                              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                          >
                              取消
                          </button>
                      </div>
                  </div>
                 </div>
                )}
                
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;

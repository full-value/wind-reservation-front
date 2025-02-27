'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { FaSearch, FaSort } from "react-icons/fa";
import MessageIcon from '@public/assets/icons/message_icon.svg';
import BellIcon from '@public/assets/icons/notification-01.svg';
import { useDashboard } from '@/hooks/useDashboard';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CheckIcon from '@public/assets/icons/check_circle_icon.svg';
import ErrorIcon from'@public/assets/icons/error_icon (log).svg';
import Notification from'@public/assets/icons/notification-01.svg';
import Modal from '@shared/components/UI/Modal';
import { timeStamp, log } from 'console';

const Api_Log = () => {
  const {getApiLogData} = useDashboard();
  const [apiLogs, setApiLogs] = useState<{ id: number,level:string, timestamp: string, message:string}[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // Add modal state
  const [modalContent, setModalContent] = useState<{user_id:string,timestamp: string, request_id:string,endpoint:string,ip_address:string,level:string,message:string,method:string,status_code:string,} | null>(null); // Optional: Store modal content
  const itemsPerPage = 10;
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getApiLogData(currentPage,searchTerm);
        setApiLogs(data.data);
        setTotalPage(data.pagination?.totalPages||0);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [currentPage,searchTerm]);

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const openModal = (log: any) => {
    setModalContent(log);
    setIsModalOpen(true);    
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
    setModalContent(null); // Reset modal content
  };
  return (
    <DashboardLayout>
      <div className="flex flex-col bg-gray-900">
        <div className="bg-gray-900 p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white mb-8">APIロク゛</h1>
          </div>

          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="検索変更履歴..."
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>

          <div className="overflow-x-aut ">
            <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700">
                  {["番号", "状態","時間", "メッセージ"].map((column) => (
                    <th
                      key={column}
                      className="px-6 py-3 text-left text-[15px] font-medium uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort(column)}
                    >
                      <div className="flex items-center">
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                        {sortColumn === column && (
                          <FaSort className={`ml-1 ${sortDirection === "asc" ? "text-gray-400" : "text-gray-200"}`} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apiLogs && (apiLogs.map((log, index) => (
                  <tr key={log.id} className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"} hover:bg-gray-700`} onClick={() => openModal(log)}>
                    <td className="px-6 py-3 w-[5%] whitespace-nowrap">{(currentPage-1)*itemsPerPage+index+1}</td>
                    <td className="px-6 py-3 w-[5%] whitespace-nowrap">{log.level === "change"?<CheckIcon />:log.level === "error"?<ErrorIcon />:log.level === "info"?<MessageIcon />:<BellIcon />}</td>
                    <td className="px-6 py-3 w-[15%] whitespace-nowrap">{new Date(log.timestamp).toISOString().replace("T", " ").replace(".000Z", "") }</td>
                    <td className="px-6 py-3 w-[75%] whitespace-wrap">{log.message}</td>
                  </tr>
                )))}
              </tbody>         
            </table> 
            <div className="flex justify-center">
              <Stack spacing={2} className='bg-gray-700 mt-1 rounded-[10px] py-1 px-5'>                    
                <Pagination 
                  color="primary" 
                  count={totalPage} 
                  page={currentPage} 
                  onChange={handlePageChange} 
                /> 
              </Stack>
            </div>         
          </div>
        </div>
        

      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="absolute z-20 w-[90vw] left-[5vw]">
          <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-[15px] font-medium uppercase tracking-wider cursor-pointer">レベル</th>
                <th className="px-6 py-3 text-left text-[15px] font-medium uppercase tracking-wider cursor-pointer">リクエストID</th>
                <th className="px-6 py-3 text-left text-[15px] font-medium uppercase tracking-wider cursor-pointer">IPアドレス</th>
                <th className="px-6 py-3 text-left text-[15px] font-medium uppercase tracking-wider cursor-pointer">ユーザーID</th>
                <th className="px-6 py-3 text-left text-[15px] font-medium uppercase tracking-wider cursor-pointer">ステータスコード</th>
                <th className="px-6 py-3 text-left text-[15px] font-medium uppercase tracking-wider cursor-pointer">メソッド</th>
                <th className="px-6 py-3 text-left text-[15px] font-medium uppercase tracking-wider cursor-pointer">エンドポイント</th>
                <th className="px-6 py-3 text-left text-[15px] font-medium uppercase tracking-wider cursor-pointer">タイムスタンプ</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100 bg-[#d1d8da]">
                <td className="px-6 py-3 whitespace-wrap text-[#201f71]">{modalContent?.level}</td>
                <td className="px-6 py-3 whitespace-wrap text-[#201f71]">{modalContent?.request_id}</td>
                <td className="px-6 py-3 whitespace-wrap text-[#201f71]">{modalContent?.ip_address}</td>
                <td className="px-6 py-3 whitespace-wrap text-[#201f71]">{modalContent?.user_id}</td>
                <td className="px-6 py-3 whitespace-wrap text-[#201f71]">{modalContent?.status_code}</td>
                <td className="px-6 py-3 whitespace-wrap text-[#201f71]">{modalContent?.method}</td>
                <td className="px-6 py-3 whitespace-wrap text-[#201f71]">{modalContent?.endpoint}</td>
                <td className="px-6 py-3 whitespace-wrap text-[#201f71]">{modalContent?.timestamp}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Api_Log;

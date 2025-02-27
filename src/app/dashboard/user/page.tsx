'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { FaSearch, FaSort } from "react-icons/fa";
import MessageIcon from '@public/assets/icons/message_icon.svg';
import BellIcon from '@public/assets/icons/notification-01.svg';
import ProfileDropDown from '@shared/components/UI/ProfileDropdown';
import CustomButton from '@shared/components/UI/CustomButton';
import { useDashboard } from '@/hooks/useDashboard';
import Modal from '@shared/components/UI/Modal';
import { notify } from '@/utils/notification';
import { Modern_Antiqua } from 'next/font/google';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Timezone } from 'next-intl';
import { log, timeStamp } from 'console';


type Props = {}

const DashboardPage = (props: Props) => {
  const { getUserData,changeUser,createUser, deleteUser} = useDashboard();
  const [users, setUsers] = useState<{ id: number, name: string, email:string, phoneNum:number,permissionStatus:string, address:String,role:string[]}[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Add modal state
  const [modalContent, setModalContent] = useState<{ type: string, users?: any } | null>(null); // Optional: Store modal content
  
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [password,setPassword] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('user');
  const [permission, setPermission] = useState('');




  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;




  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {    
    const fetchData = async () => {
      try {
        const data = await getUserData();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredusers = users.filter((users) =>
    Object.values(users).some(
      (value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedUsers = [...filteredusers].sort((a, b) => {
    if (sortColumn) {
      const column = sortColumn as keyof typeof a; // Ensure TypeScript knows it's a valid key
      if (a[column] < b[column]) return sortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

  const openModal = (users: any, type: string) => {
    setModalContent({ type, users });
    
    if(users !== null){
      
      setUserName(users.name);
      setUserEmail(users.email);
      setPassword(users.passwrod);
      setPhoneNum(users.phoneNum);
      setAddress(users.address);
      setRole(users.role);
      setPermission(users.permissionStatus);
      
    }else{
      setUserName('');
      setUserEmail('');
      setPhoneNum('');
      setPassword('');
      setAddress('');
      setRole('');      
    }   
    setIsModalOpen(true);    
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
    setModalContent(null); // Reset modal content
  }; 
  
  const handleSave = async () => {
    const updatedUserData = { 
        id: modalContent?.users.id,
        name: userName, 
        email: userEmail, 
        phoneNum: phoneNum, 
        address: address, 
        permissionStatus:permission,
        role: role}
        console.log(updatedUserData);
        
    try {
      await changeUser(updatedUserData);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === updatedUserData.id
            ? {
                ...updatedUserData,
                phoneNum: Number(updatedUserData.phoneNum), // Ensure phoneNum is a number
                role: Array.isArray(updatedUserData.role) ? updatedUserData.role : [updatedUserData.role] ,
              }
            : user
        )
      );
      notify('success', '成功!', 'データが成果的に変更されました!');
    } catch (error) {      
      notify('error', 'エラー!', '資料保管中にエラーが発生しました!');
    }
    handleCloseModal();  
  };
  const handleCreate = async () => {
    const saveUserData = { 
      name: userName, 
      password:password,
      email: userEmail, 
      phoneNum: phoneNum, 
      address: address, 
      role: role
    }   
    
    try {
      const createdUser = await createUser(saveUserData);
      if (createdUser) {
        setUsers(prevUsers => [
          ...prevUsers,
          createdUser 
        ]);
        notify('success', '成功!', 'データが成果的に保管されました!');
      } else {
        notify('error', 'エラー!', '作成されたデータは無効です!');
      }
    } catch (error) {
      notify('error', 'エラー!', '資料保管中にエラーが発生しました!');
    }
    handleCloseModal();  
  };
  
  
  const handleDelte = async () =>{
    const id = modalContent?.users.id; 
    
    try {
      const deletedUser = await deleteUser(id);
      setUsers(prevUsers => {
        return prevUsers.filter(users => users.id !== deletedUser.User.id);
      });
      notify('success', '成功!', 'データが成果的に削除されました!');
    } catch (error) {      
      notify('error', 'エラー!', '資料削除中にエラーが発生しました!');
    }
    handleCloseModal(); 
  }


  return (
    <DashboardLayout>
      <div className="flex flex-col bg-gray-900">
        <div className="bg-gray-900 p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white mb-8">ユーザー管理</h1>
            <CustomButton
              type="button"
              className="font-semibold !text-[40px]"
              label="+追加"
              onClick={() => openModal(null, 'create')} // Open modal for creating a new entry
            />
          </div>

          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="検索ユーザー..."
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
                  {["番号","ユーザID", "名前", "メール","電話番号","住所","許可状態","役割"].map((column) => (
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
                  <th className="px-6 py-3 text-left text-[15px] font-medium uppercase tracking-wider">
                  動作</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((users, index) => (
                  <tr key={users.id} className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"} hover:bg-gray-700`}>
                    <td className="pl-4 py-3 whitespace-nowrap">{(currentPage-1)*itemsPerPage+index+1}</td>
                    <td className="pl-4 py-3 whitespace-nowrap">{users.id}</td>
                    <td className="pl-4 py-3 whitespace-nowrap">{users.name}</td>
                    <td className="pl-4 py-3 whitespace-nowrap">{users.email}</td>
                    <td className="pl-4 py-3 whitespace-nowrap">{users.phoneNum}</td>
                    <td className="pl-4 py-3 whitespace-nowrap">{users.address}</td>
                    <td className="pl-4 py-3 whitespace-nowrap">{users.permissionStatus==="inpermission"?"不許可":"許可"}</td>
                    <td className="pl-4 py-3 whitespace-nowrap">{ users.role.includes("user") ?"ユーザー" : "マネージャー"}</td>
                    <td className="pl-4 py-3 whitespace-nowrap flex gap-3">
                      <button onClick={() => openModal(users, 'edit')} className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded">編集</button>
                      <button onClick={() => openModal(users, 'delete')} className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded">削除</button>
                    </td>
                  </tr>
                ))}
              </tbody>         
            </table> 
            <div className="flex justify-center">
              <Stack spacing={2} className='bg-gray-700 mt-1 rounded-[10px] py-1 px-5'>                    
                <Pagination 
                  color="primary" 
                  count={Math.ceil(sortedUsers.length / itemsPerPage)} 
                  page={currentPage} 
                  onChange={handlePageChange} 
                /> 
              </Stack>
            </div>         
          </div>
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {modalContent?.type === 'edit' && (
            <div className="flex inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-[10px] shadow-lg w-full">
                <h2 className="text-xl font-bold mb-4">情報編集</h2>
                <div className="space-y-4">
                  <input
                      type="text"
                      placeholder="名前"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                  />
                  <input
                      type="text"
                      placeholder="メール"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    placeholder="電話番号"
                    value={phoneNum}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, '');
                      if (/^\d{0,14}$/.test(numericValue)) { 
                        setPhoneNum(numericValue); 
                        
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  />

                  <input
                      type="text"
                      placeholder="住所"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                  />
                  <select
                    id="selectPermission"
                    value={role || ''} // Ensure a string value
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full py-2 px-2 pr-10 rounded-[6px] border mt-1 "
                  >
                    <option value="manager">マネージャー</option>
                    <option value="user">ユーザー</option>
                  </select>
                 <select
                    id="selectrole"
                    value={permission || ''} // Ensure a string value
                    onChange={(e) => setPermission(e.target.value)}
                    required
                    className="w-full py-2 px-2 pr-20 rounded-[6px] border mt-1 "
                  >
                    <option value="inpermission"  >不許可</option>
                    <option value="permission" >許可</option>
                  </select>
                 
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        保存
                    </button>
                    <button
                        onClick={handleCloseModal}
                        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    >
                        取消
                    </button>
                </div>
            </div>
           </div>
          )}
          {modalContent?.type === 'create' && (
            <div className="flex inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-[10px] shadow-lg w-full">
                  <h2 className="text-xl font-bold mb-4">新規ユーザー</h2>
                  <div className="space-y-4">
                  <input
                      type="text"
                      placeholder="名前"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                  />
                  <input
                      type="text"
                      placeholder="メール"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                  />
                  <input
                      type="text"
                      placeholder="パスワード"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    placeholder="電話番号"
                    value={phoneNum}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, '');
                      if (/^\d{0,14}$/.test(numericValue)) { 
                        setPhoneNum(numericValue); 
                        
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  />

                  <input
                      type="text"
                      placeholder="住所"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                  />
                  <select
                    id="selectrole"
                    value={role || ''} // Ensure a string value
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full py-2 px-2 pr-10 rounded-[6px] border mt-1 "
                  >
                    <option value="manager">マネージャー</option>
                    <option value="user">ユーザー</option>
                  </select>
                  <select
                    id="selectrole"
                    value={permission || ''} // Ensure a string value
                    onChange={(e) => setPermission(e.target.value)}
                    required
                    className="w-full py-2 px-2 pr-20 rounded-[6px] border mt-1 "
                  >
                    <option value="inpermission"  >不許可</option>
                    <option value="permission" >許可</option>
                  </select>
                </div>
                  <div className="flex justify-end mt-4 space-x-2">
                      <button
                          onClick={handleCreate}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                          保存
                      </button>
                      <button
                          onClick={handleCloseModal}
                          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                      >
                          取消
                      </button>
                  </div>
              </div>
            </div>
          )}
          {modalContent?.type === 'delete' && (
            <div className="flex inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-[10px] shadow-lg w-full">
                <h2 className="text-xl font-bold mb-4">資料を削除しますか?</h2>
                <p className="mb-6">この操作は取り消せません。削除を確認してください。</p>

                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={handleDelte}  // This will trigger the deletion action
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    はい
                  </button>
                  <button
                    onClick={handleCloseModal}  // This will close the modal without performing any action
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  >
                    いいえ
                  </button>
                </div>
              </div>
            </div>
          )}

        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

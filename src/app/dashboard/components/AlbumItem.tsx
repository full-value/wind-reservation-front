'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

import { useAlbumStore } from '@/state/albumStore';

import AlbumDetailBudge from '@/app/dashboard/components/AlbumDetailBudge';

import MoreIcon from '@/../../public/assets/icons/more.svg';
import PictureIcon from '@/../../public/assets/icons/picture.svg';
import UserIcon from '@/../../public/assets/icons/user2.svg';

import { Album, Photo } from '@/types';

type Props = {
  album: Album,
  onDelete: (albumId: string) => void
}

const AlbumItem: React.FC<Props> = ({ album, onDelete }) => {
  const { albumId, coverPhoto, name } = album;
  console.log('Photos', album)
  const { setAlbumModalOpen, setEditingAlbum } = useAlbumStore();


  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  let displayImage = 'assets/images/dashboard/placeholder.png';

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleSelect = (option: string) => {
    setDropdownVisible(false);
    if (option === 'Delete') {
      onDelete(albumId);
    } else if (option === 'Edit') {
      setAlbumModalOpen(true);
      setEditingAlbum(album);
    } {
      console.log(option);
    }
  };

  const OPTIONS = ['View', 'Edit', 'Delete'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };

    if (dropdownVisible) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownVisible]);

  return (
    <div 
      className="relative card bg-gray-100 rounded-xl"
    >
      <button
        className="absolute right-2 top-2 z-20"
        onClick={toggleDropdown}
      >
        <MoreIcon className="w-6 h-6" />
      </button>

      {dropdownVisible && (
        <div   
          ref={dropdownRef}
          className="absolute top-[33px] right-2 p-1 mt-1 w-[60px] bg-black rounded-md shadow-lg z-40"
        >
          {OPTIONS.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              className="cursor-pointer hover:bg-[#00a0ff] text-white rounded-sm text-[12px] pt-[2px] pb-[2px] pl-[5px]"
            >
              {option}
            </div>
          ))}
        </div>
      )}      
      
      <div className="absolute left-[8px] bottom-[85px] lg:left-[16px] lg:bottom-[95px] z-20">
        <AlbumDetailBudge
          icon={<PictureIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />}
          budget={384}
        />
      </div>
      
      <div className="absolute left-[8px] bottom-[55px] lg:left-[16px] lg:bottom-[65px] z-20">
        <AlbumDetailBudge
          icon={<UserIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />}
          budget={26}
        />
      </div>

      <Link href={`/dashboard/albums/${albumId}`}>
        <div className="relative w-full pt-[61.5%] sm:pt-[58.8%] lg:pt-[61.5%]">
          
            <img
              src={`${displayImage}`}
              loading="lazy"
              alt={album.albumId}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-tl-xl rounded-tr-xl"
            />
          
        </div>
        <div className="p-3">
          <h2 className="sm:text-lg text-base truncate">{album.name}</h2>
        </div>
      </Link>
    </div>
  )
}

export default AlbumItem;

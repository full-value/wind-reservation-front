'use client';

import React from 'react';
import Link from 'next/link';

import AlbumDetailBudge from '@/app/dashboard/components/AlbumDetailBudge';

import MoreIcon from '@/../../public/assets/icons/more.svg';
import CheckedIcon from '@/../../public/assets/icons/custom-check-checked.svg';
import UncheckedIcon from '@/../../public/assets/icons/custom-check-unchecked.svg';

import { Photo } from '@/types';

type Props = {
  photo: Photo,
  selectedPhotos: Photo[];
  onSelectHandler: (photo: Photo) => void;
}

const PhotoItem: React.FC<Props> = ({ photo, selectedPhotos, onSelectHandler }) => {
  const { photoId, originalKey, compressedKey, originalUrl, compressedUrl, isUploaded, createdAt, updatedAt } = photo;

  const isSelected = selectedPhotos.some((selectedPhoto) => selectedPhoto.photoId === photoId);

  return (
    <div 
      className="relative card bg-gray-100 rounded-xl"
    >
      <MoreIcon className="absolute right-2 top-2 z-20 w-6 h-6" />

      {isSelected ? (
        <CheckedIcon
          className="absolute left-2 top-2 z-20 cursor-pointer w-6 h-6 text-[#00A0FF]"
          onClick={() => onSelectHandler(photo)}
        />
      ) : (
        <UncheckedIcon
          className="absolute left-2 top-2 z-20 cursor-pointer w-6 h-6 text-white"
          onClick={() => onSelectHandler(photo)}
        />
      )}
      
      <div 
        className="w-full rounded-tl-xl rounded-tr-xl"
        style={{
          height: 'auto',
          aspectRatio: '4 / 3',
        }}
      >
        <img
          src={`${compressedUrl}`}
          alt={photoId}
          className="w-full h-full object-cover rounded-tl-xl rounded-tr-xl"
        />
      </div>
    </div>
  )
}

export default PhotoItem;

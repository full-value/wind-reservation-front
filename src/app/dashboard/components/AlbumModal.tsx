'use client';

import { useState, useEffect, useCallback } from 'react';
import { Album } from '@/types';

import Modal from '@/app/shared/components/UI/Modal';

import CustomInput from '@/app/shared/components/UI/CustomInput';
import CustomButton from '@/app/shared/components/UI/CustomButton';
import ArrowIcon from '@/../../public/assets/icons/arrow.svg';
import { notify } from '@/utils/notification';

interface AlbumModalProps {
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  album?: Album;
  onCreate: (data: { title: string; description: string }, onSuccess?: () => void) => void;
  onUpdate: (
    data: { albumId: string; albumData: { title: string; description: string } },
    onSuccess?: () => void
  ) => void;
}

const AlbumModal = ({ 
  isLoading,
  isOpen, 
  onClose,
  album,
  onCreate,
  onUpdate,
}: AlbumModalProps) => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(album?.name || '');
      setDescription(album?.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [album, isOpen]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!title.trim() || !description.trim()) {
        notify('warning', 'Warn!', 'Title and description are required.');
        return;
      }

      if (album) {
        onUpdate({ albumId: album.albumId, albumData: { title: title.trim(), description: description.trim() } }, onClose);
      } else {
        onCreate({ title: title.trim(), description: description.trim() }, onClose);
      }

    },
    [title, description, album, onCreate, onUpdate]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-header p-4 border-b border-solid">
        <h6 className="text-2xl font-semibold">{album ? 'Edit Album' : 'Create New Album'}</h6>
        <p className="text-sm text-gray-400 font-normal">{album ? 'Update album details' : 'Please enter your details'}</p>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="modal-form-input px-4 pb-4 border-b border-solid">
          <CustomInput
            value={title}
            onChangeHandler={setTitle} 
            label="Give album a title"
            placeholder="Enter Title"
            id="album-title"
          />
          
          <CustomInput
            value={description}
            onChangeHandler={setDescription} 
            label="Description"
            placeholder="Enter Description"
            id="album-description"
          />
        </div>
        <div className="p-4">
          <CustomButton
            type="submit"
            isLoading={isLoading}
            label={album ? 'Update Album' : 'Create Album'}
            icon={<ArrowIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#00A0FF]" /> }
          />
        </div>
      </form>
    </Modal>
  );
};

export default AlbumModal;

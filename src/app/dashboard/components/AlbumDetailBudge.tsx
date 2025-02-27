import React from 'react';

type Props = {
  icon: React.ReactNode;
  budget: number;
};

const AlbumDetailBadge = ({ icon, budget }: Props) => {
  return (
    <div className="flex items-center py-[3px] px-[4px] bg-white/30 rounded-lg">
      {icon}
      <h4 className="font-normal text-sm text-white mr-[4px]">{budget}</h4>
    </div>
  );
};

export default AlbumDetailBadge;
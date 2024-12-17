"use client"
import { getFolderInfo } from '@/actions/workspace';
import { useQueryData } from '@/hooks/userQueryData';
import React from 'react'
import { FolderProps } from '@/types/index.type';

interface Props {
    folderId:string
}

const FolderInfo = ({folderId}: Props) => {

    const { data } = useQueryData(["folder-info", folderId], () => getFolderInfo(folderId));

  if (!data) {
    return <div>Loading...</div>; // Handle loading state
  }

  const folder = data as FolderProps;

  return (
    <div className="flex items-center">
      <h2 className="text-[#BdBdBD] text-2xl">{folder.data.name}</h2>
    </div>
  );
};

export default FolderInfo;
import { getAllUserVideos, getFolderInfo } from '@/actions/workspace';
import FolderInfo from '@/components/ui/global/folders/folder-info';
import Videos from '@/components/ui/global/videos';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import React from 'react'


interface Props {params:{folderId:string ,workspaceId:string}}

const page = async ({ params: { folderId, workspaceId } }: Props) => {
    
    console.log(folderId , "data" )
   
    const query = new QueryClient();
    await query.prefetchQuery({
        queryKey: ['folder-videos'],
        queryFn:()=> getAllUserVideos(folderId)
    })

    await query.prefetchQuery({
        queryKey: ['folder-info'],
        queryFn: ()=> getFolderInfo(folderId)
    })

    return (
      <HydrationBoundary state={dehydrate(query)}>
            <FolderInfo folderId={folderId} />
            <Videos workspaceId={workspaceId} folderId={folderId} videosKey="folder-videos" />
      </HydrationBoundary>
    );
}

export default page
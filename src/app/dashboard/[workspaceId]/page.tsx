import React from 'react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import CreateWorkspace from '@/components/ui/global/create-workspace'
import CreateFolders from '@/components/ui/global/create-folders'
import Folders from '@/components/ui/global/folders'
interface Props {
  params:{workspaceId :string}
}

const page = ({params}: Props) => {
  return (
    <div>
    <Tabs defaultValue="videos" className="mt-6">
  <div className="flex w-full justify-between items-center">
    <TabsList className="bg-transparent gap-2 pl-0 ">
          <TabsTrigger className=" p-[13px] px-6 rounded-full  items-center data-[state=active]:bg-[#252525] " value="videos" >
             Videos
          </TabsTrigger>
           <TabsTrigger className=" p-[13px] px-6 rounded-full  items-center data-[state=active]:bg-[#252525] " value="archive">
             Archive
          </TabsTrigger>
          </TabsList>

          <div className="flex gap-x-3">
            <CreateWorkspace />
            <CreateFolders worksapceId={params.workspace.id} />
          </div>
        </div>
        
        <section className="py-9">
          <TabsContent value='videos'>
             <Folders workspaceId={params.workspaceId}/>

              </TabsContent> 
        </section>
      </Tabs>
    </div>
  )
}

export default page
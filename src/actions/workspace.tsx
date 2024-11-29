"use server"

import { client } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"


export const verifyAccessToWorkspace = async (workspaceId:string) => {
    try {
        const user = await currentUser()
        if (!user) return { status: 403 }
        
        const isUserInWorkspace = await client.workSpace.findUnique({
            where: {
                id: workspaceId,
                OR: [
                   { User: {
                        clerkid:user.id
                    }
                    },
                    {
                        members: {
                            every: {
                                User: {
                                    clerkid:user.id
                                }
                            }
                        }
                    }
                ]
            }
        })
        return {
            status: 200,
            data: {
                workspace:isUserInWorkspace
            }
}

    } catch (error) {
        return {
            status: 403,
            data:{workspace:null}
        }
    }
}

export const getWorkspaceFolders = async(workSpaceId:string) => {
    try {
        const isFolder = await client.folder.findMany({
          where: {
            workSpaceId,
          },
          include: {
            _count: {
              select: {
                videos: true,
              },
            },
          },
        });

        if (isFolder && isFolder.length > 0) return {
            status:200 , data:isFolder
        }

        return {status:404 , data:isFolder}
    } catch (error) {
        return {status :403 , data:[]}
    }
}


export const getAllUserVideos = async (workSpaceId:string) => {
    try {
        const user = await currentUser()
        if (!user) return { status: 404 }
        const videos = await client.video.findMany({
            where: {
                OR:[{workSpaceId},{folderId:workSpaceId}],
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                source: true,
                processing: true,
                Folder: {
                    select: {
                        id: true,
                        name:true
                    },
                },
                User: {
                    select: {
                        firstname: true,
                        lastname: true,
                        image:true
                    }
                },
               

            },
             orderBy: {
                  createdAt:"asc"      
                }
        })
        if (videos && videos.length > 0) {
            return {status:200 , data:videos}
        }
        return {status:400 , data:[]}
    } catch (error:any) {
        return {status:403 , error}
    }
}

export const getWorkspaces =async ()=> {
    try {
        const user = await currentUser();
        if (!user) return { status: 403, message: "user not found" }
        
        const workspaces = await client.user.findUnique({
            where: {
                clerkid:user.id
            },
            select: {
                subscription: {
                    select: {
                       plan:true
                   } 
                },
                workspace: {
                    select: {
                        id: true,
                        name: true,
                        type:true,
                    }
                },
                members: {
                    select: {
                        WorkSpace: {
                            select: {
                                id: true,
                                name: true,
                                type:true
                            }
                        }
                    }
                }
            }
        })

        if (workspaces) return { status: 200, data: workspaces }
        
        return { status: 403, data: [] };
    } catch (error:any) {
        return {stutus : 403 , error}
    }
}

export const CreateWorkspace = async(name:string) => {
        try {
            const user = await currentUser()
     
            if(!user){
                return {status:404}
            }
            const authorized = await client.user.findUnique({
                where:{
                    clerkid:user.id
                },
                select:{
                    subscription:{
                        select:{
                            plan:true
                        }
                    }
                }
            })

            if(authorized?.subscription?.plan ==="PRO"){
                const workspace = await client.user.update({
                    where: {
                        clerkid: user.id
                    },
                    data: {
                        workspace: {
                            create: {
                                name,
                                type: 'PUBLIC'
                            }
                        }
                    }
                })
                 if(workspace){
                return {status:201 , data:workspace}
            }
            }
           return {status:401 ,data:"you are not eligible to create workspaces " }

        } catch (error) {
            return {status:500 , data:error}
        }
}

export const renameFolders = async(folderId : string , name :string)=>{
    try {
        const folder = await client.folder.update({
            where:{
                id:folderId
            },
            data:{
                name
            }
        })

        if(folder){

            return{status : 200 , data :"folder renamed"}
        }

        return {status :400 , data : 'folder not exist'}
    } catch (error) {
        return {status :500 , data : error}
    }
}
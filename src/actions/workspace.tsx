"use server"

import { client } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import nodemailer from 'nodemailer'

export const sendEmail = (
    to: string,
    subject: string,
    text: string,
    html?:string
) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAILER_EMAIL,
            pass: process.env.MAILER_PASSWORD
        },

        
    })

    const mailoptions = {
        to , subject , text,html
    }

    return {transporter , mailoptions}
}

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


export const createFolder = async (workspaceId: string) => {
    
 try {
     const isNewFodler = await client.workSpace.update({
     where: {
         id:workspaceId
         },
         data: {
             folders:{
                 create:{name:"Untitle"}
             }
         }

     })
     
     if (isNewFodler) {
         return {status:200 , message:"new folder created"}
     }


 } catch (error) {
    return {status:500 , message:error}
 }
}
    

  export const getFolderInfo = async (folderId: string) => {
    try {
      const folder = await client.folder.findUnique({
        where: {
          id: folderId,
        },
        select: {
          name: true,
          _count: {
            select: {
              videos: true,
            },
          },
        },
      });

      if (folder) {
        return { status: 200, data: folder };
      }

      return { status: 400, data: null };
    } catch (error) {
      return { status: 500, data: error };
    }
};
  
export const moveVideoLocation =async (
    videoId: string,
    workspaceId: string,
    folderId: string
) => {
    try {
        const location = await client.video.update({
            where: {
                id: videoId
        },
    data: {
        folderId: folderId || null,
           
    },
        })
        if (location) {
    return {status:200 , data:"folder change successfully"}
        }
        
        return {status:400,data:"error not found"}

    } catch (error) {
        return {status:500 , data:error}
    }
}

export const getPreviewVideo = async (videoId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const video = await client.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        createdAt: true,
        source: true,
        description: true,
        processing: true,
        views: true,
        summery: true,
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
            clerkid: true,
            trial: true,
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    });
    if (video) {
      return {
        status: 200,
        data: video,
        author: user.id === video.User?.clerkid ? true : false,
      };
    }

    return { status: 404 };
  } catch (error) {
    return { status: 400 };
  }
};

export const inviteMembers = async (
  workspaceId: string,
  receiverId: string,
  email: string
) => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404 };

    const senderInfo = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
          id: true,
          firstname: true,
          lastname:true
      },
    });

    if (senderInfo?.id) {
      const workspace = await client.workSpace.findUnique({
        where: {
          id: workspaceId,
        },
        select: {
          name: true,
        },
      });

      if (workspace) {
          const invitation = await client.invite.create({
            data: {
              senderId: senderInfo.id,
                  recieverId: receiverId,
                  workSpaceId: workspaceId,
                  content:`you are invited join ${workspace.name} workspace , click to accept ro confirm`
                                     
              },
              select: {
                  id:true
              }
          });

           await client.user.update({
              where: {
                  clerkid: user.id,
              },
              data: {
                  notification: {
                      create: {
                        content:`${user.firstName} ${user.lastName} invited ${senderInfo.firstname} into ${workspace.name} `
                    }
                  }
                
                  
              }
          })

          if (invitation) {
              const { transporter, mailoptions } = sendEmail(email, 'you got an invitation'
                  , `you are invited to join ${workspace.name} Workspace , click to accept`,
                  `<a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}" style="background-color:#000; padding:5px 10px ; border-radius :10px ; " 
                   >
                     Accept Invite
                  </a>`
                  
              )
              transporter.sendMail(mailoptions, async (error , info) => {
                  if (error) {
                      console.log(error.message)
                  }
                  else {
                      console.log("email send " , info)
                  }
              })
              return {status:200 , data:"invite send"}
          }
           return { status: 400, data: "invite failed" };

        }
         return { status: 404, data: "workspace not found" };
      }
      return { status: 404, data: "recipient not found" };
  } catch (error) {
       return { status: 400, data: "something went wrong" };
      
  }
};

export const seneEmailForfirstView = async (videoId: string) => {
    try {
        const user = await currentUser()

        if (!user) return { status: 400 };

        const firstViewSetting = await client.user.findUnique({
            where: {
                clerkid:user.id
            },
            select: {
                firstView:true
            }
        })

        if (!firstViewSetting?.firstView) {return }
        
        const video = await client.video.findUnique({
            where: {
                id:videoId
            },
            select: {
                title: true,
                views: true,
                User: {
                    select: {
                        email:true
                    }
                }
            }
        })

        if (video && video.views === 0) {
            await client.video.update({
                where: {
                    id:videoId
                },
                data: {
                    views:video.views+1
                }
            })
        }

        const { transporter, mailoptions } = sendEmail(
            video?.User?.email!,
            "you got a viewer",
            `your video ${video?.title} just got its first viewer`
        )
         

        transporter.sendMail(mailoptions, async(error , info) => {
            if (error) {
                console.log(error.message)
            }
            else {
                const notifications = await client.user.update({
                    where: {
                        clerkid:user.id
                    },
                    data: {
                        notification: {
                            create: {
                                content:mailoptions.text
                            }
                        }
                    }
                })

                if (notifications) {
                    return {status:200}
                }
            }
        })

      
    } catch (error) {
        console.log(error)
    }
}
"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";



export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }

    const userExist = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
      },
    });
    if (userExist) {
      return { status: 200, user: userExist };
    }

    const newUser = await client.user.create({
      data: {
        clerkid: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
        studio: {
          create: {},
        },
        subscription: {
          create: {},
        },
        workspace: {
          create: {
            name: `${user.firstName}'s Workspace`,
            type: "PERSONAL",
          },
        },
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });
    if (newUser) {
      return { status: 201, user: newUser };
    }
    return { status: 400 };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const getNotifications = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const notifications = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        notification: true,
        _count: {
          select: {
            notification: true,
          },
        },
      },
    });

    if (notifications && notifications.notification.length > 0)
      return { status: 200, data: notifications };
    return { status: 404, data: [] };
  } catch (error) {
    return { status: 400, data: [] };
  }
};


export const searchUsers = async (query :string) => {
  try {
    const user = await currentUser()
    const users = await client.user.findMany({
      where: {
        OR: [
          { firstname: { contains: query } },
          { email: { contains: query } },
          {lastname:{contains :query}}
        ],
        NOT: [
          {clerkid : user!.id}
        ]
      },
      select: {
        id: true,
        subscription: {
          select: { plan: true },
         
        },
        firstname: true,
        lastname: true,
        image: true,
        email:true
      }

      
    })

    if (users.length > 0) {
      return { status: 200, data: users };
    } 

    return {status : 404 , data:undefined}
  } catch (error:any) {
    return {status :500 , error}
  }
}


export const getPaymentInfo = async() => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 400 }
    }

    const payment = await client.user.findUnique({
      where: {
        clerkid:user.id
      },

      select:{
        subscription: {
          select: {
               plan:true
             }
           }
      }
    })
    
    if(payment)return {status:200 , data:payment}

  } catch ( error) {
      return {status:400}
  }
}


export const getFirstView = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 }
    
    const userData = await client.user.findUnique({
      where: {
         clerkid:user.id
      },
      select: {
        firstView:true
      }
    })

    if (userData) return { status: 200, data: userData.firstView }
    
    return {status:400 , data:null}
  } catch (error) {
    return {status:400}
  }
}


export const enableFirstView = async (state: boolean) => {
  try {
    const user = await currentUser()

    if (!user) {
      return { status: 404 }
    }

    const view = await client.user.update({
      where: {
        clerkid: user.id
      },
      data: {
        firstView: state
      }
    })

    if (view) return { status: 200, data: "status updated" }
    
    return {status:400 , data:null}
    
  } catch (error) {
    return {status:400}
  }
}


export const createCommentAndReply = async(userId :string , comment:string , videoId:string , commnetId?:string | undefined ) => {
  
    try {
    if(commnetId) { const reply = await client.comment.update({
        where: {
           id:commnetId
        },
        data: {
          reply: {
            create: {
              comment, userId, videoId
            }
          }
        }
      })
      
      if (reply) {
        return {status : 200 , data:'reply posted'}
      }}

     
      const newComment = await client.video.update({
        where: {
           id:videoId
        },
        data: {
          Comment: {
            create: {
                  comment, userId
            }
        }
        }
      })

      if (newComment) return { status: 200, data: "new comment created" }
      


      
    } catch (error) {
      return { status: 400, data: null };
    }

}

export const getUserProfile = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    
    const userprofile = await client.user.findUnique({
      where:{
        clerkid:user.id
      },
      select: {
        image: true,
        id:true
      }
    })

    if(userprofile) return {status:200 , data : userprofile}
  } catch (error) {
      return {status :400}
  }
}

export const getVideosComments = async (Id: string) => {
  try {
    const comment = await client.comment.findMany({
      where: {
        OR: [{ videoId: Id }, { commentId: Id }],
        commentId:null,
      },
      include: {
        reply: {
          include: {
            User:true,
          },

        },
        User:true
      }
    })

   return { status: 200, data: comment }
    
    return{status:400}
  } catch (error) {
    
    return { status: 404 };
  }
}


export const acceptInvite = async(inviteId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    
    const invitation = await client.invite.findUnique({
      where: {
        id:inviteId
      },
      select: {
        workSpaceId: true,
        reciever: {
          select: {
            clerkid:true
          }
        }
      }
    })

    if (user.id !== invitation?.reciever?.clerkid) return { status: 401 };

    const acceptInvite =  client.invite.update({
      where: {
        id:inviteId
      },
      data: {
        accepted:true
      }

    })

    const updateMember = client.user.update({
      where: {
        clerkid:user.id
      },
      data: {
        members: {
          create: {
            workSpaceId:invitation.workSpaceId
          }
        }
      }
    })

    const membersTransaction = await client.$transaction([acceptInvite, updateMember])
    
    if (membersTransaction) {
      return {status: 200}
    }
      return { status: 400 };

  } catch (error) {
      return { status: 500 };
  }
}
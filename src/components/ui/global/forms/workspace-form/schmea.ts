import {z} from 'zod'

export const worksapceschema =z.object({
    name:z.string().min(1, {message :'Workspace name requires'})
})


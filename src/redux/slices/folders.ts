import { createSlice, PayloadAction } from '@reduxjs/toolkit'


type initialStateProps ={
    folder: ({
        _count: {
          videos:number
      }
    } & {
        id: string,
        name: string,
        createdAt: Date,
        workSpaceId:string | null
    }
    
    )[]
}

const initialState: initialStateProps = {
    folder:[]
}

export const Folders = createSlice({
    name: "folders",
    initialState,
    reducers: {
        FOLDERS: (state, action: PayloadAction<initialStateProps>)=>{
            return {...action.payload}
        }
    }
})

export const { FOLDERS } = Folders.actions
export default Folders.reducer


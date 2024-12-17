'use client'

import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { TypedUseSelectorHook, useSelector } from "react-redux";

import FolderReducer from '@/redux/slices/folders'

import WorkSpaceReducer from "@/redux/slices/workspaces";

const rootReducer = combineReducers({
    FolderReducer,
    WorkSpaceReducer
})


export const store = configureStore({
    reducer: rootReducer, 
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck:false,
        })
    
})

export type Rootstate = ReturnType<typeof store.getState>

export type AppDipatch = typeof store.dispatch

export const useAppSelector : TypedUseSelectorHook<Rootstate> = useSelector
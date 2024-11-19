import React from 'react'
import { Spinner } from './spinner'
import { cn } from '@/lib/utils'

interface Props {
    state: boolean,
    className?: string,
    color?: string,
    children?:React.ReactDOM
}

const index = ({state,className,color , children}: Props) => {
    return state ? (<div className={cn(className)}>
        <Spinner/>
    </div>) : (
            children
    )
}
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../dialog'

interface Props {
    trigger: React.ReactNode
    children: React.ReactNode
    title: string
    description: string
    className ?: string

}

const Modal = ({ trigger, children, title, description, className }: Props) => {
  return (
    <div>
      <Dialog>
      <DialogTrigger className={className} asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        </DialogContent>
        </Dialog>
    </div>
  );
};

export default Modal
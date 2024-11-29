"use client"
import Image from 'next/image';
import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../select";
import { useRouter } from 'next/navigation';
import { Separator } from '../../separator';
import { useQueryData } from '@/hooks/userQueryDAta';
import { getWorkspaces } from '@/actions/workspace';
import { Notificationprops, WorkspaceProps } from '@/types/index.type';
import Modal from '../Modal';
import { Description } from './../../../../../node_modules/cmdk/node_modules/@radix-ui/react-dialog/dist/index.d';
import { Ghost, Menu, PlusCircle } from 'lucide-react';
import Search from '../search';
import { MENU_ITEMS } from '@/constants';
import SidebarItem from './sidebar-items';
import { usePathname } from 'next/navigation';
import { getNotifications } from '@/actions/user';
import WorkspacePlaceholder from './workspace-palcecholder';
import GlobalCard from '../global-card';
import { Button } from '../../button';
import Laoder from '../loader';
import { Sheet, SheetContent, SheetTrigger } from '../../sheet';
import InfoBar from "../info-bar"



interface Props {
  activeWorkspaceId:string
}

const Sidebar = ({ activeWorkspaceId }: Props) => {
  const router = useRouter()
  const pathname = usePathname()

  const { data: notification } = useQueryData(
    ["user-notification"],
    getNotifications
  );

  

  // const { data: count } = notification as Notificationprops;
  
  const onValueChange = (value:string) => {
    router.push(`/dashboard/${value}`)
  }

  const { data, isFetched } = useQueryData(["user-workspaces"], getWorkspaces)


const menuItems = MENU_ITEMS(activeWorkspaceId);
  
  const { data: workspaces } = data as WorkspaceProps
  
  const currentWorkspace = workspaces.workspace.find((s)=> s.id === activeWorkspaceId)


  const sideBarsection = (
    <div className="bg-zinc-800 flex-none relative p-4 h-full w-[250px] flex flex-col items-center overflow-hidden ">
      <div className="p-4 gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0">
        <Image src={"/opal-logo.svg"} height={40} width={40} alt="logo" />
        <p className="text-2xl text-black">Opal</p>
      </div>

      <Select defaultValue={activeWorkspaceId} onValueChange={onValueChange}>
        <SelectTrigger className=" mt-16 text-neutral-400 bg-transparent">
          <SelectValue placeholder="Select a workspace"></SelectValue>
        </SelectTrigger>

        <SelectContent className="bg-[#11111] backdrop-blur-xl">
          <SelectGroup>
            <SelectLabel>Workspaces</SelectLabel>
            <Separator />
            {workspaces.workspace.map((work) => (
              <SelectItem key={work.id} value={work.id}>
                {work.name}
              </SelectItem>
            ))}
            {workspaces.members.length > 0 &&
              workspaces.members.map(
                (work) =>
                  work.Workspace && (
                    <SelectItem
                      key={work.Workspace.id}
                      value={work.Workspace.id}
                    >
                      {" "}
                      {work.Workspace.name}
                    </SelectItem>
                  )
              )}
          </SelectGroup>
        </SelectContent>
      </Select>
      {currentWorkspace?.type === "PUBLIC" &&
        workspaces.subscription?.paln == "PRO" && (
          <Modal
            trigger={
              <span className="text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90 hover:bg-neutral-800/60 w-full rounded-sm p-[5px gap-3">
                <PlusCircle
                  size={15}
                  className="text-neutral-400 fill-neutral-500"
                />

                <span className="text-neutral-400 font-semibold text-xs">
                  Invite To Workspace
                </span>
              </span>
            }
            title={"Invite To Workspace"}
            description={"Invite other users to your workspace"}
          >
            <Search workspaceId={activeWorkspaceId} />
          </Modal>
        )}

      <p className="w-full text-[#9d9d9d] font-bold mt-4">Menu</p>
      <nav className="w-full">
        <ul>
          {menuItems.map((items) => (
            <SidebarItem
              href={items.href}
              icon={items.icon}
              selected={pathname === items.href}
              title={items.title}
              key={items.title}
              notifications={
                (items.title === "Notification" &&
                  count._count &&
                  count._count.notification) ||
                0
              }
            />
          ))}
        </ul>
      </nav>

      <Separator className="w-4/5" />

      <p className="w-full text-[#9D9d9D] font-bold mt-4">Workspace</p>

      <nav className="w-full">
        <ul className="h-[15px] overflow-auto overflow-x-hidden fade-layer">
          {workspaces.workspace.length > 0 &&
            workspaces.workspace.map((item) => (
              <SidebarItem
                href={`/dashboard/${item.id}`}
                selected={pathname === `/dashbaord/${item.id}`}
                title={item.name}
                notifications={0}
                key={item.name}
                icon={
                  <WorkspacePlaceholder>
                    {item.name.charAt(0)}
                  </WorkspacePlaceholder>
                }
              />
            ))}
        </ul>
      </nav>

      <Separator className="w-4/5" />

      <p className="w-full text-[#9D9D9D] font-bold mt-4">Workspace</p>

      {workspaces.workspace.length > 1 && workspaces.members.length === 0 && (
        <div className="w-full mt-[-10px]">
          <p className="text-[#3c3c3c] font-medium text-sm">
            {workspaces.subscription?.paln === "FREE"
              ? " Upgrade to create workspaces"
              : "No Workspaces "}
          </p>
        </div>
      )}

      <nav className="w-full">
        <ul className="h-[15px] overflow-auto overflow-x-hidden fade-layer">
          {workspaces.workspace.length > 0 &&
            workspaces.workspace.map(
              (item) =>
                item.type !== "PERSONAL" && (
                  <SidebarItem
                    href={`/dashboard/${item.id}`}
                    selected={pathname === `/dashbaord/${item.id}`}
                    title={item.name}
                    notifications={0}
                    key={item.name}
                    icon={
                      <WorkspacePlaceholder>
                        {item.name.charAt(0)}
                      </WorkspacePlaceholder>
                    }
                  />
                )
            )}

          {workspaces.members.length > 0 &&
            workspaces.members.map((item) => (
              <SidebarItem
                href={`/dashboard/${item.Workspace.id}`}
                selected={pathname === `/dashbaord/${item.Workspace.id}`}
                title={item.Workspace.name}
                notifications={0}
                key={item.Workspace.name}
                icon={
                  <WorkspacePlaceholder>
                    {item.Workspace.name.charAt(0)}
                  </WorkspacePlaceholder>
                }
              />
            ))}
        </ul>
      </nav>

      <Separator className="w-4/5" />

      {workspaces.subscription?.paln === "FREE" && (
        <GlobalCard
          title={"Upgrade to Pro"}
          description="deciption"
          footer={
            <Button className="text-sm w-full mt-2">
              <Laoder state={true}>Upgrade</Laoder>
            </Button>
          }
        ></GlobalCard>
      )}
    </div>

   
    
    
  );
  
  return (
    <div className="w-fit ">
      <InfoBar />
      <div className="md:hidden fixed my-4">
        <Sheet>
          <SheetTrigger asChild className="ml-2">
            <Button variant={"ghost"} className="mt-[12px]">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className="p-0 w-fit h-full">
            {sideBarsection}
          </SheetContent>
        </Sheet>
      </div>

      <div className="md:block hidden h-full ">{sideBarsection}</div>
    </div>
  );
}

export default Sidebar;
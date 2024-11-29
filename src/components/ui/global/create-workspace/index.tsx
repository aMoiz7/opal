"use client"
import { useQueryData } from "@/hooks/userQueryDAta";
import React from "react";
import { Button } from "../../button";
import Modal from "../Modal";
import { getWorkspaces } from "@/actions/workspace";
import FolderPlusDuotine from './../../../icons/folder-plus-duotone';
import WorkspaceForm from "../form/workspace-form";

interface Props {}

const CreateWorkspace = (props: Props) => {


  const  data = useQueryData(["user-workspaces"], getWorkspaces);

  const { data: plan } = data as {
    status: number;
    data: {
      subscription: {
        plan: "PRO" | "FREE";
      } | null;
    };
  };

  if (plan.subscription?.plan === "FREE") {
    return <></>;
  }

  if (plan.subscription?.plan === "PRO")
    return (
      <Modal
        title="Create a workspace"
        description="Workspaces helps you collaborate with team members . you are assignes a default personal workspace where you can share videos in private with yourself"
        trigger={
          <Button className=" bg-[#1D1D1D] text-[#707070] flex items-center gap-2 px-4 rounded-2xl">
            <FolderPlusDuotine />
            Create a workspace
          </Button>
        }
      >
        <WorkspaceForm />
      </Modal>
    );
};

export default CreateWorkspace;

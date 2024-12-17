import { getNotifications, onAuthenticateUser } from "@/actions/user";
import {
  getAllUserVideos,
  getWorkspaceFolders,
  getWorkspaces,
  verifyAccessToWorkspace,
} from "@/actions/workspace";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Sidebar from "@/components/ui/global/sidebar";
import GlobalHeader from "@/components/ui/global/global-header";

interface Props {
  params: { workspaceId: string };
  children: ReactNode;
}

async function fetchData(workspaceId: string) {
  const auth = await onAuthenticateUser();

  if (!auth.user?.workspace || !auth.user.workspace.length) {
    redirect("/auth/sign-in");
    return null;
  }

  const hasAccess = await verifyAccessToWorkspace(workspaceId);
  if (hasAccess.status !== 200) {
    redirect(`/dashboard/${auth.user?.workspace[0].id}`);
    return null;
  }

  if (!hasAccess.data?.workspace) {
    console.error("Workspace data is not available.");
    return null;
  }

  const work = hasAccess.data.workspace;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["workspace-folders"],
    queryFn: () => getWorkspaceFolders(workspaceId),
  });

  await queryClient.prefetchQuery({
    queryKey: ["user-videos"],
    queryFn: () => getAllUserVideos(workspaceId),
  });

  await queryClient.prefetchQuery({
    queryKey: ["user-workspaces"],
    queryFn: () => getWorkspaces(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["user-notifications"],
    queryFn: () => getNotifications(),
  });

  return { queryClient, auth, work };
}

const Layout = async ({ params, children }: Props) => {
  const workspaceId = await params.workspaceId;
  const data = await fetchData(workspaceId);

  if (!data) return null;

  const { queryClient, auth, work } = data;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-screen w-screen ">
        <Sidebar activeWorkspaceId={workspaceId} />
        <div className=" pt-28  overflow-y-scroll w-screen overflow-x-hidden">
          <GlobalHeader workspace={work || {}} />
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default Layout;

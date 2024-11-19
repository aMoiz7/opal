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

interface Props {
  params: { workspaceId: string };
  children: ReactNode;
}

// Fetch initial data outside of the component
async function fetchData(workspaceId: string) {
  const auth = await onAuthenticateUser();

  console.log(auth)
  if (!auth.user?.workspace) redirect("/auth/sign-in");

  if (!auth.user?.workspace.length) redirect("/auth/sign-in");

  const hasAccess = await verifyAccessToWorkspace(workspaceId);

  if (hasAccess.status !== 200) {
    redirect(`/dashboard/${auth.user?.workspace[0].id}`);
  }
  if (!hasAccess.data?.workspace) return null;

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

  return { queryClient, auth };
}

const Layout = async ({ params, children }: Props) => {
  const workspaceId = params.workspaceId;
  const data = await fetchData(workspaceId);

  if (!data) return null;

  return (
    <HydrationBoundary state={dehydrate(data.queryClient)}>
      <div className="flex h-screen w-screen">
        <Sidebar activeWorkspaceId={workspaceId} />
        {children}
      </div>
    </HydrationBoundary>
  );
};

export default Layout;

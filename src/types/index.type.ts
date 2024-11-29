export type WorkspaceProps = {
    data: {
        subscription: {
            paln: "FREE" | "PRO"
            
        } | null
        workspace: {
            id: string
            name: string
            type: "PUBLIC" | "PERSONAL"
            
        }[]
        members: {
            Workspace: {
                id: string
                name: string
                type:"PUBLIC" | "PERSONAL"
            }
        }[]
    }
}

export type Notificationprops = {
  status: number;
  data: {
    _count: {
      notification: number;
    };
  };
};
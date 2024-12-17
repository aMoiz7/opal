import { useMutationData } from "@/hooks/useMutationData";
import { useSearch } from "@/hooks/useSearch";
import React from "react";
import { Input } from "../../input";
import { Skeleton } from "../../skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar";
import { User } from "lucide-react";
import { Button } from "../../button";
import Loader from "../loader/index";
import { inviteMembers } from "@/actions/workspace";

interface Props {
  workspaceId: string;
}

const Search = ({workspaceId}: Props) => {
  const { query, onSearchQuery, isFetching, onUsers } = useSearch(
    "get-users",
    "USERS"
  );

  const { mutate, isPending } = useMutationData(
    ["invite-member"],
    (data: { receiverId: string; email: string }) =>
      inviteMembers(workspaceId, data.receiverId, data.email)
  );

  return (
    <div className="flex flex-col gap-y-5 ">
      <Input
        onChange={onSearchQuery}
        value={query}
        className="bg-transparent border-2 outline-none"
        placeholder="Search for a user"
        type="text"
      />
      {isFetching ? (
        <div className="flex flex-col gap-y-2">
          <Skeleton className="w-full h-8 rounded-2xl" />
        </div>
      ) : !onUsers || onUsers.length === 0 ? (
        <p className="text-center text-sm text-[#a4a4a4]">No users found</p>
      ) : (
        <div>
          {onUsers.map((user:any) => (
            <div
              key={user.id} // Added a unique key for each user
              className="flex gap-x-3  items-center border-2 w-full p-3 rounded-xl"
            >
              <Avatar>
                <AvatarImage src={user.image as string} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <h3 className="font-bold text-lg capitalize">
                  {user.firstname} {user.secondname}
                </h3>
                <p className="lowercase text-xs bg-white px-2 rounded-lg text-[#1e1e1e]">
                  {user.subscription?.plan || "No Plan"}
                </p>
              </div>
              <div className="flex-1 flex justify-center items-center">
                <Button
                  onClick={() => {
                   mutate({ receiverId: user.id, email: user.email });
                  }}
                  className="w-5/12 font-bold"
                >
                  <Loader state={isPending} color="#0000">
                    Invite
                  </Loader>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;


import { CreateWorkspace } from "@/actions/workspace";
import { useMutationData } from "./useMutationData"
import useZodForm from "./useZodForm";
import { worksapceschema } from "@/components/ui/global/form/workspace-form/schmea";


export const useCreateworksapce = () => {
    const { mutate, isPending } = useMutationData(
        ["create-workspace"],
        (data: { name: string }) => CreateWorkspace(data.name),
        "user-workspaces"
    );

    const { errors , onFormSubmit , register } = useZodForm(worksapceschema, mutate)


    return {
        errors, onFormSubmit, register, isPending 
        
    };
}
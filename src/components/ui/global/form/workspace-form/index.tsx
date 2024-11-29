import { useCreateworksapce } from '@/hooks/useCreateworksapce'
import React from 'react'
import FormGenerator from '../../form-generator'
import { Button } from '@/components/ui/button'
import Laoder from '../../loader'

interface Props {}

const WorkspaceForm = (props: Props) => {
  const {errors ,isPending , onFormSubmit , register} = useCreateworksapce()
  return (
    <form onSubmit={onFormSubmit}
    className='flex flex-col gap-y-3'
    >
    
      <FormGenerator
        name="name"
        placeholder={'Workspace Name'}
        label="Worksapce Name"
        errors={errors}
        inputType='input'
        type="text"
        register={register}
      />

      <Button className="text-sm w-full mt-2" type="submit" disabled={isPending}>
      <Laoder state={isPending}>Create Workspace</Laoder>
      </Button>

    </form>
  )
}

export default WorkspaceForm
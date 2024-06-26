import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PayableSchema, payableSchema } from '../types';
import { useState } from 'react';
import Title from '../components/ui/title';
import FormCard from '../components/formCard';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../components/ui/input';
import Button from '../components/ui/button';
import ErrorMessage from '../components/ui/errorMessage';
import { deletePayable, editPayable, getPayable } from '../services/payable';
import { UUID } from 'crypto';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import DeleteButton from '../components/ui/deleteButton';

export default function ViewPayable() {
  const { id } = useParams<{ id: UUID }>();
  const location = useLocation();
  const title = location.state?.title;
  const [isDirty, setIsDirty] = useState(false)
  const navigate = useNavigate()
  const [assignorId, setAssignorId] = useState<UUID>('' as UUID)
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    reset,
    formState: {
      errors,
      defaultValues,
    },
  } = useForm<PayableSchema>({
    resolver: zodResolver(payableSchema),
    defaultValues: async () => {
      const data = await getPayable(id as UUID)
      setAssignorId(data.assignor)
      return {
        value: data.value,
        emissionDate: new Date(data.emissionDate).toISOString().substring(0, 10) as unknown as Date,
        assignor: data.assignorRef.name
      }
    },
  })

  const onSubmit: SubmitHandler<PayableSchema> = async (data) => {
    if (
      new Date(data.emissionDate).toISOString().substring(0, 10) as unknown as Date === defaultValues?.emissionDate &&
      data.value === defaultValues.value
    ) {
      reset();
      setIsDirty(false)
      return
    }

    try {
      const res = await editPayable({
        id: id,
        value: data.value,
        emissionDate: new Date(data.emissionDate).toISOString().substring(0, 10)
      })
      setIsDirty(false)
      toast.success("Alterações salvas", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light"
      });
    } catch (error) {
      setError("root", { message: 'Erro ao salvar as alterações.' })
    }

  }

  const onError = () => {
    setError("root", { message: 'Preencha todos os campos corretamente para salvar.' })
  }

  const onDelete = async () => {
    try {
      const res = await deletePayable(id as UUID)
      toast.success("Pagável apagado!", {
        position: "top-center",
        autoClose: 800,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light"
      });
      setTimeout(() => {
        navigate(-1);
      }, 850);
    } catch (error) {
      setError("root", { message: 'Erro ao apagar o pagável.' })
    }
  }

  return (
    <div className='flex flex-col items-center w-full gap-6'>
      <Title>{title}</Title>

      <FormCard>
        <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-3">
          <ErrorMessage error={errors.root} />
          <Input
            label='Id'
            value={id}
            disabled
          />
          <Input
            label='Valor'
            register={register('value', { onChange: () => setIsDirty(true) })}

          />
          <Input
            label='Data de emissão'
            type="date"
            register={register('emissionDate', { onChange: () => setIsDirty(true) })}
          />
          <div className='flex flex-col items-end gap-1'>
            <Input
              label='Cedente'
              register={register('assignor', { disabled: true })}
            />
            <Link to={`/assignor/view/${assignorId}`}
            state={{title: 'Dados do cedente:'}}
            className='text-themeColor hover:text-opacity-90 ease-in-out duration-200'
            >
              Ver dados do cedente.
            </Link>
          </div>
          <div className='flex flex-col gap-1'>
            <Button
              disabled={!isDirty}
            >
              Salvar alterações
            </Button>
            <DeleteButton
              onClick={onDelete}
            />
          </div>
        </form>
      </FormCard>

      <ToastContainer />
    </div>
  )
}
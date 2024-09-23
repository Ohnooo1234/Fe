import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from 'src/utils/rules'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import Input from 'src/components/Input'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import { Helmet } from 'react-helmet-async'
import path from 'src/constants/path'
import { toast } from 'react-toastify'

type FormData = Pick<Schema, 'email'>
const forgetSchema = schema.pick(['email'])

export default function Forget() {
  const { setIsAuthenticated, setRole, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(forgetSchema)
  })

  const forgetMutation = useMutation({
    mutationFn: (email: string) => authApi.forget(email)
  })
  const onSubmit = handleSubmit(async (data) => {
    const emailExist = await authApi.checkEmailExist(data.email)
    console.log(emailExist)

    if (!emailExist.data) {
      toast.error('Email không tồn tại')
      return
    }
    forgetMutation.mutate(data.email, {
      onSuccess: (data) => {
        toast.success('Bạn đã gửi email thành công, vui lòng check để đổi mât khẩu')
        navigate(path.login)
      },
      onError: (error) => {
        toast.error('Gửi yêu cầu thất bại')
      }
    })
  })

  return (
    <div className=' bg-primaryColor'>
      <Helmet>
        <title>Đăng nhập | Shopee Clone</title>
        <meta name='description' content='Đăng nhập vào dự án Shopee Clone' />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-4 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-2'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Quên mật khẩu</div>
              <Input
                name='email'
                register={register}
                type='email'
                className='mt-2'
                errorMessage={errors.email?.message}
                placeholder='Email'
                htmlFor='email'
                htmlText='Email'
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='flex  w-full items-center justify-center bg-primaryColor py-4 px-2 text-sm uppercase text-white hover:opacity-90'
                  isLoading={forgetMutation.isLoading}
                  disabled={forgetMutation.isLoading}
                >
                  Quên mật khẩu
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Quay lại đăng nhập?</span>
                <Link className='ml-1 text-primaryColor' to={path.login}>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

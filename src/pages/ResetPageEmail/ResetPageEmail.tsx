import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from 'src/utils/rules'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import Input from 'src/components/Input'
import { useEffect, useState } from 'react'
import Button from 'src/components/Button'
import { Helmet } from 'react-helmet-async'
import path from 'src/constants/path'
import { toast } from 'react-toastify'

type FormData = Pick<Schema, 'confirm_password' | 'password'>
const resetSchema = schema.pick(['confirm_password', 'password'])

export default function ResetPageEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const [tokenPage, getTokenPage] = useState<string>('')

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get('token')
    getTokenPage(token as string)
  }, [location.search])
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(resetSchema)
  })

  const resetMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (body: any) => authApi.resetPassword(body)
  })
  const onSubmit = handleSubmit((data) => {
    const fixData = {
      newPassword: data.password,
      token: tokenPage
    }
    resetMutation.mutate(fixData, {
      onSuccess: () => {
        navigate(path.login)
        toast.success('Đổi mật khẩu thành công')
      },
      onError: () => {
        toast.error('Đổi mật khẩu thất bại')
      }
    })
  })

  return (
    <div className=' bg-primaryColor'>
      <Helmet>
        <title>Đổi mật khẩu</title>
        <meta name='description' content='Đổi mật khẩu' />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-4 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-2'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đổi mật khẩu</div>
              <Input
                name='password'
                register={register}
                type='password'
                className='mt-2'
                errorMessage={errors.password?.message}
                placeholder='Password'
                autoComplete='on'
                htmlFor='password'
                htmlText='Password'
              />
              <Input
                name='confirm_password'
                register={register}
                type='password'
                className='mt-2'
                errorMessage={errors.confirm_password?.message}
                placeholder='Confirm Password'
                autoComplete='on'
                htmlFor='confirm_password'
                htmlText='Confirm password'
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='flex  w-full items-center justify-center bg-primaryColor py-4 px-2 text-sm uppercase text-white hover:opacity-90'
                  isLoading={resetMutation.isLoading}
                  disabled={resetMutation.isLoading}
                >
                  Đổi mật khẩu
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

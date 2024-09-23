import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
// Không có tính năng tree-shaking
// import { omit } from 'lodash'

// Import chỉ mỗi function omit
import omit from 'lodash/omit'

import { schema, Schema } from 'src/utils/rules'
import Input from 'src/components/Input'
import authApi from 'src/apis/auth.api'

import Button from 'src/components/Button'
import { Helmet } from 'react-helmet-async'
import path from 'src/constants/path'
import { toast } from 'react-toastify'

type FormData = Pick<
  Schema,
  'email' | 'password' | 'confirm_password' | 'userName' | 'firstName' | 'lastName' | 'phoneNumber'
>
const registerSchema = schema.pick([
  'email',
  'password',
  'confirm_password',
  'userName',
  'firstName',
  'lastName',
  'phoneNumber'
])

export default function Register() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })
  const onSubmit = handleSubmit(async (data) => {
    const fixData: FormData = {
      ...data,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      phoneNumber: parseInt(data.phoneNumber) as any
    }
    const userNameExist = await authApi.checkUserNameExist(data.userName)
    if (userNameExist.data) {
      toast.error('Tên người dùng đã tồn tại')
      return
    }

    const emailExist = await authApi.checkEmailExist(data.email)
    if (emailExist.data) {
      toast.error('Email đã tồn tại')
      return
    }
    const body = omit(fixData, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        toast.success('Đăng ký tài khoản mới thành công')
        navigate(path.login)
      },
      onError: (error) => {
        toast.error('Đăng ký tài khoản thất bại')
      }
    })
  })

  return (
    <div className='bg-primaryColor'>
      <Helmet>
        <title>Đăng ký | Shopee Clone</title>
        <meta name='description' content='Đăng ký tài khoản vào dự án Shopee Clone' />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-4 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-2'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng ký</div>
              <Input
                name='userName'
                register={register}
                type='text'
                className='mt-8'
                errorMessage={errors.userName?.message}
                placeholder='Tên đăng nhập'
                htmlFor='userName'
                htmlText='Username'
              />
              <div className='flex w-full gap-4'>
                <Input
                  name='firstName'
                  register={register}
                  type='text'
                  className='mt-2 w-full'
                  errorMessage={errors.firstName?.message}
                  placeholder='Họ'
                  htmlFor='firstName'
                  htmlText='First Name'
                />
                <Input
                  name='lastName'
                  register={register}
                  type='text'
                  className='mt-2 w-full'
                  errorMessage={errors.lastName?.message}
                  placeholder='Tên'
                  htmlFor='lastName'
                  htmlText='Last Name'
                />
              </div>
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
              <Input
                name='phoneNumber'
                register={register}
                type='text'
                className='mt-2'
                errorMessage={errors.phoneNumber?.message}
                placeholder='Số điện thoại'
                htmlFor='phoneNumber'
                htmlText='Phone Number'
              />
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

              <div className='mt-2'>
                <Button
                  className='flex w-full items-center justify-center bg-primaryColor py-4 px-2 text-sm uppercase text-white hover:opacity-90'
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                >
                  Đăng ký
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                <Link className='ml-1 text-primaryColor' to='/login'>
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

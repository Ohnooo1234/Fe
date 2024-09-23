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

type FormData = Pick<Schema, 'username' | 'password'>
const loginSchema = schema.pick(['username', 'password'])

export default function Login() {
  const { setIsAuthenticated, setRole, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.login(body)
  })
  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        const userRole = data.data.role
        setProfile(data.data)
        setRole(userRole)
        switch (userRole) {
          case 'Admin':
            navigate(path.account)
            break
          case 'Customer':
            navigate('/')
            break
          default:
            navigate('/')
        }
      },
      onError: (error) => {
        toast.error('Tài khoản hoặc mật khẩu không đúng, vui lòng nhập lại!!!')
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
              <div className='text-2xl'>Đăng nhập</div>
              <Input
                name='username'
                register={register}
                type='text'
                className='mt-8'
                errorMessage={errors.username?.message}
                placeholder='Username'
                htmlFor='username'
                htmlText='Username'
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
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='flex  w-full items-center justify-center bg-primaryColor py-4 px-2 text-sm uppercase text-white hover:opacity-90'
                  isLoading={loginMutation.isLoading}
                  disabled={loginMutation.isLoading}
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                <Link className='ml-1 text-primaryColor' to='/register'>
                  Đăng ký
                </Link>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn quên mật khẩu?</span>
                <Link className='ml-1 text-primaryColor' to='/forget'>
                  Quên mật khẩu
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

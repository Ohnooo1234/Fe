import React, { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useState } from 'react'
import authApi from 'src/apis/auth.api'
import path from 'src/constants/path'

export default function ActiveRegister() {
  const checked = <FontAwesomeIcon className='text-green-600' icon={faCircleCheck} />
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const token = searchParams.get('token')
  const [countdown, setCountdown] = useState(5)

  const { data: no_data } = useQuery({
    queryKey: ['no_data'],
    queryFn: async () => {
      return authApi.activeAutomatically(token as string)
    }
  })
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1)
    }, 1000)

    const redirectTimer = setTimeout(() => {
      // Replace '/new-page' with the path you want to navigate to
      window.location.href = path.login
    }, 5000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirectTimer)
    }
  }, [])
  return (
    <Fragment>
      <h1 className='text-center text-2xl font-extrabold text-black'>
        Tài khoản của bạn đã được xác thực thành công {checked}
      </h1>
      <p className='text-center text-xl font-bold text-black'>Chuyển hướng sau {countdown} giây</p>
    </Fragment>
  )
}

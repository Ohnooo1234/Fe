import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Image, Input, Upload } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import authApi from 'src/apis/auth.api'
import { User } from 'src/types/user.type'
import { UploadOutlined } from '@ant-design/icons'
import fileApi from 'src/apis/file.api'
import { toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'
import { AppContext } from 'src/contexts/app.context'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
}

export default function Profile() {
  const [profileData, setDataProfileData] = useState<User>()
  const { setProfile, profile } = useContext(AppContext)
  const queryClient = useQueryClient()
  const location = useLocation()
  const [form] = Form.useForm()
  const { data: profileDataApi } = useQuery({
    queryKey: ['profile'],
    queryFn: () => {
      return authApi.getProfile()
    }
  })
  useEffect(() => {
    if (profileDataApi) {
      setDataProfileData(profileDataApi.data)
      form.setFieldsValue(profileDataApi.data)
    }
  }, [form, profileDataApi])

  const [file, setFile] = useState()
  ////////////////////////////////////////////////// image //////////////////////////////////////////////
  // Cập nhật hàm normFile
  const normFile = (e: any) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    const fileList = e && e.fileList
    if (fileList && fileList.length > 0) {
      setFile(fileList[0].originFileObj)
      return fileList
    }
    setFile(null || undefined)
    return []
  }
  const chooseImageMutation = useMutation({
    mutationFn: (body) => fileApi.uploadFile(body as any)
  })
  ////////////////////////////////////////////////// update ///////////////////////////////////////////
  const updateProfileMutation = useMutation({
    mutationFn: (body: User) => authApi.updateProfile(body)
  })
  // Cập nhật hàm onFinish
  const onFinish = async (values: User) => {
    const config = {
      image: file
    }
    try {
      let uploadedImage = { data: profileData?.avatarUrl }
      if (file) {
        const config = { image: file }
        uploadedImage = await chooseImageMutation.mutateAsync(config as any)
      }
      console.log(uploadedImage.data)
      const fixData = {
        ...values,
        avatarUrl: uploadedImage.data,
        phoneNumber: parseInt(values.phoneNumber as string)
      }

      await updateProfileMutation.mutateAsync(fixData)
      queryClient.invalidateQueries(['profile'])
      const updatedProfile = { ...profile, email: fixData.email, avatarUrl: fixData.avatarUrl }
      localStorage.setItem('profile', JSON.stringify(updatedProfile))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setProfile(updatedProfile as any)
      toast.success('Cập nhật profile thành công')
    } catch (error) {
      toast.error('Cập nhật profile thất bại')
    }
  }

  const handleCustomRequest = (options: any) => {
    setFile(options.file)
    options.onSuccess(null, options.file)
  }
  return (
    <div className={location.pathname === '/profile' ? '' : 'container'}>
      <h2 className='mb-8 text-3xl'>Thông tin người dùng</h2>

      <Form onFinish={onFinish} validateTrigger='onSubmit' className='w-1/2' {...formItemLayout} form={form}>
        <Form.Item
          name='upload'
          label='Chọn ảnh sản phẩm'
          valuePropName='fileList'
          getValueFromEvent={normFile}
          extra={!file ? 'Vui lòng chọn ảnh cài avatar' : 'Đã chọn ảnh '}
        >
          <Upload name='logo' listType='picture' customRequest={handleCustomRequest}>
            {!file && <Button icon={<UploadOutlined />}>Chọn ảnh để cập nhật avatar</Button>}
          </Upload>
        </Form.Item>
        {profileData?.avatarUrl !== '' ? (
          <Image
            width={200}
            height={200}
            className='mx-auto block object-cover'
            wrapperClassName='mx-auto'
            src={`/src/assets/${profileData?.avatarUrl}`}
          />
        ) : (
          <Image
            width={200}
            height={200}
            className='mx-auto block object-cover'
            wrapperClassName='mx-auto'
            src={`https://static-00.iconduck.com/assets.00/profile-user-icon-2048x2048-m41rxkoe.png`}
          />
        )}
        <Form.Item label='Tên người dùng' name='userName' rules={[{ required: true, message: 'Vui lòng nhập tên!!!' }]}>
          <Input readOnly />
        </Form.Item>
        <Form.Item label='Họ' name='firstName' rules={[{ required: true, message: 'Vui lòng nhập họ!!!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label='Tên' name='lastName' rules={[{ required: true, message: 'Vui lòng nhập tên!!!' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label='Email'
          name='email'
          rules={[
            { required: true, message: 'Vui lòng nhập email!!!' },
            { type: 'email', message: 'Email không hợp lệ!!!' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='SĐT'
          name='phoneNumber'
          // rules={[
          //   { required: true, message: 'Vui lòng nhập số điện thoại!!!' },
          //   { pattern: /^\d{9}$/, message: 'Số điện thoại phải gồm 9 chữ số!!!' }
          // ]}
        >
          <Input />
        </Form.Item>

        <Button htmlType='submit' className='mb-4'>
          Cập nhật
        </Button>
      </Form>

      {/* <div className='flex items-center gap-8'>
        <div className=''>
          <p className='my-4 text-xl'>Tài khoản: </p>
          <p className='my-4 text-xl'>Email: </p>
          <p className='my-4 text-xl'>Họ: </p>
          <p className='my-4 text-xl'>Tên: </p>
          <p className='my-4 text-xl'>Vai trò: </p>
        </div>
        <div>
          <p className='my-4 text-xl'>{profileData?.userName}</p>
          <p className='my-4 text-xl'> {profileData?.email}</p>
          <p className='my-4 text-xl'> {profileData?.firstName}</p>
          <p className='my-4 text-xl'> {profileData?.lastName}</p>
          <p className='my-4 text-xl'>{profileData?.role}</p>
        </div>
      </div> */}
    </div>
  )
}

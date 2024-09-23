import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, Modal, Select, Upload } from 'antd'
// eslint-disable-next-line import/named
import { BaseOptionType } from 'antd/es/select'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { Product } from 'src/types/product.type'
import { UploadOutlined } from '@ant-design/icons'
import fileApi from 'src/apis/file.api'
import { useState } from 'react'
interface ModalAddProductProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  categoriesData: BaseOptionType[]
}

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

export default function ModalAddProduct({ isModalOpen, handleOk, handleCancel, categoriesData }: ModalAddProductProps) {
  const [form] = Form.useForm()
  const queryConfig = useQueryConfig()
  const queryClient = useQueryClient()
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
  ///////////////////////////////////////////////add product///////////////////////////////////////////
  const addProductMutation = useMutation({
    mutationFn: (body: Omit<Product, 'upload'>) => productApi.addProduct(body)
  })

  // Cập nhật hàm onFinish
  const onFinish = async (values: Product) => {
    const config = {
      image: file
    }
    try {
      const uploadedImage = await chooseImageMutation.mutateAsync(config as any)
      console.log(uploadedImage.data)
      const fixData = {
        ...values,
        thumbnailUrl: uploadedImage.data
      }

      await addProductMutation.mutateAsync(fixData)
      toast.success('Sản phẩm được thêm mới thành công')
      handleOk()
      form.setFieldsValue('')
      queryClient.invalidateQueries(['products', queryConfig])
    } catch (error) {
      toast.error('Thêm mới sản phẩm thất bại')
    }
  }

  const handleCustomRequest = (options: any) => {
    setFile(options.file)
    options.onSuccess(null, options.file)
  }

  return (
    <Modal title='Thêm mới sản phẩm' visible={isModalOpen} onOk={form.submit} onCancel={handleCancel} width={1000}>
      <Form
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        initialValues={{ name: '', description: '' }}
        validateTrigger='onSubmit'
      >
        <Form.Item
          name='upload'
          label='Chọn ảnh sản phẩm'
          valuePropName='fileList'
          getValueFromEvent={normFile}
          extra={!file ? 'Vui lòng chọn ảnh sản phẩm' : 'Đã chọn ảnh '}
        >
          <Upload name='logo' listType='picture' customRequest={handleCustomRequest}>
            {!file && <Button icon={<UploadOutlined />}>Click to upload</Button>}
          </Upload>
        </Form.Item>
        <Form.Item label='Tên sản phẩm' name='name' rules={[{ required: true, message: 'Name is require!!!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label='Giá tiền' name='price' rules={[{ required: true, message: 'Please input!' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label='Số sản phẩm'
          name='number_of_products'
          rules={[{ required: true, message: 'Name is require!!!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Nhãn hàng'
          name='category_id'
          rules={[{ required: true, message: 'Please input!' }]}
          initialValue={categoriesData[0]?.value}
        >
          <Select options={categoriesData} />
        </Form.Item>
        <Form.Item label='Mô tả' name='description' rules={[{ required: true, message: 'Please input!' }]}>
          <Input.TextArea autoSize={{ minRows: 5, maxRows: 10 }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

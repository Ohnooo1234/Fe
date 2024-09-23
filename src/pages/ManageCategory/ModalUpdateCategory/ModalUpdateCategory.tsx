import React, { useEffect } from 'react'
import { Modal, Cascader, DatePicker, Form, Input, InputNumber, Mentions, Select, TreeSelect, Button } from 'antd'
import { toast } from 'react-toastify'
import { Category } from 'src/types/category.type'
import categoryApi from 'src/apis/category.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useQueryConfig from 'src/hooks/useQueryConfig'

interface ModalAddCategoryProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  detail?: Category
}
const { RangePicker } = DatePicker

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

export default function ModalUpdateCategory({ isModalOpen, handleOk, handleCancel, detail }: ModalAddCategoryProps) {
  const [form] = Form.useForm()
  const queryConfig = useQueryConfig()
  const queryClient = useQueryClient()
  const updateCategoryMutation = useMutation({
    mutationFn: (body: Category) => categoryApi.updateCategory(detail?.id as number, body)
  })
  const onFinish = async (values: Category) => {
    // Here you can perform your data submission logic, e.g., API call
    const fixValue = {
      ...values,
      id: detail?.id
    }
    updateCategoryMutation.mutate(fixValue as Category, {
      onSuccess: () => {
        toast.success('Cập nhật danh mục thành công')
        handleOk() // Close modal after successful submission
        queryClient.invalidateQueries(['categories', queryConfig])
      },
      onError: () => {
        toast.error('Cập nhật danh mục thất bại')
      }
    })
  }

  useEffect(() => {
    if (detail) {
      form.setFieldsValue(detail)
    }
  }, [detail, form])

  return (
    <Modal title='Chỉnh sửa danh mục' visible={isModalOpen} onOk={form.submit} onCancel={handleCancel} width={1000}>
      <Form {...formItemLayout} form={form} onFinish={onFinish} validateTrigger='onSubmit'>
        <Form.Item label='Name' name='name' rules={[{ required: true, message: 'Please input!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label='Description' name='description' rules={[{ required: true, message: 'Please input!' }]}>
          <Input.TextArea autoSize={{ minRows: 5, maxRows: 10 }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

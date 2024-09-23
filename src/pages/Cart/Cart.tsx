import React, { useContext, useState } from 'react'
import { Button, Popconfirm, Select, Space, Table, message } from 'antd'
import classNames from 'classnames/bind'
import type { TableColumnsType, TableProps } from 'antd'
import Search from 'antd/es/input/Search'
import styles from './Cart.module.css'
import { EditOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import categoryApi from 'src/apis/category.api'
import { Category } from 'src/types/category.type'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ParamsConfig } from 'src/types/product.type'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import cartApi from 'src/apis/cart.api'
import { CartItemData } from 'src/types/cart.type'
import { formatCurrency } from 'src/utils/utils'
import value from 'src/constants/value'
const cx = classNames.bind(styles)

type TableRowSelection<T> = TableProps<T>['rowSelection']

interface DataType {
  key?: React.Key
  name?: string
  quantity?: number
  price?: number
}

export default function CategoryList() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const { setIsAuthenticated, isAuthenticated, setProfile, profile } = useContext(AppContext)
  const queryConfig = useQueryConfig()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')

  /////////////////////////////////////////////////////////CHECKBOX INDEX////////////////////////////////////////////
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = []
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false
            }
            return true
          })
          setSelectedRowKeys(newSelectedRowKeys)
        }
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = []
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true
            }
            return false
          })
          setSelectedRowKeys(newSelectedRowKeys)
        }
      }
    ]
  }

  //////////////////////////////////////////////////////NAME COLUMN, CONFIG COLUMN///////////////////////////////////////////

  const columns: TableColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'key',
      width: '10%'
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: '25%'
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      width: '25%',
      render: (_, action) => (
        <Space size='small' key={action.key}>
          <p> ₫{formatCurrency(action.price ?? 0)}</p>
        </Space>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: '20%'
    },
    {
      title: 'Tổng tiền',
      width: '20%',
      render: (_, action) => (
        <Space size='small' key={action.key}>
          <p> ₫{formatCurrency((action.price ?? 0) * (action.quantity ?? 0))}</p>
        </Space>
      )
    }
  ]
  //////////////////////////////////////////////////////////// PUSH DATA ///////////////////////////////////////////////////////
  const { data: cartsData } = useQuery({
    queryKey: ['carts', queryConfig],
    queryFn: () => {
      return cartApi.getCartByUserId({ size: value.MAX_INT })
    }
  })

  const data: DataType[] =
    cartsData?.data.content
      .filter((cart: CartItemData) => cart.user_id === profile?.id)
      .map((cart: CartItemData) => ({
        key: cart.id,
        name: cart.productname,
        quantity: cart.quantity,
        price: cart.price
      }))
      .reverse() || []

  //////////////////////////////////////////////////////////// PAGINATE ///////////////////////////////////////////////////////
  const pagination = {
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50', '100']
  }

  //////////////////////////////////////////////////////////// DELETE ///////////////////////////////////////////////////////
  const deleteCartsMutation = useMutation({
    mutationFn: (params: string) => cartApi.deleteCartItem(params),
    onSuccess: () => {
      toast.success('Xóa thành công')
      queryClient.invalidateQueries(['carts', queryConfig])
      setSelectedRowKeys([])
    },
    onError: () => {
      toast.error('Xóa thất bại')
    }
  })

  const handleDelete = () => {
    const params = selectedRowKeys.join(',')
    deleteCartsMutation.mutate(params)
  }
  return (
    <div className='container'>
      <h1 className='my-4 text-2xl'>Danh sách đơn hàng của bạn</h1>
      <Space className='my-2'>
        <Popconfirm
          title='Xóa đơn hàng'
          description='Bạn có muốn xóa các đơn hàng này?'
          okText='Yes'
          cancelText='No'
          onConfirm={handleDelete}
        >
          <Button size='large' danger className='w-32'>
            Xóa
          </Button>
        </Popconfirm>
      </Space>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} />
    </div>
  )
}

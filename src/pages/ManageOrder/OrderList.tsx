import React, { useState } from 'react'
import { Button, Popconfirm, Select, Space, Table, message } from 'antd'
import classNames from 'classnames/bind'
import type { TableColumnsType, TableProps } from 'antd'
import Search from 'antd/es/input/Search'
import styles from './OrderList.module.css'
import { EditOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import categoryApi from 'src/apis/category.api'
import { Category } from 'src/types/category.type'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ParamsConfig } from 'src/types/product.type'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { toast } from 'react-toastify'
import cartApi from 'src/apis/cart.api'
import { CartItemData } from 'src/types/cart.type'
import { formatCurrency } from 'src/utils/utils'
const cx = classNames.bind(styles)

type TableRowSelection<T> = TableProps<T>['rowSelection']

interface DataType {
  key?: React.Key
  name?: string
  quantity?: number
  price?: number
  username?: string
}

export default function OrderList() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const queryConfig = useQueryConfig()
  const queryClient = useQueryClient()
  const [detail, setDetail] = useState<Category>()
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')

  //////////////////////////////////////////////////////NAME COLUMN, CONFIG COLUMN///////////////////////////////////////////
  const columns: TableColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'key',
      width: '10%'
    },
    {
      title: 'Khách hàng',
      dataIndex: 'username',
      width: '20%'
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: '20%'
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      width: '20%',
      render: (_, action) => (
        <Space size='small' key={action.key}>
          <p> ₫{formatCurrency(action.price ?? 0)}</p>
        </Space>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: '10%'
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
      return cartApi.getCartByUserId(queryConfig as ParamsConfig)
    }
  })

  const data: DataType[] =
    cartsData?.data.content.map((cart: CartItemData) => ({
      key: cart.id,
      name: cart.productname,
      username: cart.username,
      quantity: cart.quantity,
      price: cart.price
    })) || []

  //////////////////////////////////////////////////////////// PAGINATE ///////////////////////////////////////////////////////
  const pagination = {
    current: currentPage,
    pageSize: pageSize,
    total: cartsData?.data.totalElements || 0,
    onChange: (page: number, pageSize?: number) => {
      setCurrentPage(page)
      if (pageSize) {
        setPageSize(pageSize)
      }
      navigate(`${path.order}?page=${page}&size=${pageSize}`)
    },
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100']
  }

  return (
    <>
      <Table columns={columns} dataSource={data} pagination={pagination} />
    </>
  )
}

import React, { useState } from 'react'
import { Button, Popconfirm, Select, Space, Table, Tag } from 'antd'
import classNames from 'classnames/bind'
import type { TableColumnsType, TableProps } from 'antd'
import Search from 'antd/es/input/Search'
import styles from './AccountList.module.css'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
const cx = classNames.bind(styles)

type TableRowSelection<T> = TableProps<T>['rowSelection']

interface DataType {
  key: React.Key
  name: string
  email: string
  status: boolean
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'ID',
    dataIndex: 'key',
    width: '10%'
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: '25%'
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: '25%'
  },
  {
    title: 'Activity',
    dataIndex: 'status',
    key: 'status',
    width: '25%',
    render: (_, action) => (
      <Tag key={action.key} color={action.status === true ? 'red' : 'green'}>
        {action.status === true ? 'Chưa kích hoạt' : 'Kích hoạt'}
      </Tag>
    )
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    render: (_, action) => (
      <Space size='small' key={action.key}>
        <Button type='text'>
          <EditOutlined style={{ fontSize: '16px', color: '#4f80af' }} />
        </Button>
        <Popconfirm title='Delete account' description={`Are you sure to delete account?`} okText='Yes' cancelText='No'>
          <Button type='text'>
            <DeleteOutlined style={{ fontSize: '16px', color: '#b96573' }} />
          </Button>
        </Popconfirm>
      </Space>
    )
  }
]

const data: DataType[] = []
for (let i = 0; i < 460; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    email: `EwardKing${i}@gmail.com`,
    status: i % 2 == 0 ? true : false
  })
}

export default function AccountList() {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }

  return (
    <>
      <Search
        placeholder='input search text'
        allowClear
        enterButton='Search'
        size='large'
        className={cx('group__search')}
      />
      <div className={cx('group__select', 'mt-4 mb-4 flex items-center justify-between gap-4')}>
        <Select
          placeholder='--Trạng thái kích hoạt--'
          onChange={handleChange}
          size='large'
          options={[
            { value: 'jack', label: 'Jack' },
            { value: 'lucy', label: 'Lucy' },
            { value: 'Yiminghe', label: 'yiminghe' }
          ]}
          className='w-1/2'
        />
        <Select
          placeholder='--Sắp xếp theo ngày--'
          onChange={handleChange}
          size='large'
          options={[
            { value: 'jack', label: 'Jack' },
            { value: 'lucy', label: 'Lucy' },
            { value: 'Yiminghe', label: 'yiminghe' }
          ]}
          className='w-1/2'
        />
      </div>
      <Table columns={columns} dataSource={data} />
    </>
  )
}

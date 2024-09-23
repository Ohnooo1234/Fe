import React, { ReactNode, useEffect, useState } from 'react'
import { UserOutlined, ProductOutlined, AppstoreOutlined, SolutionOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Breadcrumb, Layout, Menu, theme } from 'antd'
import { NavLink, useLocation } from 'react-router-dom'
import path from 'src/constants/path'
import styles from './Slider.module.css'
import './Slider.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

const { Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  onClick?: () => void
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    onClick
  } as MenuItem
}

export default function Slider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [breadcrumbText, setBreadcrumbText] = useState('')
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const location = useLocation()

  const determineKeyAndBreadcrumb = (pathname: string) => {
    switch (pathname) {
      case path.account:
        return { key: '1', breadcrumb: 'Quản lý tài khoản' }
      case path.product:
        return { key: '2', breadcrumb: 'Quản lý sản phẩm' }
      case path.category:
        return { key: '3', breadcrumb: 'Quản lý danh mục' }
      case path.order:
        return { key: '4', breadcrumb: 'Quản lý đơn hàng' }
      default:
        return { key: '1', breadcrumb: 'Quản lý tài khoản' }
    }
  }

  const { key: defaultSelectedKey, breadcrumb: defaultBreadcrumbText } = determineKeyAndBreadcrumb(location.pathname)

  useEffect(() => {
    setBreadcrumbText(defaultBreadcrumbText)
  }, [location.pathname, defaultBreadcrumbText])

  const items: MenuItem[] = [
    getItem(<NavLink to={path.account}>Quản lý tài khoản</NavLink>, '1', <UserOutlined />),
    getItem(<NavLink to={path.product}>Quản lý sản phẩm</NavLink>, '2', <ProductOutlined />),
    getItem(<NavLink to={path.category}>Quản lý danh mục</NavLink>, '3', <AppstoreOutlined />),
    getItem(<NavLink to={path.order}>Quản lý đơn hàng</NavLink>, '4', <SolutionOutlined />)
  ]

  return (
    <Layout className='h-screen w-full'>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} className={cx('menu')}>
        <div className='demo-logo-vertical' />
        <Menu
          defaultSelectedKeys={[defaultSelectedKey]}
          selectedKeys={[defaultSelectedKey]}
          mode='inline'
          items={items}
        />
      </Sider>
      <Layout className='overflow-x-auto'>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} className='text-2xl'>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>{breadcrumbText}</Breadcrumb.Item>
          </Breadcrumb>
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Footer>
      </Layout>
    </Layout>
  )
}

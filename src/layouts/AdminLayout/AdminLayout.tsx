import React, { ReactNode } from 'react'

import Slider from 'src/components/Slider'
import { ConfigProvider, Layout, theme } from 'antd'
import Header from 'src/components/HeaderAdmin'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm
        }}
      >
        <Layout>
          <Header />
        </Layout>
        <Slider>{children}</Slider>
      </ConfigProvider>
    </>
  )
}

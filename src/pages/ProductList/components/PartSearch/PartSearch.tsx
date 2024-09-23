import { useQuery } from '@tanstack/react-query'
import Search from 'antd/es/input/Search'
import Select from 'antd/es/select'
import { createSearchParams, useNavigate } from 'react-router-dom'
import categoryApi from 'src/apis/category.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import styles from './PartSearch.module.css'
import classNames from 'classnames/bind'
import value from 'src/constants/value'

const cx = classNames.bind(styles)

export default function PartSearch() {
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()
  //////////////////////////////////////////////////////////// SEARCH AND FILTER ///////////////////////////////////////////////////////
  const handleChangehandleChange = (value: string) => {
    navigate({
      pathname: '',
      search: createSearchParams({
        ...queryConfig,
        sort: `id,${value}`
      }).toString()
    })
  }

  const handleChangehandleChange2 = (value: string) => {
    navigate({
      pathname: '',
      search: createSearchParams({
        ...queryConfig,
        category_id: value
      }).toString()
    })
  }

  const handleSearch = (value: string) => {
    navigate({
      pathname: '',
      search: createSearchParams({
        ...queryConfig,
        search: value
      }).toString()
    })
  }

  const { data: categoriesData } = useQuery({
    queryKey: ['categories', queryConfig],
    queryFn: () => {
      return categoryApi.getCategories({ size: value.MAX_INT })
    }
  })

  const categoryOptions =
    categoriesData?.data.content.map((category) => ({
      value: category.id,
      label: category.name
    })) || []

  categoryOptions.unshift({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    value: '',
    label: 'Tất cả danh mục'
  })

  return (
    <div className='col-span-9 col-start-4'>
      <Search
        placeholder='input search text'
        allowClear
        enterButton='Search'
        size='large'
        className={cx('group__search')}
        onSearch={handleSearch}
      />
      <div className='mt-4 flex w-full gap-4'>
        <Select
          placeholder='--Sắp xếp theo ngày--'
          onChange={handleChangehandleChange}
          size='large'
          options={[
            { value: 'asc', label: 'Sắp xếp mới nhất' },
            { value: 'desc', label: 'Sắp xếp cũ nhất' }
          ]}
          className='w-1/2'
        />
        <Select
          placeholder='--Danh mục--'
          onChange={handleChangehandleChange2}
          showSearch
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          size='large'
          options={categoryOptions}
          className='w-1/2'
        />
      </div>
    </div>
  )
}

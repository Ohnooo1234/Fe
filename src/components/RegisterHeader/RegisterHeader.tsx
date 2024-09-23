import { Link, useMatch } from 'react-router-dom'
import icon from '../../assets/images/header/academy-02-01-01-01.png'
import styles from './Register.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function RegisterHeader() {
  return (
    <header className='py-5'>
      <div className='container'>
        <nav className='flex items-end'>
          <Link to='/'>
            <img src={icon} alt='icon' width={200} />
          </Link>
        </nav>
      </div>
    </header>
  )
}

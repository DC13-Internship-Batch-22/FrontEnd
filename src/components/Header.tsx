import { Bell, CircleQuestionMark } from 'lucide-react'
import avatarHeader from '../assets/cr7.png'

const Header = () => {
  return (
    <div className=' flex justify-end items-center bg-slate-100 px-8 py-4 border-b border-gray-200 gap-10'>
      <Bell />
      <CircleQuestionMark />
      <img className='w-10 h-10 rounded-2xl border-gray-300 border-2 object-cover cursor-pointer' src={avatarHeader} alt="Avatar" />
    </div>
  )
}

export default Header
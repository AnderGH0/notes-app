import { useEffect } from 'react'
import {LuCheck} from 'react-icons/lu'
import { MdDeleteOutline } from 'react-icons/md'

const Toast = ({isShown, message, type, onClose}) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onClose])

  return (
    <div className={`absolute top-20 right-6 transition-ease-out duration-400 ${
      isShown ? "opacity-100": "opacity-0"
    }`}>
      <div className={`min-w-52 ${type === "delete"?"bg-red-300" : "bg-green-300" } border border-gray-200 shadow-2xl rounded-md `}>
        <div className='flex items-center gap-3 py-2 px-4'>
          <div
          className={`w-10 h-10 flex items-center justify-center rounded-full ${
            type === 'delete' ? 'bg-red-200' : 'bg-green-200'
          }`}>
            {type === "delete" ?
              <MdDeleteOutline className = "text-xl text-red-700"/>
            :<LuCheck className="text-xl text-green-700"/>}
          </div>
          <p className="text-sm text-slate-800">{message}</p>
        </div>
      </div>
      
    </div>
  )
}

export default Toast
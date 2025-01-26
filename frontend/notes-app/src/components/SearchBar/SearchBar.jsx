import {FaMagnifyingGlass} from 'react-icons/fa6'
import {IoMdClose} from 'react-icons/io'

const SearchBar = ({value, onChange, handleSearch, onClearSearch}) => {

  const handlekeyDown = (e) => {
    if(e.key === 'Enter'){
      handleSearch();
    }
  }

  return (
    <div className='w-80 flex items-center px-4 rounded-md bg-slate-100'> 
        <input 
            type="text" 
            placeholder="Search notes" 
            value={value} 
            onChange={onChange}
            onKeyDown={(e) => handlekeyDown(e)}
            className='w-full text-xs bg-transparent py-[11px] p-2 focus:outline-none'
        />
        {value && <IoMdClose  className='text-xl mr-3 text-gray-400 cursor-pointer hover:text-gray-700' onClick={onClearSearch}/>}

        <FaMagnifyingGlass onClick={handleSearch} className='text-gray-400 cursor-pointer hover:text-gray-700'/>
    </div>
  )
}

export default SearchBar
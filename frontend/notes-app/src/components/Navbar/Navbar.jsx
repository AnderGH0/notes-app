import { useState } from 'react';
import ProfileInfo from '../Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar';

const Navbar = ({userInfo, onSearchNote, handleClearSearch}) => {
  const [SearchQuery, setSearchQuery] = useState('')

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login")
  };

  const handleSearch = () => {
    if(SearchQuery === '') {
      handleClearSearch();

    }
    if(SearchQuery){
      onSearchNote(SearchQuery)
    }
  };

  const onClearSearch = () => {
    setSearchQuery('');
    handleClearSearch();
  };

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
        <h2 className='text-xl font-medium text-black py-2'>Notes App</h2>

        

        {userInfo && <>
          <SearchBar 
        value={SearchQuery} 
        onChange={ ({target}) => {
            setSearchQuery(target.value)
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}/> 
        <ProfileInfo userInfo ={userInfo} onLogout={onLogout}/>
        </> }
    </div>
  )
}

export default Navbar
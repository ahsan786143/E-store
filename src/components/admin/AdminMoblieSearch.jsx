import React, { useState } from 'react'
import { Button } from '../ui/button'
import { IoIosSearch } from 'react-icons/io'
import SearchModel from './SearchModel'

const AdminMoblieSearch = () => {
  const [open, setOpen] = useState(false)
  return (

    <div>
       <Button type='button' size="icon" onClick={() => setOpen(true)}
        className="md:hidden" variant="ghost"
        >
        <IoIosSearch/>
       </Button>
       <SearchModel open={open} setOpen={setOpen}/>
    </div>
  )
}

export default AdminMoblieSearch

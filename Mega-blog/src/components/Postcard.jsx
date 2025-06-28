import React from 'react'
import appwriteService from '../appwrite/config'
import { Link } from 'react-router-dom'

function Postcard({$id, title, featuredIMage}) {
  return (
      <Link to={`/post/${$id}`}>
          <div className='w-full bg-gray-100 rounded-xl p-4'>
              <div className='w-full justify-center mb-4'>
                  <img src={appwriteService.getFilePreview(featuredIMage)} alt={title} />
              </div>
          </div>
    </Link>
  )
}

export default Postcard

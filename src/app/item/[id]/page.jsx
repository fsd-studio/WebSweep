'use client'
import { use } from 'react'
import { useParams } from 'next/navigation'
import RightPanel from './RightPanel'
import LeftPanel from './LeftPanel'
 
export default function BlogPostPage({ params }) {
  const { id } = use(params)
 
  return (
    <div className='flex gap-3 h-full'>
      <LeftPanel></LeftPanel>
      <RightPanel></RightPanel>
    </div>
  )
}
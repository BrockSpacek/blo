"use client"
import { IBlogItems } from '@/utils/Interfaces'
import React, { useEffect, useState } from 'react'
import BlogEntries from "@/utils/BlogEntries.json"
import { getAllBlogs, getToken } from '@/utils/DataServices'


const page = () => {
  const [blogItems, setBlogItems] = useState<IBlogItems[]>(BlogEntries);

  useEffect(() =>{
    const getData = async () => {
      const data: IBlogItems[] = await getAllBlogs(getToken());
      console.log(data);

      const filteredData = data.filter(item => item.isPublished && !item.isDeleted);
      console.log(filteredData);

      setBlogItems(filteredData);
    }

    getData();

  }, []);
  return (
    <div className='flex min-h-screen flex-col p-24'>
        <h1 className='text-center text-3xl'>Blog Page</h1>
        <div className='container flex justify-center min-w-full'>
          <div>
            {blogItems.map((item: IBlogItems, idx: number) => {
              return (
                <div key={idx}>
                  {idx % 2 === 0 ? (
                  <div className='grid grid-cols-2 gap-4 mt-10 bg-slate-400 rounded-md'>
                    <div className='p-10'>
                      <h2 className='text-center text-3xl'>{item.title}</h2>
                      <div className='flex justify-evenly'>
                        <p>{item.publisherName}</p>
                        <p>{item.date}</p>
                      </div>
                      <div>
                        <img src={item.image} alt="Martial Arts Image" className='object-cover h-96 w-full' />
                      </div>
                    </div>
                    <div className='p-10'>{item.description}</div>
                  </div>
                ) : (<div className='grid grid-cols-2 gap-4 mt-10 bg-red-400 rounded-md'>
                  <div className='p-10'>{item.description}</div>
                  <div className='p-10'>
                    <h2 className='text-center text-3xl'>{item.title}</h2>
                    <div className='flex justify-evenly'>
                      <p>{item.publisherName}</p>
                      <p>{item.date}</p>
                    </div>
                    <div>
                      <img src={item.image} alt="Martial Arts Image" className='object-cover h-96 w-full' />
                    </div>
                  </div>
                </div>)}
                </div>
              )
            })}
          </div>
        </div>
    </div>
  )
}

export default page
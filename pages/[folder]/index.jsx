import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import PocketBase from 'pocketbase';
import { useEffect, useState } from 'react';
import getFolderStats from '@/components/deleteFile';

const pb = new PocketBase('http://127.0.0.1:8090');


 export default function ClassPage({ folderData }) {
  const [folders, setFolders] = useState([]);    
  useEffect(() => {
    // needs to fix to get only folders that belong to the current user
    async function getFolders() {
        try {
          const folderPromises = folderData.folders.map(folderID => getFolderStats({ folderID }));
          const resultList = await Promise.all(folderPromises);
          setFolders(resultList);
        } catch (error) {
          console.error('Error fetching folders:', error);
        }
    }
    
    getFolders();
  }, [pb]);     
    return (
        <>
            <Head>
              <title>{folderData.folderName}</title>
            </Head>
      <div className="flex justify-center">
      <div className="w-3/4 sm:w-2/4 md:w-1/4 mt-36">
       {folderData.files.map((file, index) => {
              // Split the file string by '_' to separate the filename and the random part
              const filename = file.split('_')[0];
              const extension = "." + file.split('.')[1];
              // The sanitized filename is the first part after splitting
              const sanitizedFilename = filename + extension;

              return (
                <Link key={index} href={`http://127.0.0.1:8090/api/files/folders/${folderData.id}/${file}?thumb=100x300`}>
                  <div className='flex bg-blue-600 p-4 m-4 rounded rounded-xl'>
                    <Image src="/file.png" height={60} width={60} alt='file icon' />
                    <p className='ml-4 mt-1 text-2xl font-semibold'>{sanitizedFilename}</p>
                  </div>
                </Link>
              )
          })}
            {folders && folders.map((folder) => {
          const date = new Date(folder.updated);
            return (
              <Link key={folder.id} href={folder.id}>
                <div className='flex bg-red-600 p-4 m-4 rounded rounded-xl'>
                  <Image src="/folder.png" height={60} width={60} alt='folder icon' />
                  <div className="flex flex-col">
                    <p className='ml-6 font-semibold text-sm'>
                      Last updated: {date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className='ml-6 mt-1 text-2xl font-semibold'>{folder.folderName}</p>
                  </div>
                </div>
              </Link>
            );
        })}
        <Link href={"/"}>
        <button type="button" className="ml-4 mt-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800">Back</button>
        </Link>
        </div>
        </div>
        </>
    )
}


export async function getServerSideProps({ params }) {
  // needs updating to have folder inside a folder
  // thought of using a character like $ to separate folder names like parent$child so the getServerSideProps here would need to adjust for that
  // to remove any charachters before the $ so to get the current folder
  // although path would be needed for "back" button so to redirect from grandparent$parent$child to $grandparent$parent
  // this approach is to avoid infinite dynamic routing which I could not find a soltution for
  const record = await pb.collection('folders').getFirstListItem(`id="${params.folder.toString()}"`);
  
  const folderData = record;

  return {
    props: { folderData },
  };
}
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import PocketBase from 'pocketbase';
import { useEffect, useState } from 'react';
import getFolderStats from '@/components/getFolderStats';
import AddFile from '@/components/addFile';
import CreateFolder from '@/components/createFolder';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useRouter } from 'next/router';
import { pocketbaseAddress } from '@/components/constants';

const pb = new PocketBase(pocketbaseAddress);


 export default function ClassPage({ folderData }) {
  const router = useRouter()
  const currentUrl = router.asPath;
  const withoutLastSegment = router.asPath.split('$').slice(0, -1).join('$');
  const targetUrl = withoutLastSegment || '/';

  const [folders, setFolders] = useState([]);   
  const [folderModalShown, setFolderModalShown] = useState(false); 

  async function deleteFileFromFolder({ folderID, filename, event }) {
    event.preventDefault()
  
    try {
      await pb.collection("folders").update(`${folderID.toString()}`, {
        "files-": [filename],
      });
  
      console.log(`File '${filename}' deleted from folder '${folderID}'`);
      router.reload()
    } catch (error) {
      console.error("Error deleting file:", error.message);
      // Handle the error as needed (log, throw, etc.)
    }
  }


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
                <div key={index} className='flex'>
                <Link href={`${pocketbaseAddress}/api/files/folders/${folderData.id}/${file}?thumb=100x300`}>
                  <div className='flex bg-blue-600 p-4 m-4 rounded rounded-xl'>
                    <Image src="/file.png" height={60} width={60} alt='file icon' />
                    <p className='ml-4 mt-1 text-2xl font-semibold'>{sanitizedFilename}</p>
                  </div>
                </Link>
                <DeleteOutlineOutlinedIcon className='mt-10' onClick={(event) => deleteFileFromFolder({ folderID: folderData.id, filename: file, event })} />
                </div>
              )
          })}
            {folders && folders.map((folder) => {
          const date = new Date(folder.updated);
            return (
              <Link key={folder.id} href={`${currentUrl}$${folder.id}`}>
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
        <AddFile folderRecord={folderData} />
        <button onClick={() => setFolderModalShown(!folderModalShown)} className="mt-4 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
          Create Folder
        </button>
        {folderModalShown &&
        <CreateFolder currentFolderID={folderData.id} />
        }
        <Link href={targetUrl}>
        <button type="button" className="ml-4 mt-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800">Back</button>
        </Link>
        </div>
        </div>
        </>
    )
}


export async function getServerSideProps({ params }) {
  // Extract the part of the folder ID to the right of the rightmost dollar sign ('$')
  const folderId = params.folder.toString().split('$').pop();

  // Retrieve the record using the modified folderId
  const record = await pb.collection('folders').getFirstListItem(`id="${folderId}"`);
  
  const folderData = record;

  return {
    props: { folderData },
  };
}

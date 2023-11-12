import Head from 'next/head';
import { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import Image from 'next/image';
import Link from 'next/link';
import AddFile from '@/components/addFile';
import DeleteFile from '@/components/deleteFile';

const Home = () => {
  const pb = new PocketBase('http://127.0.0.1:8090');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id, setID] = useState('');
  const [session, setSession] = useState(false);
  const [folders, setFolders] = useState([]);

  async function submitForm(event) {
    event.preventDefault();

    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      setID(pb.authStore.model.id)
      setSession(true);
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }

  useEffect(() => {
    // needs to fix to get only folders that belong to the current user
    async function getFolders() {
      let resultList = [];
      try {
        resultList = await pb.collection('folders').getList(1, 50);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
      setFolders(resultList.items);
    }
    
    getFolders();
  }, [id]);

  return (
    <>
    <Head>
    <title>{session ? "root" : "login or sign up"}</title>
  </Head>
    <div className="flex justify-center">
      <div className="w-3/4 sm:w-2/4 md:w-1/4 mt-36">
      {!session ? (
        <form onSubmit={submitForm}>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@email.com"
            required=""
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6 mt-4">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required=""
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Sign In
        </button>
      </form>      
      ) : (
        <>
          {folders.map((folder) => {
            const date = new Date(folder.updated);
            if (folder.folderName !== 'root') {
              return (
                <>
                <Link href={folder.id}>
                <div key={folder.id} className='flex bg-red-600 p-4 m-4 rounded rounded-xl'>
                  <Image src="/folder.png" height={60} width={60} alt='folder icon' />
                  <div className="flex flex-col">
                    <p className='ml-6 font-semibold text-sm'>
                      Last updated: {date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className='ml-6 mt-1 text-2xl font-semibold'>{folder.folderName}</p>
                  </div>
                </div>
                </Link>
                </>
              );
            } else {
              // Render files within the "root" folder
              // also must add ability to delete files and folders and maybe to rename folders
              return folder.files.map((file, index) => {
              // Split the file string by '_' to separate the filename and the random part
              const filename = file.split('_')[0];
              const extension = "." + file.split('.')[1];
              // The sanitized filename is the first part after splitting
              const sanitizedFilename = filename + extension;

              return (
                <div key={index} className='flex ml-4'>
                <Link  href={`http://127.0.0.1:8090/api/files/folders/${folder.id}/${file}?thumb=100x300`}>
                  <div className='flex bg-blue-600 p-4 mt-4 mb-4 rounded rounded-xl'>
                    <Image src="/file.png" height={60} width={60} alt='file icon' />
                    <p className='ml-4 mt-1 text-2xl font-semibold'>{sanitizedFilename}</p>
                  </div>
                  </Link>

                  <div className="mt-8 ml-6">
                    <Image className='hover:cursor-pointer' src={'/delete.png'} height={25} width={25} alt='delete icon' onClick={DeleteFile(file, folder.id)} />
                  </div>
                </div>
              );
            });
            }
          })}
          <AddFile folderRecord={folders.filter(folder => folder.folderName === 'root')} />
        </>
      )}
    </div>
    </div>
    </>
  )
}

export default Home
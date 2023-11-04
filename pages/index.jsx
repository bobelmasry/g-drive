import Head from 'next/head';
import { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import Image from 'next/image';
import Link from 'next/link';

const Home = () => {
  const pb = new PocketBase('http://127.0.0.1:8090');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id, setID] = useState('');
  const [session, setSession] = useState(false);
  const [folders, setFolders] = useState([]);

  async function submitForm(event) {
    event.preventDefault(); // Prevent the form from submitting

    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      setID(pb.authStore.model.id)
      setSession(true);
    } catch (error) {
      console.error('Authentication error:', error);
      // Handle authentication error here (e.g., show an error message).
    }
  }

  useEffect(() => {
    async function getFolders() {
      let resultList = 'hi';
      try {
        resultList = await pb.collection('folders').getList(1, 50);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
      setFolders(resultList.items);
    }
    
    getFolders();
  }, [id]);

  console.log(folders);
  return (
    <>
    <Head>
    <title>Login or Signup | teachmegcse</title>
    <meta name="description" content="Login or Signup to Teachmegcse"></meta>
    <meta name="keywords" content="teachmegcse, teach me gcse, A-level revision notes, A-level past papers, A-level topic questions, 
    A-level math past papers, A-level physics past papers, A-level chemistry past papers"></meta>
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
            placeholder="name@flowbite.com"
            required=""
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
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
              return folder.files.map((file, index) => (
                <div key={index} className='flex bg-blue-600 p-4 m-4 rounded rounded-xl'>
                  <p className='ml-6 mt-1 text-2xl font-semibold'>{file}</p>
                </div>
              ));
            }
          })}
        </>
      )}
    </div>
    </div>
    </>
  )
}

export default Home
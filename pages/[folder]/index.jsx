import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');


 export default function ClassPage({ folderData }) {         
    return (
        <>
            <Head>
              <title>{folderData.folderName}</title>
            </Head>
      <div className="flex justify-center">
      <div className="w-3/4 sm:w-2/4 md:w-1/4 mt-36">
        {folderData.files.map((file, index) => (
                <Link key={index} href={`http://127.0.0.1:8090/api/files/folders/${folderData.id}/${file}`}>
                <div className='flex bg-blue-600 p-4 m-4 rounded rounded-xl'>
                  <Image src="/file.png" height={60} width={60} alt='file icon' />
                  <p className='ml-4 mt-1 text-2xl font-semibold'>{file}</p>
                </div>
                </Link>
              ))}
        <Link href={"/"}>
        <button type="button" class="ml-4 mt-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800">Back</button>
        </Link>
        </div>
        </div>
        </>
    )
}


export async function getServerSideProps({ params }) {
  const record = await pb.collection('folders').getFirstListItem(`id="${params.folder.toString()}"`);
  
  const folderData = record;

  return {
    props: { folderData },
  };
}
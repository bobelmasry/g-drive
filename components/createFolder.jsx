import { useRouter } from 'next/router';  
import { useState } from 'react';
import PocketBase from 'pocketbase';
import { pocketbaseAddress } from "@/components/constants";

export default function CreateFolder({currentFolderID}) {
  const pb = new PocketBase(pocketbaseAddress);
  const router = useRouter()

  const [folderModalShown, setFolderModalShown] = useState(true)
  const [folderName, setFolderName] = useState('')
  async function createFolderFun(){
    const record = await pb.collection('folders').create({
      folderName: folderName
  });
  const post = await pb.collection('folders').update(currentFolderID, {
    // append single tag
    'folders+': record.id.toString(),
})
setFolderModalShown(false)
  router.reload()
  }
    // a modal that creates an empty folder and then refreshes to show it
    return (
<>
  {/* Main modal */}
  {folderModalShown &&
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 w-full md:w-1/2 h-1/3 -translate-y-1/2 z-50">
  <div className="relative p-4 w-full max-w-2xl max-h-full">
    {/* Modal content */}
    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
      {/* Modal header */}
      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Create a Folder
        </h3>
        <button
          onClick={() => setFolderModalShown(false)}
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-hide="default-modal"
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
      </div>
      {/* Modal body */}
      <div className="p-4 md:p-5 space-y-4">
        {/* Your modal content here */}
        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Folder Name</label>
        <input onChange={(event) => setFolderName(event.target.value)} type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>

      </div>
      {/* Modal footer */}
      <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
        <button
        onClick={() => createFolderFun()}
          data-modal-hide="default-modal"
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Create
        </button>
      </div>
    </div>
  </div>
</div>
}
</>
      )
};
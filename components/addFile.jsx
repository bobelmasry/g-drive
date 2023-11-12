import { FileInput } from 'flowbite-react';
import { useRouter } from 'next/router';
import PocketBase from 'pocketbase';

export default function AddFile({ folderRecord }) {
    const router = useRouter();

    async function upload(event) {
        // Create a PocketBase instance
        const pb = new PocketBase('http://127.0.0.1:8090');

        // Capture the selected file
        const selectedFile = event.target.files[0]; // Access the first selected file

        if (selectedFile) {
            // Update the folder record in PocketBase
            const updatedRecord = await pb.collection('folders').update(folderRecord[0].id, {
                files: [...folderRecord[0].files, selectedFile],
            });
            
            if (updatedRecord) {
                console.log('File uploaded and folder record updated');
                router.reload();
            } else {
                console.error('Failed to update folder record');
            }
        } else {
            console.error('No file selected');
        }
    }

    return (
        <div id="fileUpload" className="max-w-md">
            <FileInput id="file" onChange={upload} />
        </div>
    );
}

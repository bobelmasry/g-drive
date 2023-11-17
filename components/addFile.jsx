import { FileInput } from 'flowbite-react';
import { useRouter } from 'next/router';
import PocketBase from 'pocketbase';
import { pocketbaseAddress } from "@/components/constants";

export default function AddFile({ folderRecord }) {
    const router = useRouter();

    async function upload(event) {
        // Create a PocketBase instance
        const pb = new PocketBase(pocketbaseAddress);

        // Capture the selected file
        const selectedFile = event.target.files[0]; // Access the first selected file

        if (selectedFile) {
            // Update the folder record in PocketBase
            const updatedRecord = await pb.collection('folders').update(folderRecord.id, {
                files: [...folderRecord.files, selectedFile],
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

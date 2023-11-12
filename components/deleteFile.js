import { useRouter } from "next/router";
import PocketBase from "pocketbase";

export default async function DeleteFile({ filename, folderID }) {
  const router = useRouter();
  const pb = new PocketBase("http://127.0.0.1:8090");

  // delete individual files
  await pb.collection("folders").update(`"${folderID}"`, {
    "files-": [filename],
  });
}

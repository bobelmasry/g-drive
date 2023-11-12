import PocketBase from "pocketbase";

export default async function getFolderStats({ folderID }) {
  const pb = new PocketBase("http://127.0.0.1:8090");

  // delete individual files
  const record = await pb
    .collection("folders")
    .getFirstListItem(`id="${folderID.toString()}"`);
  return record;
}

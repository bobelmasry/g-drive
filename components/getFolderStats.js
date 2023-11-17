import PocketBase from "pocketbase";
import { pocketbaseAddress } from "@/components/constants";

export default async function getFolderStats({ folderID }) {
  const pb = new PocketBase(pocketbaseAddress);
  let record = null;

  try {
    if (folderID && folderID != undefined) {
      // delete individual files
      record = await pb
        .collection("folders")
        .getFirstListItem(`id="${folderID.toString()}"`);
    }
  } catch (error) {
    console.error("Error fetching folder stats:", error.message);
    // Handle the error as needed (log, throw, etc.)
  }

  return record;
}

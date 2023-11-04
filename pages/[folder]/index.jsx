import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import PocketBase from 'pocketbase';


 export default function ClassPage({ folderData }) {
    console.log(folderData);
         
    return (
        <>
        <p>hi</p>
        </>
    )
}


export async function getServerSideProps({ params }) {
    const pb = new PocketBase('http://127.0.0.1:8090');
    const record = await pb.collection('posts').getFirstListItem(`id=${params.folder.toString()}`);
  
  const folderData = record;

  return {
    props: { folderData },
  };
}
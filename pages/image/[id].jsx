import React from 'react';
import axios from 'axios';
import Head from 'next/head'


const Image = ({ metadata, ...params }) => (
  <>
    <Head>
      <title>{params.id}</title>
    </Head>

    <img src={`https://situatedviews.axismaps.io/iiif-img/3/${params.id}/pct:1,1,98,98/%5E512,/0/default.jpg`} alt="this is a thumbnail" />

    <h1>An Image!</h1>
    {metadata.map(m => (
      <p>{`${m.label.none ? m.label.none[0] : m.label['pt-br'][0]} - ${
        m.value.none ? m.value.none[0] : m.value['pt-br'][0]
      }`}</p>
    ))}
  </>
);

export async function getStaticPaths() {
  // Get images from IIIF colleciton manifest
  const {
    data: { manifests },
  } = await axios.get('https://situatedviews.axismaps.io/iiif/2/collection/all');

  const paths = manifests.map(manifest => `/image/${manifest["@id"].match(/[^/]+(?=\/manifest)/)}`);

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const {
    data: { metadata },
  } = await axios.get(`https://situatedviews.axismaps.io/iiif/3/${params.id}/manifest`);

  return { props: { metadata, ...params } };
}

export default Image;

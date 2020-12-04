import React from 'react';
import axios from 'axios';
import Head from 'next/head';

const Image = ({ metadata, thumbnail, ...params }) => (
  <>
    <Head>
      <title>{params.id}</title>
    </Head>

    <img src={thumbnail} alt="this is a thumbnail" />

    <h1>An Image!</h1>
    {metadata.map(m => (
      <p>{`${m.label.none ? m.label.none[0] : m.label['pt-br'][0]} - ${
        m.value.none ? m.value.none[0] : m.value['pt-br'][0]
      }`}</p>
    ))}
  </>
);

export async function getStaticPaths() {
  // Get identifiers from IIIF v2 collection manifest
  const {
    data: { manifests },
  } = await axios.get('https://images.imaginerio.org/iiif/2/collection/all');

  const paths = manifests.map(manifest => `/image/${manifest['@id'].match(/[^/]+(?=\/manifest)/)}`);

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  // Get metadata from IIIF v3 manifest

  const {
    data: { metadata },
  } = await axios.get(`https://images.imaginerio.org/iiif/3/${params.id}/manifest`);

  const thumbnail = `https://images.imaginerio.org/iiif-img/3/${params.id}/pct:1,1,98,98/%5E512,/0/default.jpg`;

  return { props: { metadata, thumbnail, ...params } };
}

export default Image;

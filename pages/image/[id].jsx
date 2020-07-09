import React from 'react';
import axios from 'axios';

const Image = ({metadata, thumbnail}) => (
  <>
  <h1>An Image!</h1>
  {metadata.map(m => (
    <p>{`${m.label.none ? m.label.none[0] : m.label['pt-br'][0]} - ${m.value.none ? m.value.none[0] : m.value['pt-br'][0]}`}</p>
  ))}
  </>
);

export async function getStaticPaths() {
  // Get images from IIIF colleciton manifest
  const {data : {items}} = await axios.get('https://situatedviews.axismaps.io/iiif/collection/11');

  const paths = items.map((item) => `/image/${item.id.match(/\d+(?=\/manifest)/)}`)

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const {data: {metadata, thumbnail}} = await axios.get(`https://situatedviews.axismaps.io/iiif/${params.id}/manifest`)

  // Pass post data to the page via props
  return { props: { metadata, thumbnail } }
}

export default Image;

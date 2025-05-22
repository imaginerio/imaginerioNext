export default function cloudfrontLoader({ src, width, quality }) {
  if (src.startsWith('/')) {
    return src;
  }
  const url = new URL(src);
  url.searchParams.set('format', 'auto');
  url.searchParams.set('width', width.toString());
  url.searchParams.set('quality', (quality || 75).toString());
  return url.href;
}

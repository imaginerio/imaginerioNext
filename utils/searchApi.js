// Requests fired during the static build (getStaticProps / getStaticPaths) fan
// out fast enough to trip the search API's per-IP rate limit, so a full build
// fails with 429s. When SEARCH_API_BYPASS_TOKEN is set we send it as the
// `x-ratelimit-bypass` header and the API lets the build through.
//
// The token is intentionally NOT prefixed with NEXT_PUBLIC_, so it stays on the
// build server and is never bundled into client code. Only spread these headers
// into build-time data fetching — never into components or SWR fetchers, or the
// token would ship to browsers and stop being a secret.
const token = process.env.SEARCH_API_BYPASS_TOKEN;

const searchBuildHeaders = token ? { 'x-ratelimit-bypass': token } : {};

export default searchBuildHeaders;

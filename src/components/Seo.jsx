import { useEffect } from 'react';

const SITE_URL = 'https://cleanplatelab.id';

function setMeta(selector, attribute, value) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

export function Seo({ title, description, path = '/' }) {
  useEffect(() => {
    const fullTitle = title.includes('Clean Plate Lab') ? title : `${title} | Clean Plate Lab`;
    const canonicalUrl = `${SITE_URL}${path}`;
    document.title = fullTitle;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', canonicalUrl);
  }, [description, path, title]);

  return null;
}

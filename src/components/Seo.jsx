import { useEffect } from 'react';

const SITE_URL = 'https://cleanplatelab.online';

function setMeta(selector, attribute, value) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

export function Seo({ title, description, image = `${SITE_URL}/CPL_logo_white.webp`, path = '/' }) {
  useEffect(() => {
    const fullTitle = title.includes('Clean Plate Lab') ? title : `${title} | Clean Plate Lab`;
    const canonicalUrl = `${SITE_URL}${path}`;
    const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;
    document.title = fullTitle;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[property="og:image"]', 'content', imageUrl);
    setMeta('meta[property="og:image:secure_url"]', 'content', imageUrl);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', imageUrl);
    setMeta('link[rel="canonical"]', 'href', canonicalUrl);
  }, [description, image, path, title]);

  return null;
}

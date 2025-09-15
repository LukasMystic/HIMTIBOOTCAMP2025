import React from 'react';
import { Helmet } from 'react-helmet-async';

const Seo = ({ title, description, keywords, image, url }) => {
  const defaultTitle = 'HIMTI AI Bootcamp 2025';
  const defaultDescription = 'From Theory to Deployment: Master the Art of Artificial Intelligence in our 4-day intensive bootcamp.';
  const defaultKeywords = ['AI Bootcamp', 'HIMTI', 'Machine Learning', 'Python', 'Data Science', 'Binus University', 'AI Workshop', '2025'];
  
  // Use provided props or fall back to defaults
  const seoTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  
  // Construct absolute URL for images if a relative path is given
  const baseUrl = window.location.origin;
  const seoImage = image ? `${baseUrl}${image}` : `${baseUrl}/assets/poster.png`; // Default poster image
  const seoUrl = url ? `${baseUrl}${url}` : baseUrl;

  return (
    <Helmet>
      {/* Standard SEO Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords.join(', ')} />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph (Facebook, LinkedIn, etc.) */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
    </Helmet>
  );
};

export default Seo;
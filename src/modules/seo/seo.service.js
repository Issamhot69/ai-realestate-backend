const generateSlug = (title, city) => {
  const base = (title + '-' + city).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return base + '-' + Date.now();
};

const generateMetaTitle = (property) => {
  return property.title + ' - ' + property.location?.city + ' | AI RealEstate';
};

const generateMetaDescription = (property) => {
  return 'Invest in ' + property.title + ' in ' + property.location?.city + '. ROI: ' + property.roiScore + '%. Price: ' + property.price + 'EUR.';
};

const generateOpenGraph = (property) => {
  return {
    title: generateMetaTitle(property),
    description: generateMetaDescription(property),
    image: property.photos?.[0] || '',
    url: 'https://ai-realestate.com/property/' + property.slug
  };
};

const generateCityPage = (city, properties) => {
  return {
    title: 'Real Estate Investment in ' + city + ' | AI RealEstate',
    description: 'Discover the best investment opportunities in ' + city + '. ' + properties.length + ' properties available.',
    properties: properties.slice(0, 10)
  };
};

module.exports = { generateSlug, generateMetaTitle, generateMetaDescription, generateOpenGraph, generateCityPage };
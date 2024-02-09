export const numberToFixed = val => {
    return Number(val / 1000).toFixed(1);
};

// export const addhttp = (url) => {
//     // if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
//     if (!/^https?:\/\//.test(url)) {
//       url = 'https:' + url;
//     }
//     return url;
// };

export const addhttp = (url) => {
  // Check if the URL starts with "//" (protocol-relative URL)
  if (url.startsWith('//')) {
      return 'https:' + url;
  }

  // Check if the URL doesn't have a protocol (assume "https://" in this case)
  if (!/^\w+:\/\//.test(url)) {
      return 'https://' + url;
  }

  // Check if the URL doesn't start with "https://"
  if (!/^https:\/\//i.test(url)) {
      // Replace "http://" with "https://"
      url = url.replace(/^http:\/\//i, 'https://');
  }

  return url;
};

export const getImagePath = (args) => {
    if (args.finalWorth - args.estWorthPrev > 0) {
      return require('../images/up-arrow.png');
    } else if (args.finalWorth - args.estWorthPrev < 0) {
      return require('../images/down-arrow.png');
    } else {
      return require('../images/stable.png');
    }
};

export const calculateAge = (timestamp) => {
  const birthdate = new Date(timestamp);
  const referenceDate = new Date(); // Current date

  // Calculate the difference in years
  let age = referenceDate.getFullYear() - birthdate.getFullYear();

  // Adjust age if the birthday hasn't occurred yet this year
  if (
    referenceDate.getMonth() < birthdate.getMonth() ||
    (referenceDate.getMonth() === birthdate.getMonth() &&
      referenceDate.getDate() < birthdate.getDate())
  ) {
    age--;
  }

  return age;
};

export const filterUniqueByField = (array, field) => {
  const seenValues = new Set();
  return array.filter(item => {
    const value = item[field];
    if (!seenValues.has(value)) {
      seenValues.add(value);
      return true;
    }
    return false;
  });
};

let apiURL;
if (typeof window !== 'undefined') {
  apiURL = new URL('https://nacenit.openinnovations.cz:8040');    
}
else {
  apiURL = {};
}
apiURL.port = 8040;
const address = apiURL.origin;
const request = (method, uri, data = undefined, file = undefined) => {
  const formData = new FormData();
  if(data) {
    formData.append('data', JSON.stringify(data));
  }
  if(file) {
    formData.append('file', file);
  }
  return fetch(`${address}${uri}`,{
    method,
    body: formData,
  })
    .then((response) => { return response.json(); });
};


export const getFilaments = () => {
  return request('POST', '/filaments');
};

export const uploadFileForPricing = (file) => {
  return request('POST', '/upload', undefined, file);
};

export const sliceFile = (fileId, filament) => {
  return request('POST', '/slice', { fileId, filament });
};

export const getFilePrice = (fileId, filament) => {
  return request('POST', '/pricing', {fileId, filament});
};

export const createOrder = (files, email, phone, delivery, details) => {
  return request('POST', '/order', {
    files,
    email,
    delivery,
    details,
    phone,
  },);
};

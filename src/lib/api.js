const address = 'http://localhost:8040';
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
  return request('GET', '/filaments');
};

export const uploadFileForPricing = (file) => {
  return request('POST', '/upload', undefined, file);
};

export const getPrintPrice = (fileName, filament) => {
  return request('POST', '/pricing', { fileName: fileName, filament });
};

export const createOrder = (fileName, email) => {
  return request('POST', '/order', {
   fileName,
   email,
  },);
};

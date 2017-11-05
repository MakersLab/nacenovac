const address = 'http://opeteth.mooo.com:8040';
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

export const sliceFile = (fileName, filament) => {
  return request('POST', '/slice', { fileId: fileName, filament });
};

export const getFilePrice = (sliceResult, filament) => {
  return request('POST', '/pricing', {sliceResult, filament});
};

export const createOrder = (fileName, fileId, email, filament, amount) => {
  return request('POST', '/order', {
    fileName,
    fileId,
    email,
    filament,
    amount,
  },);
};

import _ from 'lodash';

export const convertObjectToArray = (object, keyName) => {
  let newArray = [];
  _.forEach(object, (value, key) => {
    value[keyName] = key;
    newArray.push(value);
  });
  return newArray;
};

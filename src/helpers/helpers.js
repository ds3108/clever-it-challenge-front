/* eslint-disable no-control-regex */

/**
 * Validate the format of an email address
 * @param {string} email : asd@gmail.com
 * @returns {bool} : true
 */
const validateEmail = email => {
  const regEx = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return regEx.test(String(email).toLowerCase());
}
/**
 * Build the headers for a fetch call
 * @param {string} verb : verb of the fetch ( GET,POST,PUT OR DELETE)
 * @param {string} data : Its the bodyform if applies.
 * @returns {object} : an Object with headers.
 */
const fetchConfig = (verb, data) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  return data ? {
      method: verb,
      headers,
      body: JSON.stringify(data),
    } : {
    method: verb,
    headers,
  };
}

export { validateEmail, fetchConfig };

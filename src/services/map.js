export function getCoordinatesByAddress(address) {
  return fetch('https://api.opencagedata.com/geocode/v1/json?q=' + encodeURIComponent(address) + '&key=7a027288e51441678b4aa074e780c90c').then((data) => data.json());
}

export function getAddressByCoordinates(lat, lng) {
  return fetch('https://api.opencagedata.com/geocode/v1/json?q=' + lat + '+' + lng + '&key=7a027288e51441678b4aa074e780c90c').then((data) => data.json());
}
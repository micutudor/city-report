import { getAuthToken } from './storage';

export async function createComplaint(complaintCategory, complaintDescription, locationLat, locationLng) {
  const token = await getAuthToken();
  return fetch('https://api.inorog.org/api/complaint/new.php?session_key=' + token, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      category: complaintCategory,
      text: complaintDescription,
      location_lat: locationLat,
      location_lng: locationLng
    })
  })
  .then((data) => data.json())
}

export async function uploadComplaintImage(complaintId, photoData = {type, uri}) {
  const photo = {
    uri: photoData.uri,
    name: "image.jpg",                  
    type: "image/jpg"         
  }
  console.log(photo);

  var form = new FormData();
  form.append("IMAGE_FILE", photo);

  return fetch('https://api.inorog.org/api/complaint/upload_image.php?id=' + complaintId, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: form
  }).then((data) => data.json());
}

export async function deleteComplaint(complaintId) {
  const token = await getAuthToken();
  return fetch('https://api.inorog.org/api/complaint/delete.php?id=' + complaintId + '&session_key=' + token, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then((data) => data.json())
}

export async function loadComplaint(complaintId) {
  const token = await getAuthToken();
  return fetch('https://api.inorog.org/api/complaint/view.php?id=' + complaintId + '&session_key=' + token).then((data) => data.json())
}

export async function getUserComplaints() {
  const token = await getAuthToken();
  return fetch('https://api.inorog.org/api/complaint/view.php?session_key=' + token).then((data) => data.json())
}

export function getAllComplaints() {
  return fetch('https://api.inorog.org/api/complaint/view.php?session_key=dIzVAzIHBWwfa7G3QihJFbpjd1kNggye').then((data) => data.json())
}
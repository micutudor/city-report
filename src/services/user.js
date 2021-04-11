export function registerUser(user_fname, user_lname, user_email, user_phone) {
  return fetch('https://api.inorog.org/api/user/new.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fname: user_fname,
      lname: user_lname,
      email: user_email,
      phone: user_phone
    })
  })
  .then((data) => data.json())
}
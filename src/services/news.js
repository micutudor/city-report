export function getAllNews()
{
  return fetch('https://api.inorog.org/api/news/view.php?session_key=dIzVAzIHBWwfa7G3QihJFbpjd1kNggye').then((data) => data.json());
}

export function getNews(newsId)
{
  return fetch('https://api.inorog.org/api/news/view.php?id=' + newsId + '&session_key=dIzVAzIHBWwfa7G3QihJFbpjd1kNggye').then((data) => data.json());
}
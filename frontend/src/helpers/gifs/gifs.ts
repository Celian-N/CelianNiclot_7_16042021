export const fetchGifs = async (searchGif: string) => {
  const apiKey = 'dc6zaTOxFJmzC';
  const searchEndPoint = 'https://api.giphy.com/v1/gifs/search?';
  const limit = 30;

  const url = `${searchEndPoint}&api_key=${apiKey}&q=${searchGif}&limit=${limit}`;

  return await fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return buildGifs(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

const buildGifs = (result: any) => {
  return result.data
    .map((gif: any) => gif.id)
    .map((gifId: string) => {
      return `https://media.giphy.com/media/${gifId}/giphy.gif`;
    });
};

const apiUrl = 'https://api.lyrics.ovh'
const resultContainer = document.getElementById('result');
const lyricContainer = document.getElementById('lyricContainer');
const searchItem = document.getElementById('searchText');
const animation = document.getElementById('animation');
let songs = [];
let isFocused = true;

/**The search function takes the input from the user and get the responses from the
 * api and passes the result  to the showResult function.
 */
function search() {
  animation.style.display = 'block';
  const searchLink = `${apiUrl}/suggest/${searchItem.value}`;
  fetch(searchLink)
  .then(response => response.json())
  .then(songs => showResult(songs.data.slice(0, 10)))
  .catch(e => { });
}

/**The showReslut function shows all the search result to the user.*/
function showResult(rawSongs) {
  
  lyricContainer.innerHTML = " ";
  lyricContainer.style.display = 'none';
  
  // removes all the previous search result.
  while (resultContainer.firstChild) {
    resultContainer.removeChild(resultContainer.firstChild);
  }

  if (rawSongs.length === 0) {
    const child = document.createElement('div');
    child.innerHTML = `<p class="text-center"> Sorry no songs found :( </p>`;
    result.appendChild(child);
    animation.style.display = 'none';
    return;
  }
  
  songs = rawSongs.map(item => ({
    title: item.title,
    author: item.artist.name,
    album: item.album.title
  }));
  
  for (let i = 0; i < 10; i++) {
    const song = songs[i];
    const child = document.createElement('div');
    child.innerHTML =
    `<div class="single-result row align-items-center my-3 p-3">
    <div class="col-md-9">
    <h3 class="lyrics-name">${song.title}</h3>
    <p class="author lead">Author - ${song.author}, Album by ${song.album}</p>
    </div>
    <div class="col-md-3 text-md-right text-center">
    <button value="${i}" class="btn btn-success">Get Lyrics</button>
    </div>
    </div>`;
    animation.style.display = 'none';
    resultContainer.appendChild(child);
    result.style.display = 'block';
  }
}

function getLyrics(e) {

  const index = e.target.value;
  if (index !== undefined) {

    const lyricLink = `${apiUrl}/v1/${songs[index].author}/${songs[index].title}`.replace(/ /g, '%20');

    fetch(lyricLink)
      .then(response => {
        if (response.status === 200)
          return response.json();
        return { lyrics: 'No lyrics found :(' }
      })
      .then(lyric => showLyrics(lyric.lyrics, index))
      .catch(e => { });

  }
}


function showLyrics(lyric, index) {
  result.style.display = 'none';

  lyricContainer.removeChild(lyricContainer.firstChild);
  const lyricElement = document.createElement('div');

  lyricElement.innerHTML = `<button value ="-1" class="btn btn-success">Go Back</button>
  <h2 class="text-success mb-4">${songs[index].author} - ${songs[index].title}</h2>
  <pre class="lyric text-white">${lyric}</pre>`;

  lyricContainer.appendChild(lyricElement);
  lyricContainer.style.display = 'block';
}

function goBack(e) {
  if (e.target.value === '-1') {
    lyricContainer.style.display = 'none';
    result.style.display = 'block';
  }

}

window.addEventListener('keydown', e => {
  if (e.keyCode === 13 && isFocused)
    search();
});


searchItem.addEventListener('focus', () => isFocused = true);
searchItem.addEventListener('focusout', () => isFocused = false);
resultContainer.addEventListener('click', getLyrics);
document.getElementById('search').addEventListener('click', search);
document.getElementById('lyricContainer').addEventListener('click', goBack);






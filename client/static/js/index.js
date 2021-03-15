const key = require('./key')

const GiphyJsFetchApi = require('@giphy/js-fetch-api')
const giphyComponents =  require('@giphy/js-components')
const renderCarousel = giphyComponents.renderCarousel
const GiphyFetch = GiphyJsFetchApi.GiphyFetch


const gf = new GiphyFetch(key);
console.log(gf)
const fetchGifs = (offset) => gf.search('dogs', {offset, sort: 'relevant', lang: 'en', limit: 3})

function toggleBorder(element){
    element.style.border = 'solid hotpink 4px'
}
function removeAllBorders(){
    const giphyGifs = document.getElementsByClassName('giphy-gif')
    for(let i=0; i<giphyGifs.length; i++) {
        giphyGifs[i].style.border = 'solid 4px transparent'
        giphyGifs[i].style.borderRadius = '12px'

    }
}

function vanillaJSCarousel(mountNode){
  renderCarousel(
    {
      gifHeight: 200,
      noLink: true,
      user: {},
      fetchGifs,
      gutter: 0,
      onGifClick: (gif, event) => {
          event.preventDefault();
            console.log(gif)
        //   console.log(gif.id)
            console.log(event.currentTarget)
            removeAllBorders()
            toggleBorder(event.currentTarget)
        }
    },
    mountNode
  );
};

const root = document.getElementById('root')
vanillaJSCarousel(root)
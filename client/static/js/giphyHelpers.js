function toggleBorder(element){
    element.style.border = 'solid limegreen 4px'
}
function removeAllBorders(){
    const giphyGifs = document.getElementsByClassName('giphy-gif')
    for(let i=0; i<giphyGifs.length; i++) {
        giphyGifs[i].style.border = 'solid 4px transparent'
        giphyGifs[i].style.borderRadius = '12px'

    }
}

module.exports = {
    toggleBorder,
    removeAllBorders
}
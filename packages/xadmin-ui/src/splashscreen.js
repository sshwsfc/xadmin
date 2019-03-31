
export default {
  start: (app) => () => {
    const loaderDiv = document.getElementById('loader-wrapper')
    if(loaderDiv) {
      loaderDiv.addEventListener('transitionend', () => {
        loaderDiv.style.display = 'none'
      }, true)
      loaderDiv.style.display = 'none'
    }
  }
}

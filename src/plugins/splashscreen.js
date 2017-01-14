
export default {
  start: (app) => () => {
    const loaderDiv = document.getElementById('loader-wrapper')
    loaderDiv.addEventListener('transitionend', () => {
      loaderDiv.style.display = 'none'
    }, true)
    loaderDiv.style.display = 'none'
  }
}

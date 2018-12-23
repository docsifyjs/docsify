export default (function () {
  let loadingImageCount = 0
  const subscribers = []

  function subscribe(cb) {
    subscribers.push(cb)
  }

  function unsubscribe(cb) {
    const index = subscribers.indexOf(cb)

    if (index !== -1) {
      subscribers.splice(index, 1)
    }
  }

  function notifyAllImagesComplete() {
    for (let i = 0; i < subscribers.length; i++) {
      subscribers[i]()
    }
  }

  function increaseLoadingImageCount() {
    loadingImageCount += 1
  }

  function decreaseLoadingImageCount() {
    loadingImageCount -= 1

    if (loadingImageCount === 0) {
      notifyAllImagesComplete()
    }
  }

  function cleanElement(ele) {
    ele.removeAttribute('onload')
    ele.removeAttribute('onerror')
  }

  function onLoad(ele) {
    cleanElement(ele)
    decreaseLoadingImageCount()
  }

  function onError(ele) {
    cleanElement(ele)
    decreaseLoadingImageCount()
  }

  function isAllImagesComplete() {
    return loadingImageCount === 0
  }

  return {
    subscribe,
    unsubscribe,
    increaseLoadingImageCount,
    onLoad,
    onError,
    isAllImagesComplete
  }
})()

/**
 * 图片加载出错
 * @param  {[type]} ele     [description]
 * @param  {[type]} binding [description]
 * @return {[type]}         [description]
 */
const imageError = (ele, binding) => {
  const photo = binding.modifiers.photo
  let errorDefault = require('~/assets/img/default.png')
  if (photo) {
    errorDefault = require('~/assets/img/photo-default.png')
  }

  const halder = () => {
    ele.src = errorDefault
    ele.removeEventListener('error', halder)
  }

  console.log(ele)
  ele.addEventListener('error', halder)
}

export default {
  inserted: imageError
}

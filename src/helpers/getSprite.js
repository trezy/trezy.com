// Local constants
const sprites = {}





const getSprite = async (type, name) => {
  const spritePath = `${type}/${name}`
  let sprite = sprites[spritePath]

  if (!sprite) {
    const container = new Image

    sprite = {
      container,
      isLoaded: false,
    }

    sprites[type] = sprite

    await new Promise((resolve, reject) => {
      container.onerror = reject

      container.onload = () => {
        sprite.isLoaded = true
        resolve()
      }

      container.src = `/game/${spritePath}.png`
    })
  }

  return sprite
}





export default getSprite

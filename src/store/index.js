import Store from 'beedle'

const actions = {
  showNotification (context, message) {
    const notificationElement = document.createElement('div')
    notificationElement.classList.add('notification')
    notificationElement.innerHTML = message
    notificationElement.addEventListener('animationend', () => {
      notificationElement.remove()
    })
    notificationElement.addEventListener('click', () => {
      notificationElement.remove()
    })
    document.querySelector('body')?.prepend(notificationElement)
  }
}

const mutations = {
}

const initialState = {
  name: 'SNOW',
  stamina: 30,
  items: [],
}

export default new Store({
  actions,
  mutations,
  initialState
})
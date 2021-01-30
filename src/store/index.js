import Store from 'beedle'
import game from '../main'

const actions = {
  showNotification (context, { message, callback = null }) {
    const notificationElement = document.createElement('div')
    notificationElement.classList.add('notification')
    notificationElement.innerHTML = message
    notificationElement.addEventListener('animationend', () => {
      notificationElement.remove()
      callback?.()
    })
    notificationElement.addEventListener('click', () => {
      notificationElement.remove()
      callback?.()
    })
    document.querySelector('body')?.prepend(notificationElement)
  },
  makeItemJitter (context, availableItems) {
    const statusList = context.state.items.map(itemId => {
      if (itemId === null) {
        return 'empty'
      }
      return availableItems.map(item => item.in).includes(itemId) ? 'available' : 'exist'
    })
    if (!statusList.some(status => status === 'available')) {
      return context.dispatch('showNotification', 'NO SUITABLE ITEMS')
    }
    context.dispatch('setBaggageStatus', {
      statusList,
      clickEvent: (index) => {
        context.dispatch('useItem', context.state.items[index])
      }
    })
  },
  cancelItemJitter (context) {
    const statusList = context.state.items.map(itemId => itemId === null ? 'empty' : 'exist')
    context.dispatch('setBaggageStatus', { statusList, clickEvent: null })
  },
  setBaggageStatus (context, { statusList, clickEvent }) {
    const baggageElement = document.querySelector('.baggage')
    for (let i = 0; i < baggageElement.children.length; i++) {
      const element = baggageElement.children[i]
      element.onclick = clickEvent?.bind(this, [i])
      element.dataset.status = statusList[i]
    }
  },
  walk (context) {
    context.state.stamina -= 1
    document.querySelector('.role-status__stamina').innerHTML = `STAMINA: ${context.state.stamina}`
    if (context.state.stamina === 0) {
      context.dispatch('gameOver')
    }
  },
  gameOver (context) {
    const playScene = game.scene.keys['PlayScene']
    playScene.scene.pause()
    context.dispatch('showNotification', {
      message: 'YOU FAILED',
      callback: () => {
        playScene.scene.restart()
      }
    })
  },
  useItem (context, id) {
    console.log('use item', id)
  }
}

const mutations = {}

const initialState = {
  name: 'SNOW',
  stamina: 10,
  items: ['rope', 'necklace', 'umbrella', 'wine-bottle'],
}

export default new Store({
  actions,
  mutations,
  initialState
})
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
  },
  makeItemJitter (context, availableItems) {
    const statusList = context.state.items.map(itemId => {
      if (itemId === null) {
        return 'empty'
      }
      return availableItems.map(item => item.in).includes(itemId) ? 'available' : 'exist'
    })
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
  useItem (context, id) {
    console.log('use item', id)
  }
}

const mutations = {}

const initialState = {
  name: 'SNOW',
  stamina: 30,
  items: ['rope', 'necklace', 'umbrella', 'wine-bottle'],
}

export default new Store({
  actions,
  mutations,
  initialState
})
import Store from 'beedle'
import game from '../main'
import itemJson from '../assets/json/item.json'

const INIT_STAMINA = 60
const INIT_ITEMS = ['rope', 'necklace', 'umbrella', 'wine-bottle']

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
  makeItemJitter (context, itemId) {
    const availableItems = itemJson.fixed.find(item => item.id === itemId)?.availableItems
    const statusList = context.state.items.map(itemId => {
      if (itemId === null) {
        return 'empty'
      }
      return availableItems.map(item => item.in).includes(itemId) ? 'available' : 'exist'
    })
    if (!statusList.some(status => status === 'available')) {
      return context.dispatch('showNotification', { message: 'NO SUITABLE ITEMS' })
    }
    context.dispatch('setBaggageStatus', {
      statusList,
      clickEvent: (index) => {
        const availableItems = itemJson.fixed.find(item => item.id === itemId)?.availableItems
        const inOutTable = availableItems.find(inOutTable => inOutTable.in === context.state.items[index])
        context.dispatch('useItem', inOutTable)
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
      element.onclick = clickEvent?.bind(this, i)
      element.dataset.status = statusList[i]
      element.dataset.name = context.state.items[i]
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
        context.state.stamina = INIT_STAMINA
        context.state.items = INIT_ITEMS
        document.querySelector('.role-status__stamina').innerHTML = `STAMINA: ${context.state.stamina}`
      }
    })
  },
  useItem (context, inOutTable) {
    const index = context.state.items.findIndex(itemId => itemId === inOutTable.in)
    const itemElement = document.querySelector('.baggage')?.children[index]
    if (inOutTable.out === 'safe') {
      itemElement.dataset.status = 'empty'
      context.state.items[index] = null
      itemElement.dataset.name = ''
      return
    }
    if (inOutTable.out === 'win') {
      const playScene = game.scene.keys['PlayScene']
      itemElement.dataset.status = 'empty'
      context.state.items[index] = null
      itemElement.dataset.name = ''
      playScene.bigMonster.walkToDrinkBeer()
      return
    }

    let outputItem = itemJson.fixed.find(item => item.id === inOutTable.out)
    if (outputItem) {
      // 新場景這類的事件 e.g 得到一張乾淨的桌子 
      itemElement.dataset.status = 'empty'
      context.state.items[index] = null
      itemElement.dataset.name = ''
      context.dispatch('showNotification', { message: `GET a ${outputItem.name}` })
      const playScene = game.scene.keys['PlayScene']
      if (outputItem.id === 'little-monster-umbrella') {
        playScene.littleMonster.setTexture(outputItem.id)
      } else if (outputItem.id === 'clean-table') {
        playScene.table.setTexture(outputItem.id)
      } else if (outputItem.id === 'groove-diamond') {
        playScene.groove.setTexture(outputItem.id)
      } else if (outputItem.id === 'reflection') {
        playScene.reflection.setVisible(true)
        playScene.point.setVisible(false)
      }
    } else {
      // 獲得新物品的事件
      outputItem = itemJson.portable.find(item => item.id === inOutTable.out)
      itemElement.dataset.status = 'exist'
      itemElement.dataset.name = outputItem.id
      context.state.items[index] = outputItem.id
      context.dispatch('showNotification', { message: `GET a ${outputItem.name}` })
    }
  }
}

const mutations = {}

const initialState = {
  name: 'SNOW',
  stamina: INIT_STAMINA,
  items: INIT_ITEMS,
}

export default new Store({
  actions,
  mutations,
  initialState
})
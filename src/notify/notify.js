export default function notify (...x) {
  const message = x.join(' ')
  const el = document.querySelector('#notifications')
  const notificationbox = new NotificationBox(el);
  notificationbox.send(message)
}

export class NotificationBox {
  constructor (parent) {
    this.__template__ = document.querySelector('#notification-template')
    this.__fragment__ = document.importNode(this.__template__.content, true)
    this.__parent__ = parent
    this.__parent__.appendChild(this.__fragment__)
    const els = parent.querySelectorAll('.notification')
    this.__element__ = els[els.length - 1]
    this.__element__text__ = this.__element__.querySelector('.notification__text')
    this.__element__.addEventListener('mouseover', () => {
      this.detailed = true
    }, false)
    this.__element__.addEventListener('mouseout', () => {
      this.detailed = false
    }, false)
    this.__element__close_button__ = this.__element__.querySelector('.notification__close-button')
    this.__element__close_button__.addEventListener('click', () => {
      this.close()
    }, false)
  }
  
  get visible () {
    return this.__element__.style.visibility === 'visible' && this.__element__.style.display !== 'none'
  }
  
  set visible (value) {
    this.__element__.style.visibility = value ? 'visible' : 'none'
  }
  
  show () {
    this.visible = true
  }
  
  close () {
    this.visible = false
    this.__element__.style.display = 'none'
  }
  
  get message () {
    return this.__element__text__.textContent || this.__element__text__.innerText
  }
  
  set message (value) {
    if (this.__element__text__.textContent) {
      this.__element__text__.textContent = value
    } else {
      this.__element__text__.innerText = value
    }
  }
  
  send (message) {
    this.message = message
    this.show()
  }
  
  get detailded () {
    const v = this.__element__.hasAttribute('data-detailed') ? this.__element__.getAttribute('data-detailed') : false
    return v === 'true' || v === 'detailed' || v === 'data-detailed'
  }
  
  set detailed (value) {
    if (value) {
      this.__element__.setAttribute('data-detailed', 'true')
      this.__parent__.setAttribute('data-detailed', 'true')
    } else {
      this.__element__.removeAttribute('data-detailed')
      this.__parent__.removeAttribute('data-detailed')
    }
  }
}

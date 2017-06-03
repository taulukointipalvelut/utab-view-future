
import notify from './notify/notify'

let notifyWithPromise = (x) =>
  new Promise((resolve) => {
    notify(x)
    resolve()
  })

window.addEventListener('load', async () => {
  await notifyWithPromise('This notification is for test es2017 features.')
  notify('Promise, async/await, generators, arrow functions, spread literals and other cool features are available!')
  notify('Moreover, these files are automatically watched and hot-replaced on livereload.')
  notify('Wow, Great! ;)')
})
function Game() {
  this.activeId = null
  this.row = 8
  this.cols = 4
  this.score = 0
  this.message = ''
  this.highScoreKey = 'high.score'
  this.gameSettingsKey = 'game.settings'
  this.storage = window.localStorage
  this.scoreArray = this.getScore()
  this.settingsArray = this.getSettings()
  this.nameBool = false
  this.sound = true
  this.isFullscreen = true
}

Game.prototype.start = function () {
  this.tableGrid()
  this.randomClick()
  this.checkDevice()
}

Game.prototype.checkDevice = function () {
  const metas = document.querySelectorAll('meta[name=viewport]')
  if (/Android/gi.test(navigator.userAgent)) {
    metas.forEach((meta) => {
      meta.content += `, height=${window.innerHeight}`
    })
  }
}

Game.prototype.tableGrid = function () {
  let grid = ''
  for (let i = 0; i < this.row; i++) {
    grid += `<tr>`
    for (let j = 0; j < this.cols; j++) {
      grid += `<td></td>`
    }
    grid += `</tr>`
  }
  const table = document.getElementById('board')
  table.innerHTML = grid
  table.style.display = 'table'
  const cols = table.querySelectorAll('td')
  cols.forEach((col, i) => (col.id = 'col' + i)) // Unique Id
}

Game.prototype.randomClick = function () {
  const cols = document.querySelectorAll('#board td')
  document.querySelectorAll('#board td').forEach((all) => (all.innerHTML = ''))
  const colsLen = cols.length - 1
  const random = Math.floor(Math.random() * colsLen)
  const randomId = document.getElementById(`col${random}`)
  randomId.innerHTML = `<span class='click'></span>`
  this.play()
}
Game.prototype.play = function () {
  const game = this
  const click = document.querySelector('.click')
  const clickGGP = click.parentElement.parentElement.parentElement
  const inter = setTimeout(() => {
    if (this.score == 0) {
      this.message = 'Hey You Are Afk'
    } else {
      this.message = 'Click faster'
    }
    this.fail(inter)
  }, 750)
  clickGGP.onclick = function (e) {
    if (e.target.className != 'click') {
      game.message = 'Make sure you hit the cyan box'
      game.fail(inter)
      return
    }
    game.score++
    game.randomClick()
    clearTimeout(inter)
    game.audio('./audio/CorrectAnswer.ogg')
  }
}
Game.prototype.fail = function (inter) {
  clearTimeout(inter)
  this.audio('./audio/wrongEffect.mp3')
  const failedSection = document.querySelector('.failedSection')
  failedSection.style.pointerEvents = 'none'
  failedSection.style.display = 'flex'
  failedSection.children[0].children[0].innerHTML = this.score
  const msg = failedSection.children[0].children[1]
  failedSection.nextElementSibling.style.display = 'none'
  if (this.score > 40) {
    msg.innerHTML = 'Excellent'
  } else {
    msg.innerHTML = this.message
  }
  setTimeout(() => {
    failedSection.style.pointerEvents = 'all'
    this.message = ''
  }, 500)
}
Game.prototype.audio = function (src) {
  if (this.sound === false) return
  const aud = new Audio(src)
  if (/wrong/gi.test(src)) {
    aud.currentTime = 1.3
  } else {
    aud.currentTime = 1.5
  }
  aud.play()
}
Game.prototype.fullscreen = function () {
  const elem = document.documentElement
  if (!this.isFullscreen) return document.exitFullscreen()
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen()
  }
}
Game.prototype.addEvents = function () {
  const game = this
  const playA = document.getElementById('788')
  const submit = document.getElementById('submit')
  const settings = document.getElementById('settings')
  const input = document.querySelector('[data-name]')
  const playAgain = document.getElementById('playAgain')
  const home = document.querySelectorAll('#home')
  const highscore = document.getElementById('highscore')
  const highscoreSection = document.querySelector('.highscoreSection')
  const failedSection = document.querySelector('.failedSection')
  const homePage = document.querySelector('.homePage')
  const soundBtn = document.getElementById('sound')
  const fullscreenBtn = document.getElementById('fullscreen')
  const settingsCont = soundBtn.parentElement

  fullscreenBtn.addEventListener('click', () => {
    this.fullscreen()
    if (this.isFullscreen) {
      this.isFullscreen = false
      fullscreenBtn.style.textDecoration = 'line-through'
    } else {
      this.isFullscreen = true
      fullscreenBtn.style.textDecoration = ''
    }
  })
  playA.addEventListener('click', function () {
    this.parentElement.style.display = 'none'
    game.start()
    game.score = 0
  })
  playAgain.addEventListener('click', function () {
    this.parentElement.parentElement.style.display = 'none'
    game.start()
    game.score = 0
  })
  home.forEach((homes) => {
    homes.addEventListener('click', function () {
      const table = document.getElementById('board')
      failedSection.style.transform = 'translateX(100%)'
      table.style.display = 'none'
      highscoreSection.style.transform = 'translateX(100%)'
      homePage.style.display = 'flex'
      settingsCont.style.transformOrigin = 'right'
      settingsCont.style.transform = 'translateX(100%)'
      setTimeout(() => {
        failedSection.style.display = 'none'
        highscoreSection.style.opacity = '0'
        highscoreSection.style.transform = 'translateX(-100%)'
        failedSection.style.transform = 'translateX(0)'
      }, 300)
    })
  })
  submit.addEventListener('click', function () {
    const score = document.querySelector('.Score')
    const msg = document.querySelector('.msg')
    if (!input.value.trim() || !isNaN(input.value)) return
    if (input.value.length > 8) {
      alert('Maximum of 8 characters')
      return
    }
    if (game.nameBool) {
      alert('Name already taken')
      return
    }
    if (game.score <= 5) {
      alert('Cannot submit the score below 5')
      return
    }
    game.submitScore()
    game.saveScore()
    game.renderScore()
    input.value = ''
    this.score = 0
    msg.innerHTML = null
    score.innerHTML = this.score
  })
  highscore.addEventListener('click', function () {
    highscoreSection.style.transform = 'translateX(0)'
    highscoreSection.style.opacity = '1'
  })
  input.addEventListener('keyup', function () {
    game.name = this.value.toUpperCase() || ''
    game.checkName(game.name)
  })
  settings.addEventListener('click', function () {
    settingsCont.style.transformOrigin = '0 '
    settingsCont.style.transform = 'translateX(0)'
  })
  soundBtn.addEventListener('click', function () {
    if (game.sound === true) {
      game.sound = false
      this.style.textDecoration = 'line-through'
    } else {
      this.style.textDecoration = 'none'
      game.sound = true
    }
    game.settingsSave()
    game.saveSettings()
  })
  const difficultyBtn = settingsCont.querySelectorAll('section button')
  difficultyBtn.forEach((btns) => {
    btns.addEventListener('click', function () {
      const currentActive = settingsCont.querySelector('section .active')
      currentActive.className = ''
      this.className = 'active'
      if (this.id == 'easy') {
        game.row = 8
        game.cols = 4
      } else if (this.id == 'medium') {
        game.row = 10
        game.cols = 5
      } else {
        game.row = 12
        game.cols = 6
      }
      game.settingsSave()
      game.saveSettings()
    })
  })
}
Game.prototype.renderSettings = function () {
  if (this.settingsArray[0] === undefined) return
  const soundBtn = document.getElementById('sound')
  this.settingsArray.forEach((setting) => {
    this.sound = setting.sounds
    if (!this.sound) {
      soundBtn.style.textDecoration = 'line-through'
    }
    const currentActive = document.querySelector('section .active')
    currentActive.className = ''
    const active = document.getElementById(setting.buttonId)
    active.className = 'active'
    active.click()
  })
}
Game.prototype.checkName = function (value) {
  if (this.scoreArray[0] === undefined) return
  let index = 0
  let playerArrayLen = this.scoreArray.length
  for (let i = 0; i < playerArrayLen; i++) {
    if (this.scoreArray[i].name === value) {
      index = i
      break
    }
  }
  if (this.scoreArray[index].name === this.name) {
    this.nameBool = true
  } else {
    this.nameBool = false
  }
}
Game.prototype.exitFullscreen = function () {
  document.exitFullscreen()
}
Game.prototype.saveScore = function () {
  this.storage.setItem(this.highScoreKey, JSON.stringify(this.scoreArray))
}
Game.prototype.getScore = function () {
  return JSON.parse(this.storage.getItem(this.highScoreKey)) || []
}
Game.prototype.saveSettings = function () {
  this.storage.setItem(this.gameSettingsKey, JSON.stringify(this.settingsArray))
}
Game.prototype.getSettings = function () {
  return JSON.parse(this.storage.getItem(this.gameSettingsKey)) || []
}
Game.prototype.settingsSave = function () {
  const settings = {
    sounds: this.sound,
    buttonId: document.querySelector('.settings .active').id,
  }
  this.settingsArray = []
  this.settingsArray.push(settings)
}
Game.prototype.submitScore = function () {
  const player = {
    name: this.name,
    score: this.score,
  }
  this.scoreArray.push(player)
  alert('Score Submitted View it in High Score Section')
}
Game.prototype.renderScore = function () {
  if (this.scoreArray[0] === undefined) return
  const ul = document.getElementById('scores')
  ul.innerHTML = ''
  this.scoreArray.sort((a, b) => b.score - a.score)
  const htmlList = this.scoreArray.map((all) => {
    return `<li>${all.name}<span>${all.score}</span></li>`
  })
  htmlList.splice(3)
  htmlList.forEach((all) => {
    ul.innerHTML += all
  })
}
const game = new Game()
window.onload = function () {
  game.addEvents()
  game.renderScore()
  game.renderSettings()
}

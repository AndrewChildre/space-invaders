const moveSpeed = 200
const invaderSpeed = 100
let currentSpeed = invaderSpeed
const levelDown = 50
const timeLeft = 10

layer(['obj', 'ui'], 'obj'),


addLevel([
  '!^^^^^^^^^^   &',
  '!^^^^^^^^^^   &',
  '!^^^^^^^^^^   &',
  '!             &',
  '!             &',
  '!             &',
  '!             &',
  '!             &',
  '!             &',
  '!             &',
  '!             &',


], {
  width: 30,
  height: 22,
  '^' : [sprite('space-invader'), 'space-invader'],
  '!' : [sprite('wall'), 'left-wall'],
  '&' : [sprite('wall'), 'right-wall'],

})

const player = add([
  sprite('space-ship'),
pos(width() / 2, height() / 2),
origin('center'),
scale(2.0)
])



keyDown('left', () => {
  player.move(-moveSpeed, 0)
})
keyDown('right', () => {
  player.move(moveSpeed, 0)
})

function spawnBullet (p) {
  add([rect(6,18), 
  pos(p), 
  origin('center'), 
  color(0.5, 0.5, 1), 
  'bullet'])
}

keyPress('space', () => {
  spawnBullet(player.pos.add(0,-20))
})
const bulletSpeed = 400
action('bullet', (b) => {
  b.move(0, -bulletSpeed)
  if(b.pos.y < 0) {
    destroy(b)
  }
})

collides('bullet', 'space-invader', (b,s) => {
  camShake(3)
  destroy(b),
  destroy(s),
  score.value++,
  score.text = score.value
})

const score = add([
  text('0'),
  pos(50, 50),
  layer('ui'),
  scale(3),
  {
    value: 0,
  }
])



const timer = add([
  text('0'),
  pos(90,50),
  scale(2),
  layer('ui'),
  {
    time: timeLeft,
  },
])

timer.action(() => {
  timer.time -= dt()
  timer.text = timer.time.toFixed(2)
  if(timer.time <= 0) {
    go('lose', {score: score.value})
  }
})

action('space-invader', (s) => {
  s.move(currentSpeed, 0)
})

collides('space-invader', 'right-wall', () => {
  currentSpeed = -invaderSpeed
  every('space-invader', (s) => {
    s.move(0, levelDown)
  })
})

collides('space-invader', 'left-wall', () => {
  currentSpeed = invaderSpeed
  every('space-invader', (s) => {
    s.move(0, levelDown)
  })
})

player.overlaps('space-invader', () => {
  go('lose', {score: score.value})
})

action('space-invader', (s) => {
  if (s.pos.y >= height() /2){
    go('lose', {score: score.value})
  }
})


const blue = ['#4ffcd4', '#80caff', '#455eff', '#1175f7']
const red = ['#ee3131', '#e32e4b', '#f60987', '#e70453']

const randomIntBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

type ParticleProps = {
  x: number
  y: number
  rotation: number
  shape: string
  color: string
  size: number
  duration: number
  parent: HTMLElement
}

class Particle {
  x: number
  y: number
  parent: HTMLElement
  rotation: number
  shape: string
  color: string
  size: number
  duration: number
  children: HTMLElement

  constructor({
    x,
    y,
    rotation,
    shape,
    color,
    size,
    duration,
    parent,
  }: ParticleProps) {
    this.x = x
    this.y = y
    this.parent = parent
    this.rotation = rotation
    this.shape = shape
    this.color = color
    this.size = size
    this.duration = duration
    this.children = document.createElement('div')
  }

  draw() {
    this.children.style.setProperty('--x', this.x + 'px')
    this.children.style.setProperty('--y', this.y + 'px')
    this.children.style.setProperty('--r', this.rotation + 'deg')
    this.children.style.setProperty('--c', this.color)
    this.children.style.setProperty('--size', this.size + 'px')
    this.children.style.setProperty('--d', this.duration + 'ms')
    this.children.className = `shape ${this.shape}`
    this.parent.append(this.children)
  }

  animate() {
    this.draw()

    const timer = setTimeout(() => {
      this.parent.removeChild(this.children)
      clearTimeout(timer)
    }, this.duration)
  }
}

type AnimateParticlesProps = {
  total: number
  parent: HTMLElement
  isEspecial: boolean
}

export function animateParticles({
  total,
  parent,
  isEspecial,
}: AnimateParticlesProps) {
  const endColor = !isEspecial
    ? blue[randomIntBetween(0, blue.length - 1)]
    : red[randomIntBetween(0, red.length - 1)]

  for (let i = 0; i < total; i++) {
    const particle = new Particle({
      x: randomIntBetween(-200, 200),
      y: randomIntBetween(-100, -300),
      rotation: randomIntBetween(-360 * 5, 360 * 5),
      shape: isEspecial ? 'heart' : 'circle',
      color: endColor,
      size: randomIntBetween(4, 7),
      duration: randomIntBetween(400, 800),
      parent,
    })

    particle.animate()
  }
}

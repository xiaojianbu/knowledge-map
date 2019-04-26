import Car from './Car'

export default class Adventure4x4Car extends Car {
  constructor(color) {
    super('4x4 Adventure car', 'For people that does not care about existing paths', 55000, 2, color)
  }
}

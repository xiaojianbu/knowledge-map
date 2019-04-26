import Car from './Car'

export default class UrbanCar extends Car {
  constructor(color) {
    super('Urban car', 'Small and designed for the city', 12000, 2, color)
  }
}

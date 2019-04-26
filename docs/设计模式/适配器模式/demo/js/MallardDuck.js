import Duck from './Duck'

export default class MallardDuck extends Duck {
  fly() {
    console.log('Can fly long distances!')
  }

  quack() {
    console.log('Quack! Quack!')
  }
}

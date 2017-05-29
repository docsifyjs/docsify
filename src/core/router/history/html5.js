import { History } from './base'

export class HTML5History extends History {
  constructor (config) {
    super(config)
    this.mode = 'history'
  }
}

import { History } from './base'

export class AbstractHistory extends History {
  constructor (config) {
    super(config)
    this.mode = 'abstract'
  }
}

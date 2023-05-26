export interface IStep<T> {
  source: T;
  dest: T;
}
export interface IResult<T> {
  totalSteps: number;
  steps: IStep<T>[];
}

export default class TowerOfHanoi<T> {
  protected numOfDisks: number;
  protected towerA: T;
  protected towerB: T;
  protected towerC: T;
  protected totalSteps: number;
  protected steps: IStep<T>[];

  constructor (numOfDisks: number, towerA: T, towerB: T, towerC: T) {
    this.numOfDisks = numOfDisks
    this.towerA = towerA
    this.towerB = towerB
    this.towerC = towerC
    this.totalSteps = 0
    this.steps = []
  }

  start (): IResult<T> {
    this.reset()
    this.next(this.numOfDisks, this.towerA, this.towerB, this.towerC)

    return {
      totalSteps: this.totalSteps,
      steps: this.steps
    }
  }

  reset (): void {
    this.totalSteps = 0
    this.steps = []
  }

  next (numOfDisks: number, source: T, helper: T, dest: T): void {
    if (numOfDisks === 1) {
      this.move(source, dest)
      return
    }
    this.next(numOfDisks - 1, source, dest, helper)
    this.move(source, dest)
    this.next(numOfDisks - 1, helper, source, dest)
  }

  move (source: T, dest: T): void {
    this.totalSteps += 1
    this.steps.push({ source, dest })
  }
}

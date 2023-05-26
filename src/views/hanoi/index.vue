<template>
  <div class="container">
    <div class="setting-panel">
      <el-row>
        <el-col :span="8">
          <label>层数：</label><el-input-number v-model="numOfDisks" :min="1" :max="10" size="mini" label="最大层数"></el-input-number>
        </el-col>
        <el-col :span="6">
          <el-button v-if="!playState" type="primary" size="mini" @click="prepare">准备</el-button>
          <el-button v-if="isPrepare" type="primary" size="mini" @click="start">开始</el-button>
          <el-button v-if="isPlaying" type="primary" size="mini" @click="stop">暂停</el-button>
          <el-button v-if="isStopped" type="primary" size="mini" @click="resume">继续</el-button>
          <el-button v-if="isStopped" type="primary" size="mini" @click="nextStep" :disabled="isLocked">下一步</el-button>
          <el-button v-if="isEnd || isEnd" type="primary" size="mini" @click="onResetClicked">重置</el-button>
        </el-col>
        <el-col :span="10">
          <div v-if="playState">共需{{ result.totalSteps }}步<template>，当前第 {{ currentStep + 1 }} 步</template></div>
        </el-col>
      </el-row>
    </div>
    <div class="scene">
      <div class="tower-panel">
        <div class="tower" v-for="(tower, index) in towers" :key="index">
          <div class="base"></div>
          <div class="stick"></div>
          <div class="disk-panel">
            <div class="disk" v-for="(disk, index) in tower" :key="index"
            :class="{
              anim: disk.isActive
            }"
            :style="{
              background: disk.color,
              width: disk.width + 'px',
              transform: `translate(${disk.offsetLeft * 233}px, ${disk.offsetTop * 20}px)`,
              bottom: (index * 20) + 'px',
            }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { random, wait } from '@/utils'
import TowerOfHanoi, { IResult, IStep } from './TowerOfHanoi'

interface IDisk {
  color: string;
  width: number;
  isActive: boolean;
  offsetTop: number;
  offsetLeft: number;
}

enum PlayState {
  DEFAULT = 0,
  PREPARE = 1,
  PLAYING = 2,
  STOPPED = 3,
  END = 4,
}

@Component
export default class Hanoi extends Vue {
  numOfDisks = 3;
  towers: IDisk[][] = [[], [], []];
  towerOfHanoi!: TowerOfHanoi<number>;
  result: IResult<number> = { steps: [], totalSteps: 0 };
  playState: PlayState = PlayState.DEFAULT;
  currentStep = 0;
  isLocked = false;

  get isPrepare (): boolean {
    return this.playState === PlayState.PREPARE
  }

  get isPlaying (): boolean {
    return this.playState === PlayState.PLAYING
  }

  get isStopped (): boolean {
    return this.playState === PlayState.STOPPED
  }

  get isEnd (): boolean {
    return this.playState === PlayState.END
  }

  prepare (): void {
    this.playState = PlayState.PREPARE
    this.reset()
    this.generateDisks()
    this.towerOfHanoi = new TowerOfHanoi<number>(this.numOfDisks, 1, 2, 3)
    this.result = this.towerOfHanoi.start()
  }

  reset (): void {
    this.towers = [[], [], []]
    this.currentStep = 0
    this.playState = PlayState.PREPARE
  }

  onResetClicked (): void {
    this.prepare()
  }

  generateDisks (): void {
    for (let i = 0; i < this.numOfDisks; i++) {
      this.towers[0].push({
        color: `rgb(${random(255)}, ${random(255)}, ${random(255)})`,
        width: 30 + 15 * (this.numOfDisks - i),
        isActive: false,
        offsetTop: 0,
        offsetLeft: 0
      })
    }
  }

  async start (): Promise<void> {
    this.playState = PlayState.PLAYING
    await wait(500)
    this.renderResult()
  }

  stop (): void {
    this.playState = PlayState.STOPPED
  }

  resume (): void {
    if (this.isLocked) {
      return
    }
    this.playState = PlayState.PLAYING
    this.currentStep += 1
    this.renderResult()
  }

  async nextStep (): Promise<void> {
    if (this.isLocked) {
      return
    }
    this.isLocked = true
    const { totalSteps, steps } = this.result

    this.currentStep += 1
    await this.renderOneStep(steps[this.currentStep])
    this.isLocked = false
    if (this.currentStep === totalSteps - 1) {
      this.playState = PlayState.END
    }
  }

  async renderResult (): Promise<void> {
    const { totalSteps, steps } = this.result
    for (; this.currentStep < steps.length; this.currentStep++) {
      await this.renderOneStep(steps[this.currentStep])
      if (this.isStopped) {
        return
      }
    }
    this.currentStep = totalSteps - 1
    this.playState = PlayState.END
  }

  async renderOneStep (step: IStep<number>): Promise<void> {
    const { source, dest } = step
    const sourceTower = this.towers[source - 1]
    const destTower = this.towers[dest - 1]
    const disk = sourceTower[sourceTower.length - 1]
    if (!disk) {
      return
    }
    disk.isActive = true
    disk.offsetLeft = dest - source
    disk.offsetTop = sourceTower.length - destTower.length - 1
    await wait(500)
    sourceTower.pop()
    disk.isActive = false
    disk.offsetLeft = 0
    disk.offsetTop = 0
    destTower.push(disk)
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 700px;
  height: 400px;
  border: 1px solid #ccc;
  position: absolute;
  left: 50%;
  transform: translateX(-350px);
  display: flex;
  flex-direction: column;
}
.setting-panel {
  flex-basis: 100px;
  padding: 3px;
}
.scene {
  height: 100%;
}
.tower-panel {
  height: 100%;
  display: flex;
  flex-direction: row;
  .tower {
    flex-grow: 1;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 0 10px;
    .base {
      width: 200px;
      height: 20px;
      position: absolute;
      bottom: 0;
      background: #dcae59;
      border-radius: 10px;
    }
    .stick {
      height: 100%;
      width: 10px;
      background: rgb(237, 136, 82);
      border-radius: 10px;
    }
    .disk-panel {
      position: absolute;
      bottom: 20px;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
    }
  }

  .disk {
    height: 20px;
    border-radius: 10px;
    position: absolute;
    bottom: 0;
    z-index: 1;
    &.anim {
      transition-property: transform;
      transition-duration: 300ms;
      transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
    }
  }
}
</style>

<template>
  <div class="container">
    <el-tabs v-model="currentTab" @tab-click="handleTabClicked">
      <el-tab-pane label="防抖" name="debounce">
        <div class="content">
          <el-form :inline="true">
            <el-form-item label="输入内容">
              <el-input
                placeholder="请输入内容"
                size="mini"
                type="text"
                v-model="inputValue"
                @input="handleInput" />
            </el-form-item>
            <el-form-item label="防抖保护时间">
              <el-input-number
              v-model="debounceWaitTime"
              label="请选择防抖保护时间"
              size="mini"
              :min="0"
              :step="100"
              @change="changeDebounceWaitTime" />
            </el-form-item>
          </el-form>
          <Logger :logs="debouncelogs" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="节流" name="throttle">
        <div>
          <el-form :inline="true">
            <el-form-item label="节流保护时间">
              <el-input-number
              v-model="throttleWaitTime"
              label="节流保护时间"
              :min="0"
              size="mini"
              :step="100"
              @change="changeThrottleWaitTime" />
            </el-form-item>
          </el-form>
        </div>
        <div class="layout">
          <div class="left" v-loading="isLoading">
            <div ref="scroller" class="scroller" @scroll="handleOnScroll">
              <ul ref="scrollContent">
                <li v-for="(item, index) in items" :key="index">{{ item }}</li>
              </ul>
            </div>
          </div>
          <div class="right"><Logger :logs="throttleLogs" /></div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Logger from '@/components/logger.vue'
import debounce from '@/utils/debounce'
import throttle from '@/utils/throttle'
import { ElTabPane } from 'element-ui/types/tab-pane'

@Component({
  components: {
    Logger
  }
})
export default class DebounceAndThrottle extends Vue {
  currentTab = 'debounce'
  inputValue = ''
  debouncelogs: string[] = []
  lastInputTime = 0
  debounceWaitTime = 0
  items: string[] = []
  throttleLogs: string[] = []
  lastScrollTime = 0
  throttleWaitTime = 0
  scrollerHeight = 0
  scrollContentHeight = 0
  isLoading = false

  get timeAfterLastInput (): number {
    if (!this.lastInputTime) {
      return 0
    }
    return Date.now() - this.lastInputTime
  }

  get timerAfterLastScroll (): number {
    if (!this.lastScrollTime) {
      return 0
    }

    return Date.now() - this.lastScrollTime
  }

  handleInput (): void {
    this.onInput()
  }

  onInput (): void {
    this.debouncelogs.unshift(`输入值:${this.inputValue}, 距离上次触发间隔${this.timeAfterLastInput}`)
    this.lastInputTime = Date.now()
  }

  changeDebounceWaitTime (): void {
    this.handleInput = this.debounceWaitTime ? debounce(() => {
      this.onInput()
    }, this.debounceWaitTime) : this.onInput
  }

  handleTabClicked (tab: ElTabPane): void {
    if (tab.name === 'throttle') {
      this.initScroller()
    }
  }

  async initScroller (): Promise<void> {
    this.items = []
    this.generateItems(100)
    this.calcScollerHeight()
  }

  calcScollerHeight (): void {
    this.$nextTick(() => {
      this.scrollerHeight = this.$refs.scroller?.clientHeight
      this.scrollContentHeight = this.$refs.scrollContent?.clientHeight
    })
  }

  /**
   * 生成内容
   * @param {number} amount 内容条数
   * @param {string} content 生成的内容
   */
  generateItems (amount: number, content = '一行毫无意义的内容'): void {
    for (let i = 0; i < amount; i++) {
      this.items.push(content)
    }
  }

  handleOnScroll (): void {
    this.onScroll()
  }

  onScroll (): void {
    if (this.isLoading) {
      return
    }
    this.throttleLogs.unshift(`距离上次滚动触发间隔${this.timerAfterLastScroll}`)
    this.lastScrollTime = Date.now()
    if (this.willLoadMore()) {
      this.throttleLogs.unshift('触发加载更多')
      this.loadMore()
    }
  }

  changeThrottleWaitTime (): void {
    this.handleOnScroll = this.throttleWaitTime ? throttle(() => {
      this.onScroll()
    }, this.throttleWaitTime) : this.onScroll
  }

  /**
   * 判断是否触发加载更多的条件
   * @returns {boolean}
   */
  willLoadMore (): boolean {
    const scrollTop = this.$refs.scroller?.scrollTop
    const remainHeightToBottom = this.scrollContentHeight - scrollTop - this.scrollerHeight
    return remainHeightToBottom < 50
  }

  loadMore (): void {
    this.isLoading = true
    setTimeout(() => {
      this.generateItems(10, '滚动加载的内容')
      this.calcScollerHeight()
      this.isLoading = false
    }, 1000)
  }
}
</script>
<style lang="scss" scoped>
.container {
  width: 700px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid #999;
}
.layout {
  display: flex;
  flex-direction: row;
  height: 300px;
  .left {
    flex-basis: 200px;
    height: 100%;
    background-color: rgb(211, 207, 207);
  }
  .right {
    height: 100%;
    width: 100%;
  }
}
.scroller {
  overflow-y: scroll;
  height: 100%;
  ul {
    padding: 0;
    list-style: none;
    font-size: 14px;
  }
}
</style>

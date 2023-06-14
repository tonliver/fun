<template>
<div class="logger" :style="{ height: height + 'px'}">
  <div v-for="(log, index) in logs" :key="index">{{ log }}</div>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class Logger extends Vue {
  @Prop({ type: Array, default: [] }) logs!: any[]
  @Prop({ type: Number, default: 300 }) height!: number
}
</script>
<style lang="scss" scoped>
.logger {
  width: 100%;
  background-color: #000;
  color: #56b97f;
  font-size: 12px;
  overflow-y: scroll;
  padding: 5px;
}
</style>

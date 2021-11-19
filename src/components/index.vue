<template>
  <div>
    <div class="wrap" :class="{ reconnect: isReconnect }">
      <!-- <i v-if="isReconnect" class="f-reconnect icon" />
      <template v-else> -->
      <div class="title">{{ serverName }}</div>
      <div class="base">
        <div>{{ base.type }} {{ base.arch }}</div>
        <div>{{ base.model }}</div>
        <div>运行 {{ info.uptime }} 天</div>
        <div>
          负载 {{ info.loadavg[0] }} {{ info.loadavg[1] }}
          {{ info.loadavg[1] }}
        </div>
      </div>
      <div class="info">
        <div>
          <i class="f-cpu icon" :class="`status-icon-${cpuStatus}`" />
          <div class="info-content">
            <div
              class="info-content-process"
              :class="`info-content-process_${cpuStatus}`"
              :style="{ width: (info.cpuUse || 0) * 2.5 + 'px' }"
            >
              <div class="info-content-process-text">
                <div>{{ info.cpuUse }}%</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <i class="f-eam icon" :class="`status-icon-${memStatus}`" />
          <div class="info-content">
            <div
              class="info-content-process"
              :class="`info-content-process_${memStatus}`"
              :style="{
                width: (info?.mem?.usedMemPercentage || 0) * 2.5 + 'px'
              }"
            >
              <div class="info-content-process-text">
                <div>{{ info?.mem?.usedMemPercentage }}%</div>
                <div>{{ usedMemMb }}G / {{ totalMemMb }}G</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <i class="f-disk icon" :class="`status-icon-${diskStatus}`" />
          <div class="info-content">
            <div
              class="info-content-process"
              :class="`info-content-process_${diskStatus}`"
              :style="{ width: (distRoot?.pcent || 0) * 2.5 + 'px' }"
            >
              <div class="info-content-process-text">
                <div>{{ distRoot?.pcent }}%</div>
                <div>{{ distUsed }}G / {{ distTotal }}G</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="openedCount">
          <i class="f-network icon" />
          {{ info.openedCount }}
        </div>
        <div class="netstat">
          <div>
            <i class="f-down icon" />
            <span>{{ info.netstat?.total?.inputMb || 0 }}MB/s</span>
          </div>
          <div>
            <i class="f-up icon" />
            <span>{{ info.netstat?.total?.outputMb || 0 }}MB/s</span>
          </div>
        </div>
      </div>
      <!-- </template> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, toRefs, computed, defineProps } from 'vue';
import io from 'socket.io-client';

const { api } = defineProps<{ serverName: string; api: string }>();

const data: { info: Info; base: Base; isReconnect: boolean } = reactive({
  info: { loadavg: [] },
  base: {},
  isReconnect: false
});

const { info, base, isReconnect } = toRefs(data);

setTimeout(() => {
  isReconnect.value = true;
}, 2000);

onMounted(() => {
  const socket = io(api, {
    transports: ['websocket', 'polling'],
    reconnectionDelayMax: 10000
  });

  socket.on('disconnect', () => {
    isReconnect.value = true;
    info.value = { loadavg: [] };
    base.value = {};
    console.log('服务已断开，等待重新连接');
  });

  socket.on('reconnect', () => {
    isReconnect.value = false;
    console.log('重新连接成功');
  });

  socket.on('reconnecting', (nextRetry) => {
    console.log('尝试重新连接');
  });

  socket.on('reconnect_failed', function () {
    isReconnect.value = true;
    console.log('连接失败');
  });
  socket.on('connected', (e: Base) => {
    base.value = e;
  });

  socket.on('systemInfo', (e: Info) => {
    isReconnect.value = false;
    info.value = e;
  });
});

function status(num: number = 0) {
  if (num <= 33) {
    return 'default';
  } else if (num <= 66) {
    return 'medium';
  }
  return 'height';
}

const cpuStatus = computed(() => status(info.value?.cpuUse));
const memStatus = computed(() => status(info.value?.mem?.usedMemPercentage));
const diskStatus = computed(() => status(distRoot.value?.pcent));
const usedMemMb = computed(() =>
  ((info.value?.mem?.usedMemMb || 1) / 1024).toFixed(2)
);
const totalMemMb = computed(() =>
  ((info.value?.mem?.totalMemMb || 1) / 1024).toFixed(2)
);
const distRoot = computed(() =>
  info.value.diskinfo?.find((i) => i.target === '/')
);
const distUsed = computed(() =>
  ((distRoot.value?.used || 1) / 1024 / 1024 / 1024).toFixed(2)
);
const distTotal = computed(() =>
  ((distRoot.value?.size || 1) / 1024 / 1024 / 1024).toFixed(2)
);
</script>

<style lang="stylus">
.reconnect
  animation:reconnect 1s infinite;
  animation-direction:alternate;
@keyframes reconnect
  from
    box-shadow: 0px 0px 14px -7px #dfdfdf;
  to
    box-shadow: 0px 0px 14px -7px #c54c43;
.wrap
  transition: .2s all
  border 1px solid #e5e5e5
  width 320px
  min-height: 322px
  box-sizing border-box
  display flex
  flex-direction column
  border-radius 6px
  padding 24px 20px 10px
  box-shadow 0px 0px 14px -7px #dfdfdf
  .f-reconnect
    position: absolute
    top 50%
    left 50%
    transform: translate(-50%,-50%)
    font-size: 42px;
  .status-icon-default
    color #009688
  .status-icon-medium
    color #c57d14
  .status-icon-height
    color #ff5722
  .info-content-process_default
    &:before
      background-color #8bc34a
  .info-content-process_medium
    &:before
      background-color #ff9800
  .info-content-process_height
    &:before
      background-color #ff0000
  .title
    line-height 24px
    justify-content space-between
    display: flex
  .base
    min-height 114px
    padding 20px 0 10px
    font-size: 12px
    flex-direction column
    align-items flex-start
    box-sizing: border-box;
    &>div
      padding: 2px 0
  .info
    line-height 36px
    .icon
      font-size 20px
    &>div
      display flex
      align-items center
      position relative
      justify-content space-between
    .info-content
      width 250px
      .info-content-process
        transition .2s width cubic-bezier(0.4, 0, 1, 1)
        .info-content-process-text
          display flex
          justify-content space-between
          height 26px;
          line-height initial
          align-items flex-end
          &>div
            transform scale(0.8)
          div:last-child
            text-align right
            width 70%
            margin-right -16px
          div:first-child
            width 30%
            margin-left -7px
            text-align left
        &>div
          font-size 12px
          color #464646
          width 250px
          box-sizing border-box
        &>*
          transition .2s width cubic-bezier(0.4, 0, 1, 1);
        &:before,&:after
          content ''
          display block
          height 2px
          position absolute
          top 50%
          margin-top -6px
          width 250px
        &:before
          width inherit
          z-index -1
        &:after
          background #f6f6f6
          z-index -2
  .footer
    display flex
    justify-content space-between
    align-items center
    line-height 30px
    padding-top 10px
    line-height 30px
    .f-network
      color #9c27b0
    .netstat,.openedCount
      font-size 12px
      display flex
      .icon
        font-size 12px
        margin-right 4px
      div
        display flex
        padding-left 10px
      .f-down
        color #4caf50
      .f-up
        color #2196f3
</style>

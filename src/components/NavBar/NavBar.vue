<template>
  <view class="content">
    <view class="content_navigation" :style="{
      'height': naviBar.naviBarHeight + 'px',
      'padding-top': naviBar.statusBarHeight + 'px'
    }">
      <button open-type="feedback" class="navigation_back">反馈</button>
      <view class="navigation_title" :style="{ 'height': naviBar.mBHeight + 'px' }">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, onBeforeMount } from 'vue';

const emit = defineEmits(['getNaviBarHeight'])
onBeforeMount(() => {
  getBarHetght()
})

const naviBar = reactive({
  titleHeight: 0, //导航栏高度
  statusBarHeight: 0, //状态栏高度
  naviBarHeight: 0, //状态栏和导航栏总高度
  mBWidth: 0, //胶囊宽度
  mBHeight: 0, //胶囊高度
})

//获取自定义导航栏高度等信息
const getBarHetght = () => {
  const res = uni.getSystemInfoSync();
  naviBar.statusBarHeight = res.statusBarHeight; 
  const mBInfo = uni.getMenuButtonBoundingClientRect();
  naviBar.titleHeight = (mBInfo.top - naviBar.statusBarHeight) * 2 + mBInfo.height;
  naviBar.naviBarHeight = naviBar.titleHeight + naviBar.statusBarHeight;
  naviBar.mBHeight = mBInfo.height;
  naviBar.mBWidth = mBInfo.width + 16;
  emit('getNaviBarHeight', naviBar.naviBarHeight)
}
</script>

<style lang="less" scoped>
  .content {
    z-index: 99;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    .content_navigation {
      display: flex;
      align-items: center;
      padding: 0 10px;
      position: relative;
      background: var(--navBgColor);
      // backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      .navigation_back {
        margin-left: unset;
        margin-right: unset;
        padding-left: unset;
        padding-right: unset;
        outline: none;
        background-color: transparent;
        line-height: inherit;
        &::after {
          border: none;
        }
        position: absolute;
        left: 6px;
        width: 70px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--navButtonBgColor);
        font-size: 16px;
        font-weight: 400;
        border-radius: 20px;
        color: var(--navButtonTextColor);
      }
      .navigation_title {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 17px
      }
    }
  }
</style>
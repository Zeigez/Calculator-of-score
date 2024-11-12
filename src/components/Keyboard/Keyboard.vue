<template>
  <view class="content" :class="{'show': modelValue}">
    <view class="content_close" @click="emit('update:modelValue', !modelValue)">
      <image class="img" src="@/static/image/down.svg"/>
    </view>
    <view class="content_keyboard">
      <view class="keyboard_item" hover-class="hover" hover-stay-time="150"
        v-for="item in keyList" :key="item" @click="emit('input', item)" 
        :class="{'key0': item == '0'}">
        {{ item }}
      </view>
      <view class="keyboard_item clean" hover-class="hover" hover-stay-time="150" @click="emit('inputFun', 'clean')">
        <image class="img line" src="@/static/image/clean.svg"/>
        <image class="img dark" src="@/static/image/clean_dark.svg"/>
      </view>
      <view class="keyboard_item reset" hover-class="hover" hover-stay-time="150" @click="emit('inputFun', 'reset')">归零</view>
      <view class="keyboard_item confirm" hover-class="hover" hover-stay-time="150" @click="emit('inputFun', 'confirm')">计算</view>
    </view>
  </view>
</template>

<script setup>
const emit = defineEmits(['update:modelValue', 'input', 'inputFun'])
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const keyList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']

</script>

<style lang="less" scoped>
  .content {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: var( --keyBoardBgColor );
    box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.05);
    max-height: 0;
    opacity: 0;
    transition: all 0.3s;
    .content_close {
      padding-top: 4px;
      display: flex;
      justify-content: center;
      .img {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
      }
    }
    .content_keyboard {
      padding: 10px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-areas: '. . . a'
                            '. . . b'
                            '. . . c'
                            'd d . c';
      gap: 9px;
      .keyboard_item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
        border-radius: 6px;
        background: var( --keyBoardButtonColor );
        box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.02);
        font-family: 'SHSC';
        font-size: 18px;
        font-weight: 900;
        &.clean {
          grid-area: a;
          & > .img {
            width: 20px;
            height: 20px;
            &.line {
              display: block;
            }
            &.dark {
              display: none;
            }
            @media (prefers-color-scheme: dark) {
              &.line {
                display: none;
              }
              &.dark {
                display: block;
              }
            }
          }
        }
        &.reset {
          grid-area: b;
          font-size: 16px;
          font-weight: 700;
        }
        &.confirm {
          grid-area: c;
          height: unset;
          font-size: 16px;
          font-weight: 700;
          background: var( --cardBgColor );
          color: #FFF;
        }
        &.key0 {
          grid-area: d;
        }
        &.confirm.hover {
          background: var( --keyBoardConfirmDownColor );
          box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.05) inset;
        }
      }
      .hover {
        background: var( --keyBoardButtonDownColor );
        box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.05) inset;
      }
    }
  }
  .show {
    max-height: 310px;
    opacity: 1;
  }
</style>
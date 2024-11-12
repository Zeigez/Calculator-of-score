<template>
  <view class="content">
    <view class="content_mask" @click="emit('update:modelValue', false)"></view>
    <view class="content_arrow"></view>
    <view class="content_box">
      <slot></slot>
    </view>
  </view>
</template>

<script setup>
const emit = defineEmits(['update:modelValue'])
</script>

<style lang="less" scoped>
.content {
  z-index: 1;
  position: absolute;
  top: 34px;
  right: -8px;
  min-width: 130px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.20);
  border-radius: 8px;
  .content_mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // background: #000;
    // opacity: 0.5
  }
  .content_arrow,
	.content_arrow::after {
		position: absolute;
		display: block;
		width: 0;
		height: 0;
		border-color: transparent;
		border-style: solid;
		border-width: 8px;
	}
	
	.content_arrow {
		filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
		top: -6px;
		right: 8px;
		margin-right: 3px;
		border-top-width: 0;
		border-bottom-color: var(--detailBgColor);
	}
	
	.content_arrow::after {
		content: " ";
		top: 1px;
		margin-left: -8px;
		border-top-width: 0;
		border-bottom-color: var(--detailBgColor);
	}

  .content_box {
    position: relative;
    z-index: 2;
    padding: 12px;
    background: var(--detailBgColor);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
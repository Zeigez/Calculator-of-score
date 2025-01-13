<template>
  <view class="content" :style="{'padding-top': naviBarHeight +'px'}">
    <NavBar @getNaviBarHeight="getNaviBarHeight">加权计算器</NavBar>
    <view class="conten_main" @click="onBlur">
      <image src="@/static/image/bg_line.svg" class="main_bg line" mode="widthFix"/>
      <image src="@/static/image/bg_dark.svg" class="main_bg dark" mode="widthFix"/>
      <view class="main_display">
        <view class="display_tip">G21</view>
        <view class="display_result">{{ result.G21 }}</view>
        <view class="display_detail" v-if="result.G21" @click="showPopupCaed = !showPopupCaed">
          <image src="@/static/image/info.svg"/>
          <PopupCard v-if="showPopupCaed" class="detail_popup">
            <view class="popup_item">{{ result.deductTips }}</view>
            <view class="popup_item">扣分：{{ result.deduct }}</view>
            <view class="popup_item">加权平均分：{{ result.weightedAverage }}</view>
            <view class="popup_item">加权：{{ result.and }}</view>
            <view class="popup_item">课程学分：{{ result.creditAnd }}</view>
            <view class="popup_item">实修学分：{{ result.actualCredits }}</view>
          </PopupCard>
        </view>
      </view>
      <view class="main_title"><view>科目</view><view>成绩</view><view>学分</view></view>
      <scroll-view scroll-y class="scroll" :class="{'showMask': topMask}" @scrolltolower="loadMore" :scroll-top="scrollTop" @scroll="onScroll" @click.stop="" scroll-with-animation>
        <view class="main_form">
          <view class="form_item" v-for="(item, index) in form" :key="index">
            <view class="item_index">{{ index + 1 }}</view>
            <view class="item_input" :class="{'focus': currentId == index+'-score'}" @click="onFocus(index+'-score')" data-attr="成绩">{{ item.score }}</view>
            <view class="item_input" :class="{'focus': currentId == index+'-credit'}" @click="onFocus(index+'-credit')"  data-attr="学分">{{ item.credit }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="content_history">
      <view class="history_item" v-for="(item,index) in historyList" :key="index" @click="onChooseHistory(item)">
        <view class="item_title">{{ item.result.G21 }}</view>
        <view class="item_right">
          <view>{{ getDataText(item.result.date) }}</view>
          <view>G21</view>
        </view>
      </view>
    </view>
    <Keyboard v-model="showKeyboard" @input="onInput" @inputFun="onInputFun"/>
    <view v-if="historyList.length == 0" class="content_info">
      <view>课程加权平均分=( ∑(课程成绩*该课程学分) )/( ∑课程学分 )</view>
      <view>扣分=课程加权平均分*(1-实修学分/最低要求学分数)</view>
    </view>
    <view v-if="historyList.length > 5" class="content_bottom line" @click="onClearHistory">合理使用工具以免不必要的浪费</view>
    <view v-if="historyList.length > 5" class="content_bottom dark" @click="">理想常在 不忘星辰</view>
  </view>
</template>

<script setup>
import NavBar from '@/components/NavBar/NavBar.vue'
import Keyboard from '@/components/Keyboard/Keyboard.vue'
import PopupCard from '@/components/PopupCard/PopupCard.vue'
import moment from 'moment';
import { computed, ref } from 'vue'
import { onLoad, onKeyboardInput } from '@dcloudio/uni-app';

const showPopupCaed = ref(false)
const naviBarHeight = ref(0)
//获取NaviBar高度
const getNaviBarHeight = (e) => naviBarHeight.value = e;

const form = ref([
  {
    score: '',
    credit: ''
  }
])

//历史列表
const historyList = ref([])

const result = ref({
  G21: 0, //结果
  deductTips: '', //扣分提示
  weightedAverage: 0, //加权平均分
  deduct: 0, //扣分
  and: 0, //加权
  creditAnd: 0, //课程学分
  actualCredits: 0, //实修学分
})

onLoad(() => {
  form.value = new Array(20).fill(null).map(() => ({ score: '', credit: '' }));
  historyList.value = uni.getStorageSync('historyList') || []
  console.log('历史列表', historyList.value)
})

//监听键盘输入
// wx.onKeyboardInput((e) => {
//   onInput(e.detail.value)
// })

const showKeyboard = ref(false)
const onInput = (e) => {
  // console.log(e)
  if (currentId.value == '-1') return
  let [index, type] = currentId.value.split('-')
  let value = form.value[index][type] += e

  if (type == "score" && value.length == 2) {
    currentId.value = index + '-credit'
    uni.vibrateShort({ type: 'heavy' });
  } else if (type == "credit" && /^(\d\.25|\d\.5|[1-9])$/.test(value)) {
    currentId.value = Number(index) + 1 + '-score'
    uni.vibrateShort({ type: 'heavy' });
  }
}

const onInputFun = (key) => {
  console.log('键盘函数', key)
  keyboardFun[key]()
}

const keyboardFun = {
  clean() {
    let [index, type] = currentId.value.split('-')
    if(form.value[index][type].length > 0) {
      form.value[index][type] = form.value[index][type].slice(0, -1);
    } else {
      currentId.value = type == 'score' ? Number(index) - 1 + '-credit' : index + '-score'
    }
  },

  reset() {
    form.value = new Array(20).fill(null).map(() => ({ score: '', credit: '' }));
    currentId.value = '0-score';
    result.value = {
      G21: 0, //结果
      deductTips: '', //扣分提示
      weightedAverage: 0, //加权平均分
      deduct: 0, //扣分
      and: 0, //加权
      creditAnd: 0, //课程学分
      actualCredits: 0, //实修学分
    }
  },

  confirm() {
    let invalidCredits = 0, //无效学分
        creditAnd = 0, //课程学分
        actualCredits = 0, //实修学分
        and = 0, //加权
        weightedAverage = 0, //加权平均分
        deduct = 0, //扣分
        deductTips = '', //扣分提示
        G21 = 0 //结果
    
    for(let item of form.value) {
      if(!item.score || !item.credit) break
      let score = parseFloat(item.score)
      let credit = parseFloat(item.credit)
      // console.log(score, credit)
      // 成绩小于60累加无效学分
      if(score < 60) invalidCredits += credit
      creditAnd += credit;
      and += score * credit;
    }

    if(!creditAnd) return uni.showToast({ title: '请输入', icon: 'none' })

    actualCredits = creditAnd - invalidCredits
    weightedAverage = and / creditAnd

    if (actualCredits < 30) {
      deduct = weightedAverage * (1 - (creditAnd - invalidCredits) / 30);
      G21 = weightedAverage - deduct;
      deductTips  = "未满30分需要扣分"
    } else {
      //"实修学分"大于30时运行
      deduct = 0;
      G21 = weightedAverage;
      deductTips = "已满30分无需扣分"
    };

    let res = {
      G21: formatNum(G21), //结果
      deductTips, //扣分提示
      weightedAverage: Math.round(weightedAverage * 100) / 100, //加权平均分
      deduct: Math.round(deduct * 100) / 100, //扣分
      and: Math.round(and * 100) / 100, //加权
      creditAnd: creditAnd, //课程学分
      actualCredits: actualCredits, //实修学分
      date: new Date().getTime()
    }

    result.value = res

    
    //去除无效项
    let arr = form.value.filter(item => item.score && item.credit)
    //深拷贝form.value
    let formList = JSON.parse(JSON.stringify(arr))
    //保存历史记录
    historyList.value.unshift({
      result: res,
      form: formList
    })

    uni.setStorage({
      key: 'historyList',
      data: historyList.value
    })

    
    uni.vibrateShort({ type: 'heavy' });
    setTimeout(() => {
      uni.vibrateShort({ type: 'heavy' });
    }, 200)
  }
}

//数字四舍五入保留两位小数补零
const formatNum = (num) => {
  let n = Math.round(num * 100) / 100
  let arr = n.toString().split('.')
  if (arr.length < 2) arr.push('00')
  if (arr.length > 1 && arr[1].length < 2) arr[1] += '0'
  return arr.join('.')
}

let currentId = ref('-1')
//聚焦
const onFocus = (id) => {
  console.log('当前id', id)
  currentId.value = id
  showKeyboard.value = true
}

//失焦
const onBlur = () => {
  showKeyboard.value = false
  currentId.value = '-1'
}

const scrollTop = computed(() => {
  let currentIndex = currentId.value.split('-')[0]
  let fillerIndex =  Number(currentIndex) - 2
  if( fillerIndex > 0 )return fillerIndex * 46
  else return 0
})

const loadMore = () => {
  console.log('加载更多')
  let arr = new Array(10).fill(null).map(() => ({ score: '', credit: '' }));
  // console.log(arr)
  form.value.push(...arr)
}

const getDataText = (data) => {
  return moment(data).calendar({
    sameDay: '[今天] HH:mm',
    nextDay: '[明天] HH:mm',
    nextWeek: 'dddd HH:mm',
    lastDay: '[昨天] HH:mm',
    lastWeek: 'dddd HH:mm',
    sameElse: 'YYYY-MM-DD HH:mm'
  })
}

const onChooseHistory = (item) => {
  form.value = item.form
  result.value = item.result
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300
  });
}

const onClearHistory = async () => {
  let res = await uni.showModal({
    content: '是否清空历史记录',
    confirmColor: '#7D579B'
  })
  if( !res.confirm ) return
  historyList.value = []
  uni.removeStorage({
    key: 'historyList'
  })
}

const topMask = ref(false)
const onScroll = (e) => {
  topMask.value = e.detail.scrollTop > 10
}
</script>

<style lang="less" scoped>
.content {
  min-height: 100vh;
  padding: 0 10px;
  padding-bottom: 14px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--pageBgColor);
  .conten_main {
    margin-bottom: 6px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 24px 22px;
    background: var( --cardBgColor);
    border-radius: 10px;
    position: relative;
    .main_bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      &.line {
        display: block;
      }
      &.dark {
        display: none;
      }
    }
    @media (prefers-color-scheme: dark) {
      .main_bg.line {
        display: none;
      }
      .main_bg.dark {
        display: block;
      }
    }
    .main_display {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 18px 8px 14px;
      background: var( --cardBoxColor);
      border-radius: 10px;
      border: 1px solid var( --cardBgColor);
      .display_tip {
        font-size: 15px;
        color: var( --tipsTextColor);
      }
      .display_result {
        font-size: 34px;
        font-weight: 700;
        font-family: 'SHSC';
      }
      .display_detail {
        position: absolute;
        right: -11px;
        display: flex;
        padding: 2px;
        background: var( --cardBoxColor);
        border-radius: 50%;
        image {
          width: 20px;
          height: 20px;
        }
        .detail_popup {
          .popup_item {
            font-size: 12px;
            color: var(--detailTextColor);
          }
        }
      }
    }
    .main_title {
      display: flex;
      gap: 10px;
      // padding: 0 6px;
      & > view {
        flex-grow: 1;
        font-size: 14px;
        font-weight: 400;
        color: var( --titleTextColor );
        display: flex;
        justify-content: center;
      }
    }
    .scroll {
      height: 240px;
      border-radius: 8px;
      background: var( --cardBoxColor );
      position: relative;
      overflow: hidden;
      &::after {
        content: '';
        width: 100%;
        height: 80px;
        // background: linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 100%);
        background: linear-gradient(180deg, var( --maskClarityColor ) 0%, var( --cardBoxColor ) 100%);
        position: absolute;
        bottom: 0;
        left: 0;
        pointer-events: none;
      }
      &:before {
        content: '';
        width: 100%;
        height: 80px;
        background: linear-gradient(180deg, var( --cardBoxColor ) 0%, var( --maskClarityColor ) 100%);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        pointer-events: none;
        opacity: 0;
        transition: all 0.3s;
      }
      &.showMask:before {
        opacity: 1;
      }
    }
    .main_form {
      min-height: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 12px;
      .form_item {
        display: flex;
        background: var( --inputBgColor );
        border-radius: 6px;
        font-size: 16px;
        font-family: 'SHSC';
        .item_index {
          margin-right: auto;
          width: 50px;
          height: 34px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: var( --cardBgColor );
          border-radius: 6px;
          font-weight: 900;
          color: #FFFFFF;
        }
        .item_input {
          overflow: hidden;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 210rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          &:after {
            background: var( --inputBgColor );
          }
          &:empty:after {
            content: attr(data-attr);
            color: var( --inputEmptyTextColor );
            font-weight: 400;
          }
          
          &.focus:after {
            content: '';
            width: 2px;
            height: 18px;
            border-radius: 1px;
            background: #18B04C;
            animation: cursor-blinks 1.5s infinite cubic-bezier(0.5, 0, 0.5, 1);
          }
          @keyframes cursor-blinks {
            0% {
              opacity: 1;
              display: block;
            }
            50% {
              opacity: 0;
              display: none;
            }
            100% {
              opacity: 1;
              display: block;
            }
          }
        }
      }
    }
  }
  .content_history {
    display: flex;
    flex-direction: column;
    gap: 12px;
    .history_item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px;
      background: var( --cardBoxColor );
      border-radius: 10px;
      .item_title {
        font-size: 26px;
        font-weight: 700;
        font-family: 'SHSC';
      }
      .item_right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
        font-size: 14px;
        color: var(--subTextColor);
      }
    }
  }
  .content_info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    font-size: 12px;
    color: var(--infoTextColor);
  }
  .content_bottom {
    flex-grow: 1;
    align-items: flex-end;
    justify-content: center;
    color: var( --buttomTextColor );
    font-size: 12px;
    &.line {
      display: flex;
    }
    &.dark {
      display: none;
    }
    @media (prefers-color-scheme: dark) {
      &.line {
        display: none;
      }
      &.dark {
        display: flex;
      }
    }
  }
}
</style>

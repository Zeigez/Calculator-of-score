<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/*每个页面公共css */
page {
  color: #333333;
  --navBgColor: rgba(255, 255, 255, 0.90);
  --navButtonBgColor: #F5F5F5;
  --navButtonTextColor: #808080;
  --pageBgColor: #F2F4F7;
  --cardBgColor: #7D579B;
  --cardBoxColor: #FFFFFF;
  --tipsTextColor: #DDDDDD;
  --titleTextColor: rgba(255, 255, 255, 0.8);
  --maskClarityColor: rgba(255, 255, 255, 0);
  --inputBgColor: #F0F8FF;
  --inputEmptyTextColor: #C4CAD8;
  --subTextColor: #BBBBBB;
  --buttomTextColor: rgba(125, 87, 155, 0.6);
  --keyBoardBgColor: #F8F8F8;
  --keyBoardButtonColor: #FFFFFF;
  --keyBoardButtonDownColor: #F1F1F1;
  --keyBoardConfirmDownColor: #614479;
  --detailBgColor: #FFFFFF;
  --detailTextColor: #9892C2;
}

@media (prefers-color-scheme: dark) {
  page {
    color: #FFFFFF;
    --navBgColor: rgba(27, 27, 27, 0.9);
    --navButtonBgColor: #202020;
    --navButtonTextColor: #808080;
    --pageBgColor: #1A1A1A;
    --cardBgColor: #614479;
    --cardBoxColor: #212121;
    --tipsTextColor: #DDDDDD;
    --titleTextColor: rgba(255, 255, 255, 0.8);
    --maskClarityColor: rgba(33, 33, 33, 0);
    --inputBgColor: #242629;
    --inputEmptyTextColor: #4D5766;
    --subTextColor: #666666;
    --buttomTextColor: rgba(125, 87, 155, 0.6);
    --keyBoardBgColor: #1F1F1F;
    --keyBoardButtonColor: #292929;
    --keyBoardButtonDownColor: #242424;
    --keyBoardConfirmDownColor: #3A234B;
    --detailBgColor: #292929;
    --detailTextColor: #9892C2;
  }
}
@font-face {
  font-family: "SHSC";
  src: url('@/static/font/SourceHanSansCN.otf') format('truetype');
}
.content {
  font-size: 14rpx;
}

view {
  box-sizing: border-box;
  font-weight: 500;
}
</style>

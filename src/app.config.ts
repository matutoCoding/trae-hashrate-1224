export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/schedule/index',
    'pages/match/index',
    'pages/gallery/index',
    'pages/profile/index',
    'pages/studio-detail/index',
    'pages/schedule-detail/index',
    'pages/match-detail/index',
    'pages/artwork-detail/index',
    'pages/cycle-config/index',
    'pages/artwork-upload/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '艺绘学堂',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F7F8FC'
  },
  tabBar: {
    color: '#9094AB',
    selectedColor: '#4F6CF5',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '工作台'
      },
      {
        pagePath: 'pages/schedule/index',
        text: '排课'
      },
      {
        pagePath: 'pages/match/index',
        text: '撮合'
      },
      {
        pagePath: 'pages/gallery/index',
        text: '画廊'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})

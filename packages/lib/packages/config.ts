const data = {
  /**
   * 系统路径名称
   */
  appCode: "JoymoLib",

  /**
   * 系统名称
   */
  title: "JoymoLib",

  /**
   * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
   */
  sideTheme: "theme-dark",

  /**
   * 是否系统布局配置
   */
  showSettings: false,

  /**
   * 是否显示 tagsView
   */
  tagsView: true,

  /**
   * 是否固定头部
   */
  fixedHeader: false,

  /**
   * 是否显示logo
   */
  sidebarLogo: true,
  /**
   * 框架平台类型
   * subapp 子应用
   * subview 子应用页面
   * mainapp 独立应用
   * joymolib UI页面
   * */
  platform: "mainapp",
  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: "development",

  /**
   * brandMdCode
   * 品牌code
   * BRAND_ABITE_WORKSHOP(20200000003, "舌尖英雄"),
     BRAND_HUI_TAI_YI(20200000004, "惠太医");
   */
  brandMdCode: 0,
  baseURL: ''
};

export default data
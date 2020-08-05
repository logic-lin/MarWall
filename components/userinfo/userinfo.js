// components/userinfo/userinfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userinfoData: {
      type: Object,
      value: {}
    },
    label_index: {
      type: Number,
      value: -1,
    },
    order_index: {
      type: Number,
      value: -1,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    index:0,
    _id:0,
    type:'',
    clubname:'',
    applicant: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    convert(e) {
      console.log(this.properties.userinfoData)
      this.setData({
        index: e.target.dataset.index,
        _id: this.properties.userinfoData._id,
        type: this.properties.type,
        clubname: this.properties.data.clubname,
        applicant: this.properties.data.applicant,
      })
      this.triggerEvent('convert', this.data) //要返回这个checkid和index
    }
  },
  lifetimes: {
    attached: function () {
      console.log(this.properties.userinfoData)
    }
  }
})
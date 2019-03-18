import { app } from 'xadmin'

const oneDay = 24 * 3600 * 1000

export default {
  name: '随机数据',
  query: ({ cell }) => {
    const Widget = app.load_dict('dashboard_widgets')[cell.type]
    return new Promise((resolve) => {
      if(Widget && Widget.sampleData) {
        Widget.sampleData(cell, resolve)
      } else {
        resolve([])
      }
    } )
  }
}

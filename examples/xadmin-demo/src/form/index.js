import React from 'react'
import { app, StoreWrap } from 'xadmin-core'

import i18n from 'xadmin-i18n'
import layout, { Page } from 'xadmin-layout'
import form, { SchemaForm } from 'xadmin-form'

@StoreWrap('hello')
class Hello extends React.Component {

  onSubmit(values) {
    const { count, add } = this.props
    add(values)
  }

  render() {
    const { count, add } = this.props
    const { _t } = app.context

    const FormLayout = (props) => {
      const { children, invalid, handleSubmit, submitSucceeded, submitting, isCreate } = props
      return (
        <form className="form-horizontal">
          {children}
          <a onClick={handleSubmit} >{_t('Add Count')}</a>
        </form>
      )
    }

    return (
      <Page title="Form demo">
        {count} 
        <SchemaForm formKey="DemoForm"
          schema={{
            type: 'object',
            properties: {
              count: {
                type: 'number',
                title: '增加数字'
              },
              type: {
                type: 'string',
                title: '数据类型',
                enum: [ '资产数据', '设备数据' ]
              },
              time: {
                type: 'string',
                format: 'date',
                title: '数据日期'
              },
              layers: {
                title: '层',
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    mode: {
                      title: '布局形式',
                      type: 'string',
                      enum: [ '栅格布局', '绝对布局' ]
                    },
                    cols: {
                      title: '列数',
                      type: 'number'
                    },
                    yheight: {
                      title: '行高度',
                      type: 'number'
                    },
                    margin: {
                      title: '间距',
                      type: 'number'
                    },
                    verticalFree: {
                      title: '自由摆放',
                      type: 'boolean'
                    }
                  }
                }
              }
            }
          }}
          onSubmit={this.onSubmit.bind(this)}
          component={FormLayout}/>
      </Page>
    )
  }
}

export default app
.use(i18n)
.use(layout)
.use(form)
.use({
  config: {
    locale: {
      lng: 'zh_Hans'
    }
  },
  locales: {
    zh_Hans: {
      translation: {
        'Add Count': '添加数字'
      }
    }
  },
  mappers: {
    hello: {
      data: ({ state }, props ) => {
        return { count: state.count }
      },
      method: {
        add: ({ dispatch }) => (values) => {
          dispatch({ type: 'ADD', ...values })
        }
      }
    }
  },
  reducers: {
    count: (state=0, action) => {
      if(action.type == 'ADD') {
        return state + action.count
      }
      return state
    }
  },
  components: {
    Dashboard: Hello
  }

})

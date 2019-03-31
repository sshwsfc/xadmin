import React from 'react'
import _ from 'lodash'
import app from 'xadmin'
import { Model } from 'xadmin-model'
import { C } from 'xadmin-ui'

export default {
  name: 'xadmin.model.reldetail',
  field_render: (SubPrev, schema) => {
    if(schema.type == 'object' && schema.relateTo) {
      return ({ value, wrap: WrapComponent }) => {
        
        if(value && value.id !== undefined && schema.showDetail === true && Object.keys(app.get('models')).indexOf(schema.relateTo) >= 0) {
          const newWrap = ({ children }) => (
            <Model name={schema.relateTo}>
              <WrapComponent>
                <C is="Model.DetailModal" id={value.id}>
                  {children}
                </C>
              </WrapComponent>
            </Model>
          )
          return <SubPrev value={value} wrap={newWrap} />
        } else {
          return <SubPrev value={value} wrap={WrapComponent} />
        }
      }
    }
    return SubPrev
  }
}

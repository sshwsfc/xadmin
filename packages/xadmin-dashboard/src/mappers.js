import _ from 'lodash'
import { app } from 'xadmin-core'
import Root from './components/Root'

const genCellKey = (type) => {
  return type.replace(/[\/\,\.]/g, '_') + '_' + Math.random().toString(36).substr(4)
}

export default {
  'dashboard.view': {
    data: ({ dashboard }) => ({
      params: dashboard.params,
      cells: dashboard.cells,
      layouts: dashboard.layouts,
      selectedCell: dashboard.selectCell
    }),
    method: {
      addCell: ({ dispatch, dashboard }) => ({ key, type, params }) => {
        if(!dashboard.selectCell) {
          // 请选择容器
          dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
            type: 'danger', headline: '错误', message: '请选择容器'
          } })
          return
        }
        let Container = null
        if(dashboard.selectCell != Root.key) {
          if(!dashboard.cells[dashboard.selectCell]) {
            // 组件信息错误
            dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
              type: 'danger', headline: '错误', message: '组件信息错误'
            } })
            return
          }
          const container = dashboard.cells[dashboard.selectCell]
          Container = app.load_dict('dashboard_widgets')[container.type]
        } else {
          Container = Root.getWidget()
        }

        if(!Container) {
          // 容器组件未定义
          dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
            type: 'danger', headline: '错误', message: '容器组件未定义'
          } })
          return
        }
        if(!Container.Container) {
          // 请选择容器组件添加
          dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
            type: 'danger', headline: '错误', message: '请选择容器组件添加子组件'
          } })
          return
        }
        
        dispatch({ dashboard, type: '@@x-dashboard/ADD_CELL', 
          key: key || genCellKey(type), 
          params: {
            ...params, type, parent: dashboard.selectCell
          }, Container })
      },
      selectCell: ({ dispatch, dashboard }) => (cellKey) => {
        dispatch({ dashboard, type: '@@x-dashboard/TRIGGER_SELECT_CELL', key: cellKey })
      },
      moveCell: ({ dispatch, dashboard }) => ({ info, dropKey, dragKey, dropPos, dropPosition }) => {

        const drop = dashboard.cells[dropKey]
        const drag = dashboard.cells[dragKey]

        // 1. 不管任何情况，首先找到parent，如果是拖动节点上，parent就是节点，否则parent是drop.parent
        const parentKey = info.dropToGap ? (
          drop.parent || 'root'
        ) : dropKey
        const parent = dashboard.cells[parentKey]

        // 2. 如果parent变更，将拖动元素从老parent中删除，移入新parent
        if(parent && drag.parent != parentKey) {
          const Container = parentKey != Root.key ? app.load_dict('dashboard_widgets')[parent.type] : Root.getWidget()
          // 先判断拖动到的这个节点是不是容器节点
          if(Container.Container) {
            const oldParent = dashboard.cells[drag.parent]
            // 从老parent中删除
            if(oldParent) {
              dispatch({ dashboard, type: '@@x-dashboard/UPDATE_CELL', key: drag.parent, params: {
                ...oldParent, childrenCells: oldParent.childrenCells ? oldParent.childrenCells.filter(k => k !== dragKey) : []
              } })
            }
            // 移入新parent
            dispatch({ dashboard, type: '@@x-dashboard/ADD_CELL', 
              key: dragKey, 
              params: {
                ...drag, parent: parentKey
              }, Container })
          }
        }

        // 3. 如果是拖动到间隙中，要处理排序
        if (info.dropToGap) {
          let ar = [ ...(parent.childrenCells || []) ]
          ar = ar.filter(key => key !== dragKey)
          const i = Math.max(0, ar.indexOf(dropKey))
          ar.splice(dropPosition === -1 ? i : i + 1, 0, dragKey)

          dispatch({ dashboard, type: '@@x-dashboard/MERGE_CELL', key: parentKey, params: {
            childrenCells: ar
          } })

          dispatch({ dashboard, type: '@@x-dashboard/SELECT_CELL', key: parentKey })
        }
      },
      layoutChange: ({ dispatch, dashboard }) => ({ key, layouts }) => {
        dispatch({ dashboard, type: '@@x-dashboard/CHANGE_LAYOUTS', key, payload: layouts })
      },
      saveParams: ({ dispatch, dashboard }) => (params) => dispatch({ dashboard, type: '@@x-dashboard/UPDATE_DASHBOARD', params }),
      testData: ({ dispatch, dashboard }) => () => {
        const cells = dashboard.cells
        Object.keys(cells).map(key => {
          const cell = cells[key]
          const Widget = app.load_dict('dashboard_widgets')[cell.type]
          if(Widget && Widget.sampleData) {
            Widget.sampleData(cell, (key, data) => {
              dispatch({ dashboard, type: '@@x-dashboard/UPDATE_DATA', key, data  })
            })
          }
        })
      }
    }
  },
  'dashboard.cell': {
    data: ({ dashboard }, { cellKey: key }) => ({
      data: dashboard.data,
      cells: dashboard.cells,
      params: dashboard.cells && dashboard.cells[key || dashboard.selectCell] || null,
      cellKey: key || dashboard.selectCell,
      selected: dashboard.selectCell == key
    }),
    method: {
      selectCell: ({ dispatch, dashboard }) => (cellKey) => 
        dispatch({ dashboard, type: '@@x-dashboard/TRIGGER_SELECT_CELL', key: cellKey }),

      removeCell: ({ dispatch, dashboard }) => (cellKey) => {
        let Container = null
        const params = dashboard.cells[cellKey]
        if(params.parent != Root.key) {
          if(dashboard.cells[params.parent]) {
            Container = app.load_dict('dashboard_widgets')[dashboard.cells[params.parent].type]
          }
        } else {
          Container = Root.getWidget()
        }
        dispatch({ dashboard, type: '@@x-dashboard/REMOVE_CELL', key: cellKey, Container })

      },

      copyCell: ({ dispatch, dashboard }) => (cell) => {
        const params = dashboard.cells[cell]
        const parent = dashboard.cells[params.parent]

        const ContainerWidget = params.parent != Root.key ? app.load_dict('dashboard_widgets')[parent.type] : Root.getWidget()
        
        dispatch({ dashboard, type: '@@x-dashboard/ADD_CELL', 
          key: genCellKey(params.type), 
          copyFrom: cell,
          params, Widget: ContainerWidget })
      },
      
      mergeParams: ({ dispatch, dashboard }, { cellKey }) => (params) => 
        dispatch({ dashboard, type: '@@x-dashboard/MERGE_CELL', key: cellKey || dashboard.selectCell, params }),

      updateData: ({ dispatch, dashboard }) => (payload) => 
        dispatch({ dashboard, type: '@@x-dashboard/UPDATE_ALL_DATA', payload }),

      dispatchData: ({ dispatch, dashboard }) => (data) => 
        dispatch({ dashboard, type: '@@x-dashboard/UPDATE_DATA', payload: data })
    }
  },
  'dashboard.form': {
    data: ({ dashboard }, { cellKey: key }) => ({
      data: dashboard.data,
      params: dashboard.cells && dashboard.cells[key || dashboard.selectCell] || null,
      cellKey: key || dashboard.selectCell
    }),
    method: {
      saveParams: ({ dispatch, dashboard }, { cellKey }) => (params) => 
        dispatch({ dashboard, type: '@@x-dashboard/UPDATE_CELL', key: cellKey || dashboard.selectCell, params }),

      saveEvents: ({ dispatch, dashboard }, { cellKey }) => (events) => 
        dispatch({ dashboard, type: '@@x-dashboard/MERGE_CELL', key: cellKey || dashboard.selectCell, params: { events } }),

      mergeParams: ({ dispatch, dashboard }, { cellKey }) => (params) => 
        dispatch({ dashboard, type: '@@x-dashboard/MERGE_CELL', key: cellKey || dashboard.selectCell, params })
    }
  },
  'dashboard.container': {
    data: ({ dashboard }, { cellKey }) => ({
      selectedCell: dashboard.selectCell
    }),
    compute: ({ dashboard }, { cellKey }) => {
      const findSelectedChild = (key) => {
        const cell = dashboard.cells[key]
        if(cell) {
          if(cell.parent == cellKey) {
            return key
          } else {
            return findSelectedChild(cell.parent)
          }
        } else {
          return null
        }
      }
      return { selectedChild: findSelectedChild(dashboard.selectCell) }
    }
  },
  'dashboard.endpoint': {
    data: ({ dashboard }) => ({
      endpoints: dashboard.endpoints
    }),
    method: {
      saveEndpoint: ({ dispatch, dashboard }) => (payload) => 
        dispatch({ dashboard, type: '@@x-dashboard/UPDATE_ENDPOINT', payload })
    }
  }
}

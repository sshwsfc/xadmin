
import { ModelListPage, ModelFormPage, ModelDetailPage } from './components/Pages'
import Pagination from './components/Pagination'
import SubMenu from './components/SubMenu'
import { DataTable, DataList } from './components/Items'
import DataForm from './components/Form'
import DataDetail from './components/Info'

export default {
  components: {
    'Model.ListPage': ModelListPage,
    'Model.FormPage': ModelFormPage,
    'Model.DetailPage': ModelDetailPage,
    'Model.Pagination': Pagination,
    'Model.ListSubMenu': SubMenu,
    'Model.DataTable': DataTable,
    'Model.DataList': DataList,
    'Model.DataForm': DataForm,
    'Model.DataDetail': DataDetail
  }
}

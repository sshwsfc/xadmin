
import { ModelListPage, ModelFormPage, ModelDetailPage } from './pages'
import Pagination from './components/Pagination'
import SubMenu from './components/SubMenu'
import DataTable from './components/DataTable'

export default {
  components: {
    'Model.ListPage': ModelListPage,
    'Model.FormPage': ModelFormPage,
    'Model.DetailPage': ModelDetailPage,
    'Model.Pagination': Pagination,
    'Model.ListSubMenu': SubMenu,
    'Model.DataTable': DataTable
  }
}

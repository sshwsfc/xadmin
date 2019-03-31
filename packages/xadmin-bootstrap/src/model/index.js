
import { ModelListPage, ModelFormPage, ModelDetailPage } from './components/Pages'
import Pagination from './components/Pagination'
import SubMenu from './components/SubMenu'
import { DataTable, DataList, Item } from './components/Items'
import DataForm from './components/Form'
import DataDetail from './components/Info'
import DetailModal from './components/DetailModal'
import SearchBar from './components/SearchBar'
import BatchDelete from './actions/BatchDelete'
import BatchChange from './actions/BatchChange'

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
    'Model.DataDetail': DataDetail,
    'Model.DataItem': Item,
    'Model.DetailModal': DetailModal,
    'Model.SearchBar': SearchBar,
    'Model.BatchChange': BatchChange,
    'Model.BatchDelete': BatchDelete
  }
}

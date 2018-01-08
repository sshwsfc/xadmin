
import HtmlPart from './HtmlPart'
import EChartContainer from './EChartContainer'
import MapContainer from './MapContainer'

import dashboard_containers from '../containers'

export default {
  html: HtmlPart,
  'xadmin-dashboard/container/EChartContainer': EChartContainer,
  'xadmin-dashboard/container/MapContainer': MapContainer,
  ...dashboard_containers
}

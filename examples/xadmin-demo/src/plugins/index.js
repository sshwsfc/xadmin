import React from 'react'
import { app, StoreWrap } from 'xadmin'

import loading from 'xadmin-plugins/lib/loading'
import search from 'xadmin-plugins/lib/search'
import modalform from 'xadmin-plugins/lib/modalform'
import modeltabs from 'xadmin-plugins/lib/modeltabs'
import reldetail from 'xadmin-plugins/lib/reldetail'
import notice from 'xadmin-plugins/lib/notice'
import splashscreen from 'xadmin-plugins/lib/splashscreen'

import main from '../model'

export default main
.use(search)
.use(loading)
.use(notice)
.use(modalform)
.use(modeltabs)
.use(reldetail)
.use(splashscreen)


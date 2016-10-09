# xadmin 3.0

> New xadmin

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm test
```

Arch

Com -> Action -> Effects -> Reducer -> Map -> Com

Router -> Subscription -> Action ...

创建过滤器的思路：

Actions: { type: 'resouce.change_filter', payload: {name: 'Tom', age: {gt: 20, lte: 14}}, meta: {resource: 'User'}}

Reducer: 

Enhance::
'resource.list.params': (perv={}, action) => {
    swtich(action.type){
        ...
        case: 'resouce.change_filter':
            return {...perv, filter: action.payload}
        ...
    }
}

Effects: 

TakeLatest('resouce.change_filter') -> put({type: 'resource.get_list', meta: {resource: act.meta.resource}})

Mapper: 
'resource.list.filter'{ 
    filters: convertFilter(state.resource[name].list.params.filter)
}

Com: 
'resource.list.filter': 
    prop.filters.map( filter => {
        return <FilterCompenment ...props/>
    })


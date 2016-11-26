
import apicloud from './apicloud'
import dotnet from './dotnet'
import mock from './mock'

export default (model) => {
  return mock(model)
  // if([ 'document', 'version', 'commdata', 'product' ].indexOf(model.name) > -1) {
  //   return dotnet(model)
  // } else {
  //   return apicloud(model)
  // }
}

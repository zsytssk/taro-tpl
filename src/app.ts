import { interceptor } from './http/interceptors';
import { addInterceptor } from './wui/taroUtils/fetch';

addInterceptor(interceptor);

function App(props) {
  return props.children;
}

export default App;

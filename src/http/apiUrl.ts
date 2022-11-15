const apiServer = GLOBAL_VARS.apiServer || {};

export default function apiUrl(path, apiPrefix = '') {
  if (path && (path.indexOf('http:') === 0 || path.indexOf('https:') === 0)) {
    return path;
  }

  apiPrefix =
    apiPrefix ||
    apiServer.address + (apiServer.port ? `:${apiServer.port}` : '');

  return apiPrefix + '/api' + (path[0] === '/' ? '' : '/') + path;
}

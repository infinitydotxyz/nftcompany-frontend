// To help typescript find the type
import { mainSchemas } from './main/index';
import { polygonSchemas } from './polygon/index';
import { localhostSchemas } from './localhost/index';

export const schemas = {
  main: mainSchemas,
  polygon: polygonSchemas,
  localhost: localhostSchemas
};

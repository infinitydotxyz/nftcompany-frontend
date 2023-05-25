import { Schema } from '../../types';
import { ERC1155Schema } from '../ERC1155';
import { ERC721Schema } from '../ERC721/index';
import { ERC20Schema } from '../ERC20/index';

export const localhostSchemas: Array<Schema<any>> = [ERC20Schema, ERC721Schema, ERC1155Schema];
import { Store } from '../entities/store.entity';
import { CoreOutput } from './../../common/dtos/core.dto';

export interface CreateStoreInput extends Pick<Store, 'name'> {}

export interface CreateStoreOutput extends CoreOutput {}

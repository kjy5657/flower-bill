import { Raw, Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { AppDataSource } from './../main';
import { CreateStoreInput, CreateStoreOutput } from './dtos/create-store.dto';
import { SearchStoreInput, SearchStoreOutput } from './dtos/search-store.dto';
import { UpdateStoreInput, UpdateStoreOutput } from './dtos/update-store.dto';
import { GetStoresInput, GetStoresOutput } from './dtos/get-stores.dto';
import { DeleteStoreInput, DeleteStoreOutput } from './dtos/delete-store.dto';
import { GetStoreInput, GetStoreOutput } from './dtos/get-store.dto';

export class StoreService {
  private readonly storeRepository: Repository<Store>;

  constructor() {
    this.storeRepository = AppDataSource.getRepository(Store);
  }

  async createStore(
    createStoreInput: CreateStoreInput
  ): Promise<CreateStoreOutput> {
    try {
      await this.storeRepository
        .createQueryBuilder()
        .insert()
        .into(Store)
        .values(createStoreInput)
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async searchStore({
    page,
    keyword,
  }: SearchStoreInput): Promise<SearchStoreOutput> {
    try {
      const stores = await this.storeRepository
        .createQueryBuilder(Store.name)
        .select()
        .where(`name LIKE "%${keyword}%"`)
        .offset(page)
        .limit(10)
        .getMany();

      console.log(stores);

      return { ok: true, stores };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async updateStore(
    updateStoreInput: UpdateStoreInput
  ): Promise<UpdateStoreOutput> {
    try {
      const { id } = updateStoreInput;

      await this.storeRepository
        .createQueryBuilder()
        .update(Store)
        .set(updateStoreInput)
        .where('id=:id', { id })
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async getStores({ page }: GetStoresInput): Promise<GetStoresOutput> {
    try {
      const stores = await this.storeRepository
        .createQueryBuilder(Store.name)
        .select()
        .offset(page)
        .limit(10)
        .getMany();

      return { ok: true, stores };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async deleteStore({ id }: DeleteStoreInput): Promise<DeleteStoreOutput> {
    try {
      await this.storeRepository
        .createQueryBuilder(Store.name)
        .delete()
        .where('id=:id', { id })
        .execute();

      return { ok: true };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  async getStore({ id }: GetStoreInput): Promise<GetStoreOutput> {
    try {
      const store = await this.storeRepository.findOne({ where: { id } });

      if (!store) {
        return { ok: false, error: '?????? ??????????????????.' };
      }

      return { ok: true, store };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
}

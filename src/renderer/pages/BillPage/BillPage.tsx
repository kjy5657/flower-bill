import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import {
  storeState,
  productsState,
  orderProductsState,
  memoState,
} from 'renderer/recoil/states';
import { Product } from 'main/product/entities/product.entity';
import { CreateOrderProductInput } from 'main/orderProduct/dtos/create-orderProduct.dto';
import { GetProductsOutput } from 'main/product/dtos/get-products.dto';
import styles from './BillPage.module.scss';
import StoreSearchModal from './components/StoreSearchModal/StoreSearchModal';
import OrderProductBox from './components/OrderProductBox/OrderProductBox';
import MemoModal from './components/MemoModal/MemoModal';
import ProductBox from './components/ProductBox/ProductBox';

const BillPage = () => {
  const [products, setProducts] = useRecoilState(productsState);
  const orderProducts = useRecoilValue(orderProductsState);
  const memo = useRecoilValue(memoState);
  const store = useRecoilValue(storeState);
  const [isSearchStoreOpen, setIsSearchStoreOpen] = useState<boolean>(false);
  const [isMemoOpen, setIsMemoOpen] = useState<boolean>(false);

  const createBill = () => {
    const orderProductInputs = orderProducts.map((orderProduct) => ({
      count: orderProduct.count,
      productId: orderProduct.product.id,
      orderPrice: orderProduct.orderPrice,
    }));

    const bill = {
      storeId: store.id,
      memo,
      orderProductInputs,
    };

    window.electron.ipcRenderer.sendMessage('create-bill', bill);
  };

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-products', {});
    window.electron.ipcRenderer.on(
      'get-products',
      (args: GetProductsOutput) => {
        setProducts(args.products as Product[]);
      }
    );
  }, []);

  return (
    <>
      <MemoModal isOpen={isMemoOpen} setIsOpen={setIsMemoOpen} />
      <StoreSearchModal
        isOpen={isSearchStoreOpen}
        setIsOpen={setIsSearchStoreOpen}
      />
      <div className={styles.container}>
        <div className={`${styles.content_container} ${styles.bill_container}`}>
          <h1>?????????</h1>
          <hr />
          <div>
            {store.name !== '' ? store.name : '______'}
            ??????
            <Button onClick={() => setIsSearchStoreOpen(true)}>
              ????????? ??????
            </Button>
            <Button onClick={() => setIsMemoOpen(true)}>??????</Button>
          </div>
          <div className={`${styles.orderProducts_list}`}>
            {orderProducts.map((orderProduct) => (
              <OrderProductBox
                key={orderProduct.product.id}
                orderProduct={orderProduct}
              />
            ))}
          </div>
          <hr />
          <div>
            <p>
              ???
              {orderProducts
                .reduce((acc, cur) => acc + cur.orderPrice, 0)
                .toLocaleString('ko-KR')}
              ???
            </p>
            <Button variant="contained" onClick={createBill}>
              ????????? ??????
            </Button>
          </div>
        </div>
        <div
          className={`${styles.content_container} ${styles.products_container}`}
        >
          <h1>??????</h1>
          <hr />
          <div className={styles.products_list}>
            {products.map((product) => (
              <ProductBox key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BillPage;

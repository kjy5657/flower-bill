import './Bill.scss';
import '../common.scss';

import * as React from 'react';
import Button from '@mui/material/Button';

import { useEffect, useState } from 'react';
import { BillService } from './../../main/bill/bill.service';
import { AppDataSource } from './../../main/main';
import { ipcRenderer } from 'electron';
import { OrderProduct } from './../../main/orderProduct/orderProduct.entity';
import { Product } from './../../main/product/entities/product.entity';
import { TextField } from '@mui/material';

const Bill = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [counts, setCounts] = useState<number[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-products', []);

    window.electron.ipcRenderer.on('get-products', (args) => {
      setProducts(args.products as Product[]);
      console.log(products);
      setIsLoading(true);
    });
  }, []);

  const createBill = () => {
    window.electron.ipcRenderer.sendMessage('create-bill', ['data']);
  };

  const addOrderProduct = (product: Product) => {
    console.log(product);
    setOrderProducts([
      ...orderProducts,
      { id: orderProducts.length, product, count: 1 },
    ]);
    setCounts([...counts, 1]);
  };

  const changeCount = (e: any, orderProduct: OrderProduct) => {
    let {
      value,
      dataset: { id },
    } = e.target;

    if (value == '' || isNaN(value)) {
      value = 0;
    }

    let nextOrderProducts = orderProducts;
    let updatedProduct = nextOrderProducts.find(
      (p) => p.id === orderProduct.id
    );

    if (updatedProduct) {
      updatedProduct.count = parseInt(value);
    }

    setOrderProducts(nextOrderProducts);

    //have to make new obj
    let updateCounts = Array.from(counts);

    updateCounts[id] = parseInt(value);
    setCounts(updateCounts);
    console.log(counts);
  };

  return (
    <div className="container">
      <div className="bill-container">
        <div className="header-container">
          <p className="font-title">계산서</p>
        </div>

        <div className="contents-container">
          {orderProducts.map((orderProduct, index) => {
            return (
              <div key={index} className="content">
                <span className="font-content">
                  {orderProduct.product.name}
                </span>
                <span className="input-container">
                  <input
                    data-id={index}
                    onInput={(e) => changeCount(e, orderProduct)}
                    value={counts[index] === 0 ? '' : counts[index]}
                    type="number"
                  ></input>
                  <span className="font-content">
                    \
                    {isNaN(orderProduct.count)
                      ? 0
                      : orderProduct.product.price * orderProduct.count}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
        <div className="total-price-container">
          <p className="font-content">총 금액</p>
          <p className="font-content">
            \
            {orderProducts.reduce((a, b) => {
              const acc = a + b.count * b.product.price;
              return acc;
            }, 0)}
          </p>
        </div>

        <Button onClick={createBill} variant="contained">
          계산서 생성
        </Button>
      </div>

      <div className="product-container">
        <div className="header-container">
          <p className="font-title">상품</p>
        </div>

        <div className="contents-container">
          <div className="content">
            {products?.map((product) => {
              return (
                <div key={product.id} className="content">
                  <p className="font-content">{product.name}</p>
                  <p className="font-content">\{product.price}</p>
                  <Button
                    onClick={() => addOrderProduct(product)}
                    variant="contained"
                  >
                    추가
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;

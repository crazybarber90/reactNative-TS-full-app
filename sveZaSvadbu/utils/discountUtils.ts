// FUNCTION THAT WILL SUBSTRACT (-) DISCOUNT OF CURRENT PRICE AND MAKE NEW PRICE

import { Product } from "../../common/services/products/types";

// IF DISCOUNT IS IN % TYPE, FUNCTION WILL MAKE AMOUNT AND SUBSTRACT OF PRICE
export const handleDiscount = (
  price: string,
  currency: string,
  discount: number,
  discount_type: number
) => {
  if (discount_type === 2) {
    let newPrice = Number(price) - discount;
    return `${newPrice.toFixed(2)} ${currency}`;
  } else if (discount_type === 1) {
    const percentageDiscount = (discount / 100) * Number(price);
    // 20 % / 100 * 1000 === 0.2 * 1000 === 200 ( dsicount of 20% === 200)
    const discountedPrice = Number(price) - percentageDiscount;
    // price 1000 - (discount 20% === 200) === 800
    return `${discountedPrice.toFixed(2)} ${currency}`;
  }
};

export const convertToPercent = (item: Product) => {
  let percent = 0;
  let price = +item.price;
  let discount = item.discount;
  let discountType = item.discount_type;

  if (discountType === 2) {
    percent =
      (100 * discount) / (price || (item.mod_price as unknown as number));
    return `-${percent.toFixed(2)}%`;
  } else {
    return `-${discount}%`;
  }
};

export const handlePrice = (price: string, currency: string) => {
  if (price === "Na Upit") {
    return price;
  } else {
    return `${parseFloat(price).toFixed(2)} ${currency}`;
  }
};

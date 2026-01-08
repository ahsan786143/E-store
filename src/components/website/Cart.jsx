import React from "react";
import { BsCart2 } from "react-icons/bs";

const Cart = () => {
  return (
    <button type="button">
      <BsCart2
        className="text-gary-500 hover:text-primary cursor-pointer"
        size={23}
      />
    </button>
  );
};

export default Cart;

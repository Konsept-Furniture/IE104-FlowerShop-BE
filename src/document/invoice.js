module.exports = ({ order }) => {
  const today = new Date();
  let stringTable = "";
  console.log(order);
  let count = 0;
  order.products.forEach(
    (item) =>
      (stringTable += `<tr>
            <td>${++count}</td>
            <td>${item.title}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${(item.quantity * item.price).toFixed(2)}</td>
          </stringTabletr>`)
  );
  console.log(stringTable);
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .wrapper {
        margin: 25px;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: 12px;
      }

      .header {
        /* display: flex;
        align-items: center;
        justify-content: space-between; */
      }
      .header__img {
        width: 200px;
      }
      .header__text {
        font-size: 44px;
        font-weight: bold;
        color: #dcb181;
        float: right;
        margin: 0;
      }

      .information {
        /* display: grid;
        overflow: hidden;
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: 1fr;
        grid-column-gap: 15px;
        grid-row-gap: 5px; */
        width: 100%;
        clear: both;
        margin-top: 15px;
      }

      .information__item__supplier {
        border: 1px solid #dcb181;
        /* padding: 0px 10px; */
        width: 48%;
        float: right;
        height: 250px;
      }
      .information__item__order {
        border: 1px solid #dcb181;
        /* padding: 0px 10px; */
        width: 48%;
        height: 250px;
      }

      .information__item__header {
        text-align: center;
        border-bottom: 1px solid #dcb181;
        padding: 8px 10px;
        font-weight: bold;
        background-color: #f5dabb;
      }
      .information__item__header p {
        margin: 0;
      }

      .information__item__body {
        padding: 0 10px;
      }

      .customer {
        margin-top: 15px;
        border: 1px solid #dcb181;
      }
      .customer__header {
        text-align: center;
        border-bottom: 1px solid #dcb181;
        padding: 8px 10px;
        font-weight: bold;
        background-color: #f5dabb;
      }
      .customer__header p {
        margin: 0;
      }

      .customer__body {
        padding: 0 10px;
      }

      .items {
        margin-top: 15px;
      }
      .items table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }

      .items td {
        border: 1px solid #dcb181;
        text-align: center;
        padding: 8px;
      }
      .items th {
        border: 1px solid #f5dabb;
        border-bottom: 1px solid #dcb181;
        text-align: center;
        padding: 8px;
      }

      .items tr:nth-child(even) {
        background-color: #f5dabb;
      }

      .payment {
        margin-top: 15px;
        font-size: 12px;
        font-weight: 600;
      }
      .payment__item {
        /* display: flex;
        align-items: flex-end;
        justify-content: space-between; */
        line-height: 1.5;
        margin-left: 200px;
        font-size: 12px;
      }
      .payment__item-price {
        float: right;
      }

      .footer {
        margin-top: 20px;
        text-align: center;
      }

      .footer__thankyou {
        font-weight: bold;
      }

      .PDFExport {
        visibility: hidden;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="header">
        <img
          src="https://konsept.qodeinteractive.com/wp-content/uploads/2020/07/logo_mainpng-300x105.png"
          alt=""
          class="header__img"
        />
        <p class="header__text">INVOICE</p>
      </div>
      <div class="information">
        <div class="information__item__supplier">
          <div class="information__item__header">
            <p>Supplier information</p>
          </div>
          <div class="information__item__body">
            <p>FURNITURE SHOP</p>
            <p>Room 999, 99/ZZ, HAKUNA MATATA </p>
            <p>99-99 HMHMHMHMHM, HAKUNA MATATA </ p>
            <p>VIET NAM</p>
          </div>
        </div>
        <div class="information__item__order">
          <div class="information__item__header">
            <p>Order Information</p>
          </div>
          <div class="information__item__body">
            <p>Date: ${order.createdAt.getDate()}-${
    order.createdAt.getMonth() + 1
  }-${order.createdAt.getFullYear()}</p>
            <p>Order NO.: ${order._id}</p>
            <p>Order Status: ${order.status}</p>
            <p>Payment method: ${order.payment}</p>
            <p>Tracking Number: ${order._id}</p>
          </div>
        </div>
      </div>
      <div class="customer">
        <div class="customer__header">
          <p>Ship To</p>
        </div>
        <div class="customer__body">
          <p>${order.deliveryInfo.name}</p>
          <p>${order.deliveryInfo.phone}</p>
          <p>${order.deliveryInfo.email}</p>
          <p>${order.deliveryInfo.address.street}  ${
    order.deliveryInfo.address.ward
  }  ${order.deliveryInfo.address.district}  ${
    order.deliveryInfo.address.province
  }</p>
        </div>
      </div>
      <div class="items">
        <table>
          <tr>
            <th>No.</th>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
          ${stringTable}
        </table>
      </div>
      <div class="payment">
        <div class="payment__item">
          <span class="payment__item-title">Subtotal:</span>
          <span class="payment__item-price">$${order.amount.toFixed(2)}</span>
        </div>
        <div class="payment__item">
          <span class="payment__item-title">Shipping:</span>
          <span class="payment__item-price">$20.00</span>
        </div>
        <div class="payment__item">
          <span class="payment__item-title">Total:</span>
          <span class="payment__item-price">$${(order.amount + 20).toFixed(
            2
          )}</span>
        </div>
      </div>
      <div class="footer">
        <p>
          If you have any questions about this invoice , please contact our
          service team.
        </p>
        <p class="footer__thankyou">Thank you for your purchase .</p>
      </div>
    </div>
  </body>
</html>
`;
};

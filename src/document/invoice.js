module.exports = ({ order }) => {
  const today = new Date();
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
        width: 150px;
      }
      .header__text {
        font-size: 36px;
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
      }

      .information__item__supplier {
        border: 1px solid #dcb181;
        /* padding: 0px 10px; */
        width: 48%;
        float: right;
        height: 200px;
      }
      .information__item__order {
        border: 1px solid #dcb181;
        /* padding: 0px 10px; */
        width: 48%;
        height: 200px;
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
        text-align: left;
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
        margin-top: 20px;
        font-size: 12px;
        font-weight: 600;
      }
      .payment__item {
        /* display: flex;
        align-items: flex-end;
        justify-content: space-between; */
        line-height: 1.5;
        margin-left: 500px;
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
            <p>Supplier company information</p>
          </div>
          <div class="information__item__body">
            <p>BANGGOOD TECHNOLOGY CO., LIMITED</p>
            <p>Room 38, 11/F, Meeco Industrial Building</p>
            <p>53-55 Au Pui Wan Street, Fotan, Shatin, N.T.</p>
            <p>Viet Nam</p>
          </div>
        </div>
        <div class="information__item__order">
          <div class="information__item__header">
            <p>Order Information</p>
          </div>
          <div class="information__item__body">
            <p>Date :2022-01-03 21:39:35</p>
            <p>Order NO. :106572494</p>
            <p>Order Status : Deliveried</p>
            <p>Payment (TXD) :USD</p>
            <p>Tracking Number : A0003622010401W4</p>
          </div>
        </div>
      </div>
      <div class="customer">
        <div class="customer__header">
          <p>Ship To</p>
        </div>
        <div class="customer__body">
          <p>${order.name}</p></p>
          <p>${order.address}</p>
          <p>${order.orderId}</p>
          <p>${order.phone}</p>
        </div>
      </div>
      <div class="items">
        <table>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
          <tr>
            <td>Table</td>
            <td>100$</td>
            <td>5</td>
            <td>500</td>
          </tr>
          <tr>
            <td>Table</td>
            <td>100$</td>
            <td>5</td>
            <td>500</td>
          </tr>
          <tr>
            <td>Table</td>
            <td>100$</td>
            <td>5</td>
            <td>500</td>
          </tr>
        </table>
      </div>
      <div class="payment">
        <div class="payment__item">
          <span class="payment__item-title">Subtotal:</span>
          <span class="payment__item-price">1000$</span>
        </div>
        <div class="payment__item">
          <span class="payment__item-title">Shipping:</span>
          <span class="payment__item-price">20$</span>
        </div>
        <div class="payment__item">
          <span class="payment__item-title">Total:</span>
          <span class="payment__item-price">100$</span>
        </div>
      </div>
      <div class="footer">
        <p>
          If you have any questions about this invoice , please contact our
          service team.
        </p>
        <p class="footer__thankyou">Thank you for your custom with us .</p>
      </div>
    </div>
  </body>
</html>
`;
};

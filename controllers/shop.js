const Order = require('../models/orders');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.find()
    //find() in mongoose is a method that returns all the products in the database. It doesnt return the cursor like in mongodb
    .then((products) => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } }).then((products) => {
  //   res.render('shop/product-detail', {
  //     product: products[0],
  //     pageTitle: products[0].title,
  //     path: '/products',
  //   });
  // });

  Product.findById(prodId) //findById is a method in mongoose
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId') //populate doesnt return a promise, it returns the user object with the populated cart so we have to call execPopulate() to return a promise
    .execPopulate()
    .then((products) => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
      });
    })
    .catch((err) => console.log(err));

  exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
      .then((product) => {
        return req.user.addToCart(product);
        res.redirect('/cart');
      })
      .catch((err) => console.log(err));
  };
  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart
  //       .getProducts({ where: { id: prodId } })
  //       .then((products) => {
  //         let product;
  //         if (products.length > 0) {
  //           product = products[0];
  //         }
  //         if (product) {
  //           const oldQuantity = product.cartItem.quantity;
  //           newQuantity = oldQuantity + 1;
  //           return product;
  //         }
  //         return Product.findByPk(prodId);
  //       })
  //       .then((product) => {
  //         return fetchedCart.addProduct(product, {
  //           through: { quantity: newQuantity },
  //         });
  //       })

  exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
      .deleteItemFromCart(prodId)
      .then((result) => {
        res.redirect('/cart');
      })
      .catch((err) => console.log(err));
  };

  exports.postOrder = (req, res, next) => {
    req.user
      .populate('cart.items.productId') //populate doesnt return a promise, it returns the user object with the populated cart so we have to call execPopulate() to return a promise
      .execPopulate()
      .then((products) => {
        const products = user.cart.items.map((i) => {
          return { quantity: i.quantity, product: { ...i.productId._doc } };
        });
        const order = new Order({
          user: {
            name: req.user.name,
            userId: req.user, //mongoose will automatically extract the id from this
          },
          products: products,
        });
        return order.save();
      })

      .then((result) => {
        return req.user.clearCart();
      })
      .then(() => {
        res.redirect('/orders');
      })
      .catch((err) => console.log(err));
  };

  exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
      .then((orders) => {
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders,
        });
      })
      .catch((err) => console.log(err));
  };
};

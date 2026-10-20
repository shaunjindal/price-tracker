// PRICE SLASHING RULES  (edit this file to change discounts)
//
// Most specific rule wins:  product  >  subcategory  >  category
//
// Rule shapes:
//   { type: 'percent', value: 10 }   -> 10% off  (value 1-100)
//   { type: 'amount',  value: 150 }  -> flat Rs 150 off
//   { type: 'none' }                 -> no discount (use on a product/subcategory
//                                       to opt out of a parent rule)
//
// Keys:
//   categories:    categoryId                      e.g. 'bedsheets'
//   subcategories: 'categoryId/subcategoryId'      e.g. 'blankets/fleece'
//   products:      productId                       e.g. 'bs-1'
module.exports = {
  categories: {
    bedsheets: { type: 'percent', value: 25 },
    blankets: { type: 'percent', value: 25 },
  },
  // subcategories: {
  //   'blankets/single': { type: 'percent', value: 25 },
  //   'blankets/blackout': { type: 'percent', value: 15 },
  // },
  // products: {
  //   'bs-1': { type: 'percent', value: 20 }, // beats the 10% bedsheets rule
  //   'ct-3': { type: 'none' },               // opts out of the blackout 15% rule
  // },
};

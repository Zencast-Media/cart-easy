# cart-easy

> A **generic solution** towards implementing a cart in your e-commerce application.
> This library has been created with **ES6+ Javascript & uses SQLite 3** as its database.
> It is meant to be used as a **pluggable library** that caters any Javascript application
> seeking to intergate **Cart** functionality

## Installation

---

- **Using npm:**
  ```
  $ npm install cart-easy
  ```
- **Using yarn:**
  ```
  $ yarn add cart-easy
  ```

## Description (MUST READ)

---

##### This library is centered around the following parameters:

1. **user id** : A unique ID that identifies a cart against a certain user.
2. **content** : The set of items present in that cart.
   - **_name_** : Name of the cart item (required).
   - **_price_** : Price of the cart item (required).
   - **_multiplier_** : Quantity of the cart item (required).
   - **_conditions_** : The set of conditions to be applied to the cart item (optional). Detailed description can be found below.
     > Note: Any other data is also accepted as per the User's requirment and will not affect the cart calculations.
3. **condition** : A set of properties that affects that price of an Item present int he cart. A condtion can be expressed as an **absolute** value or in _percentage_. There can be 2 types of conditions: 1. **_global_**: A set of condtions that is applied on the cart subtotal. If more than 1 of them are present, then a **rank** property with a **value(>0)** must be present in the global condition to assign their priority in the cart calculations. 2. **_item conditions_**: A set of conditions that is applied on the price of a cart item. If you ever want an item condition to act globally. then an **isGlobal** property with **true** as boolean value must be passed which will require you to pass a **rank** property with a **value(>0)**, otherwise just pass **isGlobal** property with a **false** boolean value. > **Note:**
   If **multiple ranked conditions** have the same rank, then their **order** in the request body will be followed during calculations.
   Both global and item conditions are optional and can be avoioded.
   Any other data is also accepted as per the User's requirment but would not affect the cart calculations.

## Import

---

```
const cart = require('cart-easy');
```

## Sample Request

---

Have a look at the parameters below:

```javascript
const userId = 'Some Unique ID';
const globalConditions = [
	{
		name: 'Condition 1', // Condition name is required
		type: 'Anyting', // Depends on the Business
		value: 100, // A positive value is required
		action: 'ADD', // action can be one of "ADD" or "SUB" is                                   required
		isPercentage: false, // isPercentage can be true or false and is                                  required
		rank: 2, // rank is required when multiple globally                               applicable conditions are present
	},
	{
		name: 'Condition 2',
		type: 'Anything',
		value: 100,
		action: 'SUB',
		isPercentage: true,
		rank: 3,
	},
];
const content = [
	{
		name: 'Item 1', // Item name is required
		price: 100, // Item price is required
		multiplier: 2, // Item multiplier is required
		attributes: [], // Can be anything as per the business requirement
		conditions: [
			// Item Conditions are optional
			{
				name: 'Some Condition 1',
				type: 'extra',
				value: 20,
				action: 'ADD',
				isPercentage: true,
				isGlobal: false, // Item condition's isGlobal can be true or false and is required
			},
			{
				name: 'Item Condition 2',
				type: 'discount',
				value: 20,
				action: 'SUB',
				isPercentage: false,
				isGlobal: true,
				rank: 1, // a positive rank is required when item condition's isGlobal is true
			},
		],
	},
	{
		name: 'Item 2',
		price: 200,
		multiplier: 1,
		conditions: [
			{
				name: 'Some Condition 3',
				type: 'addon',
				value: 20,
				action: 'ADD',
				isPercentage: true,
				isGlobal: false,
			},
			{
				name: 'Some Condition 1',
				type: 'promo',
				value: 20,
				action: 'SUB',
				isPercentage: false,
				isGlobal: true,
				rank: 1,
			},
		],
	},
];
```

> **Note:**
> The library will add the following unique identifiers:
> **\_itemId** to every item inside the content while cart creation.
> **\_conditionId** to every condition while cart creation.

## #Sample Cart Reponse

```javascript
{
  "content": [
    {
      "name": "Item 1",
      "price": 100,
      "multiplier": 2,
      "attributes": [

      ],
      "conditions": [
        {
          "name": "Some Condition 1",
          "type": "extra",
          "value": 20,
          "action": "ADD",
          "isPercentage": true,
          "isGlobal": false,
          "_conditionId": "262b0f19-f7b3-4c0f-bf89-d3fcbacb4327"
        },
        {
          "name": "Item Condition 2",
          "type": "discount",
          "value": 20,
          "action": "SUB",
          "isPercentage": false,
          "isGlobal": true,
          "rank": 1,
          "_conditionId": "c43723ce-9dc4-4ef5-92e1-f7da4df1064d"
        }
      ],
      "_itemId": "1bb9c3e4-a908-4246-b188-3921f8ddedcb"
    },
    {
      "name": "Item 2",
      "price": 200,
      "multiplier": 1,
      "conditions": [
        {
          "name": "Some Condition 3",
          "type": "addon",
          "value": 20,
          "action": "ADD",
          "isPercentage": true,
          "isGlobal": false,
          "_conditionId": "895010f8-4899-4d3d-8091-b434e9b490b5"
        },
        {
          "name": "Some Condition 1",
          "type": "promo",
          "value": 20,
          "action": "SUB",
          "isPercentage": false,
          "isGlobal": true,
          "rank": 1,
          "_conditionId": "a35cdfdc-7735-4f04-ac2e-6f9f8a2a9961"
        }
      ],
      "_itemId": "4089339a-3c9e-40eb-ad18-36f214f5743f"
    }
  ],
  "userId": "Some Unique ID",
  "globalConditions": [
    {
      "name": "Condition 1",
      "type": "Anyting",
      "value": 100,
      "action": "ADD",
      "isPercentage": false,
      "rank": 2,
      "_conditionId": "789a7045-b5af-482c-93e6-1c50280f0216"
    },
    {
      "name": "Condition 2",
      "type": "Anything",
      "value": 50,
      "action": "SUB",
      "isPercentage": true,
      "rank": 3,
      "_conditionId": "bbdda6e8-3eb7-4631-a2d4-ddc074fcad3e"
    }
  ],
  "subTotal": 480,      // can be zero
  "total": 280          // can be zero
}
```

# Usage

---

All cart-easy functions return a **promise**.

#### Creating a Cart

```javascript
const cart = require('cart-easy');
// Refer the Sample Request above
cart
	.createCart(content, globalConditions, userId)
	.then(cart => console.log(cart)) // Refer to the Sample Cart Respone above
	.catch(err => console.log(err));
```

### Updating a Cart

```javascript
cart
	.updateCart(content, globalConditions, userId)
	.then(cart => console.log(cart)) // Refer to the Sample Cart Respone above
	.catch(err => console.log(err));
```

### Fetching a Cart

```javascript
cart
	.getCart(userId)
	.then(cart => console.log(cart)) // Refer to the Sample Cart Respone above
	.catch(err => console.log(err));
```

### Update Item Multiplier

```javascript
cart
	.updateItemMultiplier(userId, _itemId, multiplier)
	.then(cart => console.log(cart)) // Refer to the Sample Cart Respone above
	.catch(err => console.log(err));
```

### Remove a Condition

#### 1. Remove an Item's condition

```javascript
cart
	.removeCondition(userId, _itemId, _conditionId)
	.then(cart => console.log(cart)) // Refer to the Sample Cart Respone above
	.catch(err => console.log(err));
```

#### 2. Remove a Global condition

```javascript
cart
	.removeCondition(userId, _conditionId)
	.then(cart => console.log(cart)) // Refer to the Sample Cart Respone above
	.catch(err => console.log(err));
```

---

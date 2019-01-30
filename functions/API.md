# API Documentation

## Run Faucet
---

**URL**: `/faucet/run`

**Method**: `POST`
  
**URL Params**: None



**Data Params**


| Name | Type | Required | Description |
| :---: | :--- | :---: | :--- |
| address | `string` | ✓ | Zilliqa address |
| token | `string` | ✓ | The user response token provided by the reCAPTCHA client-side. |  

**Data Example**

  ```json
  {
      "address": "68246c09b643f2194e658d31f99c3cce5a45799a",
      "token":"03AF6jDqWMHTC8A6iZNCY6Mw8qLZ2MV2WO4muV-F8uIWhCFCo1KmYLTxzDk_cXUn-12AyNge6QPtyHASaV7TOtPjalakCCm65979W6g-PndO2Ux_8pi31AsY_-6Jxc9HJCFW_Koc5bnnxAxwycpJp1N3WtK3i5DADtkQqnlCjezeDbarg_OEeu7pf2XcyaszHozojFHBB8Hs1HYDslKa0rRZr04z_FRnBJffNgQG6PELFrS1bM1FXKs6yjaGfKSs9a2Gq1NsrmuEeGY6rjTa_8pU72qZGTQXF8pEWUdRxb7fZIcvDyhmtkQTcGXn6KjvX-cOCkeCZb6r_GA9sVJnJ1v86Y44f9GELO9w"
  }
  ```


**Response**

  **Code:** `200`
  **Content:** 
    

```json
{ 
  "txId":  "40b0e4c3a512d79dc7f9ef3404cf06623d868d65e439554cf4c266fbab24c682"
}
```


# API Documentation

## Run Faucet

**URL** : `/faucet/run`

**Method** : `POST`

**Auth required** : No

**Permissions required** : None

**Data constraints**

Provide the followings: 
- The user response token provided by the reCAPTCHA client-side integration on your site.
- Zilliqa address (e.g. "68246c09b643f2194e658d31f99c3cce5a45799a")

```json
{
    "address": "[string]",
    "token": "[string]"
}
```

**Data example** All fields must be sent.

```json
{
    "address": "68246c09b643f2194e658d31f99c3cce5a45799a",
    "token":"03AF6jDqWMHTC8A6iZNCY6Mw8qLZ2MV2WO4muV-F8uIWhCFCo1KmYLTxzDk_cXUn-12AyNge6QPtyHASaV7TOtPjalakCCm65979W6g-PndO2Ux_8pi31AsY_-6Jxc9HJCFW_Koc5bnnxAxwycpJp1N3WtK3i5DADtkQqnlCjezeDbarg_OEeu7pf2XcyaszHozojFHBB8Hs1HYDslKa0rRZr04z_FRnBJffNgQG6PELFrS1bM1FXKs6yjaGfKSs9a2Gq1NsrmuEeGY6rjTa_8pU72qZGTQXF8pEWUdRxb7fZIcvDyhmtkQTcGXn6KjvX-cOCkeCZb6r_GA9sVJnJ1v86Y44f9GELO9w"
}
```

### Success Response

**Condition** : If everything is OK and an Account didn't exist for this User.

**Code** : `200`


### Error Responses

**Condition** : If fields are missed.

**Code** : `400`

![./scyllo.png](./scyllo.png)

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
  - [selectFrom](#selectfrom)
  - [insertInto](#insertinto)
  - [deleteFrom](#deletefrom)
- [Type Conversion](#type-conversion)
- [Known Restrictions](#known-restrictions)

## Installation

Using `npm`:

```sh
npm install scyllo
```

or if you prefer to use the `yarn` package manager:

```sh
yarn add scyllo
```

## Usage

```ts
import { ScylloClient } from "scyllo";

type User = {
  user_id: string;
  username: string;
};

type Order = {
  order_id: string;
};

const DB = new ScylloClient<{ users: User; orders: Order }>({
  client: {
    contactPoints: ["localhost:9042"],
    keyspace: "mykeyspace",
    localDataCenter: "datacenter1",
  },
});
```

### selectFrom

Selecting from a database table is as easy as it should be. Simply call the `selectFrom` function on the client instance like so:

```ts
const users = await DB.selectFrom("users", "*");
```

In the event you only want a specific column/field of your object.

```ts
const usernames = await DB.selectFrom("users", ["username"]);
```

In the event you want to apply specific restrictions to what entries should be returned.

```ts
const users = await DB.selectFrom("users", ["username"], { user_id: "12345" });
```

Adding extra values to this query should be as simple as

```ts
const users = await DB.selectFrom("users", ["username"], { user_id: "12345" }, "ALLOW FILTERING");
```

### insertInto

Inserting an object into the database is also a breeze. Simply call the `insertInto` function on the client instance like so:

```ts
await DB.insertInto('users', {user_id: "12345", username: "lucemans"});
```

or simply directly with your user object like so:

```ts
const userObject: User = {user_id: "12345", username: "lucemans"};
await DB.insertInto('users', userObject);
```

### deleteFrom

Deleting fromt he database can be done in a multitude of ways. In the event of deleting the entire row from the table, you can do it like so:

```ts
await DB.deleteFrom('users', '*', {user_id: "12345"});
```

The above code will delete the user with the `user_id` of `12345`.

In the event you want to simply delete/clear one of the cells in a specific row you can do that like so:

```ts
await DB.deleteFrom('users', ['username'], {user_id: "12345"});
```

## Type Conversion

In order to keep track of the corresponding Javascript type for a CQL data type, we can use the link bellow.
[https://docs.datastax.com/en/developer/nodejs-driver/4.6/features/datatypes/](https://docs.datastax.com/en/developer/nodejs-driver/4.6/features/datatypes/)

When `prepare = true` *(default behaviour)* in the Scyllo config, it understand that a javascript types should be converted to the corresponding cassandra type. When `prepare = false` it may cause issues with more advanced types as it will not convert them, it thus recommended to leave this option as `true`.

Note that Tuples have to be create in a specific way, which you can read about [here](https://docs.datastax.com/en/developer/nodejs-driver/4.6/features/datatypes/tuples/).

## Known Restrictions

Limited multi-keyspace support. This is something that is on our roadmap and hopefully some day in the future we will be able to handle this.
As of right now scyllo is unable to provide you with a smooth multi-keyspace experience, but this is in the works.

Query-ing restrictions are currently limited to only allow direct equality checks, for ex. `user_id = 5` etc. We hope to be able to support `user_id > 5` and `user_id >= 5` in the near future as well. If this is something you are interested in, please let us know.

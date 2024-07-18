Power by [Molecule](https://github.com/DTStack/molecule)

# Project structure

`./src` UI

`./rpc` rpc (To runing move code)

`./users_file` users_file (Move code)

# Start

## auto

`./init.sh`

`./run.sh`

`./stop.sh`

## manual

`yarn start`

`ts-node ./users-file/server.ts`

`cd rpc/server | cargo run`

# Test

## aptos

```bash
cd rpc/move
aptos move init --name user
aptos init --network testnet
aptos move test
```

## rpc (rust)

In terminal

```bash
 curl -X POST -d 'module 0x12::test{
  use std::debug::print;
  use std::string::utf8;
  #[test]
  fun test_server(){
    print(&utf8(b"server is running"));
  }
}' http://127.0.0.1:8081/run_move
```

## user_file

```bash
ts-node ./users-file/server.ts
```

Browser access:

http://localhost:3001 (default)

## react

`yarn start`

Browser access:

http://localhost:3000 (default)

# resource

[example](https://dtstack.github.io/molecule/zh-CN/docs/guides/extend-builtin-ui)

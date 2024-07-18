# 2024-07-18

## test

- [x] runing `yarn start` SUCCESS ✅
- [x] runing `cd users-file | ts-node serve.ts` SUCCESS ✅
- [x] runing `curl -X POST  http://localhost:3001/user-activity` SUCCESS ✅
- [x] runing `cd rpc/server | cargo run` SUCCESS ✅
- [x] runing test call SUCCESS ✅

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

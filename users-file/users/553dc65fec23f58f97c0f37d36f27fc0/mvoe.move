module 0x42::test{
  use std::vector;
  use std::vector as V;

  fun new_vecs(): (vector<u8>, vector<u8>, vector<u8>) {
      let v1 = std::vector::empty();
      let v2 = vector::empty();
      let v3 = V::empty();
      (v1, v2, v3)
  }
}
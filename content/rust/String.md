---
tags: ["rust"]
aliases: ["string"]
---

# A) String(rust) ?

We can use both `String` and `&str` with structs.

The important difference is, that if a struct needs to own their data, you need to use `String`. If you use `&str`, you need to use Rust lifetimes and make sure that the struct does not outlive the borrowed string, otherwise it won’t compile.

아래와 같이 lifetime (`'a`) 을 지정해주면 `str` 타입을 struct 에서도 사용할 수 있다.

```rust
struct Borrowed<'a> {
    bla: &'a str,
}
```

# B) Related

# C) References

* [Understanding String and &str in Rust - LogRocket Blog](https://blog.logrocket.com/understanding-rust-string-str/)

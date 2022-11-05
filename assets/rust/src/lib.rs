extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

// Called when the wasm module is instantiated
#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    // Use `web_sys`'s global `window` function to get a handle on the global
    // window object.
    let window = web_sys::window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");
    let body = document.body().expect("document should have a body");

    Ok(())
}

// Reverse a string coming from JS 
#[wasm_bindgen]
pub extern fn reverse(s: String) -> String {
    s.chars().rev().collect::<String>()
}

// this is a simple interface without leveraging from the Rust language bells and whistles
#[wasm_bindgen]
pub extern fn add(x: u32, y: u32) -> u32 {
    x + y
}

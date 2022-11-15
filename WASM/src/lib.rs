
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn run() {
    using_a_macro();
}

// Importing functions from JavaScript
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log(s: &str);
}

macro_rules! console_log {
    // NTS: This uses the `log` function imported above
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

fn using_a_macro() {
    console_log!("Hello {} from Rust!", "world");
}

// Exporting to JavaScript
#[wasm_bindgen]
pub fn rustlog(strarg: &str) {
    console_log!("Hello from bindgen {}", strarg);
}

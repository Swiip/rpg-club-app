use crux_core::typegen::TypeGen;
use rpg_club_core::Counter;
use std::path::PathBuf;

fn main() -> anyhow::Result<()> {
    println!("cargo:rerun-if-changed=../shared");

    let mut gen = TypeGen::new();

    gen.register_app::<Counter>()?;

    let output_root = PathBuf::from("./generated");

    gen.typescript("shared_types", output_root.join("typescript"))?;

    Ok(())
}

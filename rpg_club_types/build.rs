use crux_core::typegen::TypeGen;
use rpg_club_core::RpgClubCore;
use std::{
    fs::{self},
    io::Result,
    path::{Path, PathBuf},
};

fn main() -> anyhow::Result<()> {
    println!("cargo:rerun-if-changed=../rpg_club_core");

    let mut gen = TypeGen::new();

    gen.register_app::<RpgClubCore>()?;

    let output_root = PathBuf::from("./generated");

    gen.typescript("shared_types", output_root.join("typescript"))?;

    let path = Path::new("./generated/typescript");
    remove_js_files(path).unwrap();

    Ok(())
}

fn remove_js_files(dir: &Path) -> Result<()> {
    if dir.is_dir() {
        for entry in fs::read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();
            if path.is_dir() {
                remove_js_files(&path)?; // Recursively call the function for subdirectories
            } else if path.is_file() {
                if let Some(ext) = path.extension() {
                    if ext == "js" {
                        fs::remove_file(&path)?;
                    }
                }
            }
        }
    }
    Ok(())
}

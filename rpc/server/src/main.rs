use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use std::process::Command;
use std::fs;
use std::path::Path;
use std::str;
use actix_cors::Cors;

async fn compile_and_run_move(move_code: web::Bytes) -> impl Responder {
    println!("[接收 Move 代码] Move code: {:?}", move_code);

    // 将接收到的 Move 代码写入临时文件
    let move_file = "../move/sources/main.move";
    let path = Path::new(move_file);

    if !path.exists() {
        // 检查路径是否指向一个文件
        match path.parent() {
            Some(parent) => {
                // 创建父目录
                fs::create_dir_all(parent).expect("[创建失败] Failed to create directory");
            }
            None => {
                return HttpResponse::InternalServerError().body("Invalid file path");
            }
        }

        // 创建文件
        match fs::File::create(path) {
            Ok(_) => println!("[创建文件]: {}", move_file),
            Err(e) => {
                return HttpResponse::InternalServerError().body(format!("[创建失败] Failed to create file: {}", e));
            }
        }
    } else {
        println!("[已存在]: {}", move_file);
    }
    // let tmp_file = "../move/sources/main.move";

    match fs::write(move_file, move_code) {
        Ok(_) => (),
        Err(e) => {
            return HttpResponse::InternalServerError().body(format!("[写入文件] Failed to write Move code to file: {}", e));
        }
    }

    // 编译 Move 代码
    println!("[开始编译] {}",move_file);
    let compile_output = Command::new("aptos")
    .arg("move")
    .arg("test")
    .arg("--package-dir")
    .arg("../move")
    .output();

match compile_output {
    Ok(ref output) => {
        if !output.status.success() {
            let stderr = str::from_utf8(&output.stderr).unwrap_or("Error reading stderr");
            return HttpResponse::InternalServerError().body(format!("Move compilation failed: {}", stderr));
        }
    },
    Err(e) => {
        return HttpResponse::InternalServerError().body(format!("Failed to execute aptos move test command: {}", e));
    }
}

    // 将运行结果作为响应返回给客户端
    HttpResponse::Ok().body(String::from_utf8_lossy(&compile_output.unwrap().stdout).to_string())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // 启动服务器
    HttpServer::new(|| {
        App::new()
            // 添加CORS中间件
            .wrap(
                Cors::permissive() // <- 使用 Cors::permissive() 替换 Cors::new()
                    .allowed_origin("http://localhost:5173")
            )
            // 定义路由
            .route("/run_move", web::post().to(compile_and_run_move))
    })
    .bind("127.0.0.1:8081")?
    .run()
    .await
}
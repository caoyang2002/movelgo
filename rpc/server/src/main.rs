use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use std::process::Command;
use std::fs;
use std::path::Path;
use std::str;
use actix_cors::Cors;
use dotenv::dotenv;
use std::env;
// use std::net::IpAddr;

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
    // 获取当前执行文件的目录
    let current_dir = env::current_dir()?;
    
    // 构建 .env 文件的路径（上移三层目录）
    let env_path = current_dir.join("../../.env");
    println!("[INFO] env_path {:?}",env_path);
    
    // 加载 .env 文件
    dotenv::from_path(env_path).ok();
    // let port = env::var("REACT_APP_RPC_PORT").unwrap_or_else(|_| "3020".to_string());

     // rpc port
     let rpc_port = env::var("REACT_APP_RPC_PORT").unwrap_or_else(|_| "3020".to_string());
     println!("[INFO] rpc port: {}", rpc_port);

     // file server port
     let file_server_port = env::var("REACT_APP_FILE_SERVER_PORT").unwrap_or_else(|_| "3010".to_string());
     println!("[INFO] file server port: {}", file_server_port);

     // react app port
     let react_app_port = env::var("REACT_APP_PORT").unwrap_or_else(|_| "3020".to_string());
    println!("[INFO] app port: {}", react_app_port);

    let host_ip = env::var("REACT_APP_HOST_IP").unwrap_or_else(|_| "localhost".to_string());
    
    let rpc_address = format!("http://{}:{}", host_ip, rpc_port);
    println!("[INFO] rpc address: {}", rpc_address);
    let file_server_address = format!("http://{}:{}",host_ip,file_server_port);
    println!("[INFO] file server address: {}", file_server_address);
    let react_app_address = format!("http://{}:{}",host_ip,react_app_port);
    println!("[INFO] react app address: {}", react_app_address);
    let bind_adress = format!("{}:{}", host_ip, rpc_port);
    println!("[INFO] bind adress: {}", bind_adress);
    // 启动服务器
    println!("[INFO] rpc server start on {}", rpc_address);
    HttpServer::new(move || {
        App::new()
            // 添加CORS中间件
            .wrap(
                Cors::permissive() // <- 使用 Cors::permissive() 替换 Cors::new()
                    .allowed_origin(file_server_address.as_str())
                    .allowed_origin(react_app_address.as_str()) 
                    .allowed_methods([
                        "POST",
                    ])
            )
            // 定义路由
            .route("/move_test", web::post().to(compile_and_run_move))
    })
    .bind(&bind_adress)?
    .run()
    .await
}
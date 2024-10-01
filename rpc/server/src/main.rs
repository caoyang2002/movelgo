use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use std::process::Command;
use std::fs;
use std::path::Path;
use std::str;
use actix_cors::Cors;
use dotenv::dotenv;
use std::env;
use serde_json::json;
// use std::net::IpAddr;
use regex::Regex;

// 清理终端输出的样式
fn remove_ansi_escapes(input: &str) -> String {
    let ansi_escape = Regex::new(r"\x1B\[[0-?]*[ -/]*[@-~]").unwrap();
    ansi_escape.replace_all(input, "").into_owned()
}
async fn compile_and_run_move(move_code: web::Bytes) -> impl Responder {
    println!("[INFO] Move code: {:?}", move_code);

    // 将接收到的 Move 代码写入临时文件
    let move_file = "../move/sources/main.move";
    let path = Path::new(move_file);

    if !path.exists() {
        // 检查路径是否指向一个文件
        match path.parent() {
            Some(parent) => {
                // 创建父目录
                fs::create_dir_all(parent).expect("Failed to create directory");
            }
            None => {
                return HttpResponse::InternalServerError().body("Invalid file path");
            }
        }

        // 创建文件
        match fs::File::create(path) {
            Ok(_) => println!("[HANDLE]: create file {}", move_file),
            Err(e) => {
                return HttpResponse::InternalServerError().body(format!("Failed to create file: {}", e));
            }
        }
    } else {
        println!("[ERROR] existed: {}", move_file);
    }
    // let tmp_file = "../move/sources/main.move";

    match fs::write(move_file, move_code) {
        Ok(_) => (),
        Err(e) => {
            return HttpResponse::InternalServerError().body(format!("Failed to write Move code to file: {}", e));
        }
    }

    // 编译 Move 代码
    println!("[HANDLE] Compiling move code: {}",move_file);
    let compile_output = Command::new("aptos")
    .arg("move")
    .arg("test")
    .arg("--skip-fetch-latest-git-deps")
    .arg("--package-dir")
    .arg("../move")
    .output();
  println!("[INFO] Compilation completed");

  match compile_output {
    Ok(output) => {
        // 打印标准输出
        let stdout = String::from_utf8_lossy(&output.stdout);
        println!("[COMPILE STDOUT]:\n{}", stdout);

        // 打印标准错误
        let stderr = String::from_utf8_lossy(&output.stderr);
        println!("[COMPILE STDERR]:\n{}", stderr);


        let style_less_stdout = remove_ansi_escapes(&stdout.to_string());
    let style_less_stderr = remove_ansi_escapes(&stderr.to_string());
    println!("[COMPILE STDOUT]:\n{}", style_less_stdout);
    println!("[COMPILE STDERR]:\n{}", style_less_stderr);
        // 构造包含所有信息的响应体
        let response_body = json!({
            "success": output.status.success(),
            // "stdout": stdout.to_string(),
            // "stderr": stderr.to_string(),
            "stdout": style_less_stdout,
            "stderr": style_less_stderr,
            "exit_code": output.status.code()
        });

        // 始终返回 200 状态码，但在响应体中包含更多信息
        HttpResponse::Ok().json(response_body)
    },
    Err(e) => {
        println!("[ERROR] {}", e);
        
        // 即使在错误情况下也返回 200 状态码
        let error_response = json!({
            "success": false,
            "error": format!("Failed to execute aptos move test command: {}", e),
            "stdout": "",
            "stderr": "",
            "exit_code": null
        });

        HttpResponse::Ok().json(error_response)
    }
}

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

 // react app port
 let react_app_port = env::var("REACT_APP_PORT").unwrap_or_else(|_| "3020".to_string());
 println!("[INFO] app port: {}", react_app_port);
     // file server port
     let file_server_port = env::var("REACT_APP_FILE_SERVER_PORT").unwrap_or_else(|_| "3010".to_string());
     println!("[INFO] file server port: {}", file_server_port);
   // rpc port
   let rpc_port = env::var("REACT_APP_RPC_PORT").unwrap_or_else(|_| "3020".to_string());
   println!("[INFO] rpc port: {}", rpc_port);
    

   let host_ip = env::var("REACT_APP_RPC_HOST_IP").unwrap_or_else(|_| "localhost".to_string());
    
    let rpc_address = format!("http://{}:{}", host_ip, rpc_port);
    println!("[INFO] rpc address: {}", rpc_address);
    let file_server_address = format!("http://{}:{}",host_ip,file_server_port);
    println!("[INFO] file server address: {}", file_server_address);
    let react_app_address = format!("http://{}:{}",host_ip,react_app_port);
    println!("[INFO] react app address: {}", react_app_address);
    let bind_address = format!("{}:{}", host_ip, rpc_port);
    println!("[INFO] bind adress: {}", bind_address);
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
    .bind(&bind_address)?
    .run()
    .await
}
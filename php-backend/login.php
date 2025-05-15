<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['usernameOrEmail']) && !empty($data['password'])) {
    $conn = new mysqli("localhost", "root", "", "form_data", 3307);

    if ($conn->connect_error) {
        echo json_encode(["success" => false, "message" => "Database connection failed"]);
        exit();
    }

    $usernameOrEmail = $conn->real_escape_string($data['usernameOrEmail']);
    $password = $data['password']; 

    // Adjust table/column names if needed
    $sql = "SELECT id, username, email, password FROM submissions WHERE (username='$usernameOrEmail' OR email='$usernameOrEmail') LIMIT 1";
    $result = $conn->query($sql);

    if ($result && $result->num_rows === 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            echo json_encode([
                "success" => true,
                "user" => [
                    "id" => $user['id'],
                    "username" => $user['username'],
                    "email" => $user['email']
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Invalid password"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "User not found"]);
    }
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Username/email and password required"]);
}
?>

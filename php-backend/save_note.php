<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['title']) && !empty($data['content']) && !empty($data['user_id'])) {
    $conn = new mysqli("localhost", "root", "", "form_data",  3307);

    if ($conn->connect_error) {
        echo json_encode(["success" => false, "message" => "Database connection failed"]);
        exit;
    }

    $title = $conn->real_escape_string($data['title']);
    $content = $conn->real_escape_string($data['content']);
    $user_id = intval($data['user_id']);

    $sql = "INSERT INTO notes (user_id, title, content) VALUES ($user_id, '$title', '$content')";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Note saved successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error saving note"]);
    }
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Title, content, and user_id required"]);
}
?>

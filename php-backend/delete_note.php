<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['id'])) {
    $conn = new mysqli("localhost", "root", "", "form_data", 3307); // Use your DB credentials

    if ($conn->connect_error) {
        echo json_encode(["success" => false, "message" => "Database connection failed"]);
        exit;
    }

    $id = intval($data['id']);

    // Optional: If you want to check user_id, add AND user_id=...
    $sql = "DELETE FROM notes WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Note deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error deleting note"]);
    }
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Note ID required"]);
}
?>

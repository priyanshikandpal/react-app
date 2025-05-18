<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$reminder_id = isset($data['reminder_id']) ? intval($data['reminder_id']) : 0;

$conn = new mysqli("localhost", "root", "", "form_data", 3307);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'DB connection failed']);
    exit;
}

$stmt = $conn->prepare("UPDATE reminders SET status = 'done' WHERE id = ?");
$stmt->bind_param("i", $reminder_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}
$stmt->close();
$conn->close();
?>

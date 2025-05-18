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

$user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;
$note_id = isset($data['note_id']) ? intval($data['note_id']) : 0;
$remind_at = isset($data['remind_at']) ? $data['remind_at'] : '';
$message = isset($data['message']) ? $data['message'] : '';

$conn = new mysqli("localhost", "root", "", "form_data", 3307);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'DB connection failed']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO reminders (user_id, note_id, remind_at, message) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiss", $user_id, $note_id, $remind_at, $message);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}
$stmt->close();
$conn->close();
?>

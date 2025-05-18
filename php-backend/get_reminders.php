<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

$conn = new mysqli("localhost", "root", "", "form_data", 3307);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'data' => []]);
    exit;
}

$sql = "SELECT r.*, n.title as note_title 
        FROM reminders r
        JOIN notes n ON r.note_id = n.id
        WHERE r.user_id = $user_id AND r.status = 'pending'
        ORDER BY r.remind_at ASC";
$result = $conn->query($sql);

$reminders = [];
while ($row = $result->fetch_assoc()) {
    $reminders[] = $row;
}
echo json_encode(['success' => true, 'data' => $reminders]);

$conn->close();
?>

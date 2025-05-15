<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

$conn = new mysqli("localhost", "root", "", "form_data", 3307);
if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT * FROM notes WHERE user_id=$user_id ORDER BY created_at DESC";
$result = $conn->query($sql);

$notes = [];
while ($row = $result->fetch_assoc()) {
    $notes[] = $row;
}
echo json_encode($notes);

$conn->close();
?>

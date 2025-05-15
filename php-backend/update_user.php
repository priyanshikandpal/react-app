<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['user_id'])) {
    $conn = new mysqli("localhost", "root", "", "form_data", 3307);

    if ($conn->connect_error) {
        echo json_encode(["success" => false, "message" => "Database connection failed"]);
        exit;
    }

    $user_id = intval($data['user_id']);
    $name = isset($data['name']) ? $conn->real_escape_string($data['name']) : null;
    $bio = isset($data['bio']) ? $conn->real_escape_string($data['bio']) : null;

    // Check if profile exists
    $checkSql = "SELECT id FROM user_profiles WHERE user_id = $user_id";
    $checkResult = $conn->query($checkSql);

    if ($checkResult->num_rows > 0) {
        // Update existing profile
        $sql = "UPDATE user_profiles SET name='$name', bio='$bio' WHERE user_id=$user_id";
    } else {
        // Insert new profile
        $sql = "INSERT INTO user_profiles (user_id, name, bio) VALUES ($user_id, '$name', '$bio')";
    }

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error updating profile"]);
    }
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "user_id required"]);
}
?>

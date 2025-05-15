<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if (!empty($_GET['user_id'])) {
    $conn = new mysqli("localhost", "root", "", "form_data", 3307);

    if ($conn->connect_error) {
        echo json_encode(["success" => false, "message" => "Database connection failed"]);
        exit;
    }

    $user_id = intval($_GET['user_id']);
    $sql = "SELECT name, bio FROM user_profiles WHERE user_id = $user_id";
    $result = $conn->query($sql);

    if ($result && $row = $result->fetch_assoc()) {
        echo json_encode(["success" => true, "profile" => $row]);
    } else {
        echo json_encode(["success" => true, "profile" => ["name" => "", "bio" => ""]]);
    }
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "user_id required"]);
}
?>

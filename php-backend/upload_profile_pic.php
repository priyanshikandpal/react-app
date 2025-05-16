<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$targetDir = "uploads/"; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['profile_pic']) && isset($_POST['user_id'])) {
        $userId = intval($_POST['user_id']);
        $fileName = uniqid() . "_" . basename($_FILES["profile_pic"]["name"]);
        $targetFile = $targetDir . $fileName;

        if (move_uploaded_file($_FILES["profile_pic"]["tmp_name"], $targetFile)) {
            // Save file path to user_profiles table
            $conn = new mysqli("localhost", "root", "", "form_data", 3307);
            if ($conn->connect_error) {
                echo json_encode(["success" => false, "message" => "DB connection failed"]);
                exit;
            }
            $stmt = $conn->prepare("UPDATE user_profiles SET profile_pic=? WHERE user_id=?");
            $stmt->bind_param("si", $targetFile, $userId);
            $stmt->execute();
            $stmt->close();
            $conn->close();

            echo json_encode(["success" => true, "profile_pic" => $targetFile]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to upload file"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "No file or user ID"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
}
?>

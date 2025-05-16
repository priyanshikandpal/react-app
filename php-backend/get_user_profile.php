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
    // Fetch all required fields, including location and email
    $sql = "SELECT name, bio, profile_pic, linkedin, instagram, phone, location, email FROM user_profiles WHERE user_id = $user_id";
    $result = $conn->query($sql);

    if ($result && $row = $result->fetch_assoc()) {
        // Return all fields, even if some are empty
        echo json_encode([
            "success" => true,
            "profile" => [
                "name" => $row["name"] ?? "",
                "bio" => $row["bio"] ?? "",
                "profile_pic" => $row["profile_pic"] ?? null,
                "linkedin" => $row["linkedin"] ?? "",
                "instagram" => $row["instagram"] ?? "",
                "phone" => $row["phone"] ?? "",
                "location" => $row["location"] ?? "",
                "email" => $row["email"] ?? ""
            ]
        ]);
    } else {
        // Return all fields as empty/default if user not found
        echo json_encode([
            "success" => true,
            "profile" => [
                "name" => "",
                "bio" => "",
                "profile_pic" => null,
                "linkedin" => "",
                "instagram" => "",
                "phone" => "",
                "location" => "",
                "email" => ""
            ]
        ]);
    }
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "user_id required"]);
}
?>

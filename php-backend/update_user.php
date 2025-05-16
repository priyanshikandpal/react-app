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
    $profile_pic = isset($data['profile_pic']) ? $conn->real_escape_string($data['profile_pic']) : null;
    $linkedin = isset($data['linkedin']) ? $conn->real_escape_string($data['linkedin']) : null;
    $instagram = isset($data['instagram']) ? $conn->real_escape_string($data['instagram']) : null;
    $phone = isset($data['phone']) ? $conn->real_escape_string($data['phone']) : null;
    $location = isset($data['location']) ? $conn->real_escape_string($data['location']) : null;
    $email = isset($data['email']) ? $conn->real_escape_string($data['email']) : null;

    // Check if profile exists
    $checkSql = "SELECT id FROM user_profiles WHERE user_id = $user_id";
    $checkResult = $conn->query($checkSql);

    if ($checkResult->num_rows > 0) {
        // Update existing profile
        $sql = "UPDATE user_profiles SET 
                    name='$name', 
                    bio='$bio', 
                    profile_pic='$profile_pic', 
                    linkedin='$linkedin', 
                    instagram='$instagram', 
                    phone='$phone',
                    location='$location',
                    email='$email'
                WHERE user_id=$user_id";
    } else {
        // Insert new profile
        $sql = "INSERT INTO user_profiles (user_id, name, bio, profile_pic, linkedin, instagram, phone, location, email) 
                VALUES ($user_id, '$name', '$bio', '$profile_pic', '$linkedin', '$instagram', '$phone', '$location', '$email')";
    }

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error updating profile: " . $conn->error]);
    }
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "user_id required"]);
}
?>

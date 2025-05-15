<?php
// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Database connection
$servername = "localhost";
$username = "root"; 
$password = ""; 
$database = "form_data";
$port = 3307;

// Create connection
$conn = new mysqli($servername, $username, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read the JSON data
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (
        isset($data['name']) && isset($data['email']) &&
        isset($data['username']) && isset($data['password'])
    ) {
        $name = htmlspecialchars($data['name']);
        $email = htmlspecialchars($data['email']);
        $username = htmlspecialchars($data['username']);
        // Securely hash the password
        $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);

        // Save data to database
        $stmt = $conn->prepare("INSERT INTO submissions (name, email, username, password) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $name, $email, $username, $hashed_password);

        if ($stmt->execute()) {
            echo json_encode([
                "status" => "success",
                "message" => "Form submitted and saved to database!",
                "data" => [
                    "name" => $name,
                    "email" => $email,
                    "username" => $username
                ]
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Failed to save data."
            ]);
        }

        $stmt->close();
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid form data."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Only POST requests are allowed."
    ]);
}

$conn->close();
?>

<?php
header('Content-Type: application/json');

// Database connection
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'prons_portfolio'; // Change to your database name
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Get POST data
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if (!$name || !$email || !$message) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Insert into database
$stmt = $conn->prepare('INSERT INTO comments (name, email, message) VALUES (?, ?, ?)');
$stmt->bind_param('sss', $name, $email, $message);
if ($stmt->execute()) {
    $id = $stmt->insert_id;
    $result = $conn->query("SELECT name, email, message, created_at FROM comments WHERE id = $id");
    $comment = $result->fetch_assoc();
    echo json_encode(['success' => true, 'comment' => $comment]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to save comment']);
}
$stmt->close();
$conn->close(); 
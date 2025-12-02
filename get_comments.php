<?php
header('Content-Type: application/json');

// Database connection
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'prons_portfolio'; // Change to your database name
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

$result = $conn->query('SELECT name, email,message, created_at FROM comments ORDER BY created_at DESC');
$comments = [];
while ($row = $result->fetch_assoc()) {
    $comments[] = $row;
}
echo json_encode($comments);
$conn->close(); 
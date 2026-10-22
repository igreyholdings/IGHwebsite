<?php
require __DIR__ . '/config.php';
session_set_cookie_params(['httponly'=>true,'samesite'=>'Strict','secure'=>!empty($_SERVER['HTTPS'])]);
session_start();
header('Content-Type: application/json'); header('Cache-Control: no-store');
$root = dirname(__DIR__);
function out($a, $c = 200) { http_response_code($c); echo json_encode($a); exit; }
$a = $_GET['a'] ?? '';
if ($a === 'me') out(['auth' => !empty($_SESSION['ok'])]);
if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(['error' => 'POST only'], 405);
if ($a === 'login') {
  $in = json_decode(file_get_contents('php://input'), true); sleep(1);
  if (isset($in['password']) && hash_equals(ADMIN_PASSWORD, (string)$in['password'])) { session_regenerate_id(true); $_SESSION['ok'] = 1; out(['ok' => true]); }
  out(['error' => 'Wrong password'], 401);
}
if (empty($_SESSION['ok'])) out(['error' => 'Not signed in'], 401);
if ($a === 'logout') { session_destroy(); out(['ok' => true]); }
if ($a === 'save') {
  $in = json_decode(file_get_contents('php://input'), true);
  $f = $in['file'] ?? '';
  if (!in_array($f, ['properties', 'careers'], true) || !is_array($in['items'] ?? null)) out(['error' => 'Bad request'], 400);
  $json = json_encode(array_values($in['items']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if (file_put_contents("$root/data/$f.json", $json, LOCK_EX) === false) out(['error' => 'Could not write the file. Make the data folder writable.'], 500);
  out(['ok' => true]);
}
if ($a === 'upload') {
  $f = $_FILES['file'] ?? null;
  if (!$f || $f['error'] !== 0 || $f['size'] > 4 * 1024 * 1024) out(['error' => 'Upload failed or file is over 4 MB'], 400);
  $i = @getimagesize($f['tmp_name']);
  $ext = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'][$i['mime'] ?? ''] ?? null;
  if (!$ext) out(['error' => 'Only JPG, PNG or WebP images are allowed'], 400);
  @mkdir("$root/uploads", 0755, true);
  $n = 'uploads/' . bin2hex(random_bytes(8)) . '.' . $ext;
  if (!move_uploaded_file($f['tmp_name'], "$root/$n")) out(['error' => 'Could not save the image. Make the uploads folder writable.'], 500);
  out(['path' => $n]);
}
out(['error' => 'Unknown action'], 404);

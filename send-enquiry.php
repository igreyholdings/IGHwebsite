<?php
// Receives the website forms, emails hello@igreyholdings.com (career applications: hr@igreyholdings.com) and sends the sender an automatic reply.
header('Content-Type: application/json');
const TO = 'hello@igreyholdings.com';
const HR = 'hr@igreyholdings.com';
function clean($v, $n = 2000) { return mb_substr(trim(strip_tags((string)$v)), 0, $n); }
function oneline($v) { return preg_replace('/[\r\n]+/', ' ', $v); }
function subj($v) { return '=?UTF-8?B?' . base64_encode($v) . '?='; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"ok":false}'; exit; }
if (!empty($_POST['website'])) { echo '{"ok":true}'; exit; }          // spam trap
$name  = oneline(clean($_POST['name'] ?? '', 100));
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
if ($name === '' || !$email) { http_response_code(400); echo '{"ok":false}'; exit; }
$career = (($_POST['kind'] ?? '') === 'Career application');
$smart  = (($_POST['kind'] ?? '') === 'SMART STAY enquiry');
$kind   = $career ? 'Career application' : ($smart ? 'SMART STAY by IGH enquiry' : 'Website enquiry');
$inbox  = $career ? HR : TO;
$labels = ['phone'=>'Phone','type'=>'I am a','loc'=>'Location','svc'=>'Service','role'=>'Role','link'=>'Profile link','msg'=>'Message'];
$body = "New $kind from the iGREY Holdings website\n\nName: $name\nEmail: $email\n";
foreach ($labels as $k => $l) { if (!empty($_POST[$k])) $body .= "$l: " . clean($_POST[$k]) . "\n"; }
$h1 = "From: iGREY Holdings <" . $inbox . ">\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8\r\n";
$sent = mail($inbox, subj("$kind - $name"), $body, $h1, '-f' . $inbox);
if ($sent) {
  $what  = $career ? 'application' : 'enquiry';
  $reply = "Hello $name,\n\nThank you for contacting iGREY Holdings. We have received your $what and our team will get back to you within one business day.\n\nIf it is urgent, please call us on +91 8147172449.\n\nRegards,\niGREY Holdings\n$inbox\n";
  $h2 = "From: iGREY Holdings <" . $inbox . ">\r\nContent-Type: text/plain; charset=UTF-8\r\n";
  mail($email, subj('We have received your ' . $what . ' - iGREY Holdings'), $reply, $h2, '-f' . $inbox);
}
echo json_encode(['ok' => $sent]);

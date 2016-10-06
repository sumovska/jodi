<?php

/* ---------------------------
php and flash contact form. 
by www.MacromediaHelp.com
--------------------------- 
Note: most servers require that one of the emails (sender or receiver) to be an email hosted by same server, 
so make sure your email (on last line of this file) is one hosted on same server.
--------------------------- */


// read the variables form the string, (this is not needed with some servers).
$name = $_REQUEST["name"];
$phone = $_REQUEST["phone"];
$email = $_REQUEST["email"];
$subject = $_REQUEST["subject"];
$message = $_REQUEST["message"];


// include sender IP in the message.
$ip = $_SERVER['REMOTE_ADDR'];


// remove the backslashes that normally appears when entering " or '
$name = stripslashes($name);
$phone = stripslashes($phone);
$email = stripslashes($email);
$subject = stripslashes($subject);
$message = stripslashes($message);

$subject = "$subject - A message via West-Crete Concrete's website!";
// add a prefix in the subject line so that you know the email was sent by online form


$details = "
Senders IP Address - $ip \n
Name - $name \n
Phone - $phone \n
Email - $email \n
Message - $message  "; 



// send the email, make sure you replace email@yourserver.com with your email address

	mail("b.harris@bigpond.net.au", $subject, $details);

?>
<?php


// get posted data into local variables
$EmailFrom = Trim(stripslashes($_POST['EmailFrom']));
$EmailTo = "a1underpinning@gmail.com";
$Subject = "You have a new website enquiry!";
$Name = Trim(stripslashes($_POST['Name']));
$Email = Trim(stripslashes($_POST['EmailFrom']));
$Phone = Trim(stripslashes($_POST['Phone']));
$Suburb = Trim(stripslashes($_POST['Suburb']));
$Service = Trim(stripslashes($_POST['Service']));
$Message = Trim(stripslashes($_POST['Message']));

// validation
$validationOK = true;
if (Trim($EmailFrom) == "") $validationOK = false;
if (Trim($Name) == "") $validationOK = false;
if (!$validationOK) {
	print "<meta http-equiv=\"refresh\" content=\"0;URL=error.html\">";
	exit;
}

// prepare email body text
$Body = "";
$Body .= "Name: ";
$Body .= $Name;
$Body .= "\n";
$Body .= "Email: ";
$Body .= $EmailFrom;
$Body .= "\n";
$Body .= "Phone: ";
$Body .= $Phone;
$Body .= "\n";
$Body .= "Suburb: ";
$Body .= $Suburb;
$Body .= "\n";
$Body .= "Service: ";
$Body .= $Service;
$Body .= "\n";
$Body .= "Message: ";
$Body .= $Message;
$Body .= "\n";

// send email 
$success = mail($EmailTo, $Subject, $Body, "From: <$EmailFrom>");

// redirect to success page 
if ($success) {
	print "<meta http-equiv=\"refresh\" content=\"0;URL=ok.html\">";
} else {
	print "<meta http-equiv=\"refresh\" content=\"0;URL=error.html\">";
}

if ($_POST["gotcha"] != "") {
	header("Location: {$_SERVER[HTTP_REFERER]}");
	exit;
}


?>	



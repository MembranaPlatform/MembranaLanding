<?php

    $env = 'prod'; // test | prod
    $company = "membranaphoto";

    if ($env === 'test') {
        $key = "EIVMIQTABP8MRRI5Z7AN265UWXGTK5KRR73W7MXH";
        $gatewayUrl = "https://gateway.test.idnow.de/api/v1/$company";
        $goUrl = "https://go.test.idnow.de/$company";
    } else if ($env === 'prod') {
        $key = "JSAUF5ADF1GZCXONJACUKXILIVY7IOQ5XL7LRMZ5";
        $gatewayUrl = "https://gateway.idnow.de/api/v1/$company";
        $goUrl = "https://go.idnow.de/$company";
    }

?>
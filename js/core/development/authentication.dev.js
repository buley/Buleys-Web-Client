function get_signin() {
    var session_id = get_local_storage("session_id");
    if (typeof session_id == "undefined" || session_id == null || session_id == "") {
        jQuery("#main").append('<div id="login_prompt"><div id="login_form"><input id="email" type="email" placeholder="Email" name="email" class="defaulttext" required/><br/><input id="password"  type="password" name="password" placeholder="Password" /><br/><br/><a href="#" id="doregistration" class="registrationlink">Register</a> or <a href="#" id="dologinsubmit" class="submitloginform">Login</a></div><div id="login_buttons"><a href="#" id="doresetpassword" class="resetpasswordlink">Reset Password</a></div></div></div>');
    } else {
        jQuery("#main").append("<div id='login_prompt'>Already logged in with session id <code>" + session_id + "</code>.<br/><br/><a href='#' class='do_logout'>Click here</a> to log out.</div>");
    }
    Buleys.view.loaded = "signin";
}

function get_registration() {
    console.log("get_registration(): ");
}

function get_confirmation() {
    console.log("get_confirmation(): ");
}	
	
function submit_registration() {
    if ($('#password_once').val() == $('#password_twice').val()) {
        var password = $('#password_once').val();
        var first_name = $('#first_name').val();
        var display_name = $('#display_name').val();
        var last_name = $('#last_name').val();
        var address_1 = $('#address_1').val();
        var address_2 = $('#address_2').val();
        var city = $('#city').val();
        var state = $('#state').val();
        var zip = $('#zip').val();
        var country = $('#country').val();
        request_registration(password, display_name, first_name, last_name, address_1, address_2, city, state, zip, country);
    } else {
        alert('Passwords don\'t match');
    }
}

function account_logout() {
    data_to_send = {
        "method": "logout"
    };
    $.post("http://api.buleys.com/feedback/", data_to_send, function (data) {
        if (typeof(data.result) !== 'undefined') {
            delete Buleys.store["session_id"];
            jQuery("#login").fadeIn('fast');
            jQuery("#logout").fadeOut('fast');
        }
    }, "json");
}





function request_login(email, password) {
    password = md5(password);
    var data_to_send;
    data_to_send = {
        "method": "request_login",
        "secret": password,
        "email": email,
        "token": session_token
    };
    $.post("http://api.buleys.com/login", data_to_send, function (data) {
        if (data != null && typeof data.result !== 'undefined') {
            if (data.result.toLowerCase() == "failure") {
                console.log('fail');
                send_to_console(data.message);
            } else if (data.result.toLowerCase() == "success") {
                set_local_storage("session_id", data.session_id);
                send_to_console(data.message);
                jQuery("#login_prompt").html('');
                jQuery("#login_prompt").append("Just logged in with session id <code>" + get_local_storage("session_id") + "</code>.<br/><br/><a href='#' class='do_logout'>Click here</a> to log out.");


            }
        } else {
            console.log("request_login(): no data");
        }
    }, "json");


}


function request_registration(password, display_name, first_name, last_name, address_1, address_2, city, state, zip, country) {

    password = md5(password);

    data_to_send = {
        "method": "request_registration",
        "secret": password,
        "display_name": display_name,
        "first_name": first_name,
        "last_name": last_name,
        "address_1": address_1,
        "address_2": address_2,
        "city": city,
        "state": state,
        "zip": zip,
        "country": country
    };

    $.post("http://api.buleys.com/feedback/", data_to_send, function (data) {
        if (typeof(data.request_status) !== 'undefined') {
            if (data.result.toLowerCase() == "failure") {
                if (typeof(data.message) !== 'undefined') {
                    jQuery("#login_status_pane").prepend("<p>" + data.message + "</p>");
                } else {
                    jQuery("#login_status_pane").prepend('There was an error. Your account is not confirmed.');
                }
                close_button(jQuery("#login_status_pane"));
            } else if (data.result.toLowerCase() == "success") {
                if (typeof(data.message) !== 'undefined') {
                    jQuery("#login_status_pane").html("<p>" + data.message + "</p>");
                } else {
                    jQuery("#login_status_pane").html('Your account is confirmed.');
                }
                close_button(jQuery("#login_status_pane"));
            }
        }
    }, "json");


}

function confirm_registration(secret) {

    data_to_send = {
        "method": "confirm_account",
        "secret": secret
    };


    $.post("http://api.buleys.com/feedback/", data_to_send, function (data) {
        if (typeof(data.request_status) !== 'undefined') {
            if (data.result.toLowerCase() == "failure") {
                jQuery("#login_status_pane").html('');


                if (typeof(data.reason) !== 'undefined') {
                    jQuery("#login_status_pane").prepend("<p><small>" + data.reason + "<small></p>");
                }

                if (typeof(data.message) !== 'undefined') {
                    jQuery("#login_status_pane").prepend("<p>" + data.message + "</p>");
                } else {
                    jQuery("#login_status_pane").prepend('There was an error.');
                }

            } else if (data.result.toLowerCase() == "success") {

                if (typeof(data.message) !== 'undefined') {
                    jQuery("#login_status_pane").html("<p>" + data.message + "</p>");
                } else {
                    jQuery("#login_status_pane").html('Your account is confirmed and logged in.');
                }
/*
				
				*/
                jQuery("#login_status_pane").append('<p><strong>Password</strong>:<input id="password_once"type="password"name="password"/><br/><strong>Password</strong>(again):<input id="password_twice"type="password"name="password_confirm"/></p><p><strong>Public name</strong>:<input id="display_name"type="text"name="display_name"/></p><p id="registration_profile_info"><strong>First Name</strong>: <input id="first_name"type="text"name="first_name"  size="20"/><br/><strong>Last Name</strong>: <input id="last_name"type="text"name="last_name"  size="20"/><br/><strong>Address 1</strong>:<input id="address_1"type="text"name="address_1"/><br/><strong>Apt. #</strong> (optional): <input id="address_2"type="text"name="address_2"/><br/><strong>City</strong>: <input id="city"type="text" name="city" size="20"/><br/><strong>State</strong>: <select id="state" name="state"><option value="AL">AL</option><option value="AK">AK</option><option value="AZ">AZ</option><option value="AR">AR</option><option value="CA">CA</option><option value="CO">CO</option><option value="CT">CT</option><option value="DE">DE</option><option value="DC">DC</option><option value="FL">FL</option><option value="GA">GA</option><option value="HI">HI</option><option value="ID">ID</option><option value="IL">IL</option><option value="IN">IN</option><option value="IA">IA</option><option value="KS">KS</option><option value="KY">KY</option><option value="LA">LA</option><option value="ME">ME</option><option value="MD">MD</option><option value="MA">MA</option><option value="MI">MI</option><option value="MN">MN</option><option value="MS">MS</option><option value="MO">MO</option><option value="MT">MT</option><option value="NE">NE</option><option value="NV">NV</option><option value="NH">NH</option><option value="NJ">NJ</option><option value="NM">NM</option><option value="NY">NY</option><option value="NC">NC</option><option value="ND">ND</option><option value="OH">OH</option><option value="OK">OK</option><option value="OR">OR</option><option value="PA">PA</option><option value="RI">RI</option><option value="SC">SC</option><option value="SD">SD</option><option value="TN">TN</option><option value="TX">TX</option><option value="UT">UT</option><option value="VT">VT</option><option value="VA">VA</option><option value="WA">WA</option><option value="WV">WV</option><option value="WI">WI</option><option value="WY">WY</option></select>&nbsp;&nbsp;&nbsp;<strong>Zip</strong>: <input id="zip"type="text"name="zip" size="10"/><br/><strong>Country</strong>: <select id="country" name="country" size="1"><option value="AF">Afghanistan</option><option value="AX">Axland Islands</option><option value="AL">Albania</option><option value="DZ">Algeria</option><option value="AS">American Samoa</option><option value="AD">Andorra</option><option value="AO">Angola</option><option value="AI">Anguilla</option><option value="AQ">Antarctica</option><option value="AG">Antigua And Barbuda</option><option value="AR">Argentina</option><option value="AM">Armenia</option><option value="AW">Aruba</option><option value="AU">Australia</option><option value="AT">Austria</option><option value="AZ">Azerbaijan</option><option value="BS">Bahamas</option><option value="BH">Bahrain</option><option value="BD">Bangladesh</option><option value="BB">Barbados</option><option value="BY">Belarus</option><option value="BE">Belgium</option><option value="BZ">Belize</option><option value="BJ">Benin</option><option value="BM">Bermuda</option><option value="BT">Bhutan</option><option value="BO">Bolivia</option><option value="BA">Bosnia And Herzegovina</option><option value="BW">Botswana</option><option value="BV">Bouvet Island</option><option value="BR">Brazil</option><option value="IO">British Indian Ocean Territory</option><option value="BN">Brunei Darussalam</option><option value="BG">Bulgaria</option><option value="BF">Burkina Faso</option><option value="BI">Burundi</option><option value="KH">Cambodia</option><option value="CM">Cameroon</option><option value="CA">Canada</option><option value="CV">Cape Verde</option><option value="KY">Cayman Islands</option><option value="CF">Central African Republic</option><option value="TD">Chad</option><option value="CL">Chile</option><option value="CN">China</option><option value="CX">Christmas Island</option><option value="CC">Cocos (Keeling) Islands</option><option value="CO">Colombia</option><option value="KM">Comoros</option><option value="CG">Congo</option><option value="CD">Congo, The Democratic Republic Of The</option><option value="CK">Cook Islands</option><option value="CR">Costa Rica</option><option value="CI">Cote DIvoire</option><option value="HR">Croatia</option><option value="CU">Cuba</option><option value="CY">Cyprus</option><option value="CZ">Czech Republic</option><option value="DK">Denmark</option><option value="DJ">Djibouti</option><option value="DM">Dominica</option><option value="DO">Dominican Republic</option><option value="EC">Ecuador</option><option value="EG">Egypt</option><option value="SV">El Salvador</option><option value="GQ">Equatorial Guinea</option><option value="ER">Eritrea</option><option value="EE">Estonia</option><option value="ET">Ethiopia</option><option value="FK">Falkland Islands (Malvinas)</option><option value="FO">Faroe Islands</option><option value="FJ">Fiji</option><option value="FI">Finland</option><option value="FR">France</option><option value="GF">French Guiana</option><option value="PF">French Polynesia</option><option value="TF">French Southern Territories</option><option value="GA">Gabon</option><option value="GM">Gambia</option><option value="GE">Georgia</option><option value="DE">Germany</option><option value="GH">Ghana</option><option value="GI">Gibraltar</option><option value="GR">Greece</option><option value="GL">Greenland</option><option value="GD">Grenada</option><option value="GP">Guadeloupe</option><option value="GU">Guam</option><option value="GT">Guatemala</option><option value=" Gg">Guernsey</option><option value="GN">Guinea</option><option value="GW">Guinea-Bissau</option><option value="GY">Guyana</option><option value="HT">Haiti</option><option value="HM">Heard Island And Mcdonald Islands</option><option value="VA">Holy See (Vatican City State)</option><option value="HN">Honduras</option><option value="HK">Hong Kong</option><option value="HU">Hungary</option><option value="IS">Iceland</option><option value="IN">India</option><option value="ID">Indonesia</option><option value="IR">Iran, Islamic Republic Of</option><option value="IQ">Iraq</option><option value="IE">Ireland</option><option value="IM">Isle Of Man</option><option value="IL">Israel</option><option value="IT">Italy</option><option value="JM">Jamaica</option><option value="JP">Japan</option><option value="JE">Jersey</option><option value="JO">Jordan</option><option value="KZ">Kazakhstan</option><option value="KE">Kenya</option><option value="KI">Kiribati</option><option value="KP">Korea, Democratic People\'s Republic Of</option><option value="KR">Korea, Republic Of</option><option value="KW">Kuwait</option><option value="KG">Kyrgyzstan</option><option value="LA">Lao People\'s Democratic Republic</option><option value="LV">Latvia</option><option value="LB">Lebanon</option><option value="LS">Lesotho</option><option value="LR">Liberia</option><option value="LY">Libyan Arab Jamahiriya</option><option value="LI">Liechtenstein</option><option value="LT">Lithuania</option><option value="LU">Luxembourg</option><option value="MO">Macao</option><option value="MK">Macedonia, The Former Yugoslav Republic Of</option><option value="MG">Madagascar</option><option value="MW">Malawi</option><option value="MY">Malaysia</option><option value="MV">Maldives</option><option value="ML">Mali</option><option value="MT">Malta</option><option value="MH">Marshall Islands</option><option value="MQ">Martinique</option><option value="MR">Mauritania</option><option value="MU">Mauritius</option><option value="YT">Mayotte</option><option value="MX">Mexico</option><option value="FM">Micronesia, Federated States Of</option><option value="MD">Moldova, Republic Of</option><option value="MC">Monaco</option><option value="MN">Mongolia</option><option value="MS">Montserrat</option><option value="MA">Morocco</option><option value="MZ">Mozambique</option><option value="MM">Myanmar</option><option value="NA">Namibia</option><option value="NR">Nauru</option><option value="NP">Nepal</option><option value="NL">Netherlands</option><option value="AN">Netherlands Antilles</option><option value="NC">New Caledonia</option><option value="NZ">New Zealand</option><option value="NI">Nicaragua</option><option value="NE">Niger</option><option value="NG">Nigeria</option><option value="NU">Niue</option><option value="NF">Norfolk Island</option><option value="MP">Northern Mariana Islands</option><option value="NO">Norway</option><option value="OM">Oman</option><option value="PK">Pakistan</option><option value="PW">Palau</option><option value="PS">Palestinian Territory, Occupied</option><option value="PA">Panama</option><option value="PG">Papua New Guinea</option><option value="PY">Paraguay</option><option value="PE">Peru</option><option value="PH">Philippines</option><option value="PN">Pitcairn</option><option value="PL">Poland</option><option value="PT">Portugal</option><option value="PR">Puerto Rico</option><option value="QA">Qatar</option><option value="RE">Reunion</option><option value="RO">Romania</option><option value="RU">Russian Federation</option><option value="RW">Rwanda</option><option value="SH">Saint Helena</option><option value="KN">Saint Kitts And Nevis</option><option value="LC">Saint Lucia</option><option value="PM">Saint Pierre And Miquelon</option><option value="VC">Saint Vincent And The Grenadines</option><option value="WS">Samoa</option><option value="SM">San Marino</option><option value="ST">Sao Tome And Principe</option><option value="SA">Saudi Arabia</option><option value="SN">Senegal</option><option value="CS">Serbia And Montenegro</option><option value="SC">Seychelles</option><option value="SL">Sierra Leone</option><option value="SG">Singapore</option><option value="SK">Slovakia</option><option value="SI">Slovenia</option><option value="SB">Solomon Islands</option><option value="SO">Somalia</option><option value="ZA">South Africa</option><option value="GS">South Georgia And The South Sandwich Islands</option><option value="ES">Spain</option><option value="LK">Sri Lanka</option><option value="SD">Sudan</option><option value="SR">Suriname</option><option value="SJ">Svalbard And Jan Mayen</option><option value="SZ">Swaziland</option><option value="SE">Sweden</option><option value="CH">Switzerland</option><option value="SY">Syrian Arab Republic</option><option value="TW">Taiwan, Province Of China</option><option value="TJ">Tajikistan</option><option value="TZ">Tanzania, United Republic Of</option><option value="TH">Thailand</option><option value="TL">Timor-Leste</option><option value="TG">Togo</option><option value="TK">Tokelau</option><option value="TO">Tonga</option><option value="TT">Trinidad And Tobago</option><option value="TN">Tunisia</option><option value="TR">Turkey</option><option value="TM">Turkmenistan</option><option value="TC">Turks And Caicos Islands</option><option value="TV">Tuvalu</option><option value="UG">Uganda</option><option value="UA">Ukraine</option><option value="AE">United Arab Emirates</option><option value="GB">United Kingdom</option><option value="US" selected>United States</option><option value="UM">United States Minor Outlying Islands</option><option value="UY">Uruguay</option><option value="UZ">Uzbekistan</option><option value="VU">Vanuatu</option><option value="VE">Venezuela</option><option value="VN">Viet Nam</option><option value="VG">Virgin Islands, British</option><option value="VI">Virgin Islands, U.S.</option><option value="WF">Wallis And Futuna</option><option value="EH">Western Sahara</option><option value="YE">Yemen</option><option value="ZM">Zambia</option><option value="ZW">Zimbabwe</option></select><br/></p>');


                request_registration_confirmation_buttons(jQuery("#login_status_pane"));

            } else {
                jQuery("#login_status_pane").prepend('There was an error.');
            }
        }
    }, "json");

}


function send_confirmation(email, page, context, resend) {

    if (typeof(page) == undefined) {
        page = "";
    }
    if (typeof(context) == undefined) {
        context = "";
    }
    if (typeof(resend) == undefined) {
        resend = false;
    }

    jQuery("body").append("<div id='pending_email' style='display:none;'>" + email + "</div>");

    var data_to_send;
    data_to_send = {};

    if (resend) {
        data_to_send = {
            "method": "account_confirmation_resend",
            "email": email,
            "page": slug,
            "context": context
        };
    } else {
        data_to_send = {
            "method": "account_confirmation",
            "email": email,
            "page": slug,
            "context": context
        };
    }

    $.post("http://api.buleys.com/feedback/", data_to_send, function (data) {
        if (typeof(data.result) !== 'undefined') {
            if (data.result.toLowerCase() == "failure") {
                jQuery("#login_status_pane").html('');
                if (typeof(data.reason) !== 'undefined') {
                    if (data.reason.toLowerCase() == "account_pending") {
                        pending_confirmation_buttons(jQuery("#login_status_pane"));
                    } else {
                        ready_to_close_button(jQuery("#login_status_pane"));
                    }
                }
                if (typeof(data.message) !== 'undefined') {
                    jQuery("#login_status_pane").append("<p>" + data.message + "</p>");
                }

            } else {
                pending_secret_confirmation_buttons(jQuery("#login_status_pane"));
                jQuery("#login_status_pane").html('Thank you. Buley\'s has sent an email to ' + $('#registration_email').val() + '. Please click the verification link in that email or paste its "secret" into the box below:<br/><br/><strong>Secret</strong>: <input id="confirmation_hash" type="text" name="confirmation_hash" />');
            }
        }
    }, "json");
}

function account_login(email, password) {
    var secret = md5(password);
    data_to_send = {
        "method": "email_login",
        "email": email,
        "secret": secret
    };

    $.post("http://api.buleys.com/feedback/", data_to_send, function (data) {

        if (typeof data.result !== 'undefined') {
            if (data.result.toLowerCase() == "failure") {

                if (typeof data.message !== 'undefined') {


                    send_to_console("<p>" + data.message + "</p>");

                } else {


                }


            } else if (data.result.toLowerCase() == "success") {
                jQuery("#login_status_pane").remove();
                if (typeof(data.message) !== 'undefined' && data.message != null && data.message != '') {
                    send_to_console("<p>" + data.message + "</p>");

                } else {
                    send_to_console("<p>Logged 	in successfully.</p>");

                }
                jQuery("#register").fadeOut('fast');
                jQuery("#login").fadeOut('fast');
                jQuery("#logout").fadeIn('fast');
                close_button(jQuery("#login_status_pane"));
            }
        }
    }, "json");
}


	

function cancel_confirmation(user_id) {

}

function check_login_status() {

    var session_id = get_local_storage("session_id");
    if (typeof session_id == "undefined" || session_id == null || session_id == "") {
    	if(jQuery("#login_status_pane").length >= 1) {
        	jQuery("#login_status_pane").html('<a href="#" id="get_login" class="getloginform">Login or Signup</a>');
    	} else {
        	jQuery("#header").append("<div id='login_status_pane'>" + '<a href="#" id="get_login" class="getloginform">Login or Signup</a>' + "</div>");
    	}
    } else {
    	if(jQuery("#login_status_pane").length >= 1) {
	        jQuery("#login_status_pane").html('');
		} else {
	        jQuery("#header").append("<div id='login_status_pane'>" + "</div>");
	    }
    }

}

jQuery("#logout").live("click", function (event) {
    account_logout();
});


jQuery(".do_logout").live("click", function (event) {
event.preventDefault();
    account_logout();
});

jQuery(".do_logout").live("click", function (event) {
event.preventDefault();
    account_logout();
});

jQuery(".submitthelogin").live("click", function (event) {

	alert('submitlogin');
});

$('#dologin').live('click', function (event) {
    event.preventDefault();
    $('#dologin').remove();
    $('#login_status_pane').append('<div id="minimize_login_controls"><a href="#" id="dologinboxminimize" class="loginboxminimizelink enter_door_icon"></a></div><div id="login_form"><a href="#" id="doregistration" class="registrationlink">Register</a> or Login:<br/><input id="email" type="text" value="your@email.here" name="email" /><br/><input id="password"  type="password" xxx name="password" /></div><div id="login_buttons"><a href="#" id="doresetpassword" class="resetpasswordlink">Reset Password</a><br/><a href="#" id="dologinsubmit" class="submitloginform">Login</a></div></div>');
});

$('#dologinboxminimize').live('click', function (event) {
    event.preventDefault();

    $('#login_status_pane').html('<a href="#" id="dologin" class="getloginform exit_door_link"></a>');
});

$('#get_login').live('click', function (event) {
    event.preventDefault();
    console.log(location.pathname);
    console.log("get_login clicked");

    var stateObj = {
        "page": Buleys.view.page,
        "slug": Buleys.view.slug,
        "type": Buleys.view.type,
        "time": new Date().getTime()
    };
    var urlString = "http://www.buleys.com/start";
    history.pushState(stateObj, "login", urlString);
    reload_results();
});


$('#dologinsubmit').live('click', function (event) {
    event.preventDefault();
    if (typeof $('[name="password"]') !== undefined && $('[name="password"]').val() !== "") {
        request_login($('[name="email"]').val(), $('[name="password"]').val());
    }
});

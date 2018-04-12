/* This is a config file for site wide use */
var life_lighter_config = {
    //sitebaseurl: 'http://r8em.local/',
    sitebaseurl: 'http://localhost:8001',
    //apibaseurl: 'http://localhost:8001/api/',
    apibaseurl: 'http://ll-api.global-elevation.com/api/',
    facebook_appid: 1629975497267060, // live
    google_map_key: 'AIzaSyBzAzhG4DS1idssr4_tjk25cEkLNiMZ_d0',
    cdnmediabaseurl: 'https://d3t0t6tewm7gyy.cloudfront.net/',
    r8emmediabaseurl: 'https://s3-eu-west-1.amazonaws.com/r8em-media/',
    google_api_key: 'AIzaSyDepZ1OYHSwrSd5omhDmkfi3eyVYi1uElM',    // test
    //google_api_key: 'AIzaSyDepZ1OYHSwrSd5omhDmkfi3eyVYi1uElM'     //  production
    google_client_id: '901884951184-e45e0t1m83b46l29eh3av4n9gvjs1h0a.apps.googleusercontent.com',        // test
    loginurl: self.sitebaseurl + '/frontend/login',
    oauthredirecturl: '/frontend/index/oauthredir',
    loadertimeout: 1000,
    inputtimeout: 400,
    slowtimeout: 3000,
    immediatetimeout: 0,
    image_large: "1024x682",
    image_medium: "512x341",
    image_small: "256x170",
    image_thumbnail: "128x85",
    image_facebook: "1200x630"
};

var life_lighter_mesg = {
    loadfailed: 'Unable to load data',
    notfound: 'Entry does not exist',
    servererror: 'Unable to connect to the server !!!',
    notloggedin: "<strong>Not Logged in:</strong><br/>"
    + "Please <a href='/frontend/index/login?referer=" + encodeURIComponent(window.location.href) + "'>login</a> or <a href='/frontend/index/registration'>register</a> to continue",
    notloggedinwidget: "<strong>Not Logged in:</strong><br/>"
    + "Please <a href='/frontend/widgets/login?referer=" + encodeURIComponent(window.location.href) + "'>login</a> or <a href='/frontend/index/registration'>register</a> to continue",
    emailExists: "<strong>Email Exists:</strong><br/>"
    + "Please <a href='/frontend/index/login?referer=" + encodeURIComponent(window.location.href) + "'>login</a> or register with a different email to continue",
    processfailed: 'Process Failed, please try again later',
    invite_others: 'Hey there, are you aware that the life Lighter is now available on phones and way cheaper and user friendly, I got my copy from lifelighter.org/downloads.php'
};

var cookies = {
    did_tutorial: 'did_tutorial',
    user: 'user',
    authenticated: 'authenticated',
    has_number: 'has_number',
    balance: 'balance'
};
var database = {
    name: 'lifelighter_x.db',
    version: "1.0",
    displayName: 'Life Lighter'
};
var papa = [
    "img/p1.jpg",
    "img/p2.jpg",
    "img/p3.jpg",
    "img/p4.jpg",
    "img/p5.jpg",
    "img/p6.jpg",
    "img/prophet2.jpg"
];
var mhamha = [
    "img/m1.jpg",
    "img/m2.jpg",
    "img/m3.jpg",
    "img/m4.jpg",
    "img/m5.jpg"
];

/**
 * Created by Flash on 11/8/2017.
 */
